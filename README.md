# Chargenap Weather Dashboard

A clean, fast weather dashboard built with **Next.js 14 (App Router)**, **React**, and **TypeScript**. Powered by the free [Open-Meteo API](https://open-meteo.com/) — **no API key required**.

## Features

- 🔍 City search with autocomplete (geocoding)
- 🌡️ Current conditions card (temp, humidity, wind, precipitation)
- ⏱️ Hourly forecast for the next 24 hours
- 📅 7-day daily forecast
- 🌡️ °C / °F unit toggle (persisted in localStorage)
- 💾 Last selected city remembered across sessions
- ⚡ Client-side caching with 10-minute TTL (reduces API calls)
- 🌐 Loading and error states

## Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9 (or yarn / pnpm)

### Installation
```bash
git clone https://github.com/tharunshetty22-dotcom/Chargenap.git
cd Chargenap
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

No API key is required. See [`.env.example`](.env.example) for documentation on optional overrides.

Copy it if you plan to add secrets in future:
```bash
cp .env.example .env.local
```

## Deployment

### Vercel (recommended)
1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Keep all defaults (Next.js auto-detected).
4. Click **Deploy**.

### Netlify
```bash
npm run build
# Deploy the `.next` directory or use `next export` for static sites.
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "start"]
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| API | Open-Meteo (free, no key) |
| Caching | localStorage with TTL |
| Styling | CSS Modules / Global CSS |

## License

MIT