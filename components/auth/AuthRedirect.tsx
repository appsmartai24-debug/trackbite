"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getRoleRedirectPath } from "@/lib/firebase/auth";

export function AuthRedirect() {
  const { loading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && role) {
      router.replace(getRoleRedirectPath(role));
    }
  }, [loading, isAuthenticated, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  return null;
}
