
interface TrackbiteLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const sizes = {
  sm: { icon: 26, text: "text-sm" },
  md: { icon: 34, text: "text-base" },
  lg: { icon: 44, text: "text-xl" },
};

export function TrackbiteLogo({ size = "md", showTagline = false }: TrackbiteLogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-trackbite-green to-trackbite-green-dark shadow-md shadow-trackbite-green/20"
          style={{ width: icon, height: icon }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
            style={{ width: icon * 0.55, height: icon * 0.55 }}
          >
            <path
              d="M19.5 3.5c-9 0-15 5.6-15.5 14.3-.06 1.1.78 2.03 1.88 2.06.03 0 .07 0 .1 0 8.9-.13 14.5-6.15 14.5-14.86 0-.5-.02-.98-.06-1.44C20.35 3.5 19.94 3.5 19.5 3.5z"
              fill="currentColor"
            />
            <path
              d="M6 18C11 13 14 9.5 19 5"
              stroke="#15803d"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className={`${text} font-medium tracking-tight text-trackbite-gray-900`}>
          Trackbite
        </span>
      </div>
      {showTagline && (
        <span className="rounded-full bg-trackbite-yellow-light px-3 py-0.5 text-xs font-medium text-trackbite-gray-800">
          Eat Better. Track Smarter.
        </span>
      )}
    </div>
  );
}