// import { PageContainer } from "@/components/layout/PageContainer";
// import { TrackbiteLogo } from "@/components/layout/TrackbiteLogo";
// import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// export default function ForgotPasswordPage() {
//   return (
//     <div className="min-h-full bg-trackbite-gray-50">
//       <PageContainer size="sm">
//         <div className="mb-8 text-center">
//           <TrackbiteLogo size="md" />
//           <h1 className="mt-6 text-2xl font-bold text-trackbite-gray-900 sm:text-3xl">
//             Reset your password
//           </h1>
//           <p className="mt-2 text-trackbite-gray-600">
//             Enter your email address and we&apos;ll send you a reset link.
//           </p>
//         </div>
//         <ForgotPasswordForm />
//       </PageContainer>
//     </div>
//   );
// }


import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell topRightLabel="Log in" topRightHref="/login">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-trackbite-gray-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-trackbite-gray-600 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-trackbite-green" />
          Reset password
        </div>

        <h1 className="mt-5 text-[26px] font-medium leading-[1.15] tracking-tight text-trackbite-gray-900 sm:text-[30px]">
          Reset your password
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-trackbite-gray-500">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </AuthShell>
  );
}