"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { BottomNav } from "@/components/customer/BottomNav";
import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="customer">
      <div className="flex min-h-full flex-col bg-trackbite-gray-50">
        <header className="sticky top-0 z-30 border-b border-trackbite-gray-200 bg-white/95 backdrop-blur">
          <PageContainer size="lg" className="flex items-center justify-between py-3">
            <TrackbiteLogo size="sm" />
          </PageContainer>
        </header>

        <main className="flex flex-1 flex-col pb-20">{children}</main>

        <BottomNav />
        <InstallTrackbite />
      </div>
    </ProtectedRoute>
  );
}