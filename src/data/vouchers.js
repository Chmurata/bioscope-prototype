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

// A voucher is a money instrument, not a subscription duration: the card
// carries a USD face value, and Bioscope charges the BDT equivalent. Update
// this one constant when the rate moves — never hardcode a second taka
// figure anywhere in a component.
export const USD_BDT = 122;

// Round to the nearest 10 so the storefront shows clean BDT numbers.
const bdt = (usd) => Math.round((usd * USD_BDT) / 10) * 10;

export const vouchers = [
  { id: 'netflix-5', brand: 'Netflix', logo: VOUCHER_LOGOS.netflix, faceValue: 5, price: bdt(5), codeValidDays: 90, category: 'Streaming' },
  { id: 'netflix-10', brand: 'Netflix', logo: VOUCHER_LOGOS.netflix, faceValue: 10, price: bdt(10), codeValidDays: 90, category: 'Streaming' },
  { id: 'netflix-25', brand: 'Netflix', logo: VOUCHER_LOGOS.netflix, faceValue: 25, price: bdt(25), codeValidDays: 90, category: 'Streaming' },
  { id: 'prime-5', brand: 'Prime Video', logo: VOUCHER_LOGOS.prime, faceValue: 5, price: bdt(5), codeValidDays: 90, category: 'Streaming' },
  { id: 'prime-10', brand: 'Prime Video', logo: VOUCHER_LOGOS.prime, faceValue: 10, price: bdt(10), codeValidDays: 90, category: 'Streaming' },
  { id: 'prime-20', brand: 'Prime Video', logo: VOUCHER_LOGOS.prime, faceValue: 20, price: bdt(20), codeValidDays: 90, category: 'Streaming' },
  { id: 'spotify-5', brand: 'Spotify', logo: VOUCHER_LOGOS.spotify, faceValue: 5, price: bdt(5), codeValidDays: 90, category: 'Music' },
  { id: 'spotify-10', brand: 'Spotify', logo: VOUCHER_LOGOS.spotify, faceValue: 10, price: bdt(10), codeValidDays: 90, category: 'Music' },
  { id: 'youtube-premium-5', brand: 'YouTube Premium', logo: VOUCHER_LOGOS.youtube, faceValue: 5, price: bdt(5), codeValidDays: 90, category: 'Streaming' },
  { id: 'youtube-premium-15', brand: 'YouTube Premium', logo: VOUCHER_LOGOS.youtube, faceValue: 15, price: bdt(15), codeValidDays: 90, category: 'Streaming' },
  { id: 'onegames-3', brand: 'OneGames', logo: VOUCHER_LOGOS.onegames, faceValue: 3, price: bdt(3), codeValidDays: 30, category: 'Games' },
  { id: 'onegames-10', brand: 'OneGames', logo: VOUCHER_LOGOS.onegames, faceValue: 10, price: bdt(10), codeValidDays: 30, category: 'Games' },
];

export const demoLocker = [
  // Unredeemed — code still live. Code-validity countdown is the primary clock.
  {
    id: 'own-1',
    productId: 'prime-5',
    state: 'unredeemed',
    code: 'PRIME-X8Y2-9A4B',
    purchasedAt: '2026-08-16',
    codeExpiresAt: '2026-10-15',
    redeemedAt: null,
  },
  // Redeemed — the credit has already landed on the brand's account.
  {
    id: 'own-2',
    productId: 'netflix-10',
    state: 'redeemed',
    code: 'NFLX-M1-AB12',
    purchasedAt: '2026-08-16',
    codeExpiresAt: '2026-11-14',
    redeemedAt: '2026-08-18',
  },
  // Expired unredeemed — paid, never used, code dead. The case that justifies
  // separating purchase and redemption at all.
  {
    id: 'own-3',
    productId: 'onegames-3',
    state: 'expired',
    code: 'ONEG-EX-1234',
    purchasedAt: '2025-12-01',
    codeExpiresAt: '2025-12-31',
    redeemedAt: null,
  },
];
