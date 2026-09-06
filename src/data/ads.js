import { POSTERS } from '../assets/posters';

// Mock ad catalogue. Cycled through by the player for demo.

export const inlineAds = [
  {
    id: 'inline-1',
    brand: 'Gadget Shali',
    headline: 'Monitor bar light · 6-month warranty',
    cta: 'Shop',
    image: POSTERS.adLandscape,
  },
  {
    id: 'inline-2',
    brand: 'Fenvo',
    headline: 'Best deal on sunglasses — only ৳1,270',
    cta: 'Order',
    image: POSTERS.adLandscape,
  },
  {
    id: 'inline-3',
    brand: "Gamer's Vault",
    headline: 'Bundle offer — choose any 2 from 4',
    cta: 'Buy',
    image: POSTERS.adLandscape,
  },
];

export const fullPageAds = [
  {
    id: 'fp-1',
    title: 'Why settle for one when you can have …',
    brand: "Gamer's Vault",
    verified: false,
    description: 'Bundle offer · Choose any 2 AAA titles · Only ৳1,690',
    cta: 'Send message',
    image: POSTERS.adLandscape,
    stats: { likes: '38', comments: '32', shares: '5', saves: '12' },
  },
  {
    id: 'fp-2',
    title: 'Protect Your Eyes While Working',
    brand: 'GadgetShali',
    verified: true,
    description: 'Touch control · Multiple color modes · Monitor bar light',
    cta: 'Shop now',
    image: POSTERS.adLandscape,
    stats: { likes: '181', comments: '23', shares: '18', saves: '91' },
  },
  {
    id: 'fp-3',
    title: 'Best Deal on Premium Sunglasses',
    brand: 'FENVO',
    verified: true,
    description: 'Only ৳1,270 · Free delivery nationwide',
    cta: 'Order now',
    image: POSTERS.adLandscape,
    stats: { likes: '934', comments: '37', shares: '24', saves: '166' },
  },
];
