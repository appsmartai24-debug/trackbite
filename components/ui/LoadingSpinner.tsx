interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function LoadingSpinner({
  label = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status">
      <div
        className={[
          "animate-spin rounded-full border-trackbite-green border-t-transparent",
          sizeClasses[size],
        ].join(" ")}
        aria-hidden="true"
      />
      <p className="text-sm text-trackbite-gray-600">{label}</p>
    </div>
  );
}
