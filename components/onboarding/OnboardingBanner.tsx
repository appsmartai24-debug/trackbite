import Image from "next/image";

export function OnboardingBanner() {
  return (
    <div className="mx-auto mb-6 w-full max-w-lg overflow-hidden rounded-2xl border border-trackbite-gray-200 bg-trackbite-gray-50 shadow-sm">
      <Image
        src="/images/onboarding-banner.jpg"
        alt="Trackbite — personalized healthy dining, Dubai skyline with a fresh salad bowl and profile icon"
        width={1312}
        height={820}
        priority
        sizes="(max-width: 512px) 100vw, 512px"
        className="h-auto w-full"
      />
    </div>
  );
}