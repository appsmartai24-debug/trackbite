"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const DISMISS_KEY = "trackbite-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function InstallTrackbite() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    if (isIOS()) {
      setShowIOSInstructions(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setInstalled(true);
      setVisible(false);
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  if (installed || !visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-trackbite-gray-200 bg-white p-5 shadow-lg sm:bottom-6 sm:left-auto sm:right-6"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          📱
        </span>
        <div className="flex-1">
          <h2 id="install-title" className="font-bold text-trackbite-gray-900">
            Install Trackbite
          </h2>
          <p className="mt-1 text-sm text-trackbite-gray-600">
            {showIOSInstructions
              ? "Add Trackbite to your home screen for quick and easy access."
              : "Add Trackbite to your home screen for quick and easy access."}
          </p>

          {showIOSInstructions && (
            <ol className="mt-3 space-y-1 text-sm text-trackbite-gray-600 list-decimal list-inside">
              <li>Tap the Share button in Safari</li>
              <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
              <li>Tap &quot;Add&quot; to confirm</li>
            </ol>
          )}

          <div className="mt-4 flex items-center gap-3">
            {!showIOSInstructions && deferredPrompt && (
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm font-medium text-trackbite-gray-500 hover:text-trackbite-gray-800"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
