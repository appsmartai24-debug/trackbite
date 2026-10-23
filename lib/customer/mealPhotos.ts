import { authedFetch } from "@/lib/client/authedFetch";

/** Uploads the before/after photos for a saved meal (server keeps only the latest few). */
export async function uploadMealPhotos(
  mealId: string,
  beforeImage: string,
  afterImage: string
): Promise<void> {
  await authedFetch("/api/meal-photos", { mealId, beforeImage, afterImage });
}

/** Turns stored photo paths into short-lived viewable links. */
export async function fetchMealPhotoUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const res = await authedFetch<{ urls: Record<string, string> }>("/api/meal-photos/urls", {
    paths,
  });
  return res.urls ?? {};
}