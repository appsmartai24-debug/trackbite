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