"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getRoleRedirectPath } from "@/lib/firebase/auth";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { loading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (role && role !== requiredRole) {
      router.replace(getRoleRedirectPath(role));
    }
  }, [loading, isAuthenticated, role, requiredRole, router]);

  if (loading) {
    return <LoadingSpinner label="Loading your profile..." />;
  }

  if (!isAuthenticated || (role && role !== requiredRole)) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  return <>{children}</>;
}
