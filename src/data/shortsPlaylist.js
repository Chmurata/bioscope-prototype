import { shorts } from './shorts';
import { dramas } from './dramas';

// Interleaves Shorts with Microdrama teases. Every Nth slot becomes a
// microdrama-tease item; tease cycles through a few dramas so the user sees
// variety. Returns an array of items shaped like:
//   { kind: 'short',      short: <shorts[i]> }
//   { kind: 'microdrama', drama: <dramas[i]>, episode: <number> }
export function buildShortsPlaylist({ teaseEvery = 3 } = {}) {
  const teaseDramas = dramas.slice(0, 6); // first 6 dramas rotate as teases
  const out = [];
  let si = 0;
  let di = 0;
  // Walk shorts; after every (teaseEvery - 1) shorts, drop a microdrama tease
  while (si < shorts.length) {
    out.push({ kind: 'short', id: `pl-short-${si}`, short: shorts[si] });
    si += 1;
    if (si % (teaseEvery - 1) === 0 && si < shorts.length) {
      const drama = teaseDramas[di % teaseDramas.length];
      di += 1;
      out.push({
        kind: 'microdrama',
        id: `pl-md-${drama.id}-${di}`,
        drama,
        episode: drama.currentEpisode || 1,
      });
    }
  }
  return out;
}
