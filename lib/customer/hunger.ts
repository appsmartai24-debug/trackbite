import { HungerLevel } from "@/types";

// No Firebase imports here on purpose: this file is used by both the
// client pages and the server API route.

export const HUNGER_LABELS: Record<HungerLevel, string> = {
  slightly: "Slightly hungry",
  moderately: "Moderately hungry",
  very: "Very hungry",
};

// Shown to restaurant staff next to the hunger badge.
export const HUNGER_PORTION_HINTS: Record<HungerLevel, string> = {
  slightly: "Consider a smaller portion today.",
  moderately: "Their usual portion should be a good fit.",
  very: "Consider a larger portion today.",
};

// A hunger level is only meaningful for the current visit, so it expires.
export const HUNGER_FRESH_MS = 6 * 60 * 60 * 1000; // 6 hours

export function isHungerLevel(value: unknown): value is HungerLevel {
  return value === "slightly" || value === "moderately" || value === "very";
}

/** Returns the hunger level only if it was set recently, otherwise null. */
export function freshHunger(level: unknown, updatedAtMs: number | null): HungerLevel | null {
  if (!isHungerLevel(level) || updatedAtMs == null) return null;
  return Date.now() - updatedAtMs <= HUNGER_FRESH_MS ? level : null;
}