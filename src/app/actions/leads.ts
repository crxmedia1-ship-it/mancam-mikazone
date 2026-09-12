"use server";

import { saveLead } from "@/lib/save-lead";
import type { LeadInput, SubmitLeadResult } from "@/lib/lead";

export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  return saveLead(input);
}
