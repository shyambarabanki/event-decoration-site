export const SESSION_COOKIE_NAME = "pb_guest_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

export function createSessionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
