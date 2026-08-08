// "use client";

// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PasswordInput } from "@/components/ui/PasswordInput";
// import { Card } from "@/components/ui/Card";
// import { loginUser, getRoleRedirectPath, getUserRole } from "@/lib/firebase/auth";
// import { auth } from "@/lib/firebase/config";
// import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
// import { isValidEmail } from "@/lib/validation";
// import { useAuth } from "@/context/AuthContext";

// export function LoginForm() {
//   const router = useRouter();
//   const { refreshUser } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [formError, setFormError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setFormError("");

//     const nextErrors: Record<string, string> = {};
//     if (!email.trim()) nextErrors.email = "Email is required.";
//     else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";
//     if (!password) nextErrors.password = "Password is required.";

//     setErrors(nextErrors);
//     if (Object.keys(nextErrors).length > 0) return;

//     setIsLoading(true);
//     try {
//       await loginUser(email.trim(), password);
//       await refreshUser();
//       const uid = auth.currentUser?.uid;
//       const role = uid ? await getUserRole(uid) : null;
//       router.push(role ? getRoleRedirectPath(role) : "/onboarding");
//     } catch (error) {
//       setFormError(getFirebaseErrorMessage(error));
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//           autoComplete="current-password"
//         />

//         <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
//           {isLoading ? "Logging in..." : "Log In"}
//         </Button>

//         <div className="flex flex-col items-center gap-2 text-sm">
//           <Link
//             href="/forgot-password"
//             className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//           >
//             Forgot password?
//           </Link>
//           <p className="text-trackbite-gray-600">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/onboarding"
//               className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
//             >
//               Create one
//             </Link>
//           </p>
//         </div>
//       </form>
//     </Card>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { loginUser, getRoleRedirectPath, getUserRole } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
import { isValidEmail } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await loginUser(email.trim(), password);
      await refreshUser();
      const uid = auth.currentUser?.uid;
      const role = uid ? await getUserRole(uid) : null;
      router.push(role ? getRoleRedirectPath(role) : "/onboarding");
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

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
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Forgot password?
          </Link>
          <p className="text-trackbite-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/onboarding"
              className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}