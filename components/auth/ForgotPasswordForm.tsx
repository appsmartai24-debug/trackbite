// "use client";

// import { FormEvent, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Card } from "@/components/ui/Card";
// import { resetPassword } from "@/lib/firebase/auth";
// import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
// import { isValidEmail } from "@/lib/validation";

// export function ForgotPasswordForm() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) {
//       setError("Email is required.");
//       return;
//     }
//     if (!isValidEmail(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await resetPassword(email.trim());
//       setSuccess(true);
//     } catch (err) {
//       setError(getFirebaseErrorMessage(err));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
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
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//             />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold text-trackbite-gray-900">Check your email</h2>
//         <p className="mt-2 text-trackbite-gray-600">
//           We&apos;ve sent a password reset link to <strong>{email}</strong>.
//         </p>
//         <Link
//           href="/login"
//           className="mt-6 inline-block font-medium text-trackbite-green hover:text-trackbite-green-dark"
//         >
//           Back to Login
//         </Link>
//       </Card>
//     );
//   }

//   return (
//     <Card padding="lg" className="w-full">
//       <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//         {error && (
//           <div
//             role="alert"
//             className="rounded-xl bg-trackbite-error-light px-4 py-3 text-sm text-trackbite-error"
//           >
//             {error}
//           </div>
//         )}

//         <Input
//           label="Email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           autoComplete="email"
//         />

//         <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
//           {isLoading ? "Sending reset link..." : "Send Reset Link"}
//         </Button>

//         <p className="text-center text-sm">
//           <Link
//             href="/login"
//             className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//           >
//             Back to Login
//           </Link>
//         </p>
//       </form>
//     </Card>
//   );
// }

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { resetPassword } from "@/lib/firebase/auth";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
import { isValidEmail } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-trackbite-gray-900">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-500">
          We&apos;ve sent a password reset link to{" "}
          <strong className="font-medium text-trackbite-gray-700">{email}</strong>.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-trackbite-green hover:text-trackbite-green-dark"
        >
          Back to Login
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-xl bg-trackbite-error-light px-4 py-3 text-sm text-trackbite-error"
          >
            {error}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
          {isLoading ? "Sending reset link..." : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </Card>
  );
}