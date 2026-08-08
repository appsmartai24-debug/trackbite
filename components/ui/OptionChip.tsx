// "use client";

// interface OptionChipProps {
//   label: string;
//   selected: boolean;
//   onClick: () => void;
//   type?: "radio" | "checkbox";
// }

// export function OptionChip({ label, selected, onClick, type = "radio" }: OptionChipProps) {
//   return (
//     <button
//       type="button"
//       role={type === "radio" ? "radio" : "checkbox"}
//       aria-checked={selected}
//       onClick={onClick}
//       className={[
//         "rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all",
//         "min-h-[44px] touch-manipulation",
//         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trackbite-green focus-visible:ring-offset-2",
//         selected
//           ? "border-trackbite-green bg-trackbite-green-light text-trackbite-green-darker"
//           : "border-trackbite-gray-200 bg-white text-trackbite-gray-700 hover:border-trackbite-gray-400",
//       ].join(" ")}
//     >
//       {label}
//     </button>
//   );
// }

// interface OptionGroupProps {
//   label: string;
//   children: React.ReactNode;
//   hint?: string;
// }

// export function OptionGroup({ label, children, hint }: OptionGroupProps) {
//   return (
//     <fieldset className="space-y-3">
//       <legend className="text-sm font-medium text-trackbite-gray-800">{label}</legend>
//       {hint && <p className="text-sm text-trackbite-gray-500 -mt-1">{hint}</p>}
//       <div className="flex flex-wrap gap-2">{children}</div>
//     </fieldset>
//   );
// }


"use client";

interface OptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  type?: "radio" | "checkbox";
}

export function OptionChip({ label, selected, onClick, type = "radio" }: OptionChipProps) {
  return (
    <button
      type="button"
      role={type === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onClick}
      className={[
        "rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
        "min-h-[40px] touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trackbite-green focus-visible:ring-offset-2",
        selected
          ? "border-trackbite-green bg-trackbite-green-light text-trackbite-green-darker"
          : "border-trackbite-gray-200 bg-white text-trackbite-gray-600 hover:border-trackbite-gray-300",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

interface OptionGroupProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export function OptionGroup({ label, children, hint }: OptionGroupProps) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-xs font-medium uppercase tracking-wide text-trackbite-gray-500">
        {label}
      </legend>
      {hint && <p className="-mt-1 text-xs text-trackbite-gray-500">{hint}</p>}
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}