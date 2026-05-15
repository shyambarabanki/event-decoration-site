"use client";

import { useEffect } from "react";

function sendClientLog(payload) {
  try {
    const body = JSON.stringify({
      url: window.location.href,
      ...payload,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/log-error", blob);
      return;
    }

    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Avoid recursive logging failures in the global reporter.
  }
}

export function reportClientError(source, error, metadata = {}) {
  sendClientLog({
    source,
    message: error?.message || String(error),
    stack: error?.stack || "",
    metadata,
  });
}

export default function ErrorReporter() {
  useEffect(() => {
    const handleError = (event) => {
      sendClientLog({
        source: "window.error",
        message: event.message || "Unhandled client error",
        stack: event.error?.stack || "",
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleRejection = (event) => {
      const reason = event.reason;
      sendClientLog({
        source: "window.unhandledrejection",
        message: reason?.message || String(reason || "Unhandled promise rejection"),
        stack: reason?.stack || "",
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

