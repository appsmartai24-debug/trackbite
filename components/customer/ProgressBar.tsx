interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  max,
  className = "",
  trackClassName = "",
  barClassName = "",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={["h-2 w-full overflow-hidden rounded-full bg-trackbite-gray-100", trackClassName, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={["h-full rounded-full bg-trackbite-green transition-[width] duration-700 ease-out", barClassName]
          .filter(Boolean)
          .join(" ")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}