// Bangladesh MFS + card stack — matches Bioscope+ payment picker:
// bKash (highlighted default) · Rocket · Nagad · Other Cards & MFS · upay
export const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash',
    tileBg: '#FFFFFF',
    wordmark: 'bKash',
    wordmarkColor: '#E2136B',
    wordmarkSize: 11,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    tileBg: '#FFFFFF',
    wordmark: 'ROCKET',
    wordmarkColor: '#8E2D91',
    wordmarkSize: 8,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    tileBg: '#FFFFFF',
    wordmark: 'নগদ',
    wordmarkColor: '#EC2031',
    wordmarkSize: 12,
  },
  {
    id: 'cards',
    name: 'Other Cards & MFS',
    tileBg: '#E5E7EB',
    wordmark: '▭',
    wordmarkColor: '#6B7280',
    wordmarkSize: 18,
  },
  {
    id: 'upay',
    name: 'upay',
    tileBg: '#FFFFFF',
    wordmark: 'upay',
    wordmarkColor: '#F5B71B',
    wordmarkSize: 11,
  },
];

// Collapsed-row preview logos shown on the checkout screen before expanding.
export const PAYMENT_PREVIEW = [
  { wordmark: 'bKash',    color: '#E2136B', bg: '#FFFFFF', size: 8 },
  { wordmark: 'নগদ',      color: '#EC2031', bg: '#FFFFFF', size: 9 },
  { wordmark: 'VISA',     color: '#1A1F71', bg: '#FFFFFF', size: 9 },
  { wordmark: 'MC',       color: '#EB001B', bg: '#FFFFFF', size: 9 },
  { wordmark: 'AMEX',     color: '#006FCF', bg: '#FFFFFF', size: 7 },
];
