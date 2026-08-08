// // import Link from "next/link";
// // import { PageContainer } from "@/components/layout/PageContainer";
// // import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// // import { Button } from "@/components/ui/Button";
// // import { AuthRedirect } from "@/components/auth/AuthRedirect";
// // import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";

// // export default function WelcomePage() {
// //   return (
// //     <>
// //       <AuthRedirect />
// //       <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-trackbite-green-muted to-white">
// //         <PageContainer size="lg" className="flex flex-1 flex-col items-center justify-center py-12 md:py-20">
// //           <div className="flex w-full max-w-2xl flex-col items-center text-center">
// //             <TrackbiteLogo size="lg" showTagline />

// //             <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight text-trackbite-gray-900 sm:text-5xl md:text-6xl">
// //               Eat Better.
// //               <br />
// //               <span className="text-trackbite-green">Track Smarter.</span>
// //             </h1>

// //             <p className="mt-6 max-w-lg text-lg leading-relaxed text-trackbite-gray-600 sm:text-xl">
// //               Personalized food experiences for customers and smarter tools for
// //               restaurants.
// //             </p>

// //             <div className="mt-10 flex w-full max-w-sm flex-col gap-4">
// //               <Link href="/onboarding">
// //                 <Button size="lg" fullWidth>
// //                   Get Started
// //                 </Button>
// //               </Link>
// //               <p className="text-sm text-trackbite-gray-600">
// //                 Already have an account?{" "}
// //                 <Link
// //                   href="/login"
// //                   className="font-semibold text-trackbite-green hover:text-trackbite-green-dark"
// //                 >
// //                   Log in
// //                 </Link>
// //               </p>
// //             </div>

// //             <div className="mt-12 hidden rounded-2xl border border-trackbite-yellow/40 bg-trackbite-yellow-light/50 px-6 py-3 md:block">
// //               <p className="text-sm font-medium text-trackbite-gray-800">
// //                 One app for customers and restaurants — works on mobile, tablet, and desktop.
// //               </p>
// //             </div>
// //           </div>
// //         </PageContainer>
// //         <InstallTrackbite />
// //       </div>
// //     </>
// //   );
// // }

// import Link from "next/link";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { Button } from "@/components/ui/Button";
// import { AuthRedirect } from "@/components/auth/AuthRedirect";
// import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";

// const features = [
//   {
//     title: "Your food profile",
//     description: "Allergies, preferences, and a QR code that's your food ID.",
//   },
//   {
//     title: "Snap & track",
//     description: "Photo your plate before and after — no waste, no guesswork.",
//   },
//   {
//     title: "Rewards at every restaurant",
//     description: "Earn points independently wherever you eat.",
//   },
// ];

// export default function WelcomePage() {
//   return (
//     <>
//       <AuthRedirect />
//       <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-gradient-to-b from-trackbite-green-muted via-white to-white">
//         {/* soft decorative background accents */}
//         <div
//           className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-trackbite-green/10 blur-3xl"
//           aria-hidden="true"
//         />
//         <div
//           className="pointer-events-none absolute top-1/3 -left-28 h-72 w-72 rounded-full bg-trackbite-yellow/10 blur-3xl"
//           aria-hidden="true"
//         />

//         <PageContainer size="lg" className="relative flex flex-1 flex-col items-center justify-center py-12 md:py-20">
//           <div className="flex w-full max-w-2xl flex-col items-center text-center">
//             <TrackbiteLogo size="lg" showTagline />

//             <h1 className="mt-8 text-3xl font-medium leading-tight tracking-tight text-trackbite-gray-900 sm:text-4xl md:text-5xl">
//   Eat Better.
//   <br />
//   <span className="text-trackbite-green">Track Smarter.</span>
// </h1>

// <p className="mt-5 max-w-md text-base leading-relaxed text-trackbite-gray-600 sm:text-lg">
//   Get a personal food profile and QR code, snap a quick before-and-after
//   photo of your meal, and earn loyalty rewards at every restaurant you visit.
// </p>

//             {/* <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-trackbite-gray-900 sm:text-5xl md:text-6xl">
//               Eat Better.
//               <br />
//               <span className="text-trackbite-green">Track Smarter.</span>
//             </h1>

//             <p className="mt-6 max-w-lg text-lg leading-relaxed text-trackbite-gray-600 sm:text-xl">
//               Trackbite brings customers and restaurants together in one
//               place — discover meals you&apos;ll love, follow every order in
//               real time, and let restaurants run smoother from the first
//               click to the last bite.
//             </p> */}

//             <div className="mt-10 flex w-full max-w-sm flex-col gap-4">
//               <Link href="/onboarding">
//                 <Button size="lg" fullWidth>
//                   Get Started
//                 </Button>
//               </Link>
//               <p className="text-sm text-trackbite-gray-600">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//                 >
//                   Log in
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
//               {features.map((feature) => (
//                 <div
//                   key={feature.title}
//                   className="rounded-2xl border border-trackbite-gray-200 bg-white/70 px-5 py-4 text-left shadow-sm backdrop-blur-sm"
//                 >
//                   <p className="text-sm font-medium text-trackbite-gray-900">
//                     {feature.title}
//                   </p>
//                   <p className="mt-1 text-sm leading-relaxed text-trackbite-gray-600">
//                     {feature.description}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8 rounded-2xl border border-trackbite-yellow/40 bg-trackbite-yellow-light/50 px-6 py-3">
//               <p className="text-sm font-medium text-trackbite-gray-800">
//                 One app for customers and restaurants — works on mobile, tablet, and desktop.
//               </p>
//             </div>
//           </div>
//         </PageContainer>
//         <InstallTrackbite />
//       </div>
//     </>
//   );
// }



import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
import { Button } from "@/components/ui/Button";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { InstallTrackbite } from "@/components/pwa/InstallTrackbite";

const steps = [
  { number: "01", title: "Set up your profile", description: "Allergies, preferences, a QR food ID." },
  { number: "02", title: "Scan & snap", description: "Show your QR, photo your plate before and after." },
  { number: "03", title: "Earn rewards", description: "Points build at every restaurant you visit." },
];

export default function WelcomePage() {
  return (
    <>
      <AuthRedirect />
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-white">
        {/* faint dot grid + single soft glow — quiet, product-y backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
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

        <PageContainer size="sm" className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-trackbite-gray-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-trackbite-gray-600 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-trackbite-green" />
              Now in early access
            </div>

            <h1 className="mt-5 text-[28px] font-medium leading-[1.15] tracking-tight text-trackbite-gray-900 sm:text-[32px]">
              Eat better.
              <br />
              <span className="text-trackbite-green">Track smarter.</span>
            </h1>

            <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-trackbite-gray-500">
              A food profile and QR ID, before-and-after meal tracking, and
              rewards at every restaurant you visit.
            </p>

            <div className="mt-7 flex w-full max-w-[240px] flex-col items-center gap-3">
              <Link href="/onboarding" className="w-full">
                <Button size="md" fullWidth>
                  Get Started
                </Button>
              </Link>
              <p className="text-xs text-trackbite-gray-400">
                No credit card needed
              </p>
            </div>

            <div className="mt-14 flex w-full flex-col gap-4 text-left">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[11px] font-medium text-trackbite-green/70">
                    {step.number}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-trackbite-gray-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-trackbite-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>

        <p className="relative pb-6 text-center text-[11px] text-trackbite-gray-400">
          Works on mobile, tablet, and desktop
        </p>

        <InstallTrackbite />
      </div>
    </>
  );
}