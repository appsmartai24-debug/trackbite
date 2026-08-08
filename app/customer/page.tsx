"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";
import { logoutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/context/AuthContext";

function CustomerDashboardContent() {
  const router = useRouter();
  const { currentUser } = useAuth();

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

      <PageContainer size="md">
        <Card padding="lg" className="text-center">
          <span className="inline-block rounded-full bg-trackbite-green-light px-3 py-1 text-xs font-semibold text-trackbite-green-dark">
            Customer
          </span>
          <h1 className="mt-4 text-3xl font-bold text-trackbite-gray-900">
            Welcome to Trackbite
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-trackbite-green">
            Customer Dashboard
          </h2>
          <p className="mt-4 text-trackbite-gray-600">
            More features coming soon.
          </p>
          {currentUser?.email && (
            <p className="mt-6 text-sm text-trackbite-gray-500">
              Signed in as {currentUser.email}
            </p>
          )}
        </Card>
      </PageContainer>
      <InstallTrackbite />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}
