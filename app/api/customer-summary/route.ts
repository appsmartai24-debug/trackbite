// // import { NextRequest, NextResponse } from "next/server";
// // import { adminDb } from "@/lib/firebase/admin";
// // import { Timestamp } from "firebase-admin/firestore";

// // export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import { adminDb } from "@/lib/firebase/admin";
// import { firebaseApp } from "@/lib/firebase/config";
// import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
// import { Timestamp } from "firebase-admin/firestore";

// export const runtime = "nodejs";

// const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
// const model = getGenerativeModel(ai, { model: "gemini-3.1-flash-lite" });

// interface MealDoc {
//   clearedPercent?: number;
//   portionSize?: string;
//   notes?: string;
//   createdAt?: Timestamp;
//   // createdAt?: FirebaseFirestore.Timestamp;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { uid } = await req.json();

//     if (!uid || typeof uid !== "string") {
//       return NextResponse.json({ error: "Missing uid" }, { status: 400 });
//     }

//     const profileSnap = await adminDb.collection("customerProfiles").doc(uid).get();
//     if (!profileSnap.exists) {
//       return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
//     }
//     // const profile = profileSnap.data() ?? {};

//     // const mealsSnap = await adminDb
//     //   .collection("meals")
//     //   .where("uid", "==", uid)
//     //   .orderBy("createdAt", "desc")
//     //   .limit(10)
//     //   .get();

//     // const meals: MealDoc[] = mealsSnap.docs.map((d) => d.data() as MealDoc);

//     // if (meals.length === 0) {
//     //   return NextResponse.json({
//     //     summary:
//     //       "No meals tracked yet for this customer, so there isn't enough history for a summary.",
//     //   });
//     // }

//         const profile = profileSnap.data() ?? {};

//     const mealsSnap = await adminDb
//       .collection("meals")
//       .where("uid", "==", uid)
//       .orderBy("createdAt", "desc")
//       .limit(10)
//       .get();

//     const meals: MealDoc[] = mealsSnap.docs.map((d) => d.data() as MealDoc);

//     // Build this up front so allergies/preferences always reach the
//     // restaurant, even for a brand-new customer with no meal history yet.
//     const baseFacts = {
//       dietaryPreferences: profile.dietaryPreferences ?? [],
//       allergies: profile.allergies ?? [],
//       portionPreference: profile.portionPreference ?? "medium",
//       foodGoals: profile.foodGoals ?? [],
//       mealsTracked: meals.length,
//       averageClearedPercent: 0,
//       mostCommonPortionSize: undefined as string | undefined,
//     };

//     if (meals.length === 0) {
//       return NextResponse.json({
//         summary:
//           "No meals tracked yet for this customer, so there isn't enough history for a summary.",
//         facts: baseFacts,
//       });
//     }

//     const avgCleared = Math.round(
//       meals.reduce((sum, m) => sum + (m.clearedPercent ?? 0), 0) / meals.length
//     );
//     const portionCounts: Record<string, number> = {};
//     for (const m of meals) {
//       const size = m.portionSize ?? "medium";
//       portionCounts[size] = (portionCounts[size] ?? 0) + 1;
//     }
//     const mostCommonPortion = Object.entries(portionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

//     const factSheet = {
//       dietaryPreferences: profile.dietaryPreferences ?? [],
//       allergies: profile.allergies ?? [],
//       portionPreference: profile.portionPreference ?? "medium",
//       foodGoals: profile.foodGoals ?? [],
//       mealsTracked: meals.length,
//       averageClearedPercent: avgCleared,
//       mostCommonPortionSize: mostCommonPortion,
//     };

//     // const apiKey = process.env.ANTHROPIC_API_KEY;
//     // if (!apiKey) {
//     //   return NextResponse.json({ error: "Server missing ANTHROPIC_API_KEY" }, { status: 500 });
//     // }

//     // const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
//     //   method: "POST",
//     //   headers: {
//     //     "content-type": "application/json",
//     //     "x-api-key": apiKey,
//     //     "anthropic-version": "2023-06-01",
//     //   },
//     //   body: JSON.stringify({
//     //     model: "claude-sonnet-4-6",
//     //     max_tokens: 200,
//     //     messages: [
//     //       {
//     //         role: "user",
//     //         content: `You are helping a restaurant staff member quickly understand a returning customer, based only on the facts below. Write 2-3 short, practical sentences (no headers, no bullet points) covering things like: typical portion size, allergies/dietary needs they must respect, and how much they tend to finish. Only state what's supported by the facts — never guess or invent preferences.\n\nFacts:\n${JSON.stringify(factSheet, null, 2)}`,
//     //       },
//     //     ],
//     //   }),
//     // });

//     // if (!claudeRes.ok) {
//     //   const errText = await claudeRes.text();
//     //   return NextResponse.json({ error: `Claude API error: ${errText}` }, { status: 502 });
//     // }

//     // const data = await claudeRes.json();
//     // const summary = data.content?.find((block: { type: string }) => block.type === "text")?.text ?? "";

//     // return NextResponse.json({ summary, facts: factSheet });
//         let result;
//     try {
//       result = await model.generateContent(
//         `You are helping a restaurant staff member quickly understand a returning customer, based only on the facts below. Write 2-3 short, practical sentences (no headers, no bullet points) covering things like: typical portion size, allergies/dietary needs they must respect, and how much they tend to finish. Only state what's supported by the facts — never guess or invent preferences.\n\nFacts:\n${JSON.stringify(factSheet, null, 2)}`
//       );
//     } catch (err) {
//       return NextResponse.json({ error: `Gemini API error: ${(err as Error).message}` }, { status: 502 });
//     }

//     const summary = result.response.text() ?? "";

//     return NextResponse.json({ summary, facts: factSheet });
//   } catch (err) {
//     console.error("customer-summary error", err);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { adminDb } from "@/lib/firebase/admin";
// import { Timestamp } from "firebase-admin/firestore";
// import { callClaude } from "@/lib/ai/claude";

// export const runtime = "nodejs";

// interface MealDoc {
//   clearedPercent?: number;
//   portionSize?: string;
//   notes?: string;
//   createdAt?: Timestamp;
// }

// const SYSTEM_PROMPT =
//   "You help restaurant staff quickly understand a returning customer, using only the facts you are given. " +
//   "Write 2-3 short, practical sentences (no headers, no bullet points, no markdown). " +
//   "Cover things like: typical portion size, allergies and dietary needs that must be respected, " +
//   "favorite cuisines, foods the customer dislikes, and how much they tend to finish. " +
//   "Only state what is supported by the facts. Never guess or invent preferences.";

// export async function POST(req: NextRequest) {
//   try {
//     const { uid } = await req.json();

//     if (!uid || typeof uid !== "string") {
//       return NextResponse.json({ error: "Missing uid" }, { status: 400 });
//     }

//     const profileSnap = await adminDb.collection("customerProfiles").doc(uid).get();
//     if (!profileSnap.exists) {
//       return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
//     }
//     const profile = profileSnap.data() ?? {};

//     const mealsSnap = await adminDb
//       .collection("meals")
//       .where("uid", "==", uid)
//       .orderBy("createdAt", "desc")
//       .limit(10)
//       .get();

//     const meals: MealDoc[] = mealsSnap.docs.map((d) => d.data() as MealDoc);

//     // Built up front so allergies/preferences always reach the restaurant,
//     // even for a brand-new customer with no meal history yet.
//     const baseFacts = {
//       dietaryPreferences: profile.dietaryPreferences ?? [],
//       allergies: profile.allergies ?? [],
//       portionPreference: profile.portionPreference ?? "medium",
//       favoriteCuisines: profile.favoriteCuisines ?? [],
//       dislikedFoods: profile.dislikedFoods ?? [],
//       foodGoals: profile.foodGoals ?? [],
//       mealsTracked: meals.length,
//       averageClearedPercent: 0,
//       mostCommonPortionSize: undefined as string | undefined,
//     };

//     if (meals.length === 0) {
//       return NextResponse.json({
//         summary:
//           "No meals tracked yet for this customer, so there isn't enough history for a summary.",
//         facts: baseFacts,
//       });
//     }

//     const avgCleared = Math.round(
//       meals.reduce((sum, m) => sum + (m.clearedPercent ?? 0), 0) / meals.length
//     );
//     const portionCounts: Record<string, number> = {};
//     for (const m of meals) {
//       const size = m.portionSize ?? "medium";
//       portionCounts[size] = (portionCounts[size] ?? 0) + 1;
//     }
//     const mostCommonPortion = Object.entries(portionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

//     const factSheet = {
//       ...baseFacts,
//       averageClearedPercent: avgCleared,
//       mostCommonPortionSize: mostCommonPortion,
//     };

//     let summary = "";
//     try {
//       summary = (
//         await callClaude({
//           system: SYSTEM_PROMPT,
//           maxTokens: 250,
//           content: [{ type: "text", text: `Facts:\n${JSON.stringify(factSheet, null, 2)}` }],
//         })
//       ).trim();
//     } catch (err) {
//       console.error("customer-summary: Claude error", err);
//       return NextResponse.json({ error: "AI summary unavailable" }, { status: 502 });
//     }

//     return NextResponse.json({ summary, facts: factSheet });
//   } catch (err) {
//     console.error("customer-summary error", err);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { callClaude } from "@/lib/ai/claude";
import { HUNGER_LABELS, freshHunger } from "@/lib/customer/hunger";

export const runtime = "nodejs";

interface MealDoc {
  clearedPercent?: number;
  portionSize?: string;
  notes?: string;
  createdAt?: Timestamp;
}

const SYSTEM_PROMPT =
  "You help restaurant staff quickly understand a returning customer, using only the facts you are given. " +
  "Write 2-3 short, practical sentences (no headers, no bullet points, no markdown). " +
  "Cover things like: typical portion size, allergies and dietary needs that must be respected, " +
  "favorite cuisines, foods the customer dislikes, and how much they tend to finish. " +
  "If a hunger level for today is given, say how it should adjust the usual portion " +
  "(slightly hungry: a bit smaller, moderately hungry: usual, very hungry: a bit larger). " +
  "Only state what is supported by the facts. Never guess or invent preferences.";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const profileSnap = await adminDb.collection("customerProfiles").doc(uid).get();
    if (!profileSnap.exists) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }
    const profile = profileSnap.data() ?? {};

    const mealsSnap = await adminDb
      .collection("meals")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const meals: MealDoc[] = mealsSnap.docs.map((d) => d.data() as MealDoc);

    // Only counts if the customer set it recently (it expires after a few hours).
    const hungerUpdatedMs =
      typeof profile.hungerUpdatedAt?.toMillis === "function" ? profile.hungerUpdatedAt.toMillis() : null;
    const currentHunger = freshHunger(profile.currentHunger, hungerUpdatedMs);

    // Built up front so allergies/preferences always reach the restaurant,
    // even for a brand-new customer with no meal history yet.
    const baseFacts = {
      dietaryPreferences: profile.dietaryPreferences ?? [],
      allergies: profile.allergies ?? [],
      portionPreference: profile.portionPreference ?? "medium",
      favoriteCuisines: profile.favoriteCuisines ?? [],
      dislikedFoods: profile.dislikedFoods ?? [],
      foodGoals: profile.foodGoals ?? [],
      hungerToday: currentHunger ? HUNGER_LABELS[currentHunger] : null,
      currentHunger,
      mealsTracked: meals.length,
      averageClearedPercent: 0,
      mostCommonPortionSize: undefined as string | undefined,
    };

    if (meals.length === 0) {
      return NextResponse.json({
        summary:
          "No meals tracked yet for this customer, so there isn't enough history for a summary.",
        facts: baseFacts,
      });
    }

    const avgCleared = Math.round(
      meals.reduce((sum, m) => sum + (m.clearedPercent ?? 0), 0) / meals.length
    );
    const portionCounts: Record<string, number> = {};
    for (const m of meals) {
      const size = m.portionSize ?? "medium";
      portionCounts[size] = (portionCounts[size] ?? 0) + 1;
    }
    const mostCommonPortion = Object.entries(portionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const factSheet = {
      ...baseFacts,
      averageClearedPercent: avgCleared,
      mostCommonPortionSize: mostCommonPortion,
    };

    let summary = "";
    try {
      summary = (
        await callClaude({
          system: SYSTEM_PROMPT,
          maxTokens: 1500,
          content: [{ type: "text", text: `Facts:\n${JSON.stringify(factSheet, null, 2)}` }],
        })
      ).trim();
    } catch (err) {
      console.error("customer-summary: Claude error", err);
      return NextResponse.json({ error: "AI summary unavailable" }, { status: 502 });
    }

    return NextResponse.json({ summary, facts: factSheet });
  } catch (err) {
    console.error("customer-summary error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}