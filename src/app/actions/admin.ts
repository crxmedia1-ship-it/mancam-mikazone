"use server";

import { normalizeStandEvent, type StandEventRecord } from "@/lib/events";
import { normalizeLead, type LeadRecord } from "@/lib/lead";
import { createSupabaseClient } from "@/lib/supabase";

export type AdminDashboardData = {
  leads: LeadRecord[];
  events: StandEventRecord[];
};

function publicError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Could not load the stand panel.";

  if (/load failed|failed to fetch|networkerror|fetch/i.test(message)) {
    return "Could not reach the stand database. Tap Refresh.";
  }

  return message.replace(/^TypeError:\s*/i, "");
}

export async function loadAdminDashboard(): Promise<
  { ok: true; data: AdminDashboardData } | { ok: false; error: string }
> {
  try {
    const supabase = createSupabaseClient();
    const [leadsResult, eventsResult] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase
        .from("stand_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    if (leadsResult.error) {
      return { ok: false, error: publicError(leadsResult.error.message) };
    }
    if (eventsResult.error) {
      return { ok: false, error: publicError(eventsResult.error.message) };
    }

    return {
      ok: true,
      data: {
        leads: (leadsResult.data ?? [])
          .map((row) => normalizeLead(row as Record<string, unknown>))
          .filter((row): row is LeadRecord => row !== null),
        events: (eventsResult.data ?? [])
          .map((row) => normalizeStandEvent(row as Record<string, unknown>))
          .filter((row): row is StandEventRecord => row !== null),
      },
    };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

export async function updateLeadRating(
  leadId: string,
  rating: number | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("leads")
      .update({ rating })
      .eq("id", leadId);
    if (error) return { ok: false, error: publicError(error.message) };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

export async function updateLeadNotes(
  leadId: string,
  notes: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("leads").update({ notes }).eq("id", leadId);
    if (error) return { ok: false, error: publicError(error.message) };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}
