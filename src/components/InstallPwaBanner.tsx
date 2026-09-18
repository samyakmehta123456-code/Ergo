"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.log("SW error:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To download as an app on your device:\n\n• iOS (Safari): Tap the Share button and select 'Add to Home Screen'\n• Android / Chrome: Tap the 3 dots menu and select 'Install app' or 'Add to Home Screen'");
    }
  };

  if (isStandalone || !showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 text-white px-4 py-3 shadow-lg flex items-center justify-between transition-all border-b border-emerald-500">
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
          <Smartphone className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">Mobile & Desktop App Ready</p>
          <p className="text-sm font-medium">Download TaskFlow App for fast offline access</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstallClick}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download App</span>
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 hover:bg-white/20 rounded-lg text-emerald-200 hover:text-white transition"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
