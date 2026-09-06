import { VOUCHER_LOGOS } from '../assets/voucher-logos';

// Brand hues drive the storefront's gradients and row tints — there is no
// licensed artwork, so colour is what tells one brand from another.
export const BRAND_ACCENTS = {
  'Netflix': '#E50914',
  'Prime Video': '#00A8E1',
  'YouTube Premium': '#FF0033',
  'Spotify': '#1DB954',
  'OneGames': '#7C4DFF',
};

export const vouchers = [
  { id: 'netflix-mobile-1m', brand: 'Netflix', logo: VOUCHER_LOGOS.netflix, product: 'Mobile plan · 1 month', price: 250, codeValidDays: 90, grants: '1 month', category: 'Streaming' },
  { id: 'netflix-basic-3m', brand: 'Netflix', logo: VOUCHER_LOGOS.netflix, product: 'Basic · 3 months', price: 1400, codeValidDays: 90, grants: '3 months', category: 'Streaming' },
  { id: 'prime-1m', brand: 'Prime Video', logo: VOUCHER_LOGOS.prime, product: '1 month', price: 150, codeValidDays: 60, grants: '1 month', category: 'Streaming' },
  { id: 'prime-12m', brand: 'Prime Video', logo: VOUCHER_LOGOS.prime, product: '12 months', price: 1499, codeValidDays: 90, grants: '12 months', category: 'Streaming' },
  { id: 'onegames-1m', brand: 'OneGames', logo: VOUCHER_LOGOS.onegames, product: '1 month', price: 199, codeValidDays: 30, grants: '1 month', category: 'Games' },
  { id: 'youtube-premium-1m', brand: 'YouTube Premium', logo: VOUCHER_LOGOS.youtube, product: '1 month', price: 180, codeValidDays: 60, grants: '1 month', category: 'Streaming' },
  { id: 'spotify-3m', brand: 'Spotify', logo: VOUCHER_LOGOS.spotify, product: 'Premium · 3 months', price: 350, codeValidDays: 90, grants: '3 months', category: 'Music' }
];

export const demoLocker = [
  // Unredeemed — code still live. Code-validity countdown is the primary clock.
  {
    id: 'own-1',
    productId: 'prime-1m',
    state: 'unredeemed',
    code: 'PRIME-X8Y2-9A4B',
    purchasedAt: '2026-08-16',
    codeExpiresAt: '2026-10-15',
    redeemedAt: null,
    packageExpiresAt: null,
  },
  // Redeemed — the clocks have swapped. Package validity is now primary.
  {
    id: 'own-2',
    productId: 'netflix-mobile-1m',
    state: 'redeemed',
    code: 'NFLX-M1-AB12',
    purchasedAt: '2026-08-16',
    codeExpiresAt: '2026-11-14',
    redeemedAt: '2026-08-18',
    packageExpiresAt: '2026-09-18',
  },
  // Expired unredeemed — paid, never used, code dead. The case that justifies
  // separating the two clocks at all.
  {
    id: 'own-3',
    productId: 'onegames-1m',
    state: 'expired',
    code: 'ONEG-EX-1234',
    purchasedAt: '2025-12-01',
    codeExpiresAt: '2025-12-31',
    redeemedAt: null,
    packageExpiresAt: null,
  },
];
