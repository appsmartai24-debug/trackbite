// "use client";

// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { RegisterForm, RegisterPageHeading } from "@/components/auth/RegisterForm";
// import { useOnboarding } from "@/context/OnboardingContext";

// export default function RegisterPage() {
//   const { state } = useOnboarding();
//   const role = state.role;

//   if (!role) {
//     return (
//       <div className="flex min-h-full items-center justify-center bg-trackbite-gray-50">
//         <p className="text-trackbite-gray-600">Redirecting...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <PageContainer size="sm">
//         <div className="mb-8 text-center">
//           <TrackbiteLogo size="md" />
//           <div className="mt-6">
//             <RegisterPageHeading role={role} />
//             <p className="mt-2 text-trackbite-gray-600">
//               Complete your account to get started with Trackbite.
//             </p>
//           </div>
//         </div>
//         <RegisterForm />
//       </PageContainer>
//     </div>
//   );
// }


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