import { POSTERS } from '../assets/posters';

// Human title for each content poster — keeps card labels consistent across rails.
// Excludes the 3 banner-background assets (khan, mnemonic, takay18), which are
// used as campaign banners on themed blocks rather than as content thumbnails.
const LABELS = {
  undekhi: 'Undekhi',
  jazzCity: 'Jazz City',
  tides: 'Tides',
  valathu: 'Valathu Vashathe Kallany',
  feluda: 'Feluda',
  shaan: 'Shaan',
  golui: 'Golui',
  chokro2: 'Chokro 2',
  bh: 'BH',
  wn: 'WN',
  alt1: 'New Release',
  alt2: 'New Drama',
  alt3: 'Now Streaming',
  alt4: 'Exclusive Drop',
};

function card(key, overrides = {}) {
  return { id: `${key}-${overrides._i ?? 0}`, title: LABELS[key], poster: POSTERS[key], ...overrides };
}

export const homeRows = [
  {
    id: 'just-dropped',
    variant: 'portrait',
    title: 'Just Dropped 🧊',
    seeAll: true,
    items: [
      card('golui',   { _i: 1, platform: 'deepto',    chip: 'Exclusive', bottomLabel: 'New Drama' }),
      card('chokro2', { _i: 2, platform: 'hoichoi',   chip: 'Exclusive', bottomLabel: 'New Season' }),
      card('valathu', { _i: 3, platform: 'lionsgate', chip: 'Exclusive' }),
      card('bh',      { _i: 4, platform: 'chorki',    chip: 'Exclusive' }),
      card('wn',      { _i: 5, platform: 'iscreen',   chip: 'Exclusive' }),
    ],
  },
  {
    id: 'top-10-movies',
    variant: 'numbered',
    title: 'Top 10 Movies',
    seeAll: true,
    items: [
      card('tides',   { _i: 10 }),
      card('alt1',    { _i: 11 }),
      card('alt2',    { _i: 12 }),
      card('alt3',    { _i: 13 }),
      card('alt4',    { _i: 14 }),
      card('valathu', { _i: 15 }),
      card('bh',      { _i: 16 }),
      card('chokro2', { _i: 17 }),
      card('golui',   { _i: 18 }),
      card('wn',      { _i: 19 }),
    ],
  },
  {
    id: 'breaking-news',
    variant: 'landscape',
    title: 'Breaking News',
    seeAll: true,
    items: [
      { id: 'bn-1', title: 'Breaking News', poster: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'iscreen', overlay: 'BREAKING NEWS', timestamp: '09.00 AM | 22-04-2026' },
      { id: 'bn-2', title: 'Breaking News', poster: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'iscreen', overlay: 'BREAKING NEWS', timestamp: '07.00 AM | 22-04-2026' },
      { id: 'bn-3', title: 'Morning Bulletin', poster: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'deepto', overlay: 'সকালের ২১ এপ্রিল' },
      { id: 'bn-4', title: 'News Bulletin', poster: 'https://images.unsplash.com/photo-1531908482631-48ef745a859b?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'hoichoi', overlay: 'News Bulletin' },
    ],
  },
  {
    id: 'recommended',
    variant: 'landscape',
    title: 'Recommended For You',
    seeAll: false,
    items: [
      { id: 'rec-1', title: 'New Ad', poster: POSTERS.adLandscape, bottomLabel: 'Trailer' },
      { id: 'rec-2', title: 'Coming Soon', poster: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop', bottomLabel: 'Coming Soon' },
      { id: 'rec-3', title: 'Trailer', poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', bottomLabel: 'Trailer' },
    ],
  },
  {
    id: '18-takay',
    variant: 'themed',
    title: '18 Takay 18 Ti Bangla Movie',
    seeAll: true,
    bgImage: POSTERS.takay18,
    themeGradient: 'linear-gradient(180deg, #2d1659 0%, #1b0c3d 100%)',
    items: [
      card('alt1', { _i: 20, chip: 'Exclusive', platform: 'hoichoi' }),
      card('alt2', { _i: 21, chip: 'Exclusive' }),
      card('alt3', { _i: 22, chip: 'Exclusive' }),
      card('alt4', { _i: 23, chip: 'Exclusive' }),
    ],
  },
  {
    id: 'trending',
    variant: 'portrait',
    title: 'Trending 📈',
    seeAll: true,
    items: [
      card('feluda', { _i: 30, platform: 'sonyliv',   chip: 'Exclusive', bottomLabel: 'New Show' }),
      card('shaan',  { _i: 31, platform: 'chorki',    chip: 'Exclusive', bottomLabel: 'New Release' }),
      card('alt1',   { _i: 32, platform: 'lionsgate', chip: 'Exclusive' }),
      card('alt2',   { _i: 33, platform: 'hoichoi',   chip: 'Exclusive' }),
    ],
  },
  {
    id: 'king-dhallywood',
    variant: 'themed',
    title: 'King of Dhallywood',
    seeAll: true,
    bgImage: POSTERS.khan,
    themeGradient: 'linear-gradient(180deg, #1a0f2e 0%, #2a1240 100%)',
    items: [
      card('golui',   { _i: 40, platform: 'iscreen', chip: 'Exclusive' }),
      card('chokro2', { _i: 41, chip: 'Exclusive' }),
      card('valathu', { _i: 42, chip: 'Exclusive' }),
      card('bh',      { _i: 43, chip: 'Exclusive' }),
    ],
  },
  {
    id: 'live-tv',
    variant: 'circle',
    title: 'Live TV',
    seeAll: true,
    items: [
      { id: 'ch-i',      title: 'Channel I Live',   chip: 'Exclusive', logoBg: '#FFFFFF', logoText: 'CHANNEL\nLIVE', logoColor: '#D32F2F', logoFs: 10 },
      { id: 'deepto',    title: 'Deepto TV Live',   chip: 'Exclusive', logoBg: '#FFFFFF', logoText: 'দীপ্ত\nLIVE',   logoColor: '#E11D48', logoFs: 14 },
      { id: 'jazeera',   title: 'Al Jazeera',       chip: 'Exclusive', logoBg: '#FFFFFF', logoText: 'ALJAZEERA',     logoColor: '#C8A357', logoFs: 9 },
      { id: 'channel24', title: 'Channel 24',       chip: 'Exclusive', logoBg: '#FFFFFF', logoText: '24',            logoColor: '#E11D48', logoFs: 22 },
    ],
  },
  {
    id: 'unlimited',
    variant: 'circle',
    title: 'Unlimited Entertainment',
    seeAll: false,
    items: [
      { id: 'sonyliv',  title: 'SONY LIV', chip: 'Exclusive', logoBg: 'linear-gradient(135deg,#0ea5e9,#f59e0b)', logoText: 'SONY\nliv', logoColor: '#FFFFFF', logoFs: 14 },
      { id: 'chorki',   title: 'Chorki',   chip: 'Exclusive', logoBg: 'linear-gradient(135deg,#E11D48,#F08232)', logoText: 'C',          logoColor: '#FFFFFF', logoFs: 36 },
      { id: 'hoichoi',  title: 'hoichoi',  chip: 'Exclusive', logoBg: '#E11D48', logoText: 'hoichoi',            logoColor: '#FFFFFF', logoFs: 14 },
      { id: 'shemaroo', title: 'shemaroo', chip: 'Exclusive', logoBg: '#FFB800', logoText: 'shemaroo\nme',       logoColor: '#6E2E86', logoFs: 11 },
    ],
  },
  {
    id: 'ott-platforms',
    variant: 'ott-block',
    title: 'All OTT Platforms',
    platforms: [
      { id: 'sonyliv', name: 'SonyLiv', logoBg: '#000000', logoText: 'SONY\nliv', logoColor: '#FFFFFF', fs: 8 },
      { id: 'chorki',  name: 'Chorki',  logoBg: 'linear-gradient(135deg,#E11D48,#F08232)', logoText: 'C',    logoColor: '#FFFFFF', fs: 14 },
      { id: 'hoichoi', name: 'Hoichoi', logoBg: '#E11D48', logoText: 'h',  logoColor: '#FFFFFF', fs: 14 },
      { id: 'iscreen', name: 'iScreen', logoBg: '#BF1F2E', logoText: 'i',  logoColor: '#FFFFFF', fs: 14 },
    ],
    cards: [
      { id: 'ott-1', chip: 'Exclusive', landscape: POSTERS.adLandscape },
      { id: 'ott-2', landscape: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop' },
    ],
  },
  {
    id: 'coming-soon',
    variant: 'portrait',
    title: 'Coming Soon',
    seeAll: true,
    items: [
      card('feluda',   { _i: 50, platform: 'sonyliv', bottomLabel: 'Coming Soon' }),
      card('jazzCity', { _i: 51, platform: 'sonyliv' }),
      card('shaan',    { _i: 52, platform: 'chorki',  bottomLabel: 'Streaming Soon' }),
      card('undekhi',  { _i: 53, platform: 'sonyliv' }),
    ],
  },
];
