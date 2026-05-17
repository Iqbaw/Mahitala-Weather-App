import { Download, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const STORAGE_KEY = "mahitala-update-dismissed";
const DISMISS_DURATION = 24 * 60 * 60 * 1000;

function PwaHandler() {
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      console.log("Service Worker Registered");
    },
    onRegisterError(error) {
      console.error("SW registration error");
    },
    onNeedRefresh() {
      console.log("SW needs refresh - user will decide");
    },
    onOfflineReady() {
      console.log("App ready to work offline");
    },
  });

  const [showReloadPrompt, setShowReloadPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const dismissedData = localStorage.getItem(STORAGE_KEY);

    if (needRefresh) {
      if (dismissedData) {
        try {
          const { timestamp } = JSON.parse(dismissedData);
          const now = Date.now();

          if (now - timestamp > DISMISS_DURATION) {
            localStorage.removeItem(STORAGE_KEY);
            setShowReloadPrompt(true);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          setShowReloadPrompt(true);
        }
      } else {
        setShowReloadPrompt(true);
      }
    }
  }, [needRefresh]);

const handleReload = async () => {
  if (isUpdating) return;

  setIsUpdating(true);
  localStorage.removeItem(STORAGE_KEY);

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateServiceWorker(true);
    setShowReloadPrompt(false);
  } catch (error) {
    console.error("Update failed:", error);
    setIsUpdating(false);
  }
};

  const handleDismiss = () => {
    const dismissData = {
      timestamp: Date.now(),
      dismissed: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissData));
    setShowReloadPrompt(false);
  };

  // In PwaHandler.jsx
useEffect(() => {
  let timeoutId;

  if (needRefresh && showReloadPrompt) {
    timeoutId = setTimeout(() => {
      console.log("Auto dismissing update prompt");
      handleDismiss();
    }, 30000);
  }

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [needRefresh, showReloadPrompt]);

  if (!showReloadPrompt) return null;

  return (
    <div className="fixed bottom-0 md:right-4 w-full z-[9999] animate-in slide-in-from-bottom-4 duration-500 p-4 md:max-w-sm">
      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-2xl shadow-black/10 p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8"></div>

        <button
          onClick={handleDismiss}
          disabled={isUpdating}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group disabled:opacity-50 touch-manipulation"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          <div className="flex-1 pt-0.5 pr-6 sm:pr-0">
            <h3 className="text-gray-900 font-semibold text-sm mb-1">
              Pembaruan Tersedia
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Versi terbaru aplikasi dengan fitur dan perbaikan baru telah
              tersedia.
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleReload}
            disabled={isUpdating}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
          >
            {isUpdating ? (
              <span className="animate-spin">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isUpdating ? "Memperbarui..." : "Perbarui Sekarang"}
          </button>
          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="px-4 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 touch-manipulation min-h-[44px] sm:min-h-0"
          >
            Nanti
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20"></div>
      </div>
    </div>
  );
}

export default PwaHandler;
