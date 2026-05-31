import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FUNNEL_STEPS = [
  "pageview",
  "scroll_deep",
  "click_buy",
  "checkout_open",
  "purchase",
  "lesson_start",
  "lesson_complete",
] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");
    const days = parseInt(searchParams.get("days") || "30");
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const baseWhere = {
      createdAt: { gte: since },
      ...(productId ? { productId } : {}),
    };

    // 1. Funnel step counts (unique visitors per step)
    const funnelSteps: { step: string; uniqueVisitors: number; totalEvents: number }[] = [];

    for (const step of FUNNEL_STEPS) {
      const events = await prisma.analyticEvent.findMany({
        where: { ...baseWhere, eventType: step },
        select: { sessionId: true },
      });

      const uniqueVisitors = new Set(events.filter((e) => e.sessionId).map((e) => e.sessionId)).size;
      // Fallback: count events without sessionId as unique
      const noSessionCount = events.filter((e) => !e.sessionId).length;

      funnelSteps.push({
        step,
        uniqueVisitors: uniqueVisitors || noSessionCount,
        totalEvents: events.length,
      });
    }

    // 2. Drop-off rates between steps
    const dropoffs = funnelSteps.map((step, i) => {
      if (i === 0) return { step: step.step, dropoffRate: 0, conversionFromPrev: 100 };
      const prev = funnelSteps[i - 1].uniqueVisitors;
      const curr = step.uniqueVisitors;
      const dropoffRate = prev > 0 ? Math.round(((prev - curr) / prev) * 100) : 0;
      const conversionFromPrev = prev > 0 ? Math.round((curr / prev) * 100) : 0;
      return { step: step.step, dropoffRate, conversionFromPrev };
    });

    // 3. Top referrers
    const referrerEvents = await prisma.analyticEvent.findMany({
      where: { ...baseWhere, eventType: "pageview", sessionId: { not: null } },
      select: { metadata: true },
    });

    const referrerCounts: Record<string, number> = {};
    for (const e of referrerEvents) {
      try {
        const meta = JSON.parse(e.metadata || "{}");
        const ref = meta.referrer || "direct";
        const domain = ref ? new URL(ref).hostname : "direct";
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      } catch {
        referrerCounts["direct"] = (referrerCounts["direct"] || 0) + 1;
      }
    }

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // 4. UTM campaign performance
    const utmEvents = await prisma.analyticEvent.findMany({
      where: { ...baseWhere, eventType: "pageview", sessionId: { not: null } },
      select: { metadata: true, sessionId: true },
    });

    const campaignStats: Record<string, { visitors: Set<string>; purchases: number }> = {};
    for (const e of utmEvents) {
      try {
        const meta = JSON.parse(e.metadata || "{}");
        const campaign = meta.utm_campaign || "organic";
        if (!campaignStats[campaign]) campaignStats[campaign] = { visitors: new Set(), purchases: 0 };
        if (e.sessionId) campaignStats[campaign].visitors.add(e.sessionId);
      } catch { /* skip */ }
    }

    // Count purchases per campaign
    const purchaseEvents = await prisma.analyticEvent.findMany({
      where: { ...baseWhere, eventType: "purchase", sessionId: { not: null } },
      select: { metadata: true, sessionId: true },
    });

    for (const e of purchaseEvents) {
      try {
        const meta = JSON.parse(e.metadata || "{}");
        const campaign = meta.utm_campaign || "organic";
        if (!campaignStats[campaign]) campaignStats[campaign] = { visitors: new Set(), purchases: 0 };
        campaignStats[campaign].purchases++;
      } catch { /* skip */ }
    }

    const campaigns = Object.entries(campaignStats)
      .map(([name, stats]) => ({
        name,
        visitors: stats.visitors.size,
        purchases: stats.purchases,
        conversion: stats.visitors.size > 0 ? Math.round((stats.purchases / stats.visitors.size) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors);

    // 5. Visitor journey (last 20 unique sessions with their event sequence)
    const recentSessions = await prisma.analyticEvent.findMany({
      where: {
        ...baseWhere,
        sessionId: { not: null },
      },
      orderBy: { createdAt: "asc" },
      select: {
        sessionId: true,
        eventType: true,
        createdAt: true,
        metadata: true,
      },
      take: 500,
    });

    const sessionJourneys: Record<string, { events: string[]; firstSeen: Date; lastSeen: Date; converted: boolean }> = {};
    for (const e of recentSessions) {
      if (!e.sessionId) continue;
      if (!sessionJourneys[e.sessionId]) {
        sessionJourneys[e.sessionId] = {
          events: [],
          firstSeen: e.createdAt,
          lastSeen: e.createdAt,
          converted: false,
        };
      }
      const journey = sessionJourneys[e.sessionId];
      journey.events.push(e.eventType);
      journey.lastSeen = e.createdAt;
      if (e.eventType === "purchase") journey.converted = true;
    }

    const journeys = Object.entries(sessionJourneys)
      .map(([sid, j]) => ({ sessionId: sid, ...j }))
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
      .slice(0, 20);

    return NextResponse.json({
      funnelSteps,
      dropoffs,
      topReferrers,
      campaigns,
      journeys,
      summary: {
        totalVisitors: funnelSteps[0]?.uniqueVisitors || 0,
        totalPurchases: funnelSteps.find((s) => s.step === "purchase")?.uniqueVisitors || 0,
        overallConversion:
          funnelSteps[0]?.uniqueVisitors > 0
            ? Math.round(
                ((funnelSteps.find((s) => s.step === "purchase")?.uniqueVisitors || 0) /
                  funnelSteps[0].uniqueVisitors) *
                  100
              )
            : 0,
      },
    });
  } catch (error) {
    console.error("GET /api/analytics/funnel error:", error);
    return NextResponse.json({ error: "Failed to fetch funnel data" }, { status: 500 });
  }
}
