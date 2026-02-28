"use client";

import { useEffect, useState } from "react";

export default function CookieAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowAlert(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowAlert(false);
  };

  const handleReject = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setShowAlert(false);
  };

  const handleSavePreferences = (preferences: {
    analytics: boolean;
    marketing: boolean;
  }) => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        ...preferences,
        timestamp: new Date().toISOString(),
      })
    );
    setShowAlert(false);
    setShowCustomize(false);
  };

  if (!showAlert) return null;

  if (showCustomize) {
    return <CustomizeModal onSave={handleSavePreferences} onClose={() => setShowCustomize(false)} />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface p-4 shadow-lg md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-base font-semibold">
              We value your privacy
            </h3>
            <p className="text-sm text-muted">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking
              &quot;Accept All&quot;, you consent to our use of cookies.{" "}
              <a
                href="/privacy"
                className="text-accent underline hover:no-underline"
              >
                Read our Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReject}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10"
            >
              Reject
            </button>
            <button
              onClick={() => setShowCustomize(true)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomizeModal({
  onSave,
  onClose,
}: {
  onSave: (preferences: { analytics: boolean; marketing: boolean }) => void;
  onClose: () => void;
}) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cookie Preferences</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Necessary Cookies */}
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold">
                Necessary Cookies
              </h4>
              <p className="text-xs text-muted">
                Essential for the website to function properly. Cannot be
                disabled.
              </p>
            </div>
            <div className="flex h-6 w-11 items-center rounded-full bg-accent">
              <div className="h-5 w-5 translate-x-6 rounded-full bg-white" />
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold">
                Analytics Cookies
              </h4>
              <p className="text-xs text-muted">
                Help us understand how visitors interact with the website.
              </p>
            </div>
            <button
              onClick={() => setAnalytics(!analytics)}
              className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                analytics ? "bg-accent" : "bg-border"
              }`}
              aria-label="Toggle analytics cookies"
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  analytics ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold">
                Marketing Cookies
              </h4>
              <p className="text-xs text-muted">
                Used to track visitors and display relevant ads.
              </p>
            </div>
            <button
              onClick={() => setMarketing(!marketing)}
              className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                marketing ? "bg-accent" : "bg-border"
              }`}
              aria-label="Toggle marketing cookies"
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  marketing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ analytics, marketing })}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </>
  );
}
