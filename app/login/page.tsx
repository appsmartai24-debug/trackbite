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