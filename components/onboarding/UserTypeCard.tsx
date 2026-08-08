// "use client";

// import Link from "next/link";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// interface UserTypeCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   ctaLabel: string;
//   href: string;
//   accentColor?: "green" | "yellow";
// }

// export function UserTypeCard({
//   icon,
//   title,
//   description,
//   ctaLabel,
//   href,
//   accentColor = "green",
// }: UserTypeCardProps) {
//   const accentClasses =
//     accentColor === "yellow"
//       ? "group-hover:border-trackbite-yellow group-focus-within:border-trackbite-yellow group-hover:shadow-md"
//       : "group-hover:border-trackbite-green group-focus-within:border-trackbite-green group-hover:shadow-md";

//   return (
//     <Link
//       href={href}
//       className={[
//         "group block rounded-2xl outline-none transition-all",
//         "focus-visible:ring-2 focus-visible:ring-trackbite-green focus-visible:ring-offset-2",
//       ].join(" ")}
//     >
//       <Card
//         padding="lg"
//         className={[
//           "h-full border-2 border-trackbite-gray-200 transition-all",
//           "active:scale-[0.98]",
//           accentClasses,
//         ].join(" ")}
//       >
//         <div className="flex h-full flex-col">
//           <div
//             className={[
//               "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
//               accentColor === "yellow"
//                 ? "bg-trackbite-yellow-light text-trackbite-yellow-dark"
//                 : "bg-trackbite-green-light text-trackbite-green-dark",
//             ].join(" ")}
//             aria-hidden="true"
//           >
//             {icon}
//           </div>
//           <h2 className="mb-2 text-xl font-bold text-trackbite-gray-900">{title}</h2>
//           <p className="mb-6 flex-1 text-trackbite-gray-600 leading-relaxed">
//             {description}
//           </p>
//           <Button variant="outline" fullWidth className="pointer-events-none">
//             {ctaLabel}
//           </Button>
//         </div>
//       </Card>
//     </Link>
//   );
// }

// function CustomerIcon() {
//   return (
//     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>
//   );
// }

// function RestaurantIcon() {
//   return (
//     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
//       <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
//       <path d="M12 9v13" />
//     </svg>
//   );
// }

// export { CustomerIcon, RestaurantIcon };

"use client";

import Link from "next/link";

interface UserTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  accentColor?: "green" | "yellow";
}

export function UserTypeCard({
  icon,
  title,
  description,
  ctaLabel,
  href,
  accentColor = "green",
}: UserTypeCardProps) {
  const isYellow = accentColor === "yellow";

  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border border-trackbite-gray-200 bg-white p-6 text-left outline-none transition-all",
        "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.99]",
        isYellow
          ? "hover:border-trackbite-yellow-dark/50"
          : "hover:border-trackbite-green/50",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        isYellow ? "focus-visible:ring-trackbite-yellow-dark" : "focus-visible:ring-trackbite-green",
      ].join(" ")}
    >
      {/* subtle corner glow, appears on hover */}
      <div
        className={[
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          isYellow ? "bg-trackbite-yellow/20" : "bg-trackbite-green/15",
        ].join(" ")}
        aria-hidden="true"
      />

      <div
        className={[
          "relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl",
          isYellow
            ? "bg-trackbite-yellow-light text-trackbite-yellow-dark"
            : "bg-trackbite-green-light text-trackbite-green-dark",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </div>

      <h2 className="relative text-base font-medium text-trackbite-gray-900">{title}</h2>
      <p className="relative mt-1.5 text-sm leading-relaxed text-trackbite-gray-500">
        {description}
      </p>

      <div
        className={[
          "relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-transform",
          "group-hover:translate-x-0.5",
          isYellow ? "text-trackbite-yellow-dark" : "text-trackbite-green",
        ].join(" ")}
      >
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

function CustomerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function RestaurantIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <path d="M12 9v13" />
    </svg>
  );
}

export { CustomerIcon, RestaurantIcon };