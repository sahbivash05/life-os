# Life OS

Life OS is a personal habit tracking and life management app.

## Run locally

```bash
npm install
npm run dev
```

## Features

- Dashboard analytics (daily/weekly/monthly scores, pending, streaks, trend)
- Today tracker (daily + negative habits)
- Weekly tracker
- Monthly tracker
- Goals (one-time)
- Reports (weekly + monthly) + GitHub-style heatmap
- Light/Dark/System theme with persistence
- LocalStorage persistence via a storage abstraction (no direct `localStorage` usage in components)

## Architecture

- Feature-first structure under `src/`
- Reusable services (`src/services/*`) + hooks (`src/hooks/*`)
- Pure “engine” utilities for scoring/streaks/reports

## Scripts

- `npm run dev`: start dev server
- `npm run build`: typecheck + production build
- `npm test`: run unit tests (Vitest)
