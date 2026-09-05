"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import {
  getRestaurantProfile,
  updateRewardSettings,
} from "@/lib/restaurant/profile";

function RewardSettingsContent() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState("200");
  const [rewardName, setRewardName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      const profile = await getRestaurantProfile(currentUser.uid);
      if (!cancelled && profile) {
        setThreshold(String(profile.rewardThreshold));
        setRewardName(profile.rewardName);
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setError(null);
    setSaved(false);

    const parsedThreshold = Number(threshold);
    if (!Number.isFinite(parsedThreshold) || parsedThreshold <= 0) {
      setError("Points needed must be a number greater than 0.");
      return;
    }
    if (!rewardName.trim()) {
      setError("Give the reward a short name, e.g. \"Free dessert\".");
      return;
    }

    setSaving(true);
    try {
      await updateRewardSettings(currentUser.uid, {
        rewardThreshold: Math.round(parsedThreshold),
        rewardName: rewardName.trim(),
      });
      setSaved(true);
    } catch {
      setError("Couldn't save your reward settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer size="md" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading reward settings..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md" className="flex flex-1 flex-col gap-6">
      <BackHeader title="Reward settings" href="/restaurant" />

      <Card padding="lg" className="flex flex-col gap-5">
        <div>
          <h2 className="text-sm font-semibold text-trackbite-gray-900">
            Your loyalty programme
          </h2>
          <p className="mt-1 text-sm text-trackbite-gray-500">
            Every customer earns points only with you — points never transfer
            to or from any other restaurant on Trackbite.
          </p>
        </div>

        <Input
          label="Points needed for a reward"
          name="threshold"
          type="number"
          min={1}
          inputMode="numeric"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          hint="e.g. 200 points before a customer's reward is ready"
          required
        />

        <Input
          label="Reward given"
          name="rewardName"
          value={rewardName}
          onChange={(e) => setRewardName(e.target.value)}
          placeholder="e.g. Free dessert"
          hint="Shown to your staff when a customer's reward is ready"
          required
        />

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {saved && !error && (
          <p className="rounded-xl bg-trackbite-green-light px-3 py-2 text-sm text-trackbite-green-darker">
            Saved. New scans will use these settings.
          </p>
        )}

        <Button onClick={handleSave} isLoading={saving} fullWidth>
          Save settings
        </Button>
      </Card>
    </PageContainer>
  );
}

export default function RestaurantRewardsPage() {
  return (
    <ProtectedRoute requiredRole="restaurant">
      <RewardSettingsContent />
    </ProtectedRoute>
  );
}