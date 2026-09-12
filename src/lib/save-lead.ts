import { getProductsByIds } from "@/data/products";
import {
  isLeadNetworkError,
  leadSchema,
  type SubmitLeadResult,
} from "@/lib/lead";
import { createSupabaseClient } from "@/lib/supabase";

function fieldErrorsFromIssues(
  issues: ReadonlyArray<{ path: readonly PropertyKey[]; message: string }>,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
}

function publicError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Could not save your request.";

  if (isLeadNetworkError(message) || /load failed|failed to fetch|networkerror|fetch/i.test(message)) {
    return "Could not reach the stand database.";
  }

  return message.replace(/^TypeError:\s*/i, "");
}

export async function saveLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFromIssues(parsed.error.issues),
    };
  }

  const lead = parsed.data;
  const selectedProducts = getProductsByIds(lead.productsOfInterest);

  if (selectedProducts.length !== lead.productsOfInterest.length) {
    return {
      ok: false,
      error: "One or more selected products are not in the catalog.",
      fieldErrors: {
        productsOfInterest: ["Select products from the current catalog."],
      },
    };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("leads").insert({
      full_name: lead.fullName,
      company_name: lead.companyName,
      email: lead.email.toLowerCase(),
      phone: lead.phone.replace(/\s+/g, " ").trim(),
      profile_type: lead.profileType || "other",
      products_of_interest: lead.productsOfInterest,
      purchase_volume: lead.purchaseVolume || "sample",
      primary_application: lead.primaryApplication || "other",
      source: "qr-stand",
    });

    if (error) {
      return {
        ok: false,
        error:
          publicError(error.message) ||
          "Could not save your request. We will keep it on this device.",
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: publicError(error) || "Could not reach the server.",
    };
  }
}
