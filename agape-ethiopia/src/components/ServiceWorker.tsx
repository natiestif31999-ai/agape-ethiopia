"use client";

import { useEffect, useState } from "react";

export default function ServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none", // Always check for updates
          });

          console.log("✅ Service Worker registered:", registration.scope);
          setSwRegistration(registration);

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker available while old one is still active
                  console.log("🔄 Service Worker update available");
                  setUpdateAvailable(true);
                  
                  // Notify user about update (optional - can be silent)
                  notifyUpdateAvailable();
                }
              });
            }
          });

          // Periodically check for updates (every hour)
          const checkInterval = setInterval(() => {
            registration.update().catch((error) => {
              console.error("Error checking for SW updates:", error);
            });
          }, 60 * 60 * 1000); // 1 hour

          return () => clearInterval(checkInterval);
        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      };

      if (document.readyState === "complete") {
        registerServiceWorker();
      } else {
        window.addEventListener("load", registerServiceWorker);
        return () => {
          window.removeEventListener("load", registerServiceWorker);
        };
      }
    }
  }, []);

  const handleSkipWaiting = async () => {
    if (swRegistration?.waiting) {
      // Tell the service worker to skip waiting
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      
      // Reload page once the new SW takes control
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!reloaded) {
          reloaded = true;
          window.location.reload();
        }
      });
    }
  };

  const notifyUpdateAvailable = () => {
    // Show a subtle notification (can be replaced with a toast/modal)
    // This is a simple console log - in production you might use a toast library
    console.log("💡 An app update is available. Please refresh or click Update when ready.");
  };

  // Optional: Show update notification in UI
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 flex gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-lg">
        <span className="flex items-center text-sm font-medium">
          ✨ App update available
        </span>
        <button
          onClick={handleSkipWaiting}
          className="whitespace-nowrap rounded bg-white px-3 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          Update
        </button>
      </div>
    );
  }

  return null;
}
