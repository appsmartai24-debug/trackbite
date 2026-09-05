"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OptionChip, OptionGroup } from "@/components/ui/OptionChip";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Allergy,
  DietaryPreference,
  FoodGoal,
  PortionPreference,
} from "@/types";
import { validateRequired } from "@/lib/validation";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Basic info", "Dietary", "Portions & goals", "Review"];

const DIETARY_OPTIONS: { value: DietaryPreference; label: string }[] = [
  { value: "no-preference", label: "No preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "keto", label: "Keto" },
  { value: "other", label: "Other" },
];

const ALLERGY_OPTIONS: { value: Allergy; label: string }[] = [
  { value: "none", label: "None" },
  { value: "nuts", label: "Nuts" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "seafood", label: "Seafood" },
  { value: "eggs", label: "Eggs" },
  { value: "other", label: "Other" },
];

const PORTION_OPTIONS: { value: PortionPreference; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const FOOD_GOAL_OPTIONS: { value: FoodGoal; label: string }[] = [
  { value: "eat-healthier", label: "Eat healthier" },
  { value: "control-portions", label: "Control portions" },
  { value: "reduce-food-waste", label: "Reduce food waste" },
  { value: "track-meals", label: "Track meals" },
];

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-trackbite-gray-100 bg-trackbite-gray-50 px-4 py-3">
      <div>
        <p className="text-xs font-medium text-trackbite-gray-500">{label}</p>
        <p className="mt-0.5 text-sm text-trackbite-gray-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs font-medium text-trackbite-green hover:text-trackbite-green-dark"
      >
        Edit
      </button>
    </div>
  );
}

export function CustomerOnboarding() {
  const router = useRouter();
  const { state, updateCustomer, setRole } = useOnboarding();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { customer } = state;

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    const firstNameError = validateRequired(customer.firstName, "First name");
    const lastNameError = validateRequired(customer.lastName, "Last name");
    if (firstNameError) nextErrors.firstName = firstNameError;
    if (lastNameError) nextErrors.lastName = lastNameError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    if (step === 1) {
      router.push("/onboarding");
      return;
    }
    setStep((s) => s - 1);
  };

  const handleFinish = () => {
    setRole("customer");
    router.push("/register");
  };

  const toggleAllergy = (allergy: Allergy) => {
    let next = [...customer.allergies];
    if (allergy === "none") {
      next = next.includes("none") ? [] : ["none"];
    } else {
      next = next.filter((a) => a !== "none");
      if (next.includes(allergy)) {
        next = next.filter((a) => a !== allergy);
      } else {
        next.push(allergy);
      }
    }
    updateCustomer({ allergies: next });
  };

  const toggleFoodGoal = (goal: FoodGoal) => {
    const next = customer.foodGoals.includes(goal)
      ? customer.foodGoals.filter((g) => g !== goal)
      : [...customer.foodGoals, goal];
    updateCustomer({ foodGoals: next });
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Tell us about yourself
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Help us personalize your Trackbite experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={customer.firstName}
                onChange={(e) => updateCustomer({ firstName: e.target.value })}
                error={errors.firstName}
                required
                autoComplete="given-name"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={customer.lastName}
                onChange={(e) => updateCustomer({ lastName: e.target.value })}
                error={errors.lastName}
                required
                autoComplete="family-name"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Dietary preferences
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                So restaurants know what to serve — and what to avoid.
              </p>
            </div>

            <OptionGroup label="Dietary preference">
              {DIETARY_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.value}
                  label={opt.label}
                  selected={customer.dietaryPreference === opt.value}
                  onClick={() => updateCustomer({ dietaryPreference: opt.value })}
                  type="radio"
                />
              ))}
            </OptionGroup>

            <OptionGroup label="Allergies" hint="Select all that apply">
              {ALLERGY_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.value}
                  label={opt.label}
                  selected={customer.allergies.includes(opt.value)}
                  onClick={() => toggleAllergy(opt.value)}
                  type="checkbox"
                />
              ))}
            </OptionGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Portions &amp; goals
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                A little more context helps us fine-tune your experience.
              </p>
            </div>

            <OptionGroup label="Portion preference">
              {PORTION_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.value}
                  label={opt.label}
                  selected={customer.portionPreference === opt.value}
                  onClick={() => updateCustomer({ portionPreference: opt.value })}
                  type="radio"
                />
              ))}
            </OptionGroup>

            <OptionGroup label="Food goals" hint="Select all that apply">
              {FOOD_GOAL_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.value}
                  label={opt.label}
                  selected={customer.foodGoals.includes(opt.value)}
                  onClick={() => toggleFoodGoal(opt.value)}
                  type="checkbox"
                />
              ))}
            </OptionGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Review your profile
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Make sure everything looks right before you continue.
              </p>
            </div>

            <div className="space-y-2.5">
              <ReviewRow
                label="Name"
                value={`${customer.firstName} ${customer.lastName}`.trim() || "—"}
                onEdit={() => setStep(1)}
              />
              <ReviewRow
                label="Dietary preference"
                value={
                  DIETARY_OPTIONS.find((o) => o.value === customer.dietaryPreference)
                    ?.label ?? "—"
                }
                onEdit={() => setStep(2)}
              />
              <ReviewRow
                label="Allergies"
                value={
                  customer.allergies.length
                    ? customer.allergies
                        .map((a) => ALLERGY_OPTIONS.find((o) => o.value === a)?.label)
                        .join(", ")
                    : "None specified"
                }
                onEdit={() => setStep(2)}
              />
              <ReviewRow
                label="Portion preference"
                value={
                  PORTION_OPTIONS.find((o) => o.value === customer.portionPreference)
                    ?.label ?? "—"
                }
                onEdit={() => setStep(3)}
              />
              <ReviewRow
                label="Food goals"
                value={
                  customer.foodGoals.length
                    ? customer.foodGoals
                        .map((g) => FOOD_GOAL_OPTIONS.find((o) => o.value === g)?.label)
                        .join(", ")
                    : "None specified"
                }
                onEdit={() => setStep(3)}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-trackbite-gray-100 pt-6">
          <button
            type="button"
            onClick={goBack}
            className="text-sm font-medium text-trackbite-gray-500 hover:text-trackbite-gray-900"
          >
            Back
          </button>
          {step < TOTAL_STEPS ? (
            <Button size="md" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button size="md" onClick={handleFinish}>
              Create profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}