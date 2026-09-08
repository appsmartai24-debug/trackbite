// "use client";

// import { useRouter } from "next/navigation";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";
// import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";
// import { logoutUser } from "@/lib/firebase/auth";
// import { useAuth } from "@/context/AuthContext";

// function RestaurantDashboardContent() {
//   const router = useRouter();
//   const { currentUser } = useAuth();

//   const handleLogout = async () => {
//     await logoutUser();
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <header className="border-b border-trackbite-gray-200 bg-white">
//         <PageContainer size="lg" className="flex items-center justify-between py-4">
//           <TrackbiteLogo size="sm" />
//           <Button variant="ghost" size="sm" onClick={handleLogout}>
//             Log out
//           </Button>
//         </PageContainer>
//       </header>

//       <PageContainer size="md">
//         <Card padding="lg" className="text-center">
//           <span className="inline-block rounded-full bg-trackbite-yellow-light px-3 py-1 text-xs font-semibold text-trackbite-gray-800">
//             Restaurant
//           </span>
//           <h1 className="mt-4 text-3xl font-bold text-trackbite-gray-900">
//             Welcome to Trackbite
//           </h1>
//           <h2 className="mt-2 text-xl font-semibold text-trackbite-green">
//             Restaurant Dashboard
//           </h2>
//           <p className="mt-4 text-trackbite-gray-600">
//             More features coming soon.
//           </p>
//           {currentUser?.email && (
//             <p className="mt-6 text-sm text-trackbite-gray-500">
//               Signed in as {currentUser.email}
//             </p>
//           )}
//         </Card>
//       </PageContainer>
//       <InstallTrackbite />
//     </div>
//   );
// }

// export default function RestaurantPage() {
//   return (
//     <ProtectedRoute requiredRole="restaurant">
//       <RestaurantDashboardContent />
//     </ProtectedRoute>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";
// import { SettingsRow } from "@/components/customer/SettingsRow";
// import { CameraIcon, GiftIcon } from "@/components/customer/icons";
// import { logoutUser } from "@/lib/firebase/auth";
// import { useAuth } from "@/context/AuthContext";
// import { getRestaurantProfile, RestaurantProfile } from "@/lib/restaurant/profile";

// function RestaurantDashboardContent() {
//   const router = useRouter();
//   const { currentUser } = useAuth();
//   const [profile, setProfile] = useState<RestaurantProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       if (!currentUser) return;
//       const data = await getRestaurantProfile(currentUser.uid);
//       if (!cancelled) {
//         setProfile(data);
//         setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [currentUser]);

//   const handleLogout = async () => {
//     await logoutUser();
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <header className="border-b border-trackbite-gray-200 bg-white">
//         <PageContainer size="lg" className="flex items-center justify-between py-4">
//           <TrackbiteLogo size="sm" />
//           <Button variant="ghost" size="sm" onClick={handleLogout}>
//             Log out
//           </Button>
//         </PageContainer>
//       </header>

//       <PageContainer size="md" className="flex flex-col gap-5">
//         <Card padding="lg">
//           <span className="inline-block rounded-full bg-trackbite-yellow-light px-3 py-1 text-xs font-semibold text-trackbite-gray-800">
//             Restaurant
//           </span>
//           <h1 className="mt-4 text-2xl font-semibold text-trackbite-gray-900">
//             {profile?.restaurantName || "Welcome to Trackbite"}
//           </h1>
//           {currentUser?.email && (
//             <p className="mt-1 text-sm text-trackbite-gray-500">
//               Signed in as {currentUser.email}
//             </p>
//           )}
//         </Card>

//         {loading ? (
//           <Card padding="lg">
//             <LoadingSpinner label="Loading your dashboard..." size="sm" />
//           </Card>
//         ) : (
//           <Card padding="lg" className="flex items-center justify-between gap-4">
//             <div className="min-w-0">
//               <p className="text-xs font-medium uppercase tracking-wide text-trackbite-gray-400">
//                 Current reward
//               </p>
//               <p className="mt-1 truncate text-sm font-medium text-trackbite-gray-900">
//                 {profile?.rewardName || "Not set yet"}
//               </p>
//               <p className="text-xs text-trackbite-gray-500">
//                 at {profile?.rewardThreshold ?? 200} points
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => router.push("/restaurant/rewards")}
//             >
//               Edit
//             </Button>
//           </Card>
//         )}

//         <Card padding="sm" className="divide-y divide-trackbite-gray-100">
//           <SettingsRow
//             href="/restaurant/scan"
//             icon={CameraIcon}
//             label="Scan a customer"
//             description="Look up a customer's profile and wallet"
//           />
//           <SettingsRow
//             href="/restaurant/rewards"
//             icon={GiftIcon}
//             label="Reward settings"
//             description="Set your points threshold and reward"
//           />
//         </Card>
//       </PageContainer>
//       <InstallTrackbite />
//     </div>
//   );
// }

// export default function RestaurantPage() {
//   return (
//     <ProtectedRoute requiredRole="restaurant">
//       <RestaurantDashboardContent />
//     </ProtectedRoute>
//   );
// }



// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { getRestaurantProfile, RestaurantProfile } from "@/lib/restaurant/profile";
// import { authedFetch } from "@/lib/client/authedFetch";
// import {
//   CameraIcon,
//   GiftIcon,
//   UserIcon,
//   StarIcon,
//   GiftBoxSmallIcon,
//   ArrowRightIcon,
// } from "@/components/customer/icons";

// interface RestaurantStats {
//   customersServed: number;
//   totalPointsAwarded: number;
//   rewardsRedeemed: number;
// }

// function greetingForHour(hour: number): string {
//   if (hour < 5) return "Still open";
//   if (hour < 12) return "Good morning";
//   if (hour < 17) return "Good afternoon";
//   return "Good evening";
// }

// function StatCell({
//   icon: Icon,
//   value,
//   label,
// }: {
//   icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
//   value: string;
//   label: string;
// }) {
//   return (
//     <div className="flex min-w-0 items-center gap-2 px-2.5 first:pl-4 last:pr-4 sm:gap-2.5 sm:px-4">
//       <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-trackbite-gray-50 text-trackbite-green">
//         <Icon className="h-4 w-4" />
//       </span>
//       <div className="min-w-0">
//         <p className="truncate text-base font-semibold leading-tight text-trackbite-gray-900">{value}</p>
//         <p className="truncate text-[11px] leading-tight text-trackbite-gray-500">{label}</p>
//       </div>
//     </div>
//   );
// }

// export default function RestaurantPage() {
//   const { currentUser } = useAuth();
//   const [profile, setProfile] = useState<RestaurantProfile | null>(null);
//   const [stats, setStats] = useState<RestaurantStats | null>(null);

//   useEffect(() => {
//     if (!currentUser) return;
//     let cancelled = false;

//     async function load() {
//       const [profileData, statsData] = await Promise.all([
//         getRestaurantProfile(currentUser!.uid),
//         authedFetch<RestaurantStats>("/api/restaurant/stats", {}).catch(() => null),
//       ]);
//       if (!cancelled) {
//         setProfile(profileData);
//         setStats(statsData);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [currentUser]);

//   const greeting = greetingForHour(new Date().getHours());
//   const hasActivity = stats !== null && stats.customersServed > 0;

//   return (
//     <PageContainer size="lg" className="flex flex-1 flex-col gap-6">
//       <div>
//         <p className="text-sm font-medium text-trackbite-green">{greeting}</p>
//         <h1 className="mt-0.5 truncate text-2xl font-medium text-trackbite-gray-900">
//           {profile?.restaurantName || "Welcome back"}
//         </h1>
//       </div>

//       {/* Primary action — the thing staff reach for the most during a shift */}
//       <Link
//         href="/restaurant/scan"
//         className="group flex items-center gap-4 rounded-2xl bg-trackbite-green p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-trackbite-green-dark hover:shadow-md sm:p-6"
//       >
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
//           <CameraIcon className="h-6 w-6" />
//         </div>
//         <div className="min-w-0 flex-1">
//           <p className="text-base font-medium text-white">Scan a customer</p>
//           <p className="mt-0.5 text-sm text-white/70">Look up their wallet and add points</p>
//         </div>
//         <ArrowRightIcon className="h-5 w-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
//       </Link>

//       {/* Impact — real numbers, one cohesive bar instead of three repeated boxes */}
//       <div>
//         <div className="grid grid-cols-3 divide-x divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white py-3.5 shadow-sm">
//           <StatCell
//             icon={UserIcon}
//             value={stats ? String(stats.customersServed) : "—"}
//             label="Customers"
//           />
//           <StatCell
//             icon={StarIcon}
//             value={stats ? stats.totalPointsAwarded.toLocaleString() : "—"}
//             label="Points awarded"
//           />
//           <StatCell
//             icon={GiftBoxSmallIcon}
//             value={stats ? String(stats.rewardsRedeemed) : "—"}
//             label="Redeemed"
//           />
//         </div>
//         {stats !== null && !hasActivity && (
//           <p className="mt-2 px-1 text-xs text-trackbite-gray-500">
//             Scan your first customer to start tracking impact here.
//           </p>
//         )}
//       </div>

//       {/* Loyalty programme — same "membership card" identity as the profile page */}
//       <div className="relative overflow-hidden rounded-3xl bg-trackbite-gray-900 px-6 py-6">
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.07]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 14px)",
//           }}
//           aria-hidden="true"
//         />
//         <div className="relative flex items-center justify-between gap-6">
//           <div className="flex min-w-0 flex-col justify-between self-stretch py-1">
//             <div>
//               <p className="text-sm font-medium tracking-tight text-white">trackbite</p>
//               <p className="mt-0.5 text-xs text-white/50">Loyalty programme</p>
//             </div>
//             <div>
//               <p className="text-sm text-white/80">{profile?.rewardName || "Not set yet"}</p>
//               <p className="mt-1 text-xs text-white/50">
//                 at {profile?.rewardThreshold ?? 200} points per customer
//               </p>
//               <Link
//                 href="/restaurant/rewards"
//                 className="mt-3 inline-block text-xs font-medium text-trackbite-yellow hover:text-trackbite-yellow-dark"
//               >
//                 Edit reward
//               </Link>
//             </div>
//           </div>

//           <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-trackbite-yellow-light">
//             <GiftIcon className="h-10 w-10 text-trackbite-yellow-dark" />
//           </div>
//         </div>
//       </div>
//     </PageContainer>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { getRestaurantProfile, RestaurantProfile } from "@/lib/restaurant/profile";
import { authedFetch } from "@/lib/client/authedFetch";
import {
  CameraIcon,
  GiftIcon,
  UserIcon,
  StarIcon,
  GiftBoxSmallIcon,
  ArrowRightIcon,
} from "@/components/customer/icons";

interface Redemption {
  id: string;
  rewardName: string;
  pointsRedeemed: number;
  redeemedAt: number;
}

interface RestaurantStats {
  customersServed: number;
  totalPointsAwarded: number;
  rewardsRedeemed: number;
  recentRedemptions: Redemption[];
}

function greetingForHour(hour: number): string {
  if (hour < 5) return "Still open";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(ms: number): string {
  if (!ms) return "";
  const diffMs = Date.now() - ms;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
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

export default function RestaurantPage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [stats, setStats] = useState<RestaurantStats | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    async function load() {
      const [profileData, statsData] = await Promise.all([
        getRestaurantProfile(currentUser!.uid),
        authedFetch<RestaurantStats>("/api/restaurant/stats", {}).catch(() => null),
      ]);
      if (!cancelled) {
        setProfile(profileData);
        setStats(statsData);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const greeting = greetingForHour(new Date().getHours());
  const hasActivity = stats !== null && stats.customersServed > 0;

  return (
    <PageContainer size="lg" className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-trackbite-green">{greeting}</p>
        <h1 className="mt-0.5 truncate text-2xl font-medium text-trackbite-gray-900">
          {profile?.restaurantName || "Welcome back"}
        </h1>
      </div>

      {/* Primary action — the thing staff reach for the most during a shift */}
      <Link
        href="/restaurant/scan"
        className="group flex items-center gap-4 rounded-2xl bg-trackbite-green p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-trackbite-green-dark hover:shadow-md sm:p-6"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <CameraIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-white">Scan a customer</p>
          <p className="mt-0.5 text-sm text-white/70">Look up their wallet and add points</p>
        </div>
        <ArrowRightIcon className="h-5 w-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
      </Link>

      {/* Impact — real numbers, one cohesive bar instead of three repeated boxes */}
      <div>
        <div className="grid grid-cols-3 divide-x divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white py-3.5 shadow-sm">
          <StatCell
            icon={UserIcon}
            value={stats ? String(stats.customersServed) : "—"}
            label="Customers"
          />
          <StatCell
            icon={StarIcon}
            value={stats ? stats.totalPointsAwarded.toLocaleString() : "—"}
            label="Points awarded"
          />
          <StatCell
            icon={GiftBoxSmallIcon}
            value={stats ? String(stats.rewardsRedeemed) : "—"}
            label="Redeemed"
          />
        </div>
        {stats !== null && !hasActivity && (
          <p className="mt-2 px-1 text-xs text-trackbite-gray-500">
            Scan your first customer to start tracking impact here.
          </p>
        )}
      </div>

      {/* Loyalty programme — same "membership card" identity as the profile page */}
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
              <p className="text-sm text-white/80">{profile?.rewardName || "Not set yet"}</p>
              <p className="mt-1 text-xs text-white/50">
                at {profile?.rewardThreshold ?? 200} points per customer
              </p>
              <Link
                href="/restaurant/rewards"
                className="mt-3 inline-block text-xs font-medium text-trackbite-yellow hover:text-trackbite-yellow-dark"
              >
                Edit reward
              </Link>
            </div>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-trackbite-yellow-light">
            <GiftIcon className="h-10 w-10 text-trackbite-yellow-dark" />
          </div>
        </div>
      </div>

      {/* Recent activity — real redemptions, not filler */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-trackbite-gray-900">Recent activity</h2>

        {stats === null ? (
          <p className="px-1 text-sm text-trackbite-gray-400">Loading...</p>
        ) : stats.recentRedemptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/60 p-5 text-center">
            <p className="text-sm text-trackbite-gray-500">No rewards redeemed yet.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-trackbite-gray-100 rounded-2xl border border-trackbite-gray-200 bg-white px-4 shadow-sm">
            {stats.recentRedemptions.map((redemption) => (
              <div key={redemption.id} className="flex items-center gap-3 py-3.5 first:pt-4 last:pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trackbite-yellow-light text-trackbite-yellow-dark">
                  <GiftBoxSmallIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-trackbite-gray-900">{redemption.rewardName}</p>
                  <p className="truncate text-xs text-trackbite-gray-500">
                    {redemption.pointsRedeemed} points redeemed
                  </p>
                </div>
                <p className="shrink-0 text-[11px] text-trackbite-gray-400">
                  {timeAgo(redemption.redeemedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}