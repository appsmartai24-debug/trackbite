"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { AIBadge } from "@/components/customer/AIBadge";
import { getRecentMeals, getMealStats, MealStats } from "@/lib/customer/meals";
import { getCustomerProfile } from "@/lib/customer/profile";
import { Meal } from "@/types";
import {
  ArrowRightIcon,
  CameraIcon,
  FlameIcon,
  LeafIcon,
  QrIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/customer/icons";

// Generic rotating tips shown until we generate real personalized insights
// from the customer's tracked meal history.
const INSIGHTS = [
  "Consistent tracking helps Trackbite AI learn your real portion patterns over time.",
  "Try to photograph your plate from the same angle before and after for the most accurate reading.",
  "Every meal you track adds to your food-waste savings — small habits add up.",
];

function timeAgo(ms: number): string {
  const diffMs = Date.now() - ms;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

function greetingForHour(hour: number): string {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good evening";
}

function MealThumb({ clearedPercent }: { clearedPercent: number }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-trackbite-green-light">
      <CameraIcon className="h-5.5 w-5.5 text-trackbite-green" />
      <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-trackbite-green-darker shadow-sm ring-1 ring-trackbite-gray-100">
        {clearedPercent}%
      </span>
    </div>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 px-2.5 first:pl-4 last:pr-4 sm:gap-2.5 sm:px-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-trackbite-gray-50 text-trackbite-green">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold leading-tight text-trackbite-gray-900">{value}</p>
        <p className="truncate text-[11px] leading-tight text-trackbite-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function CustomerHomePage() {
  const { currentUser } = useAuth();

  const [firstName, setFirstName] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState<MealStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    let cancelled = false;

    async function load() {
      try {
        const [profile, recentMeals, mealStats] = await Promise.all([
          getCustomerProfile(uid),
          getRecentMeals(uid, 3),
          getMealStats(uid),
        ]);
        if (!cancelled) {
          setFirstName(profile?.firstName ?? null);
          setMeals(recentMeals);
          setStats(mealStats);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const insight = INSIGHTS[new Date().getDate() % INSIGHTS.length];
  const greeting = greetingForHour(new Date().getHours());
  const displayName = firstName || currentUser?.email?.split("@")[0];

  return (
    <PageContainer size="lg" className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-trackbite-green">{greeting}</p>
        <h1 className="mt-0.5 text-2xl font-medium capitalize text-trackbite-gray-900">
          {displayName || "Welcome back"}
        </h1>
      </div>

      {/* AI insight — the one signature, colorful moment on this screen.
          Everything else stays quiet so this keeps its weight. */}
      <div className="relative overflow-hidden rounded-2xl border border-trackbite-green/15 bg-gradient-to-br from-trackbite-green-muted via-white to-trackbite-yellow-light/40 p-5 shadow-sm sm:p-6">
        <div
          className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-trackbite-green/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-trackbite-green shadow-sm">
            <SparkleIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <AIBadge label="Today's insight" />
            <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-800">{insight}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Link
          href="/customer/track"
          className="group flex flex-col justify-between rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-trackbite-green/40 hover:shadow-md sm:p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-trackbite-green-light text-trackbite-green">
            <CameraIcon className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-trackbite-gray-900">Track a meal</p>
            <p className="mt-0.5 text-xs text-trackbite-gray-500">Snap before &amp; after</p>
          </div>
          <ArrowRightIcon className="mt-3 h-4 w-4 text-trackbite-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-trackbite-green" />
        </Link>

        <Link
          href="/customer/profile"
          className="group flex flex-col justify-between rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-trackbite-green/40 hover:shadow-md sm:p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-trackbite-yellow-light text-trackbite-yellow-dark">
            <QrIcon className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-trackbite-gray-900">Show Food ID</p>
            <p className="mt-0.5 text-xs text-trackbite-gray-500">Scan in at a restaurant</p>
          </div>
          <ArrowRightIcon className="mt-3 h-4 w-4 text-trackbite-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-trackbite-green" />
        </Link>
      </div>

      {/* Stats — one cohesive bar instead of three repeated boxes */}
      <div className="grid grid-cols-3 divide-x divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white py-3.5 shadow-sm">
        <StatCell icon={CameraIcon} value={stats ? String(stats.mealsTracked) : "—"} label="Meals tracked" />
        <StatCell icon={StarIcon} value={stats ? stats.pointsEarned.toLocaleString() : "—"} label="Points" />
        <StatCell icon={LeafIcon} value={stats ? `${stats.foodSavedKg} kg` : "—"} label="Food saved" />
      </div>

      {/* Recent meals */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-trackbite-gray-900">Recent meals</h2>
          <Link
            href="/customer/track"
            className="text-xs font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Track one
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-trackbite-gray-400">Loading...</p>
        ) : meals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/60 p-5 text-center">
            <p className="text-sm text-trackbite-gray-500">No meals tracked yet.</p>
            <Link href="/customer/track" className="mt-2 inline-block text-xs font-medium text-trackbite-green hover:text-trackbite-green-dark">
              Track your first meal
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white px-4 shadow-sm">
            {meals.map((meal) => (
              <div key={meal.id} className="flex items-center gap-3 py-3.5 first:pt-4 last:pb-4">
                <MealThumb clearedPercent={meal.clearedPercent} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium capitalize text-trackbite-gray-900">
                    {meal.portionSize} portion
                  </p>
                  <p className="truncate text-xs text-trackbite-gray-500">{meal.notes || "No notes"}</p>
                </div>
                <p className="shrink-0 text-[11px] text-trackbite-gray-400">{timeAgo(meal.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Streak footer strip */}
            <div className="flex items-center gap-3 rounded-2xl border border-trackbite-gray-200 bg-trackbite-gray-50 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-trackbite-yellow-dark shadow-sm">
          <FlameIcon className="h-4.5 w-4.5" />
        </div>
        <p className="text-xs text-trackbite-gray-600">
          <span className="font-semibold text-trackbite-gray-900">
            {stats ? stats.mealsTracked : 0} meals tracked
          </span>{" "}
          so far. Track today&apos;s meal to keep building your history.
        </p>
      </div>
    </PageContainer>
  );
}