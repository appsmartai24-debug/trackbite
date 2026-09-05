import { SparkleIcon } from "@/components/customer/icons";

interface AIBadgeProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * The recurring "Trackbite AI" signature — a soft green-to-yellow
 * gradient pill with a sparkle mark. Used anywhere the product is
 * surfacing a model-generated read (insights, scan results, picks)
 * so it reads as a distinct, trustworthy voice rather than a plain
 * system message.
 */
export function AIBadge({ label = "Trackbite AI", size = "sm", className = "" }: AIBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-trackbite-green-light to-trackbite-yellow-light font-semibold text-trackbite-green-darker",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SparkleIcon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label}
    </span>
  );
}