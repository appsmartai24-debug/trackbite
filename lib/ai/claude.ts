// Small server-side client for the Claude Messages API.
// Docs: https://platform.claude.com/docs/en/api/messages
// Uses plain fetch, so no extra npm package is needed.

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

// Override without touching code: CLAUDE_MODEL=claude-sonnet-5-5
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL?.trim() || "claude-haiku-5-5";

export type ClaudeContentBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: { type: "base64"; media_type: string; data: string };
    };

export class ClaudeError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface CallOptions {
  system: string;
  content: ClaudeContentBlock[];
  maxTokens: number;
  timeoutMs?: number;
  model?: string;
}

const RETRYABLE = new Set([429, 500, 502, 503, 529]);

async function singleRequest(opts: CallOptions, apiKey: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify({
        model: opts.model ?? CLAUDE_MODEL,
        max_tokens: opts.maxTokens,
        system: opts.system,
        messages: [{ role: "user", content: opts.content }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new ClaudeError(`Claude API ${res.status}: ${body.slice(0, 300)}`, res.status);
    }

    // const data = (await res.json()) as {
    //   content?: { type: string; text?: string }[];
    // };
    // const text = data.content?.find((b) => b.type === "text")?.text;
    // if (!text) throw new ClaudeError("Claude returned no text");
    // return text;
        const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
      stop_reason?: string;
    };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!text) {
      const blocks = (data.content ?? []).map((b) => b.type).join(",") || "none";
      throw new ClaudeError(
        `Claude returned no text (stop_reason=${data.stop_reason}, blocks=${blocks})`
      );
    }
    return text;
  } catch (err) {
    if (err instanceof ClaudeError) throw err;
    if ((err as Error).name === "AbortError") throw new ClaudeError("CLAUDE_TIMEOUT");
    throw new ClaudeError((err as Error).message || "CLAUDE_NETWORK_ERROR");
  } finally {
    clearTimeout(timer);
  }
}

/** Calls Claude and returns the text of the reply. Retries once on overload/rate-limit/5xx/timeout. */
export async function callClaude(opts: CallOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ClaudeError("Server missing ANTHROPIC_API_KEY");

  try {
    return await singleRequest(opts, apiKey);
  } catch (err) {
    const e = err as ClaudeError;
    const canRetry = e.message === "CLAUDE_TIMEOUT" || (e.status !== undefined && RETRYABLE.has(e.status));
    if (!canRetry) throw err;
    await new Promise((r) => setTimeout(r, 800));
    return singleRequest(opts, apiKey);
  }
}

/** Pulls the first JSON object out of a reply, even if it was wrapped in ``` fences. */
// export function extractJson<T>(text: string): T {
//   const cleaned = text.replace(/```json|```/gi, "").trim();
//   const start = cleaned.indexOf("{");
//   const end = cleaned.lastIndexOf("}");
//   if (start === -1 || end === -1 || end < start) throw new ClaudeError("No JSON in Claude reply");
//   return JSON.parse(cleaned.slice(start, end + 1)) as T;
// }

/** Pulls the first JSON object out of a reply, even if it was wrapped in ``` fences. */
export function extractJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new ClaudeError(`No JSON in Claude reply. Raw reply: ${text.slice(0, 600)}`);
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}