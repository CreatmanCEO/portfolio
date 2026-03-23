"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/creatsetup")) return;

    // Get or create session ID
    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("analytics_session_id", sessionId);
    }

    // Send tracking data
    const data = {
      path: pathname,
      referrer: document.referrer || null,
      sessionId,
    };

    // Use sendBeacon for reliability, fallback to fetch
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {}); // Silently fail
    }
  }, [pathname]); // Re-track on navigation

  return null; // Invisible component
}
