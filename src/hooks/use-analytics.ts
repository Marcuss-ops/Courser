"use client";

import { useEffect, useState } from "react";

export function useAnalytics(productId?: string) {
  const [stats, setStats] = useState<any>(null);

  async function track(eventType: string, metadata?: object) {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          productId,
          metadata: metadata || {},
        }),
      });
    } catch (e) {
      // Silently fail analytics
    }
  }

  function trackPageView() {
    track("pageview");
  }

  function trackClickBuy(extra?: object) {
    track("click_buy", extra);
  }

  function trackCheckoutStart(extra?: object) {
    track("checkout_start", extra);
  }

  function trackPurchase(amount?: number, extra?: object) {
    track("purchase", { amount, ...extra });
  }

  function trackLessonComplete(lessonId: string) {
    track("lesson_complete", { lessonId });
  }

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/analytics/dashboard?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [productId]);

  return { stats, track, trackPageView, trackClickBuy, trackCheckoutStart, trackPurchase, trackLessonComplete };
}
