"use client";

import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { AIBadge } from "@/components/customer/AIBadge";
import { ProgressBar } from "@/components/customer/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { logMeal, getRecentMeals } from "@/lib/customer/meals";
import { Meal } from "@/types";
import {
  CameraIcon,
  CheckIcon,
  CoinIcon,
  ImagePlusIcon,
  LeafIcon,
  RefreshIcon,
  SparkleIcon,
  XIcon,
} from "@/components/customer/icons";

type Step = "capture" | "analyzing" | "results";
type SlotKey = "before" | "after";

const ANALYSIS_STEPS = [
  "Detecting your plate",
  "Reading portion size",
  "Comparing before & after",
  "Estimating your impact",
];

// Ticks are driven by REAL progress from the server (see startAnalysis), with
// a gentle timer only for the middle steps while the model is thinking. The
// timer can never advance past SOFT_CAP, so the final steps only complete
// once the AI has actually answered — the checklist can't finish early.
const SOFT_STEP_MS = 2500;
const SOFT_CAP = ANALYSIS_STEPS.length - 2; // last soft-ticked index (step 3 stays "active")

// Reassure the user if the first model is slow.
const SLOW_HINT_DELAY_MS = 8000;
const BUSY_MESSAGE = "Our main AI is busy — switching to a backup model…";
const SLOW_MESSAGE = "Still working — this can take a few extra seconds.";

// Hard client-side ceiling. The server tries up to 3 models x 12s each, so this
// only fires if the connection itself is stuck. Nobody waits forever.
const OVERALL_TIMEOUT_MS = 50_000;

// Short, safe error codes the backend may return. Anything else (or raw
// provider/SDK text) is never shown to the user directly.
const ERROR_MESSAGES: Record<string, string> = {
  MISSING_IMAGES: "Please add both a before and after photo.",
  NOT_A_MEAL: "We couldn't spot the same meal in both photos. Try a clear, same-angle shot of your plate.",
  AI_UNAVAILABLE: "Our AI analyzer is very busy right now. Please try again in a minute.",
  SERVER_ERROR: "Something went wrong on our end. Please try again.",
  TOO_LARGE: "Your photos are too large. Try again — they're compressed automatically.",
  NETWORK_ERROR: "You appear to be offline. Check your connection and try again.",
  UNAUTHORIZED: "Your session expired. Please sign in again.",
};

function friendlyError(code?: string): string {
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  return "We couldn't analyze your meal. Please try again.";
}

type StreamEvent =
  | { type: "attempt"; model: string; index: number; total: number }
  | { type: "result"; data: MealResult }
  | { type: "error"; code: string };

interface MealResult {
  clearedPercent: number;
  portionSize: "small" | "medium" | "large";
  feedback: string;
  wasteAvoidedKg: number;
  points: number;
  confidence?: "low" | "medium" | "high";
  dishSummary?: string;
}

function PhotoSlot({
  label,
  hint,
  image,
  onCapture,
  onClear,
}: {
  label: string;
  hint: string;
  image: string | null;
  onCapture: () => void;
  onClear: () => void;
}) {
  if (image) {
    return (
      <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-trackbite-gray-200 shadow-sm sm:h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={`${label} photo of your meal`} className="h-full w-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
        <button
          type="button"
          onClick={onClear}
          aria-label={`Retake ${label.toLowerCase()} photo`}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onCapture}
      className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/60 text-trackbite-gray-400 transition-colors hover:border-trackbite-green/50 hover:bg-trackbite-green-muted hover:text-trackbite-green sm:h-48"
    >
      <ImagePlusIcon className="h-7 w-7" />
      <span className="text-sm font-medium text-trackbite-gray-700">{label}</span>
      <span className="px-4 text-center text-[11px] text-trackbite-gray-400">{hint}</span>
    </button>
  );
}

// Bottom-sheet style picker: lets the user choose between taking a new photo
// and uploading one from their library. On mobile, a file input with
// `capture` set jumps straight to the camera with no way to pick an existing
// photo, so we need two separate inputs and let the user choose.
function PhotoSourceSheet({
  label,
  onTakePhoto,
  onChooseFromLibrary,
  onDismiss,
}: {
  label: string;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${label.toLowerCase()} photo`}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-lg sm:rounded-2xl sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-3 text-center text-sm font-medium text-trackbite-gray-900">
          Add {label.toLowerCase()} photo
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onTakePhoto}
            className="flex items-center gap-3 rounded-xl border border-trackbite-gray-200 px-4 py-3 text-left text-sm font-medium text-trackbite-gray-800 transition-colors hover:bg-trackbite-gray-50"
          >
            <CameraIcon className="h-5 w-5 text-trackbite-green" />
            Take photo
          </button>
          <button
            type="button"
            onClick={onChooseFromLibrary}
            className="flex items-center gap-3 rounded-xl border border-trackbite-gray-200 px-4 py-3 text-left text-sm font-medium text-trackbite-gray-800 transition-colors hover:bg-trackbite-gray-50"
          >
            <ImagePlusIcon className="h-5 w-5 text-trackbite-green" />
            Choose from library
          </button>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 w-full rounded-xl py-2.5 text-center text-sm font-medium text-trackbite-gray-500 hover:text-trackbite-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CustomerTrackPage() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<Step>("capture");
  const [images, setImages] = useState<Record<SlotKey, string | null>>({ before: null, after: null });
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [result, setResult] = useState<MealResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);

  const beforeCameraRef = useRef<HTMLInputElement>(null);
  const afterCameraRef = useRef<HTMLInputElement>(null);
  const beforeLibraryRef = useRef<HTMLInputElement>(null);
  const afterLibraryRef = useRef<HTMLInputElement>(null);
  const cameraInputRefs = { before: beforeCameraRef, after: afterCameraRef };
  const libraryInputRefs = { before: beforeLibraryRef, after: afterLibraryRef };
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    return () => {
      // runIdRef is a plain counter (not a DOM ref), so reading .current here is intentional:
      // bumping it marks any in-flight analysis as stale so it can't update unmounted state.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      runIdRef.current++;
      abortRef.current?.abort();
      timers.current.forEach(clearTimeout);
      if (ticker.current) clearInterval(ticker.current);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    getRecentMeals(currentUser.uid, 3)
      .then((data) => {
        if (!cancelled) setRecentMeals(data);
      })
      .catch((err) => console.error("Failed to load recent meals", err))
      .finally(() => {
        if (!cancelled) setLoadingRecent(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser, justSaved]);

  function readFile(file: File, slot: SlotKey) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback: use the original (uncompressed) image if canvas isn't available
          setImages((prev) => ({ ...prev, [slot]: reader.result as string }));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setImages((prev) => ({ ...prev, [slot]: compressedDataUrl }));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(slot: SlotKey) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file, slot);
      e.target.value = "";
    };
  }

  function openPicker(slot: SlotKey) {
    setError(null);
    setPickerSlot(slot);
  }

  function closePicker() {
    setPickerSlot(null);
  }

  function handleTakePhoto() {
    const slot = pickerSlot;
    closePicker();
    if (slot) cameraInputRefs[slot].current?.click();
  }

  function handleChooseFromLibrary() {
    const slot = pickerSlot;
    closePicker();
    if (slot) libraryInputRefs[slot].current?.click();
  }

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
  }

  async function startAnalysis() {
    if (step === "analyzing" || !images.before || !images.after) return;

    clearTimers();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const runId = ++runIdRef.current;
    const isStale = () => runIdRef.current !== runId;

    setStep("analyzing");
    setAnalysisIndex(0);
    setStatusMessage(null);
    setError(null);

    // Safety nets: reassure when slow, and never wait forever.
    timers.current.push(
      setTimeout(() => setStatusMessage((m) => m ?? SLOW_MESSAGE), SLOW_HINT_DELAY_MS),
      setTimeout(() => controller.abort(), OVERALL_TIMEOUT_MS)
    );

    // Soft progress for the middle steps once the request has been accepted.
    // Capped, so it can never tick the final step before the AI answers.
    ticker.current = setInterval(() => {
      setAnalysisIndex((i) => (i >= 1 && i < SOFT_CAP ? i + 1 : i));
    }, SOFT_STEP_MS);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("UNAUTHORIZED");

      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ beforeImage: images.before, afterImage: images.after }),
      });

      if (!res.ok || !res.body) {
        let code: string | undefined;
        try {
          code = ((await res.json()) as { error?: string }).error;
        } catch {
          // non-JSON error body
        }
        throw new Error(code ?? (res.status === 413 ? "TOO_LARGE" : "SERVER_ERROR"));
      }

      // Read the server's progress events as they arrive.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let final: MealResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newline: number;
        while ((newline = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          if (!line) continue;

          const event = JSON.parse(line) as StreamEvent;
          if (isStale()) return;

          if (event.type === "attempt") {
            // Server has our photos and a model is working on them.
            setAnalysisIndex((i) => Math.max(i, 1));
            if (event.index > 0) setStatusMessage(BUSY_MESSAGE);
          } else if (event.type === "result") {
            final = event.data;
          } else if (event.type === "error") {
            throw new Error(event.code);
          }
        }
      }

      if (isStale()) return;
      if (!final) throw new Error("SERVER_ERROR");

      // The AI has really finished — now (and only now) complete the last steps.
      clearTimers();
      setStatusMessage(null);
      setAnalysisIndex(ANALYSIS_STEPS.length - 1);
      timers.current.push(
        setTimeout(() => setAnalysisIndex(ANALYSIS_STEPS.length), 350),
        setTimeout(() => {
          setResult(final);
          setStep("results");
        }, 800)
      );
    } catch (err) {
      if (isStale()) return; // user reset or left the page
      clearTimers();
      setStatusMessage(null);

      let code: string | undefined;
      if (err instanceof DOMException && err.name === "AbortError") code = "AI_UNAVAILABLE"; // overall timeout
      else if (err instanceof TypeError) code = "NETWORK_ERROR"; // fetch failed (offline, DNS, ...)
      else if (err instanceof Error) code = err.message;

      setError(friendlyError(code));
      setStep("capture"); // photos are kept, so the user can just tap Analyze again
    }
  }

  function reset() {
    runIdRef.current++;
    abortRef.current?.abort();
    clearTimers();
    setImages({ before: null, after: null });
    setStep("capture");
    setAnalysisIndex(0);
    setStatusMessage(null);
    setJustSaved(false);
    setResult(null);
  }

  async function saveMeal() {
    if (!result || !currentUser) return;
    setSaving(true);
    setError(null);
    try {
      await logMeal({
        uid: currentUser.uid,
        clearedPercent: result.clearedPercent,
        portionSize: result.portionSize,
        notes: result.feedback,
      });
      setJustSaved(true);
      const t = setTimeout(reset, 1400);
      timers.current.push(t);
    } catch (err) {
      console.error("saveMeal failed", err);
      setError("Couldn't save this meal. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const bothCaptured = Boolean(images.before && images.after);
  const pickerLabel = pickerSlot === "before" ? "Before" : pickerSlot === "after" ? "After" : "";

  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <input
        ref={beforeCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange("before")}
      />
      <input
        ref={beforeLibraryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange("before")}
      />
      <input
        ref={afterCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange("after")}
      />
      <input
        ref={afterLibraryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange("after")}
      />

      {pickerSlot && (
        <PhotoSourceSheet
          label={pickerLabel}
          onTakePhoto={handleTakePhoto}
          onChooseFromLibrary={handleChooseFromLibrary}
          onDismiss={closePicker}
        />
      )}

      <div>
        <h1 className="text-2xl font-medium text-trackbite-gray-900">Track a meal</h1>
        <p className="mt-1 text-sm text-trackbite-gray-500">
          Snap a before and after photo — Trackbite AI reads the rest.
        </p>
      </div>

      {step === "capture" && (
        <div className="animate-tb-fade-up mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <PhotoSlot
              label="Before"
              hint="Full plate, straight on"
              image={images.before}
              onCapture={() => openPicker("before")}
              onClear={() => setImages((p) => ({ ...p, before: null }))}
            />
            <PhotoSlot
              label="After"
              hint="Same angle, when you're done"
              image={images.after}
              onCapture={() => openPicker("after")}
              onClear={() => setImages((p) => ({ ...p, after: null }))}
            />
          </div>

          <p className="text-center text-xs text-trackbite-gray-400">
            Tip: keep the same angle for both photos so the model can compare them accurately.
          </p>

          <Button
            fullWidth
            size="lg"
            disabled={!bothCaptured}
            onClick={startAnalysis}
            className="gap-2"
          >
            <SparkleIcon className="h-4 w-4" />
            Analyze with Trackbite AI
          </Button>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">{error}</p>
          )}

          <RecentScans meals={recentMeals} loading={loadingRecent} />
        </div>
      )}

      {step === "analyzing" && (
        <div className="animate-tb-fade-up mt-6 flex flex-1 flex-col">
          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-trackbite-gray-200 shadow-sm sm:h-64">
            {images.after && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images.after} alt="Your meal, after" className="h-full w-full object-cover" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
            <div
              className="animate-tb-scan pointer-events-none absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-trackbite-green/35 to-transparent"
              aria-hidden="true"
            />
            <div
              className="animate-tb-scan pointer-events-none absolute inset-x-0 h-px bg-trackbite-green shadow-[0_0_12px_2px_rgba(22,163,74,0.6)]"
              aria-hidden="true"
            />
          </div>

          <div className="mt-5 flex justify-center">
            <AIBadge label="Trackbite AI is analyzing" size="md" />
          </div>

          <ul className="mx-auto mt-5 flex w-full max-w-xs flex-col gap-3">
            {ANALYSIS_STEPS.map((label, i) => {
              const done = i < analysisIndex;
              const active = i === analysisIndex;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white transition-colors",
                      done
                        ? "border-trackbite-green bg-trackbite-green"
                        : active
                          ? "border-trackbite-green"
                          : "border-trackbite-gray-200",
                    ].join(" ")}
                  >
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : active ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-trackbite-green border-t-transparent" />
                    ) : null}
                  </span>
                  <span
                    className={[
                      "text-sm transition-colors",
                      done || active ? "text-trackbite-gray-800" : "text-trackbite-gray-400",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p
            role="status"
            aria-live="polite"
            className="mx-auto mt-5 min-h-4 max-w-xs text-center text-xs text-trackbite-gray-400"
          >
            {statusMessage}
          </p>
        </div>
      )}

      {step === "results" && result && (
        <div className="animate-tb-fade-up mt-6 flex flex-1 flex-col gap-5">
          {justSaved ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-trackbite-green-light text-trackbite-green">
                <CheckIcon className="h-7 w-7" />
              </div>
              <p className="text-base font-medium text-trackbite-gray-900">Meal saved</p>
              <p className="text-sm text-trackbite-gray-500">+{result.points} points added to your wallet.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <AIBadge label="Analysis complete" />
                <span className="text-[11px] text-trackbite-gray-400">Just now</span>
              </div>

              {result.dishSummary && (
                <p className="text-base font-medium text-trackbite-gray-900">{result.dishSummary}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                {(["before", "after"] as SlotKey[]).map((slot) => (
                  <div key={slot} className="relative h-28 overflow-hidden rounded-xl border border-trackbite-gray-200 sm:h-32">
                    {images[slot] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[slot]!} alt={slot} className="h-full w-full object-cover" />
                    )}
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium capitalize text-white">
                      {slot}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-trackbite-gray-900">Plate cleared</p>
                  <p className="text-2xl font-semibold text-trackbite-green">{result.clearedPercent}%</p>
                </div>
                <ProgressBar value={result.clearedPercent} max={100} className="mt-3" />
                <div className="mt-2 flex justify-between text-[11px] text-trackbite-gray-400">
                  <span>Eaten {result.clearedPercent}%</span>
                  <span>Left on plate {100 - result.clearedPercent}%</span>
                </div>
                <p className="mt-4 border-t border-trackbite-gray-100 pt-4 text-sm leading-relaxed text-trackbite-gray-600">
                  {result.feedback}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-2xl border border-trackbite-gray-200 bg-white p-3.5 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trackbite-yellow-light text-trackbite-yellow-dark">
                    <CoinIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-trackbite-gray-900">+{result.points} pts</p>
                    <p className="text-[11px] text-trackbite-gray-500">Points earned</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-trackbite-gray-200 bg-white p-3.5 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trackbite-green-light text-trackbite-green">
                    <LeafIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-trackbite-gray-900">{result.wasteAvoidedKg} kg</p>
                    <p className="text-[11px] text-trackbite-gray-500">Waste avoided</p>
                  </div>
                </div>
              </div>

              {result.confidence === "low" && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
                  These photos were hard to compare, so this estimate may be less accurate. Same angle and good
                  light help next time.
                </p>
              )}

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">{error}</p>
              )}

              <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
                <Button fullWidth size="lg" onClick={saveMeal} disabled={saving}>
                  {saving ? "Saving..." : "Save meal"}
                </Button>
                <Button fullWidth size="lg" variant="outline" onClick={reset} className="gap-2" disabled={saving}>
                  <RefreshIcon className="h-4 w-4" />
                  Track another
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function timeAgo(ms: number): string {
  const diffMs = Date.now() - ms;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

function RecentScans({ meals, loading }: { meals: Meal[]; loading: boolean }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-trackbite-gray-900">Recent scans</h2>
      {loading ? (
        <p className="text-xs text-trackbite-gray-400">Loading...</p>
      ) : meals.length === 0 ? (
        <p className="text-xs text-trackbite-gray-400">No meals tracked yet — your first one will show up here.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center gap-3 rounded-2xl border border-trackbite-gray-200 bg-white p-3 shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-gray-50 text-trackbite-gray-400">
                <CameraIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize text-trackbite-gray-900">
                  {meal.portionSize} portion
                </p>
                <p className="text-[11px] text-trackbite-gray-400">{timeAgo(meal.createdAt)}</p>
              </div>
              <span className="shrink-0 rounded-full bg-trackbite-green-light px-2 py-1 text-[11px] font-semibold text-trackbite-green-darker">
                {meal.clearedPercent}%
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}