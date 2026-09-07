"use client";

import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { auth } from "@/lib/firebase/config";
import { authedFetch } from "@/lib/client/authedFetch";


import { ALLERGY_LABELS, DIETARY_LABELS, PORTION_LABELS, FOOD_GOAL_LABELS } from "@/lib/customer/profile";
import { Allergy, DietaryPreference, PortionPreference, FoodGoal } from "@/types";

// Must match the prefix the customer app encodes into its QR
// (see QR_PREFIX in app/customer/profile/page.tsx).
const QR_PREFIX = "TRACKBITE:CUSTOMER:";
const READER_ID = "restaurant-qr-reader";
const DEFAULT_AWARD_AMOUNT = 10;

type ScanState = "camera" | "manual" | "result";

interface WalletInfo {
  points: number;
  visits: number;
  rewardThreshold: number;
  rewardName: string;
  rewardReady: boolean;
}

interface CustomerFacts {
  dietaryPreferences: string[];
  allergies: string[];
  portionPreference: string;
  foodGoals: string[];
  mealsTracked: number;
  averageClearedPercent: number;
  mostCommonPortionSize?: string;
}

function extractUid(rawText: string): string | null {
  if (!rawText.startsWith(QR_PREFIX)) return null;
  const uid = rawText.slice(QR_PREFIX.length).trim();
  return uid.length > 0 ? uid : null;
}

/** Every wallet call needs the restaurant's own Firebase ID token so the
 *  server can trust which restaurant is asking — never send restaurantId
 *  in the request body, since that could be forged by any caller. */
// async function authedFetch(path: string, body: object) {
//   const idToken = await auth.currentUser?.getIdToken();
//   if (!idToken) throw new Error("You're not signed in. Please log in again.");
//   const res = await fetch(path, {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//       authorization: `Bearer ${idToken}`,
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error ?? "Request failed");
//   return data;
// }

export default function RestaurantScanPage() {
  const [mode, setMode] = useState<ScanState>("camera");
  const [manualUid, setManualUid] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [scannedUid, setScannedUid] = useState<string | null>(null);
  const [facts, setFacts] = useState<CustomerFacts | null>(null);

  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [awardAmount, setAwardAmount] = useState(String(DEFAULT_AWARD_AMOUNT));
  const [awarding, setAwarding] = useState(false);
  const [awardError, setAwardError] = useState<string | null>(null);
  const [justAwarded, setJustAwarded] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [justRedeemed, setJustRedeemed] = useState(false);

  // Holds the live Html5Qrcode instance so we can stop the camera
  // whenever we leave "camera" mode or the page unmounts.
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  async function lookupCustomer(uid: string) {
    setScannedUid(uid);
    setLookupLoading(true);
    setLookupError(null);
    setSummary(null);
    setWallet(null);
    setJustAwarded(false);
    setJustRedeemed(false);
    setRedeemError(null);
    try {
      const [summaryRes, walletRes] = await Promise.all([
        fetch("/api/customer-summary", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ uid }),
        }).then((res) => res.json()),
        authedFetch("/api/wallet", { customerUid: uid }),
      ]);
      // if (summaryRes.error) throw new Error(summaryRes.error);
      // setSummary(summaryRes.summary);
      // setWallet(walletRes as WalletInfo);
      if (summaryRes.error) throw new Error(summaryRes.error);
      setSummary(summaryRes.summary);
      setFacts(summaryRes.facts ?? null);
      setWallet(walletRes as WalletInfo);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLookupLoading(false);
      setMode("result");
    }
  }

  // Starts the camera and begins decoding as soon as we're in "camera" mode.
  // useEffect(() => {
  //   if (mode !== "camera") return;
  //   let cancelled = false;

  //   async function start() {
  //     try {
  //       const { Html5Qrcode } = await import("html5-qrcode");
  //       if (cancelled) return;

  //       const scanner = new Html5Qrcode(READER_ID);
  //       scannerRef.current = scanner;

  //       await scanner.start(
  //         { facingMode: "environment" },
  //         { fps: 10, qrbox: { width: 240, height: 240 } },
  //         (decodedText) => {
  //           const uid = extractUid(decodedText);
  //           if (!uid) {
  //             setCameraError("That's not a Trackbite customer code. Try again.");
  //             return;
  //           }
  //           setCameraError(null);
  //           // Stop scanning as soon as we get a valid hit.
  //           scanner
  //             .stop()
  //             .catch(() => undefined)
  //             .finally(() => lookupCustomer(uid));
  //         },
  //         () => {
  //           // Fired continuously while no code is in view — ignore.
  //         }
  //       );
  //     } catch {
  //       if (!cancelled) {
  //         setCameraError(
  //           "Couldn't access the camera. Check permissions, or enter the Food ID manually."
  //         );
  //       }
  //     }
  //   }

  //   start();

  //   return () => {
  //     cancelled = true;
  //     const scanner = scannerRef.current;
  //     if (scanner) {
  //       scanner.stop().catch(() => undefined);
  //       scannerRef.current = null;
  //     }
  //   };
  // }, [mode]);
useEffect(() => {
  if (mode !== "camera") return;
  let cancelled = false;
  let scanner: import("html5-qrcode").Html5Qrcode | null = null;

  async function start() {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;

      scanner = new Html5Qrcode(READER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        // (decodedText) => {
        //   const uid = extractUid(decodedText);
        //   if (!uid) {
        //     setCameraError("That's not a Trackbite customer code. Try again.");
        //     return;
        //   }
        //   setCameraError(null);
        //   scanner
        //     ?.stop()
        //     .catch(() => undefined)
        //     .finally(() => lookupCustomer(uid));
        // },

                (decodedText) => {
          const uid = extractUid(decodedText);
          if (!uid) {
            setCameraError("That's not a Trackbite customer code. Try again.");
            return;
          }
          setCameraError(null);
          // Prevent the cleanup below from trying to stop this scanner again.
          scannerRef.current = null;
          try {
            scanner
              ?.stop()
              .catch(() => undefined)
              .finally(() => lookupCustomer(uid));
          } catch {
            // stop() can throw synchronously if already stopped — safe to ignore.
            lookupCustomer(uid);
          }
        },
        () => {}
      );
    } catch {
      if (!cancelled) {
        setCameraError(
          "Couldn't access the camera. Check permissions, or enter the Food ID manually."
        );
      }
    }
  }

  start();

  return () => {
    cancelled = true;
    const activeScanner = scannerRef.current;
    scannerRef.current = null;
    if (activeScanner) {
      // Wait for full stop AND clear the video element before this
      // effect is allowed to spin up a second instance (Strict Mode
      // double-invokes this in dev).
      activeScanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          activeScanner.clear();
        });
    }
  };
}, [mode]);
  const handleManualLookup = () => {
    if (!manualUid.trim()) return;
    lookupCustomer(manualUid.trim());
  };

  const handleAward = async () => {
    if (!scannedUid) return;
    const points = Number(awardAmount);
    if (!Number.isFinite(points) || points <= 0) {
      setAwardError("Enter a positive number of points.");
      return;
    }
    setAwarding(true);
    setAwardError(null);
    setJustAwarded(false);
    try {
      const updated = await authedFetch("/api/wallet/award", {
        customerUid: scannedUid,
        points,
      });
      setWallet(updated as WalletInfo);
      setJustAwarded(true);
    } catch (err) {
      setAwardError(err instanceof Error ? err.message : "Couldn't award points.");
    } finally {
      setAwarding(false);
    }
  };

  const handleRedeem = async () => {
    if (!scannedUid) return;
    setRedeeming(true);
    setRedeemError(null);
    setJustRedeemed(false);
    try {
      const updated = await authedFetch("/api/wallet/redeem", { customerUid: scannedUid });
      setWallet(updated as WalletInfo);
      setJustRedeemed(true);
      setJustAwarded(false);
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : "Couldn't redeem the reward.");
    } finally {
      setRedeeming(false);
    }
  };

  const handleScanAnother = () => {
    setSummary(null);
    setLookupError(null);
    setScannedUid(null);
    setFacts(null);
    setManualUid("");
    setWallet(null);
    setAwardError(null);
    setJustAwarded(false);
    setRedeemError(null);
    setJustRedeemed(false);
    setAwardAmount(String(DEFAULT_AWARD_AMOUNT));
    setMode("camera");
  };

  return (
    <PageContainer size="md" className="flex flex-1 flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-medium text-trackbite-gray-900">Scan a customer</h1>
        <p className="mt-1 text-sm text-trackbite-gray-500">
          Point the camera at the customer&apos;s Food ID QR code.
        </p>
      </div>

      {mode === "camera" && (
        <Card padding="lg" className="flex flex-col gap-4">
          <div
            id={READER_ID}
            className="mx-auto w-full max-w-xs overflow-hidden rounded-xl bg-trackbite-gray-900"
          />
          {cameraError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{cameraError}</p>
          )}
          <Button variant="outline" fullWidth onClick={() => setMode("manual")}>
            Enter Food ID manually instead
          </Button>
        </Card>
      )}

      {mode === "manual" && (
        <Card padding="lg" className="flex flex-col gap-4">
          <Input
            label="Customer Food ID"
            placeholder="e.g. aB3xQ..."
            value={manualUid}
            onChange={(e) => setManualUid(e.target.value)}
          />
          <Button onClick={handleManualLookup} disabled={!manualUid.trim()} fullWidth>
            Get summary
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setMode("camera")}>
            Back to camera scan
          </Button>
        </Card>
      )}

      {mode === "result" && (
        <div className="flex flex-col gap-4">
          {lookupLoading && (
            <Card padding="lg">
              <LoadingSpinner label="Looking up customer..." size="sm" />
            </Card>
          )}

          {!lookupLoading && lookupError && (
            <Card padding="lg">
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {lookupError}
              </p>
            </Card>
          )}

          {/* {!lookupLoading && summary && (
            <Card padding="lg">
              {scannedUid && (
                <p className="mb-2 select-all break-all font-mono text-[11px] text-trackbite-gray-400">
                  {scannedUid}
                </p>
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-trackbite-green">
                Trackbite AI summary
              </p>
              <p className="mt-2 text-sm leading-relaxed text-trackbite-gray-800">{summary}</p>
            </Card>
          )} */}

                    {!lookupLoading && facts && (
            <Card padding="lg" className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-trackbite-gray-500">
                Customer profile
              </p>

              {facts.allergies.length > 0 && (
                <div>
                  <p className="text-xs text-trackbite-gray-500">Allergies</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {facts.allergies.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600"
                      >
                        {ALLERGY_LABELS[a as Allergy] ?? a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {facts.dietaryPreferences.length > 0 && (
                <div>
                  <p className="text-xs text-trackbite-gray-500">Dietary preferences</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {facts.dietaryPreferences.map((d) => (
                      <span
                        key={d}
                        className="rounded-md bg-trackbite-gray-100 px-2 py-1 text-xs font-medium text-trackbite-gray-700"
                      >
                        {DIETARY_LABELS[d as DietaryPreference] ?? d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

                            {facts.foodGoals.length > 0 && (
                <div>
                  <p className="text-xs text-trackbite-gray-500">Goals</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {facts.foodGoals.map((g) => (
                      <span
                        key={g}
                        className="rounded-md bg-trackbite-gray-100 px-2 py-1 text-xs font-medium text-trackbite-gray-700"
                      >
                        {FOOD_GOAL_LABELS[g as FoodGoal] ?? g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="flex gap-6 text-xs text-trackbite-gray-500">
                <span>{facts.mealsTracked} meals tracked</span>
                <span>Avg. cleared: {facts.averageClearedPercent}%</span>
                <span>
                  Usual portion:{" "}
                  {PORTION_LABELS[facts.mostCommonPortionSize as PortionPreference] ??
                    facts.mostCommonPortionSize}
                </span>
              </div> */}

                            <div>
                <p className="text-xs text-trackbite-gray-500">Preferred portion</p>
                <p className="mt-1 text-sm font-medium text-trackbite-gray-800">
                  {PORTION_LABELS[facts.portionPreference as PortionPreference] ??
                    facts.portionPreference}
                </p>
              </div>

              <div className="flex gap-6 text-xs text-trackbite-gray-500">
                <span>{facts.mealsTracked} meals tracked</span>
                {facts.mealsTracked > 0 && (
                  <>
                    <span>Avg. cleared: {facts.averageClearedPercent}%</span>
                    <span>
                      Usual portion (AI-observed):{" "}
                      {PORTION_LABELS[facts.mostCommonPortionSize as PortionPreference] ??
                        facts.mostCommonPortionSize}
                    </span>
                  </>
                )}
              </div>
            </Card>
          )}

          {!lookupLoading && wallet && (
            <Card padding="lg" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-trackbite-gray-400">
                    This restaurant&apos;s wallet
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-trackbite-gray-900">
                    {wallet.points} <span className="text-sm font-normal text-trackbite-gray-500">pts</span>
                  </p>
                  <p className="text-xs text-trackbite-gray-500">
                    {wallet.visits} visit{wallet.visits === 1 ? "" : "s"} so far · reward at{" "}
                    {wallet.rewardThreshold} pts
                  </p>
                </div>
              </div>

              {wallet.rewardReady && (
                <div className="flex flex-col gap-2 rounded-xl bg-trackbite-green-light px-3 py-3">
                  <p className="text-sm font-medium text-trackbite-green-darker">
                    🎉 Reward ready — {wallet.rewardName}!
                  </p>
                  <Button onClick={handleRedeem} isLoading={redeeming} size="sm">
                    Redeem now
                  </Button>
                  {redeemError && (
                    <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                      {redeemError}
                    </p>
                  )}
                </div>
              )}
              {justRedeemed && (
                <p className="rounded-xl bg-trackbite-green-light px-3 py-2 text-sm text-trackbite-green-darker">
                  Reward redeemed. Any extra points carried over.
                </p>
              )}
              {justAwarded && !wallet.rewardReady && (
                <p className="rounded-xl bg-trackbite-green-light px-3 py-2 text-sm text-trackbite-green-darker">
                  Points awarded.
                </p>
              )}

              {!wallet.rewardReady && (
                <div className="flex items-end gap-3">
                  <Input
                    label="Award points for this visit"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={awardAmount}
                    onChange={(e) => setAwardAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAward} isLoading={awarding}>
                    Award
                  </Button>
                </div>
              )}
              {awardError && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                  {awardError}
                </p>
              )}
            </Card>
          )}

          <Button variant="outline" fullWidth onClick={handleScanAnother}>
            Scan another customer
          </Button>
        </div>
      )}
    </PageContainer>
  );
}