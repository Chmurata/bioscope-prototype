import { PAYMENT_LOGOS } from '../assets/payment-logos';

// Bangladesh MFS + card stack — matches Bioscope+ payment picker:
// bKash (highlighted default) · Rocket · Nagad · Other Cards & MFS · upay
export const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash',
    tileBg: '#FFFFFF',
    logo: PAYMENT_LOGOS.bkash,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    tileBg: '#FFFFFF',
    logo: PAYMENT_LOGOS.rocket,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    tileBg: '#FFFFFF',
    logo: PAYMENT_LOGOS.nagad,
  },
  {
    id: 'cards',
    name: 'Other Cards & MFS',
    tileBg: '#FFFFFF',
    logo: PAYMENT_LOGOS.visa,
  },
  {
    id: 'upay',
    name: 'upay',
    tileBg: '#FFFFFF',
    logo: PAYMENT_LOGOS.upay,
  },
];

// Collapsed-row preview logos shown on the checkout screen before expanding.
export const PAYMENT_PREVIEW = [
  { logo: PAYMENT_LOGOS.bkash,      bg: '#FFFFFF' },
  { logo: PAYMENT_LOGOS.nagad,      bg: '#FFFFFF' },
  { logo: PAYMENT_LOGOS.visa,       bg: '#FFFFFF' },
  { logo: PAYMENT_LOGOS.mastercard, bg: '#FFFFFF' },
  { logo: PAYMENT_LOGOS.amex,       bg: '#FFFFFF' },
];
