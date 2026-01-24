# Network State Atlas - Design Document

## Overview

A SvelteKit web application for discovering network states and adjacent communities. Users land on an interactive world map, explore communities by location and category, and find ways to get involved.

**Target users:**
- Curious explorers new to the network state concept
- Active participants looking to join or visit communities

## Core Architecture

```
/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Home: full-screen map
│   │   ├── +layout.svelte            # Shared nav, footer
│   │   ├── community/[slug]/
│   │   │   └── +page.svelte          # Individual community profile
│   │   ├── directory/
│   │   │   └── +page.svelte          # Filterable list view
│   │   └── about/
│   │       └── +page.svelte          # Context for newcomers
│   ├── lib/
│   │   ├── components/               # Map, CommunityCard, Filters, etc.
│   │   └── data/
│   │       └── communities.json      # All community data
│   └── app.css                       # Global styles
├── static/                           # Images, icons
└── svelte.config.js
```

Data flows from `communities.json` as the single source of truth. SvelteKit loads it at build time for static generation, providing fast page loads and good SEO. Each community gets its own URL for shareability and search indexing.

## Tech Stack

- **Framework:** SvelteKit
- **Map:** Leaflet + OpenStreetMap (open source, no API key needed)
- **Data:** Static JSON file in repository
- **Deployment:** Static adapter (Vercel, Netlify, or similar)

## Data Model

```json
{
  "slug": "cabin",
  "name": "Cabin",
  "category": "network-city",
  "tagline": "A decentralized city for online creators",
  "description": "Cabin is building a network of coliving neighborhoods...",
  "founded": 2021,
  "status": "active",
  "location": {
    "hasPhysical": true,
    "coordinates": [30.2672, -97.7431],
    "label": "Austin, TX (HQ) + distributed neighborhoods"
  },
  "focus": ["coliving", "creators", "nature"],
  "size": "1000+ members",
  "links": {
    "website": "https://cabin.city",
    "twitter": "https://twitter.com/cabindotcity",
    "discord": "https://discord.gg/cabin"
  },
  "joinInfo": "Apply through their website for citizenship or neighborhood stays",
  "lastUpdated": "2025-01-15"
}
```

**Categories:** `network-state`, `network-city`, `popup-city`, `charter-city`, `intentional-community`, `digital-community`, `special-economic-zone`

**Status:** `concept`, `forming`, `active`, `inactive`

Communities without physical locations set `hasPhysical: false` and omit coordinates.

## Map Interface (Home Page)

- Full-screen interactive map centered on world view
- Markers color-coded by category
- Clustered markers expand on zoom
- Clicking marker opens popup with: name, category badge, tagline, "View Profile" link

**Overlay controls:**
- Category filter toggles
- Status filter (active only vs. all)
- Search box for name filtering

**Persistent elements:**
- Header with logo and Directory link
- Collapsible legend showing category colors
- "About" link for newcomers

**Mobile:** Full-screen map with touch-friendly controls, bottom sheet for filters.

## Community Profile Page

Route: `/community/[slug]`

**Layout:**
- Hero: name, category badge, tagline, status indicator
- Embedded mini-map (if physical location)
- Description paragraph
- Details: focus areas, community size, location
- Get Involved section with joinInfo and CTA to website
- Social/external links
- Last updated timestamp

## Directory View

Route: `/directory`

- Filter bar: category, status, focus area dropdowns
- Search box for name filtering
- Grid of community cards showing: name, category, tagline, location, focus tags
- Sorting: alphabetical, recently updated, founding year
- Filters sync with map view via URL params

## About Page

Route: `/about`

**Sections:**
- What is a Network State? (accessible explanation with links to deeper resources)
- The Ecosystem (explains categories and how they differ)
- How to Use This Atlas
- About This Project (maintainer info, contribution links)

## Future: Community Submissions

**Phase 1:** GitHub issue template for submissions, manual review and merge.

**Phase 2:** Form at `/submit` with moderation queue, no authentication needed.

## Out of Scope (MVP)

- User accounts/authentication
- Comments or reviews
- Events calendar
- Comparison tools
- Separate API layer
- Dark mode
- Internationalization
- Analytics dashboard (beyond simple Plausible/Fathom)

## Initial Dataset

Curate 15-30 communities across categories to seed launch. Potential sources:
- thenetworkstate.com dashboard
- Cabin's neighborhood directory
- Praxis, Prospera, Vitalia, Zuzalu documentation
- Community lists from blog posts and Twitter threads
