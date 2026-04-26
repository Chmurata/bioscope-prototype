import { POSTERS } from '../assets/posters';
import { OTT_LOGOS } from '../assets/ott-logos';
import { LIVETV } from '../assets/livetv';
import { MICRODRAMA } from '../assets/microdrama';

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
      { id: 'bn-1', title: 'Breaking News',   poster: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'iscreen', overlay: 'BREAKING NEWS', timestamp: '09.00 AM | 22-04-2026' },
      { id: 'bn-2', title: 'Breaking News',   poster: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'iscreen', overlay: 'BREAKING NEWS', timestamp: '07.00 AM | 22-04-2026' },
      { id: 'bn-3', title: 'Morning Bulletin', poster: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800&h=450&fit=crop', chip: 'Exclusive', platform: 'deepto', overlay: 'সকালের ২১ এপ্রিল' },
    ],
  },
  {
    id: 'recommended',
    variant: 'landscape',
    title: 'Recommended For You',
    seeAll: false,
    items: [
      { id: 'rec-1', title: 'Coming Soon',   poster: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop', bottomLabel: 'Coming Soon' },
      { id: 'rec-2', title: 'Latest Trailer',poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', bottomLabel: 'Trailer' },
      { id: 'rec-3', title: 'Up Next',       poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop', bottomLabel: 'Trailer' },
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
      { id: 'channel-i',  title: 'Channel I',  chip: 'Exclusive', logo: LIVETV.channelI },
      { id: 'deepto-tv',  title: 'Deepto TV',  chip: 'Exclusive', logo: LIVETV.deeptoTv },
      { id: 'al-jazeera', title: 'Al Jazeera', chip: 'Exclusive', logo: LIVETV.alJazeera },
      { id: 'ary-news',   title: 'ARY News',   chip: 'Exclusive', logo: LIVETV.aryNews },
      { id: 'dw',         title: 'DW',         chip: 'Exclusive', logo: LIVETV.dw },
      { id: 'sitare',     title: 'Sitare',     chip: 'Exclusive', logo: LIVETV.sitare },
      { id: 'rongeen-tv', title: 'Rongeen TV',                    logo: LIVETV.rongeenTv },
      { id: 'akaash-atth',title: 'Akaash Aath',                   logo: LIVETV.akaashAtth },
      { id: 'cnbc',       title: 'CNBC',                          logo: LIVETV.cnbc },
      { id: 'bloomberg',  title: 'Bloomberg',                     logo: LIVETV.bloomberg },
      { id: 'srk-tv',     title: 'SRK TV',                        logo: LIVETV.srkTv },
      { id: 'dangal-tv',  title: 'Dangal TV',                     logo: LIVETV.dangalTv },
      { id: 'ndtv',       title: 'NDTV',                          logo: LIVETV.ndtv },
      { id: 'express',    title: 'Express Ent.',                  logo: LIVETV.expressEntertainment },
    ],
  },
  {
    id: 'unlimited',
    variant: 'circle',
    title: 'Unlimited Entertainment',
    seeAll: false,
    items: [
      { id: 'sonyliv',   title: 'SonyLiv',     chip: 'Exclusive', logo: OTT_LOGOS.sonyliv },
      { id: 'chorki',    title: 'Chorki',      chip: 'Exclusive', logo: OTT_LOGOS.chorki },
      { id: 'hoichoi',   title: 'Hoichoi',     chip: 'Exclusive', logo: OTT_LOGOS.hoichoi },
      { id: 'iscreen',   title: 'iScreen',     chip: 'Exclusive', logo: OTT_LOGOS.iscreen },
      { id: 'lionsgate', title: 'Lionsgate',   chip: 'Exclusive', logo: OTT_LOGOS.lionsgate },
      { id: 'epic-on',   title: 'Epic ON',                        logo: OTT_LOGOS.epicOn },
      { id: 'shemaroo',  title: 'Shemaroo',                       logo: OTT_LOGOS.shemaroo },
      { id: 'klikk',     title: 'Klikk',                          logo: OTT_LOGOS.klikk },
      { id: 'docubay',   title: 'Docubay',                        logo: OTT_LOGOS.docubay },
      { id: 'deepto',    title: 'Deepto',                         logo: OTT_LOGOS.deepto },
    ],
  },
  {
    id: 'ott-platforms',
    variant: 'ott-block',
    title: 'All OTT Platforms',
    platforms: [
      { id: 'sonyliv',   name: 'SonyLiv',   logo: OTT_LOGOS.sonyliv },
      { id: 'chorki',    name: 'Chorki',    logo: OTT_LOGOS.chorki },
      { id: 'hoichoi',   name: 'Hoichoi',   logo: OTT_LOGOS.hoichoi },
      { id: 'iscreen',   name: 'iScreen',   logo: OTT_LOGOS.iscreen },
      { id: 'lionsgate', name: 'Lionsgate', logo: OTT_LOGOS.lionsgate },
      { id: 'epic-on',   name: 'Epic ON',   logo: OTT_LOGOS.epicOn },
      { id: 'shemaroo',  name: 'Shemaroo',  logo: OTT_LOGOS.shemaroo },
      { id: 'klikk',     name: 'Klikk',     logo: OTT_LOGOS.klikk },
    ],
    cards: [
      { id: 'ott-1', chip: 'Exclusive', poster: MICRODRAMA.unoSir },
      { id: 'ott-2', chip: 'Exclusive', poster: MICRODRAMA.dostorkhanerIftar },
      { id: 'ott-3', chip: 'Exclusive', poster: MICRODRAMA.konoEkBosonto },
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
  {
    id: 'bangla-originals',
    variant: 'portrait',
    title: 'Bangla Originals',
    seeAll: true,
    items: [
      { id: 'bo-1', title: 'Kono Ek Bosonto Bikel', poster: MICRODRAMA.konoEkBosonto,   platform: 'iscreen', chip: 'Exclusive' },
      { id: 'bo-2', title: 'Dostorkhaner Iftar',     poster: MICRODRAMA.dostorkhanerIftar, platform: 'hoichoi', chip: 'Exclusive', bottomLabel: 'New Release' },
      { id: 'bo-3', title: 'Shohore Onek Rodh',      poster: MICRODRAMA.shohoreOnekRodh,    platform: 'chorki',  chip: 'Exclusive' },
      { id: 'bo-4', title: 'Uno Sir',                poster: MICRODRAMA.unoSir,             platform: 'deepto',  chip: 'Exclusive', bottomLabel: 'New Show' },
    ],
  },
];
