// "use client";

// import { useEffect, useRef, useState } from "react";
// import { PageContainer } from "@/components/layout/PageContainer";
// import { Button } from "@/components/ui/Button";
// import { AIBadge } from "@/components/customer/AIBadge";
// import { ProgressBar } from "@/components/customer/ProgressBar";
// import { useAuth } from "@/context/AuthContext";
// import { logMeal } from "@/lib/customer/meals";
// import { Meal } from "@/types";
// import {
//   CameraIcon,
//   CheckIcon,
//   CoinIcon,
//   ImagePlusIcon,
//   LeafIcon,
//   RefreshIcon,
//   SparkleIcon,
//   XIcon,
// } from "@/components/customer/icons";

// type Step = "capture" | "analyzing" | "results";
// type SlotKey = "before" | "after";

// const ANALYSIS_STEPS = [
//   "Detecting your plate",
//   "Reading portion size",
//   "Comparing before & after",
//   "Estimating your impact",
// ];

// interface MealResult {
//   clearedPercent: number;
//   portionSize: "small" | "medium" | "large";
//   feedback: string;
//   wasteAvoidedKg: number;
//   points: number;
// }

// function PhotoSlot({
//   label,
//   hint,
//   image,
//   onCapture,
//   onClear,
// }: {
//   label: string;
//   hint: string;
//   image: string | null;
//   onCapture: () => void;
//   onClear: () => void;
// }) {
//   if (image) {
//     return (
//       <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-trackbite-gray-200 shadow-sm sm:h-48">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img src={image} alt={`${label} photo of your meal`} className="h-full w-full object-cover" />
//         <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
//           {label}
//         </span>
//         <button
//           type="button"
//           onClick={onClear}
//           aria-label={`Retake ${label.toLowerCase()} photo`}
//           className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
//         >
//           <XIcon className="h-3.5 w-3.5" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       type="button"
//       onClick={onCapture}
//       className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-trackbite-gray-200 bg-trackbite-gray-50/60 text-trackbite-gray-400 transition-colors hover:border-trackbite-green/50 hover:bg-trackbite-green-muted hover:text-trackbite-green sm:h-48"
//     >
//       <ImagePlusIcon className="h-7 w-7" />
//       <span className="text-sm font-medium text-trackbite-gray-700">{label}</span>
//       <span className="px-4 text-center text-[11px] text-trackbite-gray-400">{hint}</span>
//     </button>
//   );
// }

// export default function CustomerTrackPage() {
//   const { currentUser } = useAuth();
//   const [step, setStep] = useState<Step>("capture");
//   const [images, setImages] = useState<Record<SlotKey, string | null>>({ before: null, after: null });
//   const [analysisIndex, setAnalysisIndex] = useState(0);
//   const [justSaved, setJustSaved] = useState(false);
//   const [result, setResult] = useState<MealResult | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [recentMeals, setRecentMeals] = useState<Meal[]>([]);

//   const beforeInputRef = useRef<HTMLInputElement>(null);
//   const afterInputRef = useRef<HTMLInputElement>(null);
//   const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

//   useEffect(() => {
//     return () => {
//       timers.current.forEach(clearTimeout);
//     };
//   }, []);

   

//   function readFile(file: File, slot: SlotKey) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImages((prev) => ({ ...prev, [slot]: reader.result as string }));
//     };
//     reader.readAsDataURL(file);
//   }

//   function handleFileChange(slot: SlotKey) {
//     return (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) readFile(file, slot);
//       e.target.value = "";
//     };
//   }

//   async function startAnalysis() {
//     setStep("analyzing");
//     setAnalysisIndex(0);
//     setError(null);

//     // Drives the step-by-step visual ticker while the real request runs.
//     ANALYSIS_STEPS.forEach((_, i) => {
//       const t = setTimeout(() => setAnalysisIndex(i + 1), 650 * (i + 1));
//       timers.current.push(t);
//     });

//     try {
//       const res = await fetch("/api/analyze-meal", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({ beforeImage: images.before, afterImage: images.after }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error ?? "Analysis failed");
//       }

//       // Make sure the ticker has had time to visually finish before showing results.
//       const minWait = 650 * ANALYSIS_STEPS.length + 450;
//       const wait = setTimeout(() => {
//         setResult(data as MealResult);
//         setStep("results");
//       }, minWait);
//       timers.current.push(wait);
//     } catch (err) {
//       timers.current.forEach(clearTimeout);
//       setError(err instanceof Error ? err.message : "Something went wrong analyzing your meal.");
//       setStep("capture");
//     }
//   }

//   function reset() {
//     timers.current.forEach(clearTimeout);
//     timers.current = [];
//     setImages({ before: null, after: null });
//     setStep("capture");
//     setAnalysisIndex(0);
//     setJustSaved(false);
//     setResult(null);
//   }

//   async function saveMeal() {
//     if (!result || !currentUser) return;
//     setSaving(true);
//     setError(null);
//     try {
//       await logMeal({
//         uid: currentUser.uid,
//         clearedPercent: result.clearedPercent,
//         portionSize: result.portionSize,
//         notes: result.feedback,
//       });
//       setJustSaved(true);
//       const t = setTimeout(reset, 1400);
//       timers.current.push(t);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Couldn't save this meal. Try again.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const bothCaptured = Boolean(images.before && images.after);

//   return (
//     <PageContainer size="md" className="flex flex-1 flex-col">
//       <input
//         ref={beforeInputRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         className="hidden"
//         onChange={handleFileChange("before")}
//       />
//       <input
//         ref={afterInputRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         className="hidden"
//         onChange={handleFileChange("after")}
//       />

//       <div>
//         <h1 className="text-2xl font-medium text-trackbite-gray-900">Track a meal</h1>
//         <p className="mt-1 text-sm text-trackbite-gray-500">
//           Snap a before and after photo — Trackbite AI reads the rest.
//         </p>
//       </div>

//       {step === "capture" && (
//         <div className="animate-tb-fade-up mt-6 flex flex-col gap-6">
//           <div className="grid grid-cols-2 gap-3 sm:gap-4">
//             <PhotoSlot
//               label="Before"
//               hint="Full plate, straight on"
//               image={images.before}
//               onCapture={() => beforeInputRef.current?.click()}
//               onClear={() => setImages((p) => ({ ...p, before: null }))}
//             />
//             <PhotoSlot
//               label="After"
//               hint="Same angle, when you're done"
//               image={images.after}
//               onCapture={() => afterInputRef.current?.click()}
//               onClear={() => setImages((p) => ({ ...p, after: null }))}
//             />
//           </div>

//           <p className="text-center text-xs text-trackbite-gray-400">
//             Tip: keep the same angle for both photos so the model can compare them accurately.
//           </p>

//           <Button
//             fullWidth
//             size="lg"
//             disabled={!bothCaptured}
//             onClick={startAnalysis}
//             className="gap-2"
//           >
//             <SparkleIcon className="h-4 w-4" />
//             Analyze with Trackbite AI
//           </Button>

//           {error && (
//             <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">{error}</p>
//           )}

//           <RecentScans />
//         </div>
//       )}

//       {step === "analyzing" && (
//         <div className="animate-tb-fade-up mt-6 flex flex-1 flex-col">
//           <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-trackbite-gray-200 shadow-sm sm:h-64">
//             {images.after && (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img src={images.after} alt="Your meal, after" className="h-full w-full object-cover" />
//             )}
//             <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
//             <div
//               className="animate-tb-scan pointer-events-none absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-trackbite-green/35 to-transparent"
//               aria-hidden="true"
//             />
//             <div
//               className="animate-tb-scan pointer-events-none absolute inset-x-0 h-px bg-trackbite-green shadow-[0_0_12px_2px_rgba(22,163,74,0.6)]"
//               aria-hidden="true"
//             />
//           </div>

//           <div className="mt-5 flex justify-center">
//             <AIBadge label="Trackbite AI is analyzing" size="md" />
//           </div>

//           <ul className="mx-auto mt-5 flex w-full max-w-xs flex-col gap-3">
//             {ANALYSIS_STEPS.map((label, i) => {
//               const done = i < analysisIndex;
//               const active = i === analysisIndex;
//               return (
//                 <li key={label} className="flex items-center gap-3">
//                   <span
//                     className={[
//                       "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white transition-colors",
//                       done
//                         ? "border-trackbite-green bg-trackbite-green"
//                         : active
//                           ? "border-trackbite-green"
//                           : "border-trackbite-gray-200",
//                     ].join(" ")}
//                   >
//                     {done ? (
//                       <CheckIcon className="h-3.5 w-3.5" />
//                     ) : active ? (
//                       <span className="h-3 w-3 animate-spin rounded-full border-2 border-trackbite-green border-t-transparent" />
//                     ) : null}
//                   </span>
//                   <span
//                     className={[
//                       "text-sm transition-colors",
//                       done || active ? "text-trackbite-gray-800" : "text-trackbite-gray-400",
//                     ].join(" ")}
//                   >
//                     {label}
//                   </span>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {step === "results" && result && (
//         <div className="animate-tb-fade-up mt-6 flex flex-1 flex-col gap-5">
//           {justSaved ? (
//             <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
//               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-trackbite-green-light text-trackbite-green">
//                 <CheckIcon className="h-7 w-7" />
//               </div>
//               <p className="text-base font-medium text-trackbite-gray-900">Meal saved</p>
//               <p className="text-sm text-trackbite-gray-500">+{result.points} points added to your wallet.</p>
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center justify-between">
//                 <AIBadge label="Analysis complete" />
//                 <span className="text-[11px] text-trackbite-gray-400">Just now</span>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 {(["before", "after"] as SlotKey[]).map((slot) => (
//                   <div key={slot} className="relative h-28 overflow-hidden rounded-xl border border-trackbite-gray-200 sm:h-32">
//                     {images[slot] && (
//                       // eslint-disable-next-line @next/next/no-img-element
//                       <img src={images[slot]!} alt={slot} className="h-full w-full object-cover" />
//                     )}
//                     <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium capitalize text-white">
//                       {slot}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="rounded-2xl border border-trackbite-gray-200 bg-white p-5 shadow-sm">
//                 <div className="flex items-baseline justify-between">
//                   <p className="text-sm font-medium text-trackbite-gray-900">Plate cleared</p>
//                   <p className="text-2xl font-semibold text-trackbite-green">{result.clearedPercent}%</p>
//                 </div>
//                 <ProgressBar value={result.clearedPercent} max={100} className="mt-3" />
//                 <div className="mt-2 flex justify-between text-[11px] text-trackbite-gray-400">
//                   <span>Eaten {result.clearedPercent}%</span>
//                   <span>Left on plate {100 - result.clearedPercent}%</span>
//                 </div>
//                 <p className="mt-4 border-t border-trackbite-gray-100 pt-4 text-sm leading-relaxed text-trackbite-gray-600">
//                   {result.feedback}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="flex items-center gap-2.5 rounded-2xl border border-trackbite-gray-200 bg-white p-3.5 shadow-sm">
//                   <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trackbite-yellow-light text-trackbite-yellow-dark">
//                     <CoinIcon className="h-4 w-4" />
//                   </span>
//                   <div>
//                     <p className="text-sm font-semibold text-trackbite-gray-900">+{result.points} pts</p>
//                     <p className="text-[11px] text-trackbite-gray-500">Points earned</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2.5 rounded-2xl border border-trackbite-gray-200 bg-white p-3.5 shadow-sm">
//                   <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trackbite-green-light text-trackbite-green">
//                     <LeafIcon className="h-4 w-4" />
//                   </span>
//                   <div>
//                     <p className="text-sm font-semibold text-trackbite-gray-900">{result.wasteAvoidedKg} kg</p>
//                     <p className="text-[11px] text-trackbite-gray-500">Waste avoided</p>
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">{error}</p>
//               )}

//               <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
//                 <Button fullWidth size="lg" onClick={saveMeal} disabled={saving}>
//                   {saving ? "Saving..." : "Save meal"}
//                 </Button>
//                 <Button fullWidth size="lg" variant="outline" onClick={reset} className="gap-2" disabled={saving}>
//                   <RefreshIcon className="h-4 w-4" />
//                   Track another
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </PageContainer>
//   );
// }

// const RECENT_SCANS = [
//   { id: "r1", name: "Grilled salmon bowl", when: "Today, 1:20 PM", cleared: 92 },
//   { id: "r2", name: "Chicken shawarma plate", when: "Yesterday, 8:05 PM", cleared: 78 },
// ];

// function RecentScans() {
//   return (
//     <section>
//       <h2 className="mb-3 text-sm font-semibold text-trackbite-gray-900">Recent scans</h2>
//       <div className="flex flex-col gap-2.5">
//         {RECENT_SCANS.map((scan) => (
//           <div
//             key={scan.id}
//             className="flex items-center gap-3 rounded-2xl border border-trackbite-gray-200 bg-white p-3 shadow-sm"
//           >
//             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trackbite-gray-50 text-trackbite-gray-400">
//               <CameraIcon className="h-4 w-4" />
//             </span>
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-medium text-trackbite-gray-900">{scan.name}</p>
//               <p className="text-[11px] text-trackbite-gray-400">{scan.when}</p>
//             </div>
//             <span className="shrink-0 rounded-full bg-trackbite-green-light px-2 py-1 text-[11px] font-semibold text-trackbite-green-darker">
//               {scan.cleared}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { AIBadge } from "@/components/customer/AIBadge";
import { ProgressBar } from "@/components/customer/ProgressBar";
import { useAuth } from "@/context/AuthContext";
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

interface MealResult {
  clearedPercent: number;
  portionSize: "small" | "medium" | "large";
  feedback: string;
  wasteAvoidedKg: number;
  points: number;
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

export default function CustomerTrackPage() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<Step>("capture");
  const [images, setImages] = useState<Record<SlotKey, string | null>>({ before: null, after: null });
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [result, setResult] = useState<MealResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
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

  // function readFile(file: File, slot: SlotKey) {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setImages((prev) => ({ ...prev, [slot]: reader.result as string }));
  //   };
  //   reader.readAsDataURL(file);
  // }
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

  async function startAnalysis() {
    setStep("analyzing");
    setAnalysisIndex(0);
    setError(null);

    // Drives the step-by-step visual ticker while the real request runs.
    ANALYSIS_STEPS.forEach((_, i) => {
      const t = setTimeout(() => setAnalysisIndex(i + 1), 650 * (i + 1));
      timers.current.push(t);
    });

    try {
      // const res = await fetch("/api/analyze-meal", {
      //   method: "POST",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify({ beforeImage: images.before, afterImage: images.after }),
      // });
      // const data = await res.json();

      // if (!res.ok) {
      //   throw new Error(data.error ?? "Analysis failed");
      // }
            const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ beforeImage: images.before, afterImage: images.after }),
      });

      let data: { error?: string } & Partial<MealResult>;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status === 413
            ? "Your photos are too large. Please try again they'll be compressed automatically."
            : `Server error (${res.status}). Please try again.`
        );
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      // Make sure the ticker has had time to visually finish before showing results.
      const minWait = 650 * ANALYSIS_STEPS.length + 450;
      const wait = setTimeout(() => {
        setResult(data as MealResult);
        setStep("results");
      }, minWait);
      timers.current.push(wait);
    } catch (err) {
      timers.current.forEach(clearTimeout);
      setError(err instanceof Error ? err.message : "Something went wrong analyzing your meal.");
      setStep("capture");
    }
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setImages({ before: null, after: null });
    setStep("capture");
    setAnalysisIndex(0);
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
      setError(err instanceof Error ? err.message : "Couldn't save this meal. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const bothCaptured = Boolean(images.before && images.after);

  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <input
        ref={beforeInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange("before")}
      />
      <input
        ref={afterInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange("after")}
      />

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
              onCapture={() => beforeInputRef.current?.click()}
              onClear={() => setImages((p) => ({ ...p, before: null }))}
            />
            <PhotoSlot
              label="After"
              hint="Same angle, when you're done"
              image={images.after}
              onCapture={() => afterInputRef.current?.click()}
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