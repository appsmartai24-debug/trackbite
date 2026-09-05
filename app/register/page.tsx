"use client";

import { AuthShell } from "@/components/layout/AuthShell";
import { RegisterForm, RegisterPageHeading } from "@/components/auth/RegisterForm";
import { useOnboarding } from "@/context/OnboardingContext";

export default function RegisterPage() {
  const { state } = useOnboarding();
  const role = state.role;

  if (!role) {
    return (
      <AuthShell topRightLabel="Log in" topRightHref="/login">
        <p className="text-sm text-trackbite-gray-500">Redirecting...</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell topRightLabel="Log in" topRightHref="/login">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-trackbite-gray-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-trackbite-gray-600 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-trackbite-green" />
          {role === "customer" ? "Customer account" : "Restaurant account"}
        </div>

        <RegisterPageHeading role={role} />
        <p className="mt-2.5 text-sm leading-relaxed text-trackbite-gray-500">
          Complete your account to get started with Trackbite.
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <RegisterForm />
      </div>
    </AuthShell>
  );
}