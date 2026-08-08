// "use client";

// import { useRouter } from "next/navigation";
// import { FormEvent, useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PasswordInput } from "@/components/ui/PasswordInput";
// import { Card } from "@/components/ui/Card";
// import { registerUser, getRoleRedirectPath } from "@/lib/firebase/auth";
// import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
// import { isValidEmail, validatePassword } from "@/lib/validation";
// import { useOnboarding } from "@/context/OnboardingContext";
// import { useAuth } from "@/context/AuthContext";
// import { UserRole } from "@/types";

// export function RegisterForm() {
//   const router = useRouter();
//   const { state, clearOnboarding } = useOnboarding();
//   const { refreshUser } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [formError, setFormError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);

//   const role: UserRole | null = state.role;

//   useEffect(() => {
//     if (!role) {
//       router.replace("/onboarding");
//     }
//   }, [role, router]);

//   if (!role) return null;

//   const heading =
//     role === "customer"
//       ? "Create your Customer account"
//       : "Create your Restaurant account";

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setFormError("");

//     const nextErrors: Record<string, string> = {};
//     if (!email.trim()) nextErrors.email = "Email is required.";
//     else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";

//     const passwordError = validatePassword(password);
//     if (passwordError) nextErrors.password = passwordError;
//     if (!confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
//     else if (password !== confirmPassword)
//       nextErrors.confirmPassword = "Passwords do not match.";

//     setErrors(nextErrors);
//     if (Object.keys(nextErrors).length > 0) return;

//     setIsLoading(true);
//     try {
//       await registerUser(
//         email.trim(),
//         password,
//         role,
//         role === "customer" ? state.customer : undefined,
//         role === "restaurant" ? state.restaurant : undefined
//       );
//       await refreshUser();
//       setVerificationSent(true);
//       clearOnboarding();

//       setTimeout(() => {
//         router.push(getRoleRedirectPath(role));
//       }, 2500);
//     } catch (error) {
//       setFormError(getFirebaseErrorMessage(error));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (verificationSent) {
//     return (
//       <Card padding="lg" className="w-full text-center">
//         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-trackbite-green-light">
//           <svg
//             className="h-8 w-8 text-trackbite-green"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold text-trackbite-gray-900">Account created!</h2>
//         <p className="mt-2 text-trackbite-gray-600">
//           We&apos;ve sent a verification email to <strong>{email}</strong>.
//           Please check your inbox to verify your account.
//         </p>
//         <p className="mt-4 text-sm text-trackbite-gray-500">Redirecting you now...</p>
//       </Card>
//     );
//   }

//   return (
//     <Card padding="lg" className="w-full">
//       <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//         {formError && (
//           <div
//             role="alert"
//             className="rounded-xl bg-trackbite-error-light px-4 py-3 text-sm text-trackbite-error"
//           >
//             {formError}
//           </div>
//         )}

//         <Input
//           label="Email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           error={errors.email}
//           required
//           autoComplete="email"
//         />

//         <PasswordInput
//           label="Password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           error={errors.password}
//           required
//           autoComplete="new-password"
//         />

//         <PasswordInput
//           label="Confirm Password"
//           name="confirmPassword"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           error={errors.confirmPassword}
//           required
//           autoComplete="new-password"
//         />

//         <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
//           {isLoading ? "Creating account..." : "Create Account"}
//         </Button>

//         <p className="text-center text-sm text-trackbite-gray-600">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//           >
//             Log in
//           </Link>
//         </p>
//       </form>
//     </Card>
//   );
// }

// export { RegisterForm as default };

// export function RegisterPageHeading({ role }: { role: UserRole }) {
//   return (
//     <h1 className="text-2xl font-bold text-trackbite-gray-900 sm:text-3xl">
//       {role === "customer"
//         ? "Create your Customer account"
//         : "Create your Restaurant account"}
//     </h1>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { registerUser, getRoleRedirectPath } from "@/lib/firebase/auth";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
import { isValidEmail, validatePassword } from "@/lib/validation";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const { state, clearOnboarding } = useOnboarding();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const role: UserRole | null = state.role;

  useEffect(() => {
    if (!role) {
      router.replace("/onboarding");
    }
  }, [role, router]);

  if (!role) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";

    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;
    if (!confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await registerUser(
        email.trim(),
        password,
        role,
        role === "customer" ? state.customer : undefined,
        role === "restaurant" ? state.restaurant : undefined
      );
      await refreshUser();
      setVerificationSent(true);
      clearOnboarding();

      setTimeout(() => {
        router.push(getRoleRedirectPath(role));
      }, 2500);
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <Card padding="lg" className="w-full text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-trackbite-green-light">
          <svg
            className="h-8 w-8 text-trackbite-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-trackbite-gray-900">Account created!</h2>
        <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-500">
          We&apos;ve sent a verification email to{" "}
          <strong className="font-medium text-trackbite-gray-700">{email}</strong>.
          Please check your inbox to verify your account.
        </p>
        <p className="mt-4 text-xs text-trackbite-gray-400">Redirecting you now...</p>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {formError && (
          <div
            role="alert"
            className="rounded-xl bg-trackbite-error-light px-4 py-3 text-sm text-trackbite-error"
          >
            {formError}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-trackbite-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Log in
          </Link>
        </p>
      </form>
    </Card>
  );
}

export { RegisterForm as default };

export function RegisterPageHeading({ role }: { role: UserRole }) {
  return (
    <h1 className="mt-5 text-[26px] font-medium leading-[1.15] tracking-tight text-trackbite-gray-900 sm:text-[30px]">
      {role === "customer"
        ? "Create your Customer account"
        : "Create your Restaurant account"}
    </h1>
  );
}