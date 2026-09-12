const SESSION_KEY = "mancam-mikazone:session-id";

export function getStandSessionId(): string {
  if (typeof window === "undefined") return "server";

  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return "ephemeral";
  }
}
