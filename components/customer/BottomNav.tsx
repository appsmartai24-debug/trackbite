"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CameraIcon, GiftIcon, HomeIcon, IconComponent, UserIcon } from "@/components/customer/icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconComponent;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/customer", label: "Home", icon: HomeIcon },
  { href: "/customer/track", label: "Track", icon: CameraIcon },
  { href: "/customer/rewards", label: "Rewards", icon: GiftIcon },
  { href: "/customer/profile", label: "Profile", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-trackbite-gray-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/customer" ? pathname === "/customer" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={[
                  "h-6 w-6 transition-colors",
                  isActive ? "text-trackbite-green" : "text-trackbite-gray-400",
                ].join(" ")}
              />
              <span
                className={[
                  "text-[11px] font-medium transition-colors",
                  isActive ? "text-trackbite-green" : "text-trackbite-gray-500",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}