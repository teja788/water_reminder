/**
 * Monetization scaffold. Phase 1 ships fully free; when the one-time
 * "Pro" unlock is added, this flag becomes IAP-driven. Gate any future
 * pro feature by checking isProUnlocked() so the seam already exists.
 */
export function isProUnlocked(): boolean {
  return false;
}
