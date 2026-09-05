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


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";
import { SettingsRow } from "@/components/customer/SettingsRow";
import { CameraIcon, GiftIcon } from "@/components/customer/icons";
import { logoutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { getRestaurantProfile, RestaurantProfile } from "@/lib/restaurant/profile";

function RestaurantDashboardContent() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      const data = await getRestaurantProfile(currentUser.uid);
      if (!cancelled) {
        setProfile(data);
        setLoading(false);
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

  return (
    <div className="min-h-full bg-trackbite-gray-50">
      <header className="border-b border-trackbite-gray-200 bg-white">
        <PageContainer size="lg" className="flex items-center justify-between py-4">
          <TrackbiteLogo size="sm" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </PageContainer>
      </header>

      <PageContainer size="md" className="flex flex-col gap-5">
        <Card padding="lg">
          <span className="inline-block rounded-full bg-trackbite-yellow-light px-3 py-1 text-xs font-semibold text-trackbite-gray-800">
            Restaurant
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-trackbite-gray-900">
            {profile?.restaurantName || "Welcome to Trackbite"}
          </h1>
          {currentUser?.email && (
            <p className="mt-1 text-sm text-trackbite-gray-500">
              Signed in as {currentUser.email}
            </p>
          )}
        </Card>

        {loading ? (
          <Card padding="lg">
            <LoadingSpinner label="Loading your dashboard..." size="sm" />
          </Card>
        ) : (
          <Card padding="lg" className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-trackbite-gray-400">
                Current reward
              </p>
              <p className="mt-1 truncate text-sm font-medium text-trackbite-gray-900">
                {profile?.rewardName || "Not set yet"}
              </p>
              <p className="text-xs text-trackbite-gray-500">
                at {profile?.rewardThreshold ?? 200} points
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/restaurant/rewards")}
            >
              Edit
            </Button>
          </Card>
        )}

        <Card padding="sm" className="divide-y divide-trackbite-gray-100">
          <SettingsRow
            href="/restaurant/scan"
            icon={CameraIcon}
            label="Scan a customer"
            description="Look up a customer's profile and wallet"
          />
          <SettingsRow
            href="/restaurant/rewards"
            icon={GiftIcon}
            label="Reward settings"
            description="Set your points threshold and reward"
          />
        </Card>
      </PageContainer>
      <InstallTrackbite />
    </div>
  );
}

export default function RestaurantPage() {
  return (
    <ProtectedRoute requiredRole="restaurant">
      <RestaurantDashboardContent />
    </ProtectedRoute>
  );
}