"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@/components/customer/icons";

interface BackHeaderProps {
  title: string;
  href?: string;
}

export function BackHeader({ title, href = "/customer/profile" }: BackHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <Link
        href={href}
        aria-label="Back"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-trackbite-gray-600 hover:bg-trackbite-gray-100"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Link>
      <h1 className="truncate text-lg font-medium text-trackbite-gray-900">{title}</h1>
    </div>
  );
}