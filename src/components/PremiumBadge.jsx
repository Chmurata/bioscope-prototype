/**
 * Premium crown badge — currently hidden across all surfaces.
 * Returning null keeps every existing callsite valid while removing
 * the visual without having to track each consumer.
 */
export function PremiumBadge() {
  return null;
}
