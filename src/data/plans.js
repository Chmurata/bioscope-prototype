import { dramas } from './dramas';

// Real OTT tile palette — matches the wordmark styling in the Bioscope+ checkout cards.
// Each brand renders as a rounded square tile with its authentic brand color + wordmark text.
// We stylize the wordmark in CSS since we don't have the PNG logos extracted.
export const OTT_BRANDS = {
  lionsgate: { name: 'Lionsgate Play', text: 'LIONSGATE PLAY', bg: '#000000', color: '#F5C518', fs: 6,  weight: 900 },
  iscreen:   { name: 'iscreen',        text: 'i',              bg: '#BF1F2E', color: '#FFFFFF', fs: 22, weight: 900 },
  sonyLiv:   { name: 'Sony LIV',       text: 'SONY\nliv',      bg: '#000000', color: '#FFFFFF', fs: 8,  weight: 900 },
  chorki:    { name: 'Chorki',         text: 'C',              bg: 'linear-gradient(135deg,#F08232 0%,#E11D48 100%)', color: '#FFFFFF', fs: 20, weight: 900 },
  hoichoi:   { name: 'hoichoi',        text: 'hoichoi',        bg: '#E11D48', color: '#FFFFFF', fs: 9,  weight: 700 },
  shemaroo:  { name: 'shemaroo me',    text: 'shemaroo\nme',   bg: '#FFB800', color: '#6E2E86', fs: 7,  weight: 900 },
  epicOn:    { name: 'EPIC ON',        text: 'EPIC ON',        bg: '#000000', color: '#FFFFFF', fs: 7,  weight: 900, border: '#FFC629' },
  bongo:     { name: 'Bongo',          text: 'B',              bg: '#6E0A10', color: '#FFFFFF', fs: 22, weight: 900, italic: true },
  deepto:    { name: 'Deepto Play',    text: 'দীপ্ত',            bg: '#0F1623', color: '#00BBFF', fs: 14, weight: 700, border: '#00BBFF' },
  klikk:     { name: 'Klikk',          text: 'K',              bg: '#F2F2F2', color: '#E11D48', fs: 22, weight: 900 },
  iscreenAlt:{ name: 'iscreen',        text: 'i',              bg: '#E11D48', color: '#FFFFFF', fs: 22, weight: 900 },
};

// Plans mirror the Bioscope+ production flow — Super (featured navy) + Bangla (neutral grey).
// Each plan carries: title, optional floating badge, clock duration, price, "Get N Subscriptions in 1 Pack!" subtitle,
// 3 poster thumbnails sourced from `dramas`, and a list of OTT brand keys.
export const PLANS = [
  {
    id: 'super',
    title: 'Bioscope+ Super',
    badge: 'Recommended for All',
    duration: '1 month',
    subtitle: 'Get 10 Subscriptions in 1 Pack!',
    price: 299,
    variant: 'primary',
    posters: [dramas[0]?.poster, dramas[1]?.poster, dramas[2]?.poster].filter(Boolean),
    ottBrands: ['lionsgate','iscreen','sonyLiv','chorki','hoichoi','shemaroo','epicOn','bongo','deepto','klikk','iscreenAlt'],
  },
  {
    id: 'bangla',
    title: 'Bioscope+ Bangla',
    badge: null,
    duration: '1 month',
    subtitle: 'Get subscriptions to Hoichoi, DeeptoPlay & Iscreen — All in one pack',
    price: 109,
    variant: 'neutral',
    posters: [dramas[3]?.poster, dramas[4]?.poster].filter(Boolean),
    ottBrands: ['iscreen','hoichoi','deepto'],
  },
  {
    id: 'weekly',
    title: 'Bioscope+ Weekly',
    badge: 'Best for New Users',
    duration: '1 week',
    subtitle: 'Get 10 Subscriptions in 1 Pack!',
    price: 79,
    variant: 'neutral',
    posters: [dramas[5]?.poster, dramas[6]?.poster, dramas[7]?.poster].filter(Boolean),
    ottBrands: ['lionsgate','iscreen','sonyLiv','chorki','hoichoi','shemaroo','epicOn','bongo','deepto','klikk'],
  },
];

export const FLEXIPLAN = {
  title: 'Make your own plan',
  description: 'Make your custom plan in 2 simple steps',
  cta: 'Create Package',
};
