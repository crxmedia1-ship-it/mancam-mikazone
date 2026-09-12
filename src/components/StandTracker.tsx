"use client";

import { useEffect } from "react";
import { trackStandEvent } from "@/app/actions/events";
import { getStandSessionId } from "@/lib/session";
import type { StandEventType } from "@/lib/events";

const VISIT_GUARD_KEY = "mancam-mikazone:last-visit";

export function recordStandEvent(
  eventType: Exclude<StandEventType, "visit">,
  productId?: string,
) {
  void trackStandEvent({
    eventType,
    sessionId: getStandSessionId(),
    productId,
  });
}

export function StandTracker() {
  useEffect(() => {
    try {
      const last = Number(window.sessionStorage.getItem(VISIT_GUARD_KEY) ?? 0);
      if (Date.now() - last < 4000) return;
      window.sessionStorage.setItem(VISIT_GUARD_KEY, String(Date.now()));
    } catch {
      // Private mode: still count the visit.
    }

    void trackStandEvent({
      eventType: "visit",
      sessionId: getStandSessionId(),
    });
  }, []);

  return null;
}
