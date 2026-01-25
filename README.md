# Network State Atlas

An interactive map and directory of network states, charter cities, intentional communities, and other emerging communities around the world.

## Tech Stack

- SvelteKit 2 / Svelte 5
- Leaflet with marker clustering
- TypeScript

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data

Community data lives in `src/lib/data/communities.json`. Each community includes location coordinates, category, status, and links.
