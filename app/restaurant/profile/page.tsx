"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SettingsRow } from "@/components/customer/SettingsRow";
import {
  GiftIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  BowlIcon,
  UserIcon,
} from "@/components/customer/icons";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/lib/firebase/auth";
import { getRestaurantProfile, RestaurantProfile } from "@/lib/restaurant/profile";
import { authedFetch } from "@/lib/client/authedFetch";

interface RestaurantStats {
  customersServed: number;
  totalPointsAwarded: number;
  rewardsRedeemed: number;
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-3 first:pl-0 last:pr-0">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-gray-50 text-trackbite-gray-500">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-trackbite-gray-500">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-trackbite-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function RestaurantProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      try {
        const [profileData, statsData] = await Promise.all([
          getRestaurantProfile(currentUser.uid),
          authedFetch<RestaurantStats>("/api/restaurant/stats", {}).catch(() => null),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setStats(statsData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <PageContainer size="md" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading your profile..." />
      </PageContainer>
    );
  }

  const initials = profile?.restaurantName?.[0]?.toUpperCase() ?? "R";

  return (
    <PageContainer size="md" className="flex flex-1 flex-col gap-6">
      {/* Hero header — identity + real activity at a glance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-trackbite-gray-900 via-trackbite-gray-800 to-trackbite-gray-900 px-6 py-7">
        <div
          className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-trackbite-yellow/20 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/20 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-trackbite-yellow-light text-xl font-semibold text-trackbite-gray-800 ring-2 ring-white/20">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-medium text-white">
              {profile?.restaurantName || "Your restaurant"}
            </h1>
            <p className="truncate text-sm text-white/70">{currentUser?.email}</p>
          </div>
        </div>

        <div className="relative mt-6 flex items-center divide-x divide-white/15 border-t border-white/15 pt-5">
          <StatItem value={stats ? String(stats.customersServed) : "0"} label="Customers" />
          <StatItem
            value={stats ? stats.totalPointsAwarded.toLocaleString() : "0"}
            label="Points awarded"
          />
          <StatItem value={stats ? String(stats.rewardsRedeemed) : "0"} label="Redeemed" />
        </div>
      </div>

      {/* Loyalty programme — the equivalent of the customer's Food ID card */}
      <div className="relative overflow-hidden rounded-3xl bg-trackbite-gray-900 px-6 py-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col justify-between self-stretch py-1">
            <div>
              <p className="text-sm font-medium tracking-tight text-white">trackbite</p>
              <p className="mt-0.5 text-xs text-white/50">Loyalty programme</p>
            </div>
            <div>
              <p className="text-sm text-white/80">
                {profile?.rewardName || "Not set yet"}
              </p>
              <p className="mt-1 text-xs text-white/50">
                at {profile?.rewardThreshold ?? 200} points per customer
              </p>
            </div>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-trackbite-yellow-light">
            <GiftIcon className="h-10 w-10 text-trackbite-yellow-dark" />
          </div>
        </div>
      </div>

      {/* Restaurant details */}
      <Card padding="lg">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-trackbite-gray-900">Restaurant details</h2>
          <button
            type="button"
            onClick={() => router.push("/restaurant/rewards")}
            className="text-xs font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Edit reward
          </button>
        </div>

        <div className="divide-y divide-trackbite-gray-100">
          <DetailRow icon={UserIcon} label="Contact person" value={profile?.contactPerson} />
          <DetailRow icon={PhoneIcon} label="Phone" value={profile?.phone} />
          <DetailRow
            icon={MapPinIcon}
            label="Address"
            value={[profile?.address, profile?.city].filter(Boolean).join(", ")}
          />
          <DetailRow icon={BowlIcon} label="Cuisine type" value={profile?.cuisineType} />
        </div>
      </Card>

      {/* Account */}
      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold text-trackbite-gray-900">Account</h2>
        <Card padding="sm" className="divide-y divide-trackbite-gray-100">
          <SettingsRow
            href="/restaurant/rewards"
            icon={GiftIcon}
            label="Reward settings"
            description="Points threshold and reward given"
          />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-trackbite-error-light"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-error-light text-trackbite-error">
              <LogOutIcon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-trackbite-error">Log out</span>
          </button>
        </Card>
      </div>
    </PageContainer>
  );
}