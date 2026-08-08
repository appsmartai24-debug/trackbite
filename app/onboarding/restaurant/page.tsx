
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { RestaurantOnboarding } from "@/components/onboarding/RestaurantOnboarding";

export default function RestaurantOnboardingPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 90%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-trackbite-yellow/15 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <TrackbiteLogo size="sm" />
        <Link
          href="/login"
          className="text-xs font-medium text-trackbite-gray-500 hover:text-trackbite-gray-900"
        >
          Log in
        </Link>
      </div>

      <PageContainer size="md" className="relative py-8 sm:py-12">
        <RestaurantOnboarding />
      </PageContainer>
    </div>
  );
}