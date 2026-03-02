"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showEveryTime, setShowEveryTime] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem("aiAnalystWelcomeSeen");
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (!showEveryTime) {
      localStorage.setItem("aiAnalystWelcomeSeen", "true");
    } else {
      localStorage.removeItem("aiAnalystWelcomeSeen");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {t("aiAnalyst.welcome.title")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              {t("aiAnalyst.welcome.subtitle")}
            </p>
          </div>

          {/* How to use */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {t("aiAnalyst.welcome.howTo")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📁</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.step1")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✏️</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.step2")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌐</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.step3")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.step4")}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {t("aiAnalyst.welcome.features")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.feature1")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.feature2")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.feature3")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.feature4")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {t("aiAnalyst.welcome.feature5")}
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEveryTime}
                onChange={(e) => setShowEveryTime(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
              />
              <span className="text-zinc-700 dark:text-zinc-300">
                {t("aiAnalyst.welcome.showEveryTime")}
              </span>
            </label>
          </div>

          {/* Action button */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {t("aiAnalyst.welcome.gotIt")}
          </button>
        </div>
      </div>
    </div>
  );
}
