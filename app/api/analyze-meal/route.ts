// // import { NextRequest, NextResponse } from "next/server";
// // import { getAI, getGenerativeModel, GoogleAIBackend, Schema, type GenerativeModel } from "firebase/ai";
// // import { firebaseApp } from "@/lib/firebase/config";
// // import { verifyCustomer } from "@/lib/firebase/verifyCustomer";

// // export const runtime = "nodejs";
// // // Worst case is every model in the chain timing out, so leave headroom.
// // export const maxDuration = 60;

// // /* -------------------------------------------------------------------------- */
// // /*  Config                                                                    */
// // /* -------------------------------------------------------------------------- */

// // // Tried in order. The first model that answers wins; on overload, timeout or
// // // any provider error we move straight to the next one.
// // // Override without a redeploy of code: AI_MODELS="modelA,modelB,modelC"
// // const DEFAULT_MODELS = ["gemini-3.8-flash"];
// // const fromEnv = (process.env.AI_MODELS ?? "")
// //   .split(",")
// //   .map((m) => m.trim())
// //   .filter(Boolean);
// // const MODEL_CHAIN = fromEnv.length ? fromEnv : DEFAULT_MODELS;

// // const PER_MODEL_TIMEOUT_MS = 12_000;
// // const MAX_IMAGE_BASE64_CHARS = 4_500_000; // ~3.3 MB per image after client compression

// // const SYSTEM_INSTRUCTION = `You are Trackbite's food-waste analyst. You receive two photos of the same meal: BEFORE eating and AFTER eating.
// // Rules:
// // - clearedPercent is the share (0-100) of the EDIBLE food that was eaten. Ignore plates, cutlery, napkins, bones, shells, peels and other inedible parts.
// // - Judge by how much food remains in the AFTER photo compared with the BEFORE photo. An empty or nearly empty plate is 90-100.
// // - portionSize describes the size of the ORIGINAL serving in the BEFORE photo: small, medium or large.
// // - isValidComparison is false if either photo does not show food, or the two photos clearly do not show the same meal. In that case set clearedPercent to 0.
// // - confidence is "high" for clear, similarly-framed photos; "medium" when lighting or angle differs; "low" when it is hard to compare.
// // - dishSummary: a short plain description of the meal, under 8 words (e.g. "Chicken biryani with raita").
// // - feedback: ONE short, warm, specific sentence about this meal, under 25 words. Encourage without being preachy.`;

// // const responseSchema = Schema.object({
// //   properties: {
// //     isValidComparison: Schema.boolean(),
// //     clearedPercent: Schema.integer(),
// //     portionSize: Schema.enumString({ enum: ["small", "medium", "large"] }),
// //     confidence: Schema.enumString({ enum: ["low", "medium", "high"] }),
// //     dishSummary: Schema.string(),
// //     feedback: Schema.string(),
// //   },
// // });

// // /* -------------------------------------------------------------------------- */
// // /*  Types                                                                     */
// // /* -------------------------------------------------------------------------- */

// // type StreamEvent =
// //   | { type: "attempt"; model: string; index: number; total: number }
// //   | { type: "result"; data: MealAnalysis }
// //   | { type: "error"; code: string };

// // interface MealAnalysis {
// //   clearedPercent: number;
// //   portionSize: "small" | "medium" | "large";
// //   confidence: "low" | "medium" | "high";
// //   dishSummary: string;
// //   feedback: string;
// //   wasteAvoidedKg: number;
// //   points: number;
// // }

// // interface RawModelOutput {
// //   isValidComparison?: boolean;
// //   clearedPercent?: number;
// //   portionSize?: string;
// //   confidence?: string;
// //   dishSummary?: string;
// //   feedback?: string;
// // }

// // class NotAMealError extends Error {}

// // /* -------------------------------------------------------------------------- */
// // /*  Helpers                                                                   */
// // /* -------------------------------------------------------------------------- */

// // const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
// // const modelCache = new Map<string, GenerativeModel>();

// // function getModel(name: string): GenerativeModel {
// //   let model = modelCache.get(name);
// //   if (!model) {
// //     model = getGenerativeModel(
// //       ai,
// //       {
// //         model: name,
// //         systemInstruction: SYSTEM_INSTRUCTION,
// //         generationConfig: {
// //           responseMimeType: "application/json",
// //           responseSchema,
// //           temperature: 0.2,
// //         },
// //       },
// //       // { timeout: PER_MODEL_TIMEOUT_MS }
// //     );
// //     modelCache.set(name, model);
// //   }
// //   return model;
// // }

// // function parseDataUrl(dataUrl: unknown): { mediaType: string; base64: string } | null {
// //   if (typeof dataUrl !== "string") return null;
// //   const match = /^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/.exec(dataUrl);
// //   if (!match) return null;
// //   return { mediaType: match[1], base64: match[2] };
// // }

// // function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
// //   return new Promise((resolve, reject) => {
// //     const timer = setTimeout(() => reject(new Error("MODEL_TIMEOUT")), ms);
// //     promise.then(
// //       (v) => {
// //         clearTimeout(timer);
// //         resolve(v);
// //       },
// //       (e) => {
// //         clearTimeout(timer);
// //         reject(e);
// //       }
// //     );
// //   });
// // }

// // type Image = { mediaType: string; base64: string };

// // async function runModel(name: string, before: Image, after: Image): Promise<MealAnalysis> {
// //   const result = await withTimeout(
// //     getModel(name).generateContent([
// //       { text: "BEFORE photo (plate before eating):" },
// //       { inlineData: { mimeType: before.mediaType, data: before.base64 } },
// //       { text: "AFTER photo (same plate after eating):" },
// //       { inlineData: { mimeType: after.mediaType, data: after.base64 } },
// //       { text: "Analyze the two photos and return the JSON." },
// //     ]),
// //     PER_MODEL_TIMEOUT_MS + 1_000
// //   );

// //   const raw = result.response.text();
// //   const parsed = JSON.parse(raw.trim()) as RawModelOutput;

// //   if (parsed.isValidComparison === false) throw new NotAMealError();

// //   const clearedPercent = Math.max(0, Math.min(100, Math.round(Number(parsed.clearedPercent ?? 0))));
// //   const portionSize = (["small", "medium", "large"].includes(parsed.portionSize ?? "")
// //     ? parsed.portionSize
// //     : "medium") as MealAnalysis["portionSize"];
// //   const confidence = (["low", "medium", "high"].includes(parsed.confidence ?? "")
// //     ? parsed.confidence
// //     : "medium") as MealAnalysis["confidence"];

// //   return {
// //     clearedPercent,
// //     portionSize,
// //     confidence,
// //     dishSummary: (parsed.dishSummary ?? "").trim().slice(0, 80),
// //     feedback: (parsed.feedback ?? "").trim().slice(0, 240),
// //     wasteAvoidedKg: Math.round((clearedPercent / 100) * 0.4 * 10) / 10,
// //     points: Math.round(clearedPercent * 0.5),
// //   };
// // }

// // /* -------------------------------------------------------------------------- */
// // /*  Route                                                                     */
// // /* -------------------------------------------------------------------------- */

// // export async function POST(req: NextRequest) {
// //   // Only signed-in customers can spend AI quota.
// //   try {
// //     await verifyCustomer(req);
// //   } catch {
// //     return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
// //   }

// //   let body: { beforeImage?: unknown; afterImage?: unknown };
// //   try {
// //     body = await req.json();
// //   } catch {
// //     return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
// //   }

// //   const before = parseDataUrl(body.beforeImage);
// //   const after = parseDataUrl(body.afterImage);
// //   if (!before || !after) {
// //     return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
// //   }
// //   if (before.base64.length > MAX_IMAGE_BASE64_CHARS || after.base64.length > MAX_IMAGE_BASE64_CHARS) {
// //     return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
// //   }

// //   // Stream newline-delimited JSON so the page can show REAL progress
// //   // (which model is running, when we fall back, when the result lands)
// //   // instead of guessing with timers.
// //   const encoder = new TextEncoder();
// //   const stream = new ReadableStream({
// //     async start(controller) {
// //       const send = (event: StreamEvent) => {
// //         try {
// //           controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
// //         } catch {
// //           // Client disconnected; nothing to do.
// //         }
// //       };

// //       try {
// //         for (let i = 0; i < MODEL_CHAIN.length; i++) {
// //           if (req.signal.aborted) return;

// //           const model = MODEL_CHAIN[i];
// //           send({ type: "attempt", model, index: i, total: MODEL_CHAIN.length });

// //           try {
// //             const data = await runModel(model, before, after);
// //             send({ type: "result", data });
// //             return;
// //           } catch (err) {
// //             if (err instanceof NotAMealError) {
// //               send({ type: "error", code: "NOT_A_MEAL" });
// //               return;
// //             }
// //             // Overloaded (500/503), rate-limited, timed out, bad JSON, blocked...
// //             // Log the real reason server-side only, then try the next model.
// //             console.warn(`analyze-meal: ${model} failed (${i + 1}/${MODEL_CHAIN.length})`, err);
// //           }
// //         }

// //         console.error("analyze-meal: every model in the chain failed", MODEL_CHAIN);
// //         send({ type: "error", code: "AI_UNAVAILABLE" });
// //       } catch (err) {
// //         console.error("analyze-meal error", err);
// //         send({ type: "error", code: "SERVER_ERROR" });
// //       } finally {
// //         try {
// //           controller.close();
// //         } catch {
// //           // already closed
// //         }
// //       }
// //     },
// //   });

// //   return new Response(stream, {
// //     headers: {
// //       "content-type": "application/x-ndjson; charset=utf-8",
// //       "cache-control": "no-store, no-transform",
// //       "x-accel-buffering": "no",
// //     },
// //   });
// // }


// import { NextRequest, NextResponse } from "next/server";
// import { CLAUDE_MODEL, callClaude, extractJson } from "@/lib/ai/claude";
// import { verifyCustomer } from "@/lib/firebase/verifyCustomer";

// export const runtime = "nodejs";
// // Worst case is a timeout plus one retry, so leave headroom.
// export const maxDuration = 60;

// /* -------------------------------------------------------------------------- */
// /*  Config                                                                    */
// /* -------------------------------------------------------------------------- */

// // Model is set in lib/ai/claude.ts (default claude-haiku-5-5).
// // Change it without a code edit: CLAUDE_MODEL=claude-sonnet-5-5
// const MODEL_CHAIN = [CLAUDE_MODEL];

// const PER_MODEL_TIMEOUT_MS = 20_000;
// const MAX_IMAGE_BASE64_CHARS = 4_500_000; // ~3.3 MB per image after client compression

// const SYSTEM_INSTRUCTION = `You are Trackbite's food-waste analyst. You receive two photos of the same meal: BEFORE eating and AFTER eating.
// Rules:
// - clearedPercent is the share (0-100) of the EDIBLE food that was eaten. Ignore plates, cutlery, napkins, bones, shells, peels and other inedible parts.
// - Judge by how much food remains in the AFTER photo compared with the BEFORE photo. An empty or nearly empty plate is 90-100.
// - portionSize describes the size of the ORIGINAL serving in the BEFORE photo: small, medium or large.
// - isValidComparison is false if either photo does not show food, or the two photos clearly do not show the same meal. In that case set clearedPercent to 0.
// - confidence is "high" for clear, similarly-framed photos; "medium" when lighting or angle differs; "low" when it is hard to compare.
// - dishSummary: a short plain description of the meal, under 8 words (e.g. "Chicken biryani with raita").
// - feedback: ONE short, warm, specific sentence about this meal, under 25 words. Encourage without being preachy.

// Reply with ONLY a JSON object and nothing else (no markdown, no code fences), using exactly these keys:
// {"isValidComparison": boolean, "clearedPercent": integer 0-100, "portionSize": "small"|"medium"|"large", "confidence": "low"|"medium"|"high", "dishSummary": string, "feedback": string}`;

// /* -------------------------------------------------------------------------- */
// /*  Types                                                                     */
// /* -------------------------------------------------------------------------- */

// type StreamEvent =
//   | { type: "attempt"; model: string; index: number; total: number }
//   | { type: "result"; data: MealAnalysis }
//   | { type: "error"; code: string };

// interface MealAnalysis {
//   clearedPercent: number;
//   portionSize: "small" | "medium" | "large";
//   confidence: "low" | "medium" | "high";
//   dishSummary: string;
//   feedback: string;
//   wasteAvoidedKg: number;
//   points: number;
// }

// interface RawModelOutput {
//   isValidComparison?: boolean;
//   clearedPercent?: number;
//   portionSize?: string;
//   confidence?: string;
//   dishSummary?: string;
//   feedback?: string;
// }

// class NotAMealError extends Error {}

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                   */
// /* -------------------------------------------------------------------------- */

// // Claude accepts JPEG, PNG, GIF and WebP images.
// function parseDataUrl(dataUrl: unknown): { mediaType: string; base64: string } | null {
//   if (typeof dataUrl !== "string") return null;
//   const match = /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/.exec(dataUrl);
//   if (!match) return null;
//   return { mediaType: match[1], base64: match[2] };
// }

// type Image = { mediaType: string; base64: string };

// async function runModel(name: string, before: Image, after: Image): Promise<MealAnalysis> {
//   const raw = await callClaude({
//     model: name,
//     system: SYSTEM_INSTRUCTION,
//     maxTokens: 1500,
//     timeoutMs: PER_MODEL_TIMEOUT_MS,
//     content: [
//       { type: "text", text: "BEFORE photo (plate before eating):" },
//       { type: "image", source: { type: "base64", media_type: before.mediaType, data: before.base64 } },
//       { type: "text", text: "AFTER photo (same plate after eating):" },
//       { type: "image", source: { type: "base64", media_type: after.mediaType, data: after.base64 } },
//       { type: "text", text: "Analyze the two photos and return the JSON." },
//     ],
//   });
//   const parsed = extractJson<RawModelOutput>(raw);

//   if (parsed.isValidComparison === false) throw new NotAMealError();

//   const clearedPercent = Math.max(0, Math.min(100, Math.round(Number(parsed.clearedPercent ?? 0))));
//   const portionSize = (["small", "medium", "large"].includes(parsed.portionSize ?? "")
//     ? parsed.portionSize
//     : "medium") as MealAnalysis["portionSize"];
//   const confidence = (["low", "medium", "high"].includes(parsed.confidence ?? "")
//     ? parsed.confidence
//     : "medium") as MealAnalysis["confidence"];

//   return {
//     clearedPercent,
//     portionSize,
//     confidence,
//     dishSummary: (parsed.dishSummary ?? "").trim().slice(0, 80),
//     feedback: (parsed.feedback ?? "").trim().slice(0, 240),
//     wasteAvoidedKg: Math.round((clearedPercent / 100) * 0.4 * 10) / 10,
//     points: Math.round(clearedPercent * 0.5),
//   };
// }

// /* -------------------------------------------------------------------------- */
// /*  Route                                                                     */
// /* -------------------------------------------------------------------------- */

// export async function POST(req: NextRequest) {
//   // Only signed-in customers can spend AI quota.
//   try {
//     await verifyCustomer(req);
//   } catch {
//     return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//   }

//   let body: { beforeImage?: unknown; afterImage?: unknown };
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
//   }

//   const before = parseDataUrl(body.beforeImage);
//   const after = parseDataUrl(body.afterImage);
//   if (!before || !after) {
//     return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
//   }
//   if (before.base64.length > MAX_IMAGE_BASE64_CHARS || after.base64.length > MAX_IMAGE_BASE64_CHARS) {
//     return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
//   }

//   // Stream newline-delimited JSON so the page can show REAL progress
//   // (when the model starts, when the result lands) instead of guessing with timers.
//   const encoder = new TextEncoder();
//   const stream = new ReadableStream({
//     async start(controller) {
//       const send = (event: StreamEvent) => {
//         try {
//           controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
//         } catch {
//           // Client disconnected; nothing to do.
//         }
//       };

//       try {
//         for (let i = 0; i < MODEL_CHAIN.length; i++) {
//           if (req.signal.aborted) return;

//           const model = MODEL_CHAIN[i];
//           send({ type: "attempt", model, index: i, total: MODEL_CHAIN.length });

//           try {
//             const data = await runModel(model, before, after);
//             send({ type: "result", data });
//             return;
//           } catch (err) {
//             if (err instanceof NotAMealError) {
//               send({ type: "error", code: "NOT_A_MEAL" });
//               return;
//             }
//             // Overloaded, rate-limited, timed out, bad JSON...
//             // Log the real reason server-side only.
//             console.warn(`analyze-meal: ${model} failed (${i + 1}/${MODEL_CHAIN.length})`, err);
//           }
//         }

//         console.error("analyze-meal: every model in the chain failed", MODEL_CHAIN);
//         send({ type: "error", code: "AI_UNAVAILABLE" });
//       } catch (err) {
//         console.error("analyze-meal error", err);
//         send({ type: "error", code: "SERVER_ERROR" });
//       } finally {
//         try {
//           controller.close();
//         } catch {
//           // already closed
//         }
//       }
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "content-type": "application/x-ndjson; charset=utf-8",
//       "cache-control": "no-store, no-transform",
//       "x-accel-buffering": "no",
//     },
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import { CLAUDE_MODEL, callClaude, extractJson } from "@/lib/ai/claude";
import { verifyCustomer } from "@/lib/firebase/verifyCustomer";

export const runtime = "nodejs";
// Worst case is a timeout plus one retry, so leave headroom.
export const maxDuration = 60;

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

// Model is set in lib/ai/claude.ts (default claude-haiku-5-5).
// Change it without a code edit: CLAUDE_MODEL=claude-sonnet-5-5
const MODEL_CHAIN = [CLAUDE_MODEL];

const PER_MODEL_TIMEOUT_MS = 20_000;
const MAX_IMAGE_BASE64_CHARS = 4_500_000; // ~3.3 MB per image after client compression

const SYSTEM_INSTRUCTION = `You are Trackbite's food-waste analyst. You receive two photos of the same meal: BEFORE eating and AFTER eating.
Rules:
- ingredients: list EVERY distinct edible food item visible in the BEFORE photo (e.g. "Rice", "Chicken breast", "Salad", "Curry sauce"), at most 8, using short plain names. Merge tiny garnishes into the nearest item.
- For each ingredient give sharePercent: the share (1-100) of the ORIGINAL plate that ingredient took up in the BEFORE photo, by food amount. The shares must add up to 100.
- For each ingredient give leftPercent: the share (0-100) of THAT ingredient still remaining in the AFTER photo compared with its own amount in the BEFORE photo. 0 = fully eaten, 100 = untouched. Judge each ingredient separately; do not give them all the same number unless that is really what the photos show.
- clearedPercent is the share (0-100) of the EDIBLE food that was eaten overall. Ignore plates, cutlery, napkins, bones, shells, peels and other inedible parts.
- Judge by how much food remains in the AFTER photo compared with the BEFORE photo. An empty or nearly empty plate is 90-100.
- portionSize describes the size of the ORIGINAL serving in the BEFORE photo: small, medium or large.
- isValidComparison is false if either photo does not show food, or the two photos clearly do not show the same meal. In that case set clearedPercent to 0 and ingredients to an empty list.
- confidence is "high" for clear, similarly-framed photos; "medium" when lighting or angle differs; "low" when it is hard to compare.
- dishSummary: a short plain description of the meal, under 8 words (e.g. "Chicken biryani with raita").
- feedback: ONE short, warm, specific sentence about this meal, under 25 words. Encourage without being preachy.

Reply with ONLY a JSON object and nothing else (no markdown, no code fences), using exactly these keys:
{"isValidComparison": boolean, "ingredients": [{"name": string, "sharePercent": integer 1-100, "leftPercent": integer 0-100}], "clearedPercent": integer 0-100, "portionSize": "small"|"medium"|"large", "confidence": "low"|"medium"|"high", "dishSummary": string, "feedback": string}`;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type StreamEvent =
  | { type: "attempt"; model: string; index: number; total: number }
  | { type: "result"; data: MealAnalysis }
  | { type: "error"; code: string };

interface IngredientResult {
  name: string;
  sharePercent: number; // share of the original plate (sums to 100)
  leftPercent: number; // how much of this ingredient is still left (0-100)
}

interface MealAnalysis {
  clearedPercent: number;
  leftPercent: number; // overall, weighted by ingredient share
  ingredients: IngredientResult[];
  portionSize: "small" | "medium" | "large";
  confidence: "low" | "medium" | "high";
  dishSummary: string;
  feedback: string;
  wasteAvoidedKg: number;
  points: number;
}

interface RawModelOutput {
  isValidComparison?: boolean;
  ingredients?: { name?: unknown; sharePercent?: unknown; leftPercent?: unknown }[];
  clearedPercent?: number;
  portionSize?: string;
  confidence?: string;
  dishSummary?: string;
  feedback?: string;
}

class NotAMealError extends Error {}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// Claude accepts JPEG, PNG, GIF and WebP images.
function parseDataUrl(dataUrl: unknown): { mediaType: string; base64: string } | null {
  if (typeof dataUrl !== "string") return null;
  const match = /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { mediaType: match[1], base64: match[2] };
}

type Image = { mediaType: string; base64: string };

const clampPct = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

/**
 * Cleans the model's ingredient list: trims names, clamps percentages, and
 * rescales the plate shares so they add up to exactly 100.
 */
function sanitizeIngredients(raw: RawModelOutput["ingredients"]): IngredientResult[] {
  if (!Array.isArray(raw)) return [];

  const items = raw
    .map((i) => ({
      name: typeof i?.name === "string" ? i.name.trim().slice(0, 40) : "",
      share: Math.max(0, Number(i?.sharePercent) || 0),
      leftPercent: clampPct(i?.leftPercent),
    }))
    .filter((i) => i.name.length > 0)
    .slice(0, 8);
  if (items.length === 0) return [];

  // If the model gave no usable shares, assume the ingredients are equal.
  const totalShare = items.reduce((sum, i) => sum + i.share, 0);
  const normalized = items.map((i) => ({
    ...i,
    share: totalShare > 0 ? (i.share / totalShare) * 100 : 100 / items.length,
  }));

  // Round shares, then push the rounding drift onto the largest one so they sum to 100.
  const rounded = normalized.map((i) => ({
    name: i.name,
    sharePercent: Math.round(i.share),
    leftPercent: i.leftPercent,
  }));
  const drift = 100 - rounded.reduce((sum, i) => sum + i.sharePercent, 0);
  if (drift !== 0) {
    const biggest = rounded.reduce((a, b) => (b.sharePercent > a.sharePercent ? b : a));
    biggest.sharePercent += drift;
  }
  return rounded;
}

async function runModel(name: string, before: Image, after: Image): Promise<MealAnalysis> {
  const raw = await callClaude({
    model: name,
    system: SYSTEM_INSTRUCTION,
    maxTokens: 1500,
    timeoutMs: PER_MODEL_TIMEOUT_MS,
    content: [
      { type: "text", text: "BEFORE photo (plate before eating):" },
      { type: "image", source: { type: "base64", media_type: before.mediaType, data: before.base64 } },
      { type: "text", text: "AFTER photo (same plate after eating):" },
      { type: "image", source: { type: "base64", media_type: after.mediaType, data: after.base64 } },
      { type: "text", text: "Analyze the two photos and return the JSON." },
    ],
  });
  const parsed = extractJson<RawModelOutput>(raw);

  if (parsed.isValidComparison === false) throw new NotAMealError();

  const ingredients = sanitizeIngredients(parsed.ingredients);

  // With ingredients, the overall figure is the average of what is left,
  // weighted by how much of the plate each ingredient took up. Otherwise
  // fall back to the model's own overall estimate.
  const leftPercent =
    ingredients.length > 0
      ? clampPct(ingredients.reduce((sum, i) => sum + (i.sharePercent / 100) * i.leftPercent, 0))
      : 100 - clampPct(parsed.clearedPercent);
  const clearedPercent = 100 - leftPercent;

  const portionSize = (["small", "medium", "large"].includes(parsed.portionSize ?? "")
    ? parsed.portionSize
    : "medium") as MealAnalysis["portionSize"];
  const confidence = (["low", "medium", "high"].includes(parsed.confidence ?? "")
    ? parsed.confidence
    : "medium") as MealAnalysis["confidence"];

  return {
    clearedPercent,
    leftPercent,
    ingredients,
    portionSize,
    confidence,
    dishSummary: (parsed.dishSummary ?? "").trim().slice(0, 80),
    feedback: (parsed.feedback ?? "").trim().slice(0, 240),
    wasteAvoidedKg: Math.round((clearedPercent / 100) * 0.4 * 10) / 10,
    points: Math.round(clearedPercent * 0.5),
  };
}

/* -------------------------------------------------------------------------- */
/*  Route                                                                     */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  // Only signed-in customers can spend AI quota.
  try {
    await verifyCustomer(req);
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: { beforeImage?: unknown; afterImage?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
  }

  const before = parseDataUrl(body.beforeImage);
  const after = parseDataUrl(body.afterImage);
  if (!before || !after) {
    return NextResponse.json({ error: "MISSING_IMAGES" }, { status: 400 });
  }
  if (before.base64.length > MAX_IMAGE_BASE64_CHARS || after.base64.length > MAX_IMAGE_BASE64_CHARS) {
    return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  }

  // Stream newline-delimited JSON so the page can show REAL progress
  // (when the model starts, when the result lands) instead of guessing with timers.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // Client disconnected; nothing to do.
        }
      };

      try {
        for (let i = 0; i < MODEL_CHAIN.length; i++) {
          if (req.signal.aborted) return;

          const model = MODEL_CHAIN[i];
          send({ type: "attempt", model, index: i, total: MODEL_CHAIN.length });

          try {
            const data = await runModel(model, before, after);
            send({ type: "result", data });
            return;
          } catch (err) {
            if (err instanceof NotAMealError) {
              send({ type: "error", code: "NOT_A_MEAL" });
              return;
            }
            // Overloaded, rate-limited, timed out, bad JSON...
            // Log the real reason server-side only.
            console.warn(`analyze-meal: ${model} failed (${i + 1}/${MODEL_CHAIN.length})`, err);
          }
        }

        console.error("analyze-meal: every model in the chain failed", MODEL_CHAIN);
        send({ type: "error", code: "AI_UNAVAILABLE" });
      } catch (err) {
        console.error("analyze-meal error", err);
        send({ type: "error", code: "SERVER_ERROR" });
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}