import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-trackbite-green-muted text-trackbite-green">
        {icon}
      </div>
      <h2 className="text-lg font-medium text-trackbite-gray-900">{title}</h2>
      <p className="mt-1.5 max-w-xs text-sm text-trackbite-gray-500">{description}</p>
    </div>
  );
}