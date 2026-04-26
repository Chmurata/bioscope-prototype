# Bioscope+ Prototype

Mobile-first interactive prototype of the Bioscope+ streaming app — built for design reviews and stakeholder demos.

## Stack

- **React 19** + **Vite 8** + **Tailwind CSS v4**
- **Framer Motion** for transitions, drag gestures, and the hero carousel
- **Lucide** icons
- Pure client-side; no backend.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev -- --host  # expose on LAN for phone testing
```

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # serve the production build locally
```

## Deploy

This project deploys cleanly to **Vercel** out of the box — see [`vercel.json`](./vercel.json) for the SPA rewrite rule that keeps deep links working on refresh.

```bash
# One-time: install Vercel CLI
npm i -g vercel

# Deploy
vercel
vercel --prod        # promote to production
```

Or connect the GitHub repo to Vercel via the dashboard — it auto-detects Vite.

## What's in here

- `src/screens/` — top-level screens: Home, Browse, Micro Drama, Player
- `src/components/home/` — home screen building blocks (HeroCarousel, PosterRail, ThemedBlock, etc.)
- `src/components/SubscribeSheet.jsx` — full 5-stage subscription flow (plans → checkout → payment → processing → success)
- `src/data/` — declarative fixtures for dramas, hero slides, home rows, plans, payment methods
- `src/assets/` — Bioscope brand assets, microdrama posters, Figma exports
