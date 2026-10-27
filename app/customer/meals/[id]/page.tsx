"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { ProgressBar } from "@/components/customer/ProgressBar";
import { useMealPhotoUrls } from "@/components/customer/MealPhotos";
import { getMealById } from "@/lib/customer/meals";
import { Meal } from "@/types";

/** Less left on the plate is better: green when almost clean, red when most is wasted. */
function leftBarColor(leftPercent: number): string {
  if (leftPercent <= 25) return "bg-trackbite-green";
  if (leftPercent <= 60) return "bg-trackbite-yellow";
  return "bg-trackbite-error";
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function BigPhoto({ src, label, hasPath }: { src?: string; label: string; hasPath: boolean }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-trackbite-gray-200 bg-trackbite-gray-100 shadow-sm">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${label} photo of your meal`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-trackbite-gray-400">
          {hasPath ? "Loading photo..." : "No photo saved"}
        </div>
      )}
      <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

export default function MealDetailPage() {
  const { currentUser } = useAuth();
  const params = useParams<{ id: string }>();
  const mealId = params?.id;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const photoUrls = useMealPhotoUrls(meal ? [meal] : []);

  useEffect(() => {
    if (!currentUser || !mealId) return;
    const uid = currentUser.uid;
    let cancelled = false;

    async function load() {
      try {
        const result = await getMealById(uid, mealId);
        if (!cancelled) setMeal(result);
      } catch (err) {
        console.error("Failed to load meal", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser, mealId]);

  const left = meal ? 100 - meal.clearedPercent : 0;

  return (
    <PageContainer size="md" className="flex flex-1 flex-col gap-5">
      <BackHeader title="Meal details" href="/customer" />

      {loading ? (
        <p className="text-sm text-trackbite-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-sm text-trackbite-error">Couldn&apos;t load this meal. Please try again.</p>
      ) : !meal ? (
        <div className="rounded-2xl border border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/60 p-5 text-center">
          <p className="text-sm text-trackbite-gray-500">We couldn&apos;t find this meal.</p>
          <Link href="/customer" className="mt-2 inline-block text-xs font-medium text-trackbite-green">
            Back to home
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-medium capitalize text-trackbite-gray-900">{meal.portionSize} portion</h2>
            <p className="mt-0.5 text-xs text-trackbite-gray-500">{formatDate(meal.createdAt)}</p>
          </div>

          {(meal.beforePhotoPath || meal.afterPhotoPath) && (
            <div className="grid grid-cols-2 gap-3">
              <BigPhoto
                label="Before"
                hasPath={Boolean(meal.beforePhotoPath)}
                src={meal.beforePhotoPath ? photoUrls[meal.beforePhotoPath] : undefined}
              />
              <BigPhoto
                label="After"
                hasPath={Boolean(meal.afterPhotoPath)}
                src={meal.afterPhotoPath ? photoUrls[meal.afterPhotoPath] : undefined}
              />
            </div>
          )}

          <div className="grid grid-cols-2 divide-x divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white py-3.5 shadow-sm">
            <div className="px-4">
              <p className="text-2xl font-semibold text-trackbite-gray-900">{meal.clearedPercent}%</p>
              <p className="text-[11px] text-trackbite-gray-500">Eaten</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-semibold text-trackbite-gray-900">{left}%</p>
              <p className="text-[11px] text-trackbite-gray-500">Left on plate</p>
            </div>
          </div>

          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-trackbite-gray-900">Left on plate, by ingredient</p>
              <div className="mt-3 flex flex-col gap-3">
                {meal.ingredients.map((ing) => (
                  <div key={ing.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm text-trackbite-gray-800">{ing.name}</p>
                      <p className="shrink-0 text-sm font-semibold text-trackbite-gray-900">{ing.leftPercent}% left</p>
                    </div>
                    <ProgressBar
                      value={ing.leftPercent}
                      max={100}
                      className="mt-1.5"
                      barClassName={leftBarColor(ing.leftPercent)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-trackbite-gray-900">Notes</p>
            <p className="mt-1.5 text-sm leading-relaxed text-trackbite-gray-600">{meal.notes || "No notes"}</p>
          </div>
        </>
      )}
    </PageContainer>
  );
}