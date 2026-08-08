"use client";

import { AuthProvider } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <ServiceWorkerRegister />
        {children}
      </OnboardingProvider>
    </AuthProvider>
  );
}
