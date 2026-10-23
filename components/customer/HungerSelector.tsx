"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { OptionChip } from "@/components/ui/OptionChip";
import { HUNGER_LABELS } from "@/lib/customer/hunger";
import { setCustomerHunger } from "@/lib/customer/profile";
import { HungerLevel } from "@/types";

const OPTIONS = Object.entries(HUNGER_LABELS) as [HungerLevel, string][];

interface HungerSelectorProps {
  uid: string;
  initial: HungerLevel | null;
}

export function HungerSelector({ uid, initial }: HungerSelectorProps) {
  const [level, setLevel] = useState<HungerLevel | null>(initial);
  const [error, setError] = useState("");

  const choose = async (next: HungerLevel) => {
    const previous = level;
    // Tapping the selected chip again clears it (the question is optional).
    const value = previous === next ? null : next;
    setLevel(value);
    setError("");
    try {
      await setCustomerHunger(uid, value);
    } catch {
      setLevel(previous);
      setError("Couldn't save. Please try again.");
    }
  };

  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-trackbite-gray-900">
          How hungry are you today?
        </h2>
        <p className="mt-0.5 text-xs text-trackbite-gray-500">
          Optional. Helps the restaurant adjust your portion for this visit.
        </p>
      </div>

      <div role="radiogroup" aria-label="Hunger level" className="flex flex-wrap gap-2">
        {OPTIONS.map(([value, label]) => (
          <OptionChip
            key={value}
            label={label}
            selected={level === value}
            onClick={() => choose(value)}
            type="radio"
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-trackbite-error">
          {error}
        </p>
      )}
    </Card>
  );
}