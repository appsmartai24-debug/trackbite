import Link from "next/link";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { PageContainer } from "@/components/layout/PageContainer";

interface AuthShellProps {
  children: React.ReactNode;
  topRightLabel: string;
  topRightHref: string;
}

/**
 * Shared backdrop for /login, /register and /forgot-password — the same
 * faint dot-grid + soft green glow + minimal top bar used on the welcome
 * and onboarding screens, so the whole auth flow feels like one product.
 */
export function AuthShell({ children, topRightLabel, topRightHref }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 90%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-trackbite-green/10 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Trackbite home">
          <TrackbiteLogo size="sm" />
        </Link>
        <Link
          href={topRightHref}
          className="text-xs font-medium text-trackbite-gray-500 hover:text-trackbite-gray-900"
        >
          {topRightLabel}
        </Link>
      </div>

      <PageContainer
        size="sm"
        className="relative flex flex-1 flex-col items-center justify-center px-6 py-10"
      >
        {children}
      </PageContainer>
    </div>
  );
}