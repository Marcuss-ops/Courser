"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  productSlug: string;
}

export function usePageViewTracking(productSlug: string) {
  useEffect(() => {
    if (!productSlug) return;
    // Track pageview on mount
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "pageview",
        productId: productSlug,
        metadata: { url: window.location.href, referrer: document.referrer },
      }),
    }).catch(() => {});
  }, [productSlug]);
}

export function trackClickBuy(productSlug: string, extra?: Record<string, unknown>) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "click_buy",
      productId: productSlug,
      metadata: { ...extra, url: window.location.href },
    }),
  }).catch(() => {});
}

export function trackLessonComplete(productSlug: string, lessonId: string) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "lesson_complete",
      productId: productSlug,
      metadata: { lessonId },
    }),
  }).catch(() => {});
}

// Invisible component that tracks pageview on mount
export function AnalyticsTracker({ productSlug }: AnalyticsTrackerProps) {
  usePageViewTracking(productSlug);
  return null;
}
