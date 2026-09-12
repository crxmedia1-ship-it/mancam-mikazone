"use server";

import {
  STAND_EVENT_TYPES,
  type StandEventType,
} from "@/lib/events";
import { createSupabaseClient } from "@/lib/supabase";

export async function trackStandEvent(input: {
  eventType: StandEventType;
  sessionId: string;
  productId?: string | null;
}): Promise<{ ok: boolean }> {
  if (!STAND_EVENT_TYPES.includes(input.eventType)) {
    return { ok: false };
  }

  const sessionId = input.sessionId.trim();
  if (sessionId.length < 4 || sessionId.length > 80) {
    return { ok: false };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("stand_events").insert({
      event_type: input.eventType,
      session_id: sessionId,
      product_id: input.productId || null,
      path: "/",
    });

    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
