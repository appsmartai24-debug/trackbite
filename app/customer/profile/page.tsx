// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useAuth } from "@/context/AuthContext";
// import { logoutUser } from "@/lib/firebase/auth";
// import { SettingsRow } from "@/components/customer/SettingsRow";
// import { DocumentIcon, EditIcon, HelpIcon, ShieldIcon, SlidersIcon } from "@/components/customer/icons";
// import {
//   getCustomerProfile,
//   CustomerProfile,
//   DIETARY_LABELS,
//   ALLERGY_LABELS,
//   PORTION_LABELS,
//   FOOD_GOAL_LABELS,
// } from "@/lib/customer/profile";

// // Prefixing the encoded value lets the restaurant-side scanner tell a
// // Trackbite customer code apart from any other QR code it might pick up.
// const QR_PREFIX = "TRACKBITE:CUSTOMER:";

// function buildQrImageUrl(data: string, size = 220) {
//   const params = new URLSearchParams({
//     size: `${size}x${size}`,
//     data,
//     margin: "8",
//   });
//   return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
// }

// function Chip({ label }: { label: string }) {
//   return (
//     <span className="rounded-lg border border-trackbite-gray-200 bg-trackbite-gray-50 px-3 py-1.5 text-xs font-medium text-trackbite-gray-700">
//       {label}
//     </span>
//   );
// }

// function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <p className="text-xs font-medium uppercase tracking-wide text-trackbite-gray-400">
//         {label}
//       </p>
//       <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
//     </div>
//   );
// }

// export default function CustomerProfilePage() {
//   const router = useRouter();
//   const { currentUser } = useAuth();
//   const [profile, setProfile] = useState<CustomerProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [qrError, setQrError] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       if (!currentUser) return;
//       try {
//         const data = await getCustomerProfile(currentUser.uid);
//         if (!cancelled) setProfile(data);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [currentUser]);

//   const handleLogout = async () => {
//     await logoutUser();
//     router.push("/login");
//   };

//   if (loading) {
//     return (
//       <PageContainer size="md" className="flex flex-1 items-center justify-center">
//         <LoadingSpinner label="Loading your profile..." />
//       </PageContainer>
//     );
//   }

//   const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
//   const initials =
//     [profile?.firstName?.[0], profile?.lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
//     currentUser?.email?.[0]?.toUpperCase() ||
//     "?";

//   const qrValue = currentUser ? `${QR_PREFIX}${currentUser.uid}` : "";

//   return (
//     <PageContainer size="md" className="flex flex-1 flex-col gap-5">
//       <div className="flex items-center gap-4">
//         <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-trackbite-green-light text-xl font-semibold text-trackbite-green-darker">
//           {initials}
//         </div>
//         <div className="min-w-0">
//           <h1 className="truncate text-xl font-medium text-trackbite-gray-900">
//             {fullName || "Your profile"}
//           </h1>
//           <p className="truncate text-sm text-trackbite-gray-500">{currentUser?.email}</p>
//         </div>
//       </div>

//       {/* Unique QR identity card */}
//       <Card padding="lg" className="flex flex-col items-center text-center">
//         <span className="rounded-full bg-trackbite-green-light px-3 py-1 text-xs font-semibold text-trackbite-green-dark">
//           Your Food ID
//         </span>
//         <p className="mt-3 max-w-xs text-sm text-trackbite-gray-500">
//           Show this code at any participating restaurant for instant personalized service.
//         </p>

//         <div className="mt-5 flex h-56 w-56 items-center justify-center rounded-2xl border border-trackbite-gray-200 bg-white p-3">
//           {qrValue && !qrError ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={buildQrImageUrl(qrValue)}
//               alt="Your unique Trackbite QR code"
//               width={220}
//               height={220}
//               className="h-full w-full object-contain"
//               onError={() => setQrError(true)}
//             />
//           ) : (
//             <p className="px-4 text-xs text-trackbite-gray-400">
//               QR code couldn&apos;t load. Check your connection and try again.
//             </p>
//           )}
//         </div>

//         {currentUser?.uid && (
//           <p className="mt-4 select-all break-all rounded-lg bg-trackbite-gray-50 px-3 py-2 font-mono text-[11px] text-trackbite-gray-500">
//             {currentUser.uid}
//           </p>
//         )}
//       </Card>

//       {/* Preferences summary */}
//       <Card padding="lg" className="flex flex-col gap-4">
//         <h2 className="text-sm font-semibold text-trackbite-gray-900">Food preferences</h2>

//         <ProfileRow label="Diet">
//           {profile && profile.dietaryPreferences.length > 0 ? (
//             profile.dietaryPreferences.map((d) => <Chip key={d} label={DIETARY_LABELS[d]} />)
//           ) : (
//             <Chip label={DIETARY_LABELS["no-preference"]} />
//           )}
//         </ProfileRow>

//         <ProfileRow label="Allergies">
//           {profile && profile.allergies.length > 0 ? (
//             profile.allergies.map((a) => <Chip key={a} label={ALLERGY_LABELS[a]} />)
//           ) : (
//             <Chip label="None" />
//           )}
//         </ProfileRow>

//         <ProfileRow label="Portion size">
//           <Chip label={PORTION_LABELS[profile?.portionPreference ?? "medium"]} />
//         </ProfileRow>

//         <ProfileRow label="Goals">
//           {profile && profile.foodGoals.length > 0 ? (
//             profile.foodGoals.map((g) => <Chip key={g} label={FOOD_GOAL_LABELS[g]} />)
//           ) : (
//             <span className="text-xs text-trackbite-gray-400">No goals set yet</span>
//           )}
//         </ProfileRow>
//       </Card>

//       <Card padding="sm" className="divide-y divide-trackbite-gray-100">
//   <SettingsRow
//     href="/customer/profile/edit"
//     icon={EditIcon}
//     label="Edit Profile"
//     description="Name and account details"
//   />
//   <SettingsRow
//     href="/customer/profile/preferences"
//     icon={SlidersIcon}
//     label="Update Preferences"
//     description="Diet, allergies, portions & goals"
//   />
//   <SettingsRow href="/customer/help" icon={HelpIcon} label="Help & Support" />
//   <SettingsRow href="/customer/privacy" icon={ShieldIcon} label="Privacy Policy" />
//   <SettingsRow href="/customer/terms" icon={DocumentIcon} label="Terms & Conditions" />
// </Card>

//       <Button variant="outline" fullWidth onClick={handleLogout}>
//         Log out
//       </Button>
//     </PageContainer>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/lib/firebase/auth";
import { getMealStats, MealStats } from "@/lib/customer/meals";
import { SettingsRow } from "@/components/customer/SettingsRow";
import {
  AlertIcon,
  BowlIcon,
  DocumentIcon,
  EditIcon,
  HelpIcon,
  LeafIcon,
  LogOutIcon,
  ShieldIcon,
  SlidersIcon,
  TargetIcon,
} from "@/components/customer/icons";
import {
  getCustomerProfile,
  CustomerProfile,
  DIETARY_LABELS,
  ALLERGY_LABELS,
  PORTION_LABELS,
  FOOD_GOAL_LABELS,
} from "@/lib/customer/profile";

// Prefixing the encoded value lets the restaurant-side scanner tell a
// Trackbite customer code apart from any other QR code it might pick up.
const QR_PREFIX = "TRACKBITE:CUSTOMER:";

function buildQrImageUrl(data: string, size = 200) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data,
    margin: "6",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-3 first:pl-0 last:pr-0">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}

function PreferenceRow({
  icon: Icon,
  label,
  children,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-gray-50 text-trackbite-gray-500">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-trackbite-gray-500">{label}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">{children}</div>
      </div>
    </div>
  );
}

function Chip({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "warn" }) {
  return (
    <span
      className={
        tone === "warn"
          ? "rounded-md bg-trackbite-yellow-light px-2 py-1 text-xs font-medium text-trackbite-yellow-dark"
          : "rounded-md bg-trackbite-gray-100 px-2 py-1 text-xs font-medium text-trackbite-gray-700"
      }
    >
      {label}
    </span>
  );
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [stats, setStats] = useState<MealStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      try {
        const [profileData, statsData] = await Promise.all([
          getCustomerProfile(currentUser.uid),
          getMealStats(currentUser.uid),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setStats(statsData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <PageContainer size="md" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading your profile..." />
      </PageContainer>
    );
  }

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const initials =
    [profile?.firstName?.[0], profile?.lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
    currentUser?.email?.[0]?.toUpperCase() ||
    "?";

  const qrValue = currentUser ? `${QR_PREFIX}${currentUser.uid}` : "";

  return (
    <PageContainer size="md" className="flex flex-1 flex-col gap-6">
      {/* Hero header — identity + real activity at a glance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-trackbite-green-darker via-trackbite-green-dark to-trackbite-green px-6 py-7">
        <div
          className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-semibold text-white ring-2 ring-white/30">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-medium text-white">{fullName || "Your profile"}</h1>
            <p className="truncate text-sm text-white/70">{currentUser?.email}</p>
          </div>
        </div>

        <div className="relative mt-6 flex items-center divide-x divide-white/15 border-t border-white/15 pt-5">
          <StatItem value={stats ? String(stats.mealsTracked) : "0"} label="Meals tracked" />
          <StatItem value={stats ? stats.pointsEarned.toLocaleString() : "0"} label="Points" />
          <StatItem value={stats ? `${stats.foodSavedKg} kg` : "0 kg"} label="Food saved" />
        </div>
      </div>

      {/* Food ID — a membership card, the one bold element on this page */}
      <div className="relative overflow-hidden rounded-3xl bg-trackbite-gray-900 px-6 py-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col justify-between self-stretch py-1">
            <div>
              <p className="text-sm font-medium tracking-tight text-white">trackbite</p>
              <p className="mt-0.5 text-xs text-white/50">Digital Food ID</p>
            </div>
            <div>
              <p className="text-sm text-white/80">
                Show this to restaurant staff for personalized, waste-aware service.
              </p>
              {currentUser?.uid && (
                <p className="mt-3 select-all break-all font-mono text-[11px] text-white/40">
                  {currentUser.uid}
                </p>
              )}
            </div>
          </div>

          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            {qrValue && !qrError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={buildQrImageUrl(qrValue)}
                alt="Your unique Trackbite QR code"
                width={200}
                height={200}
                className="h-full w-full object-contain"
                onError={() => setQrError(true)}
              />
            ) : (
              <p className="px-2 text-center text-[10px] text-trackbite-gray-400">
                Couldn&apos;t load. Check your connection.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences — grouped list, not a chip grid */}
      <Card padding="lg">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-trackbite-gray-900">Food preferences</h2>
          
           <a href="/customer/profile/preferences"
            className="text-xs font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Edit
          </a>
        </div>

        <div className="divide-y divide-trackbite-gray-100">
          <PreferenceRow icon={LeafIcon} label="Diet">
            {profile && profile.dietaryPreferences.length > 0 ? (
              profile.dietaryPreferences.map((d) => <Chip key={d} label={DIETARY_LABELS[d]} />)
            ) : (
              <Chip label={DIETARY_LABELS["no-preference"]} />
            )}
          </PreferenceRow>

          <PreferenceRow icon={AlertIcon} label="Allergies">
            {profile && profile.allergies.length > 0 ? (
              profile.allergies.map((a) => <Chip key={a} label={ALLERGY_LABELS[a]} tone="warn" />)
            ) : (
              <Chip label="None" />
            )}
          </PreferenceRow>

          <PreferenceRow icon={BowlIcon} label="Portion size">
            <Chip label={PORTION_LABELS[profile?.portionPreference ?? "medium"]} />
          </PreferenceRow>

          <PreferenceRow icon={TargetIcon} label="Goals">
            {profile && profile.foodGoals.length > 0 ? (
              profile.foodGoals.map((g) => <Chip key={g} label={FOOD_GOAL_LABELS[g]} />)
            ) : (
              <span className="text-xs text-trackbite-gray-400">No goals set yet</span>
            )}
          </PreferenceRow>
        </div>
      </Card>

      {/* Account */}
      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold text-trackbite-gray-900">Account</h2>
        <Card padding="sm" className="divide-y divide-trackbite-gray-100">
          <SettingsRow
            href="/customer/profile/edit"
            icon={EditIcon}
            label="Edit profile"
            description="Name and account details"
          />
          <SettingsRow
            href="/customer/profile/preferences"
            icon={SlidersIcon}
            label="Update preferences"
            description="Diet, allergies, portions & goals"
          />
          <SettingsRow href="/customer/help" icon={HelpIcon} label="Help & support" />
          <SettingsRow href="/customer/privacy" icon={ShieldIcon} label="Privacy policy" />
          <SettingsRow href="/customer/terms" icon={DocumentIcon} label="Terms & conditions" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-trackbite-error-light"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-error-light text-trackbite-error">
              <LogOutIcon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-trackbite-error">Log out</span>
          </button>
        </Card>
      </div>
    </PageContainer>
  );
}