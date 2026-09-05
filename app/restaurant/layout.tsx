"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { RestaurantBottomNav } from "@/components/restaurant/BottomNav";
import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="restaurant">
      <div className="flex min-h-full flex-col bg-trackbite-gray-50">
        <header className="sticky top-0 z-30 border-b border-trackbite-gray-200 bg-white/95 backdrop-blur">
          <PageContainer size="lg" className="flex items-center justify-between py-3">
            <TrackbiteLogo size="sm" />
            <span className="rounded-full bg-trackbite-yellow-light px-3 py-1 text-xs font-semibold text-trackbite-gray-800">
              Restaurant
            </span>
          </PageContainer>
        </header>

        <main className="flex flex-1 flex-col pb-20">{children}</main>

        <RestaurantBottomNav />
        <InstallTrackbite />
      </div>
    </ProtectedRoute>
  );
}