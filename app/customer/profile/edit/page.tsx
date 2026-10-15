// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { BackHeader } from "@/components/customer/BackHeader";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useAuth } from "@/context/AuthContext";
// import { getCustomerProfile, updateCustomerProfile } from "@/lib/customer/profile";
// import { validateRequired } from "@/lib/validation";


// export default function EditProfilePage() {
//   const router = useRouter();
//   const { currentUser } = useAuth();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [formError, setFormError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       if (!currentUser) return;
//       const profile = await getCustomerProfile(currentUser.uid);
//       if (cancelled) return;
//       if (profile) {
//         setFirstName(profile.firstName);
//         setLastName(profile.lastName);
//       }
//       setLoading(false);
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [currentUser]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!currentUser) return;
//     setFormError("");

//     const nextErrors: Record<string, string> = {};
//     const firstNameError = validateRequired(firstName, "First name");
//     const lastNameError = validateRequired(lastName, "Last name");
//     if (firstNameError) nextErrors.firstName = firstNameError;
//     if (lastNameError) nextErrors.lastName = lastNameError;

//     setErrors(nextErrors);
//     if (Object.keys(nextErrors).length > 0) return;

//     setSaving(true);
//     try {
//       await updateCustomerProfile(currentUser.uid, {
//         firstName: firstName.trim(),
//         lastName: lastName.trim(),
//       });
//       router.push("/customer/profile");
//     } catch {
//       setFormError("Something went wrong while saving. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <PageContainer size="md" className="flex flex-1 items-center justify-center">
//         <LoadingSpinner label="Loading your profile..." />
//       </PageContainer>
//     );
//   }

//   return (
//     <PageContainer size="md" className="flex flex-1 flex-col">
//       <BackHeader title="Edit Profile" />

//       <Card padding="lg">
//         <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//           {formError && (
//             <div
//               role="alert"
//               className="rounded-xl bg-trackbite-error-light px-4 py-3 text-sm text-trackbite-error"
//             >
//               {formError}
//             </div>
//           )}

//           <Input
//             label="Email"
//             name="email"
//             type="email"
//             value={currentUser?.email ?? ""}
//             disabled
//             hint="Your email is tied to your account and can't be changed here."
//           />

//           <div className="grid gap-4 sm:grid-cols-2">
//             <Input
//               label="First Name"
//               name="firstName"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               error={errors.firstName}
//               required
//               autoComplete="given-name"
//             />
//             <Input
//               label="Last Name"
//               name="lastName"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               error={errors.lastName}
//               required
//               autoComplete="family-name"
//             />
//           </div>

//           <Button type="submit" fullWidth isLoading={saving} disabled={saving}>
//             {saving ? "Saving..." : "Save changes"}
//           </Button>
//         </form>
//       </Card>
//     </PageContainer>
//   );
// }

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OptionChip, OptionGroup } from "@/components/ui/OptionChip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { getCustomerProfile, updateCustomerProfile } from "@/lib/customer/profile";
import {
  validateHeightCm,
  validateRequired,
  validateWeightKg,
} from "@/lib/validation";

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [wantsAppetizers, setWantsAppetizers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      const profile = await getCustomerProfile(currentUser.uid);
      if (cancelled) return;
      if (profile) {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setHeightCm(profile.heightCm != null ? String(profile.heightCm) : "");
        setWeightKg(profile.weightKg != null ? String(profile.weightKg) : "");
        setWantsAppetizers(profile.wantsAppetizers);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setFormError("");

    const nextErrors: Record<string, string> = {};
    const firstNameError = validateRequired(firstName, "First name");
    const lastNameError = validateRequired(lastName, "Last name");
    if (firstNameError) nextErrors.firstName = firstNameError;
    if (lastNameError) nextErrors.lastName = lastNameError;
    const heightError = validateHeightCm(heightCm);
    const weightError = validateWeightKg(weightKg);
    if (heightError) nextErrors.heightCm = heightError;
    if (weightError) nextErrors.weightKg = weightError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await updateCustomerProfile(currentUser.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        wantsAppetizers,
      });
      router.push("/customer/profile");
    } catch {
      setFormError("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer size="md" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading your profile..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <BackHeader title="Edit Profile" />

      <Card padding="lg">
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
            value={currentUser?.email ?? ""}
            disabled
            hint="Your email is tied to your account and can't be changed here."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              required
              autoComplete="given-name"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              required
              autoComplete="family-name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Height (cm)"
              name="heightCm"
              type="number"
              inputMode="decimal"
              min={50}
              max={250}
              step="any"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              error={errors.heightCm}
              required
            />
            <Input
              label="Weight (kg)"
              name="weightKg"
              type="number"
              inputMode="decimal"
              min={10}
              max={500}
              step="any"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              error={errors.weightKg}
              required
            />
          </div>

          <OptionGroup label="Would you like appetizers?">
            <OptionChip
              label="Yes"
              selected={wantsAppetizers}
              onClick={() => setWantsAppetizers(true)}
              type="radio"
            />
            <OptionChip
              label="No"
              selected={!wantsAppetizers}
              onClick={() => setWantsAppetizers(false)}
              type="radio"
            />
          </OptionGroup>

          <Button type="submit" fullWidth isLoading={saving} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}