// import Link from "next/link";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import {
//   CustomerIcon,
//   RestaurantIcon,
//   UserTypeCard,
// } from "@/components/onboarding/UserTypeCard";

// export default function OnboardingPage() {
//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <PageContainer size="lg">
//         <div className="mb-10 text-center">
//           <TrackbiteLogo size="md" />
//           <h1 className="mt-8 text-3xl font-bold text-trackbite-gray-900 sm:text-4xl">
//             Welcome to Trackbite
//           </h1>
//           <p className="mt-3 text-lg text-trackbite-gray-600">
//             How will you use Trackbite?
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 md:gap-8">
//           <UserTypeCard
//             icon={<CustomerIcon />}
//             title="I'm a Customer"
//             description="Create your food profile and enjoy a more personalized dining experience."
//             ctaLabel="Continue as Customer"
//             href="/onboarding/customer"
//             accentColor="green"
//           />
//           <UserTypeCard
//             icon={<RestaurantIcon />}
//             title="I'm a Restaurant"
//             description="Connect with customers and create better dining experiences."
//             ctaLabel="Continue as Restaurant"
//             href="/onboarding/restaurant"
//             accentColor="yellow"
//           />
//         </div>

//         <p className="mt-10 text-center text-sm text-trackbite-gray-500">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//           >
//             Log in
//           </Link>
//         </p>
//       </PageContainer>
//     </div>
//   );
// }


import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import {
  CustomerIcon,
  RestaurantIcon,
  UserTypeCard,
} from "@/components/onboarding/UserTypeCard";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-white">
      {/* faint dot grid + soft glow — same backdrop as the welcome screen */}
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
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-trackbite-green/10 blur-[90px]"
        aria-hidden="true"
      />

      {/* top bar */}
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
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-trackbite-gray-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-trackbite-gray-600 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-trackbite-green" />
            Step 1 of 2
          </div>
          <h1 className="mt-5 text-[26px] font-medium leading-[1.15] tracking-tight text-trackbite-gray-900 sm:text-[30px]">
            How will you use Trackbite?
          </h1>
          <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-trackbite-gray-500">
            Pick the option that fits you best. You can always add the other later.
          </p>
        </div>

        <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2">
          <UserTypeCard
            icon={<CustomerIcon />}
            title="I'm a Customer"
            description="Build a food profile and get a personalized dining experience."
            ctaLabel="Continue as Customer"
            href="/onboarding/customer"
            accentColor="green"
          />
          <UserTypeCard
            icon={<RestaurantIcon />}
            title="I'm a Restaurant"
            description="Scan customer QR codes and run your own loyalty program."
            ctaLabel="Continue as Restaurant"
            href="/onboarding/restaurant"
            accentColor="yellow"
          />
        </div>

        <p className="mt-10 text-center text-xs text-trackbite-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Log in
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}