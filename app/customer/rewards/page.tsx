// "use client";

// import { useMemo, useState } from "react";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { AIBadge } from "@/components/customer/AIBadge";
// import { ProgressBar } from "@/components/customer/ProgressBar";
// import {
//   ArrowUpRightIcon,
//   CoinIcon,
//   GiftBoxSmallIcon,
//   LockIcon,
//   SparkleIcon,
// } from "@/components/customer/icons";

// // --- Mock content -------------------------------------------------------

// const WALLETS = [
//   { id: "w1", name: "Green Bowl", initial: "G", points: 420, nextTier: "Gold", tierAt: 500 },
//   { id: "w2", name: "Kai's Kitchen", initial: "K", points: 260, nextTier: "Silver", tierAt: 300 },
//   { id: "w3", name: "Nolita Coffee", initial: "N", points: 90, nextTier: "Regular", tierAt: 150 },
// ];

// const REWARDS = [
//   { id: "rw1", restaurant: "Green Bowl", name: "Free seasonal drink", cost: 300 },
//   { id: "rw2", restaurant: "Kai's Kitchen", name: "10% off next order", cost: 200 },
//   { id: "rw3", restaurant: "Green Bowl", name: "Free dessert", cost: 450 },
//   { id: "rw4", restaurant: "Nolita Coffee", name: "Free coffee", cost: 100 },
//   { id: "rw5", restaurant: "Kai's Kitchen", name: "Free appetizer", cost: 350 },
// ];

// const walletPoints = (name: string) => WALLETS.find((w) => w.name === name)?.points ?? 0;

// export default function CustomerRewardsPage() {
//   const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

//   const totalPoints = useMemo(() => WALLETS.reduce((sum, w) => sum + w.points, 0), []);

//   // The wallet closest to unlocking its next reward — this is the thing
//   // the AI pick surfaces first.
//   const pick = useMemo(() => {
//     const unlockable = REWARDS.filter((r) => !redeemed.has(r.id))
//       .map((r) => ({ ...r, remaining: r.cost - walletPoints(r.restaurant) }))
//       .filter((r) => r.remaining > 0)
//       .sort((a, b) => a.remaining - b.remaining)[0];
//     return unlockable ?? null;
//   }, [redeemed]);

//   return (
//     <PageContainer size="lg" className="flex flex-1 flex-col gap-6">
//       <div>
//         <h1 className="text-2xl font-medium text-trackbite-gray-900">Rewards</h1>
//         <p className="mt-1 text-sm text-trackbite-gray-500">
//           Every restaurant you visit keeps its own loyalty wallet for you.
//         </p>
//       </div>

//       {/* Total points hero */}
//       <div className="relative overflow-hidden rounded-2xl border border-trackbite-gray-200 bg-trackbite-gray-900 p-5 text-white shadow-sm sm:p-6">
//         <div
//           className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full bg-trackbite-green/25 blur-3xl"
//           aria-hidden="true"
//         />
//         <div
//           className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-trackbite-yellow/15 blur-3xl"
//           aria-hidden="true"
//         />
//         <div className="relative flex items-center justify-between">
//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total points</p>
//             <p className="mt-1.5 text-3xl font-semibold">{totalPoints.toLocaleString()}</p>
//             <p className="mt-1 text-xs text-white/50">Across {WALLETS.length} restaurants</p>
//           </div>
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
//             <CoinIcon className="h-6 w-6 text-trackbite-yellow" />
//           </div>
//         </div>
//       </div>

//       {/* AI pick */}
//       {pick && (
//         <div className="relative overflow-hidden rounded-2xl border border-trackbite-green/15 bg-gradient-to-br from-trackbite-green-muted via-white to-trackbite-yellow-light/40 p-5 shadow-sm sm:p-6">
//           <div className="flex items-start gap-4">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-trackbite-green shadow-sm">
//               <SparkleIcon className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <AIBadge label="AI pick for you" />
//               <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-800">
//                 You&apos;re <span className="font-semibold">{pick.remaining} points</span> away from{" "}
//                 <span className="font-semibold">{pick.name.toLowerCase()}</span> at {pick.restaurant}. Track one more meal there to close the gap.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Wallets */}
//       <section>
//         <h2 className="mb-3 text-sm font-semibold text-trackbite-gray-900">Your wallets</h2>
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
//           {WALLETS.map((w) => (
//             <div key={w.id} className="rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trackbite-green-light text-sm font-semibold text-trackbite-green-darker">
//                   {w.initial}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-trackbite-gray-900">{w.name}</p>
//                   <p className="text-xs text-trackbite-gray-500">{w.points} points</p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <div className="mb-1.5 flex items-center justify-between text-[11px] text-trackbite-gray-400">
//                   <span>Next: {w.nextTier}</span>
//                   <span>
//                     {w.points}/{w.tierAt}
//                   </span>
//                 </div>
//                 <ProgressBar value={w.points} max={w.tierAt} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Redeemable catalog */}
//       <section className="pb-2">
//         <h2 className="mb-3 text-sm font-semibold text-trackbite-gray-900">Redeem</h2>
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           {REWARDS.map((reward) => {
//             const points = walletPoints(reward.restaurant);
//             const isRedeemed = redeemed.has(reward.id);
//             const unlocked = points >= reward.cost;

//             return (
//               <div
//                 key={reward.id}
//                 className={[
//                   "flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition-colors",
//                   isRedeemed
//                     ? "border-trackbite-green/30 bg-trackbite-green-muted"
//                     : unlocked
//                       ? "border-trackbite-gray-200 bg-white"
//                       : "border-trackbite-gray-200 bg-trackbite-gray-50/70",
//                 ].join(" ")}
//               >
//                 <span
//                   className={[
//                     "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
//                     unlocked || isRedeemed
//                       ? "bg-trackbite-yellow-light text-trackbite-yellow-dark"
//                       : "bg-trackbite-gray-100 text-trackbite-gray-400",
//                   ].join(" ")}
//                 >
//                   <GiftBoxSmallIcon className="h-5 w-5" />
//                 </span>

//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-trackbite-gray-900">{reward.name}</p>
//                   <p className="truncate text-xs text-trackbite-gray-500">{reward.restaurant}</p>
//                 </div>

//                 <div className="shrink-0">
//                   {isRedeemed ? (
//                     <span className="rounded-full bg-trackbite-green-light px-2.5 py-1 text-[11px] font-semibold text-trackbite-green-darker">
//                       Redeemed
//                     </span>
//                   ) : unlocked ? (
//                     <button
//                       type="button"
//                       onClick={() => setRedeemed((prev) => new Set(prev).add(reward.id))}
//                       className="inline-flex items-center gap-1 rounded-lg bg-trackbite-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-trackbite-green-dark"
//                     >
//                       Redeem
//                       <ArrowUpRightIcon className="h-3 w-3" />
//                     </button>
//                   ) : (
//                     <span className="inline-flex items-center gap-1 rounded-lg bg-trackbite-gray-100 px-2.5 py-1.5 text-[11px] font-medium text-trackbite-gray-400">
//                       <LockIcon className="h-3 w-3" />
//                       {reward.cost} pts
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//     </PageContainer>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { AIBadge } from "@/components/customer/AIBadge";
import { ProgressBar } from "@/components/customer/ProgressBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CoinIcon, GiftBoxSmallIcon, SparkleIcon } from "@/components/customer/icons";
import { useAuth } from "@/context/AuthContext";
import { authedFetch } from "@/lib/client/authedFetch";

interface CustomerWalletSummary {
  restaurantId: string;
  restaurantName: string;
  points: number;
  visits: number;
  rewardThreshold: number;
  rewardName: string;
  rewardReady: boolean;
}

export default function CustomerRewardsPage() {
  const { currentUser } = useAuth();
  const [wallets, setWallets] = useState<CustomerWalletSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        const data = await authedFetch<{ wallets: CustomerWalletSummary[] }>(
          "/api/customer/wallets",
          {}
        );
        if (!cancelled) setWallets(data.wallets);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't load your rewards.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const totalPoints = useMemo(
    () => wallets.reduce((sum, w) => sum + w.points, 0),
    [wallets]
  );

  // The AI pick: a reward that's already ready takes priority (nothing
  // left to do but ask staff); otherwise, whichever wallet is closest to
  // unlocking its reward.
  const pick = useMemo(() => {
    const ready = wallets.find((w) => w.rewardReady);
    if (ready) return { ...ready, remaining: 0 };

    const closest = wallets
      .map((w) => ({ ...w, remaining: w.rewardThreshold - w.points }))
      .filter((w) => w.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining)[0];

    return closest ?? null;
  }, [wallets]);

  if (loading) {
    return (
      <PageContainer size="lg" className="flex flex-1 items-center justify-center">
        <LoadingSpinner label="Loading your rewards..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="lg" className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-trackbite-gray-900">Rewards</h1>
        <p className="mt-1 text-sm text-trackbite-gray-500">
          Every restaurant you visit keeps its own loyalty wallet for you.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* Total points hero */}
      <div className="relative overflow-hidden rounded-2xl border border-trackbite-gray-200 bg-trackbite-gray-900 p-5 text-white shadow-sm sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full bg-trackbite-green/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-trackbite-yellow/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total points</p>
            <p className="mt-1.5 text-3xl font-semibold">{totalPoints.toLocaleString()}</p>
            <p className="mt-1 text-xs text-white/50">
              Across {wallets.length} restaurant{wallets.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
            <CoinIcon className="h-6 w-6 text-trackbite-yellow" />
          </div>
        </div>
      </div>

      {/* AI pick */}
      {pick && (
        <div className="relative overflow-hidden rounded-2xl border border-trackbite-green/15 bg-gradient-to-br from-trackbite-green-muted via-white to-trackbite-yellow-light/40 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-trackbite-green shadow-sm">
              <SparkleIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <AIBadge label="AI pick for you" />
              <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-800">
                {pick.remaining === 0 ? (
                  <>
                    Your <span className="font-semibold">{pick.rewardName.toLowerCase()}</span> at{" "}
                    {pick.restaurantName} is ready — show your Food ID next visit to redeem it.
                  </>
                ) : (
                  <>
                    You&apos;re <span className="font-semibold">{pick.remaining} points</span>{" "}
                    away from{" "}
                    <span className="font-semibold">{pick.rewardName.toLowerCase()}</span> at{" "}
                    {pick.restaurantName}. Track one more meal there to close the gap.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wallets */}
      <section className="pb-2">
        <h2 className="mb-3 text-sm font-semibold text-trackbite-gray-900">Your wallets</h2>

        {wallets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/70 p-6 text-center">
            <p className="text-sm text-trackbite-gray-500">
              No wallets yet. Visit a restaurant on Trackbite and have your Food ID scanned to
              start earning points.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {wallets.map((w) => (
              <div
                key={w.restaurantId}
                className="rounded-2xl border border-trackbite-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trackbite-green-light text-sm font-semibold text-trackbite-green-darker">
                    {w.restaurantName[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-trackbite-gray-900">
                      {w.restaurantName}
                    </p>
                    <p className="text-xs text-trackbite-gray-500">
                      {w.points} points · {w.visits} visit{w.visits === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-trackbite-gray-400">
                    <span className="truncate">{w.rewardName}</span>
                    <span className="shrink-0">
                      {Math.min(w.points, w.rewardThreshold)}/{w.rewardThreshold}
                    </span>
                  </div>
                  <ProgressBar value={Math.min(w.points, w.rewardThreshold)} max={w.rewardThreshold} />
                </div>

                <div className="mt-3">
                  {w.rewardReady ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-trackbite-green-light px-2.5 py-1.5 text-[11px] font-semibold text-trackbite-green-darker">
                      <GiftBoxSmallIcon className="h-3.5 w-3.5" />
                      Ready — ask staff to redeem
                    </span>
                  ) : (
                    <span className="text-[11px] text-trackbite-gray-400">
                      {w.rewardThreshold - w.points} points to go
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}