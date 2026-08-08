
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useOnboarding } from "@/context/OnboardingContext";
import { isValidEmail, validateRequired } from "@/lib/validation";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Restaurant info", "Contact & location", "About", "Review"];

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
        className="shrink-0 text-xs font-medium text-trackbite-yellow-dark hover:opacity-80"
      >
        Edit
      </button>
    </div>
  );
}

export function RestaurantOnboarding() {
  const router = useRouter();
  const { state, updateRestaurant, setRole } = useOnboarding();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { restaurant } = state;

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    const nameError = validateRequired(restaurant.restaurantName, "Restaurant name");
    const contactError = validateRequired(restaurant.contactPerson, "Contact person");
    const phoneError = validateRequired(restaurant.phone, "Phone number");

    if (nameError) nextErrors.restaurantName = nameError;
    if (contactError) nextErrors.contactPerson = contactError;
    if (phoneError) nextErrors.phone = phoneError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors: Record<string, string> = {};
    const emailError = !restaurant.email.trim()
      ? "Email is required."
      : !isValidEmail(restaurant.email)
        ? "Please enter a valid email address."
        : null;
    const addressError = validateRequired(restaurant.address, "Restaurant address");
    const cityError = validateRequired(restaurant.city, "City");

    if (emailError) nextErrors.email = emailError;
    if (addressError) nextErrors.address = addressError;
    if (cityError) nextErrors.city = cityError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep3 = () => {
    const nextErrors: Record<string, string> = {};
    const cuisineError = validateRequired(restaurant.cuisineType, "Cuisine type");
    const descError = validateRequired(restaurant.description, "Restaurant description");

    if (cuisineError) nextErrors.cuisineType = cuisineError;
    if (descError) nextErrors.description = descError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
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
    setRole("restaurant");
    router.push("/register");
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Tell us about your restaurant
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Let&apos;s get your restaurant set up on Trackbite.
              </p>
            </div>

            <Input
              label="Restaurant Name"
              name="restaurantName"
              value={restaurant.restaurantName}
              onChange={(e) => updateRestaurant({ restaurantName: e.target.value })}
              error={errors.restaurantName}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact Person"
                name="contactPerson"
                value={restaurant.contactPerson}
                onChange={(e) => updateRestaurant({ contactPerson: e.target.value })}
                error={errors.contactPerson}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={restaurant.phone}
                onChange={(e) => updateRestaurant({ phone: e.target.value })}
                error={errors.phone}
                required
                autoComplete="tel"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Contact &amp; location
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Where customers can find you.
              </p>
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={restaurant.email}
              onChange={(e) => updateRestaurant({ email: e.target.value })}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Restaurant Address"
              name="address"
              value={restaurant.address}
              onChange={(e) => updateRestaurant({ address: e.target.value })}
              error={errors.address}
              required
              autoComplete="street-address"
            />

            <Input
              label="City"
              name="city"
              value={restaurant.city}
              onChange={(e) => updateRestaurant({ city: e.target.value })}
              error={errors.city}
              required
              autoComplete="address-level2"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">About the restaurant</h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Help customers know what to expect.
              </p>
            </div>

            <Input
              label="Cuisine Type"
              name="cuisineType"
              value={restaurant.cuisineType}
              onChange={(e) => updateRestaurant({ cuisineType: e.target.value })}
              error={errors.cuisineType}
              required
              placeholder="e.g. Italian, Middle Eastern"
            />

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-xs font-medium text-trackbite-gray-700"
              >
                Restaurant Description <span className="text-trackbite-error">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={restaurant.description}
                onChange={(e) => updateRestaurant({ description: e.target.value })}
                className={[
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-trackbite-gray-900",
                  "placeholder:text-trackbite-gray-400 transition-colors resize-y min-h-[100px]",
                  "focus:border-trackbite-green focus:ring-2 focus:ring-trackbite-green/20 focus:outline-none",
                  errors.description
                    ? "border-trackbite-error bg-trackbite-error-light"
                    : "border-trackbite-gray-200",
                ].join(" ")}
                placeholder="Tell customers what makes your restaurant special..."
              />
              {errors.description && (
                <p role="alert" className="mt-1.5 text-xs text-trackbite-error">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-medium text-trackbite-gray-900">
                Review your restaurant profile
              </h1>
              <p className="mt-1.5 text-sm text-trackbite-gray-500">
                Make sure everything looks right before you continue.
              </p>
            </div>

            <div className="space-y-2.5">
              <ReviewRow
                label="Restaurant name"
                value={restaurant.restaurantName || "—"}
                onEdit={() => setStep(1)}
              />
              <ReviewRow
                label="Contact person"
                value={restaurant.contactPerson || "—"}
                onEdit={() => setStep(1)}
              />
              <ReviewRow label="Phone" value={restaurant.phone || "—"} onEdit={() => setStep(1)} />
              <ReviewRow label="Email" value={restaurant.email || "—"} onEdit={() => setStep(2)} />
              <ReviewRow
                label="Address"
                value={
                  [restaurant.address, restaurant.city].filter(Boolean).join(", ") || "—"
                }
                onEdit={() => setStep(2)}
              />
              <ReviewRow
                label="Cuisine type"
                value={restaurant.cuisineType || "—"}
                onEdit={() => setStep(3)}
              />
              <ReviewRow
                label="Description"
                value={restaurant.description || "—"}
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
              Create restaurant profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}