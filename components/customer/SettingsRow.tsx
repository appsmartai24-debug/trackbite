import Link from "next/link";
import { ChevronRightIcon, IconComponent } from "@/components/customer/icons";

interface SettingsRowProps {
  href: string;
  icon: IconComponent;
  label: string;
  description?: string;
}

export function SettingsRow({ href, icon: Icon, label, description }: SettingsRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-1 py-3 transition-colors hover:bg-trackbite-gray-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-gray-100 text-trackbite-gray-600">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-trackbite-gray-900">{label}</span>
        {description && (
          <span className="block truncate text-xs text-trackbite-gray-500">{description}</span>
        )}
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-trackbite-gray-400" />
    </Link>
  );
}