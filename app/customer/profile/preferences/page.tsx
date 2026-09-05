"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { OptionChip, OptionGroup } from "@/components/ui/OptionChip";
import { useAuth } from "@/context/AuthContext";
import {
  getCustomerProfile,
  updateCustomerProfile,
  DIETARY_LABELS,
  ALLERGY_LABELS,
  PORTION_LABELS,
  FOOD_GOAL_LABELS,
} from "@/lib/customer/profile";
import { Allergy, DietaryPreference, FoodGoal, PortionPreference } from "@/types";

const DIETARY_OPTIONS = Object.entries(DIETARY_LABELS) as [DietaryPreference, string][];
const ALLERGY_OPTIONS = Object.entries(ALLERGY_LABELS) as [Allergy, string][];
const PORTION_OPTIONS = Object.entries(PORTION_LABELS) as [PortionPreference, string][];
const FOOD_GOAL_OPTIONS = Object.entries(FOOD_GOAL_LABELS) as [FoodGoal, string][];

export default function UpdatePreferencesPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("no-preference");
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [portionPreference, setPortionPreference] = useState<PortionPreference>("medium");
  const [foodGoals, setFoodGoals] = useState<FoodGoal[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      const profile = await getCustomerProfile(currentUser.uid);
      if (cancelled || !profile) {
        if (!cancelled) setLoading(false);
        return;
      }
      setDietaryPreference(profile.dietaryPreferences[0] ?? "no-preference");
      setAllergies(profile.allergies.length > 0 ? profile.allergies : ["none"]);
      setPortionPreference(profile.portionPreference);
      setFoodGoals(profile.foodGoals);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const toggleAllergy = (allergy: Allergy) => {
    setAllergies((prev) => {
      if (allergy === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      let next = prev.filter((a) => a !== "none");
      next = next.includes(allergy) ? next.filter((a) => a !== allergy) : [...next, allergy];
      return next;
    });
  };

  const toggleFoodGoal = (goal: FoodGoal) => {
    setFoodGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateCustomerProfile(currentUser.uid, {
        dietaryPreferences: dietaryPreference === "no-preference" ? [] : [dietaryPreference],
        allergies: allergies.filter((a) => a !== "none"),
        portionPreference,
        foodGoals,
      });
      setSaved(true);
      setTimeout(() => router.push("/customer/profile"), 900);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer size="md" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading your preferences..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <BackHeader title="Update Preferences" />

      <Card padding="lg" className="flex flex-col gap-7">
        <OptionGroup label="Dietary preference">
          {DIETARY_OPTIONS.map(([value, label]) => (
            <OptionChip
              key={value}
              label={label}
              selected={dietaryPreference === value}
              onClick={() => setDietaryPreference(value)}
              type="radio"
            />
          ))}
        </OptionGroup>

        <OptionGroup label="Allergies" hint="Select all that apply">
          {ALLERGY_OPTIONS.map(([value, label]) => (
            <OptionChip
              key={value}
              label={label}
              selected={allergies.includes(value)}
              onClick={() => toggleAllergy(value)}
              type="checkbox"
            />
          ))}
        </OptionGroup>

        <OptionGroup label="Portion preference">
          {PORTION_OPTIONS.map(([value, label]) => (
            <OptionChip
              key={value}
              label={label}
              selected={portionPreference === value}
              onClick={() => setPortionPreference(value)}
              type="radio"
            />
          ))}
        </OptionGroup>

        <OptionGroup label="Food goals" hint="Select all that apply">
          {FOOD_GOAL_OPTIONS.map(([value, label]) => (
            <OptionChip
              key={value}
              label={label}
              selected={foodGoals.includes(value)}
              onClick={() => toggleFoodGoal(value)}
              type="checkbox"
            />
          ))}
        </OptionGroup>
      </Card>

      <div className="mt-5">
        <Button fullWidth onClick={handleSave} isLoading={saving} disabled={saving}>
          {saved ? "Saved!" : saving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </PageContainer>
  );
}