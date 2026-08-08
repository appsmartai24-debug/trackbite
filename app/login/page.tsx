// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { LoginForm } from "@/components/auth/LoginForm";

// export default function LoginPage() {
//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <PageContainer size="sm">
//         <div className="mb-8 text-center">
//           <TrackbiteLogo size="md" />
//           <h1 className="mt-6 text-2xl font-bold text-trackbite-gray-900 sm:text-3xl">
//             Welcome Back
//           </h1>
//           <p className="mt-2 text-trackbite-gray-600">
//             Log in to your Trackbite account
//           </p>
//         </div>
//         <LoginForm />
//       </PageContainer>
//     </div>
//   );
// }

import { AuthShell } from "@/components/layout/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell topRightLabel="Create account" topRightHref="/onboarding">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-trackbite-gray-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-trackbite-gray-600 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-trackbite-green" />
          Welcome back
        </div>

        <h1 className="mt-5 text-[26px] font-medium leading-[1.15] tracking-tight text-trackbite-gray-900 sm:text-[30px]">
          Log in to Trackbite
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-trackbite-gray-500">
          Enter your email and password to continue.
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <LoginForm />
      </div>
    </AuthShell>
  );
}