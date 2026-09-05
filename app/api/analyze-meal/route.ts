import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } | null {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { mediaType: match[1], base64: match[2] };
}

export async function POST(req: NextRequest) {
  try {
    const { beforeImage, afterImage } = await req.json();

    const before = parseDataUrl(beforeImage);
    const after = parseDataUrl(afterImage);
    if (!before || !after) {
      return NextResponse.json({ error: "Both beforeImage and afterImage must be base64 data URLs" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server missing ANTHROPIC_API_KEY" }, { status: 500 });
    }

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "First photo: the plate BEFORE eating." },
              { type: "image", source: { type: "base64", media_type: before.mediaType, data: before.base64 } },
              { type: "text", text: "Second photo: the same plate AFTER eating." },
              { type: "image", source: { type: "base64", media_type: after.mediaType, data: after.base64 } },
              {
                type: "text",
                text: `Compare the two plate photos and estimate how much food was eaten. Respond with ONLY raw JSON, no markdown fences, no preamble, in exactly this shape:
{"clearedPercent": <integer 0-100>, "portionSize": "small" | "medium" | "large", "feedback": "<one short encouraging sentence about this specific meal, under 25 words>"}`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      return NextResponse.json({ error: `Claude API error: ${errText}` }, { status: 502 });
    }

    const data = await claudeRes.json();
    const text = data.content?.find((block: { type: string }) => block.type === "text")?.text ?? "{}";

    let parsed: { clearedPercent?: number; portionSize?: string; feedback?: string };
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      return NextResponse.json({ error: "Model did not return valid JSON", raw: text }, { status: 502 });
    }

    const clearedPercent = Math.max(0, Math.min(100, Math.round(parsed.clearedPercent ?? 0)));
    const portionSize = (["small", "medium", "large"].includes(parsed.portionSize ?? "")
      ? parsed.portionSize
      : "medium") as "small" | "medium" | "large";

    return NextResponse.json({
      clearedPercent,
      portionSize,
      feedback: parsed.feedback ?? "",
      wasteAvoidedKg: Math.round(((clearedPercent / 100) * 0.4) * 10) / 10,
      points: Math.round(clearedPercent * 0.5),
    });
  } catch (err) {
    console.error("analyze-meal error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}