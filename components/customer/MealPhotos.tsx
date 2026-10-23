"use client";

import { useEffect, useState } from "react";
import { fetchMealPhotoUrls } from "@/lib/customer/mealPhotos";
import { Meal } from "@/types";

/** Loads viewable links for every photo path on the given meals. */
export function useMealPhotoUrls(meals: Meal[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});

  // A stable string, so the effect only re-runs when the set of photos changes.
  const key = meals
    .flatMap((m) => [m.beforePhotoPath, m.afterPhotoPath])
    .filter((p): p is string => Boolean(p))
    .join("|");

  useEffect(() => {
    const paths = key ? key.split("|") : [];
    if (paths.length === 0) {
      setUrls({});
      return;
    }
    let cancelled = false;
    fetchMealPhotoUrls(paths)
      .then((result) => {
        if (!cancelled) setUrls(result);
      })
      .catch(() => {
        if (!cancelled) setUrls({});
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return urls;
}

function Photo({ src, label }: { src?: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="h-12 w-12 overflow-hidden rounded-lg bg-trackbite-gray-100">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${label} photo`} className="h-full w-full object-cover" />
        )}
      </div>
      <span className="text-[9px] text-trackbite-gray-400">{label}</span>
    </div>
  );
}

/** Before/after thumbnails. Renders `fallback` when this meal has no saved photos. */
export function MealPhotoPair({
  meal,
  urls,
  fallback,
}: {
  meal: Meal;
  urls: Record<string, string>;
  fallback: React.ReactNode;
}) {
  if (!meal.beforePhotoPath && !meal.afterPhotoPath) return <>{fallback}</>;
  return (
    <div className="flex shrink-0 gap-1.5">
      <Photo src={meal.beforePhotoPath ? urls[meal.beforePhotoPath] : undefined} label="Before" />
      <Photo src={meal.afterPhotoPath ? urls[meal.afterPhotoPath] : undefined} label="After" />
    </div>
  );
}