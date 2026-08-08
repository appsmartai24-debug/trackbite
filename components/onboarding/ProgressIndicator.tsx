// interface ProgressIndicatorProps {
//   currentStep: number;
//   totalSteps: number;
// }

// export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
//   const progress = (currentStep / totalSteps) * 100;

//   return (
//     <div className="mb-8">
//       <p className="mb-2 text-sm font-medium text-trackbite-gray-600">
//         Step {currentStep} of {totalSteps}
//       </p>
//       <div
//         className="h-2 w-full overflow-hidden rounded-full bg-trackbite-gray-100"
//         role="progressbar"
//         aria-valuenow={currentStep}
//         aria-valuemin={1}
//         aria-valuemax={totalSteps}
//         aria-label={`Step ${currentStep} of ${totalSteps}`}
//       >
//         <div
//           className="h-full rounded-full bg-trackbite-green transition-all duration-300"
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//     </div>
//   );
// }

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  const currentLabel = labels?.[currentStep - 1];

  return (
    <div className="mb-6">
      <div
        className="flex items-center gap-1.5"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < currentStep ? "bg-trackbite-green" : "bg-trackbite-gray-100",
            ].join(" ")}
          />
        ))}
      </div>
      <p className="mt-2.5 text-xs font-medium text-trackbite-gray-500">
        Step {currentStep} of {totalSteps}
        {currentLabel ? ` — ${currentLabel}` : ""}
      </p>
    </div>
  );
}