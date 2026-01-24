# Network State Atlas Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a map-first web application for discovering network states and adjacent communities.

**Architecture:** SvelteKit static site with Leaflet/OpenStreetMap map. Data stored in JSON, loaded at build time. Four routes: home (map), directory (list), community profiles, and about page.

**Tech Stack:** SvelteKit, Leaflet, leaflet.markercluster, TypeScript, adapter-static

---

## Task 1: Initialize SvelteKit Project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- Create: `src/app.html`, `src/app.css`

**Step 1: Create SvelteKit project**

Run:
```bash
cd /Users/zach/Repos/network-state-atlas/.worktrees/feature-mvp
npm create svelte@latest . -- --template skeleton --types typescript --no-add-ons
```

Select: Skeleton project, TypeScript, no additional options

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install leaflet leaflet.markercluster
npm install -D @types/leaflet @types/leaflet.markercluster @sveltejs/adapter-static
```

**Step 3: Configure static adapter**

Edit `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		})
	}
};

export default config;
```

**Step 4: Add prerender configuration**

Create `src/routes/+layout.ts`:
```typescript
export const prerender = true;
```

**Step 5: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Server starts at localhost:5173, shows welcome page

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize SvelteKit project with static adapter"
```

---

## Task 2: Create Data Model and Seed Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/data/communities.json`

**Step 1: Define TypeScript types**

Create `src/lib/types.ts`:
```typescript
export type CategoryType =
	| 'network-state'
	| 'network-city'
	| 'popup-city'
	| 'charter-city'
	| 'intentional-community'
	| 'digital-community'
	| 'special-economic-zone';

export type StatusType = 'concept' | 'forming' | 'active' | 'inactive';

export interface CommunityLocation {
	hasPhysical: boolean;
	coordinates?: [number, number]; // [lat, lng]
	label: string;
}

export interface CommunityLinks {
	website?: string;
	twitter?: string;
	discord?: string;
	telegram?: string;
	github?: string;
}

export interface Community {
	slug: string;
	name: string;
	category: CategoryType;
	tagline: string;
	description: string;
	founded: number;
	status: StatusType;
	location: CommunityLocation;
	focus: string[];
	size: string;
	links: CommunityLinks;
	joinInfo: string;
	lastUpdated: string;
}

export const CATEGORY_LABELS: Record<CategoryType, string> = {
	'network-state': 'Network State',
	'network-city': 'Network City',
	'popup-city': 'Popup City',
	'charter-city': 'Charter City',
	'intentional-community': 'Intentional Community',
	'digital-community': 'Digital Community',
	'special-economic-zone': 'Special Economic Zone'
};

export const CATEGORY_COLORS: Record<CategoryType, string> = {
	'network-state': '#3b82f6',
	'network-city': '#8b5cf6',
	'popup-city': '#f59e0b',
	'charter-city': '#10b981',
	'intentional-community': '#ec4899',
	'digital-community': '#6366f1',
	'special-economic-zone': '#14b8a6'
};

export const STATUS_LABELS: Record<StatusType, string> = {
	concept: 'Concept',
	forming: 'Forming',
	active: 'Active',
	inactive: 'Inactive'
};
```

**Step 2: Create seed data with 5 example communities**

Create `src/lib/data/communities.json`:
```json
[
	{
		"slug": "prospera",
		"name": "Próspera",
		"category": "charter-city",
		"tagline": "A startup city on the island of Roatán, Honduras",
		"description": "Próspera is a special economic zone and charter city project on the island of Roatán, Honduras. It operates under a special legal framework (ZEDE) that allows for alternative governance structures, attracting entrepreneurs and innovators seeking regulatory flexibility.",
		"founded": 2020,
		"status": "active",
		"location": {
			"hasPhysical": true,
			"coordinates": [16.3833, -86.4167],
			"label": "Roatán, Honduras"
		},
		"focus": ["governance", "entrepreneurship", "innovation"],
		"size": "100+ residents",
		"links": {
			"website": "https://prospera.hn",
			"twitter": "https://twitter.com/ProsperaGlobal"
		},
		"joinInfo": "Apply for residency or e-residency through their website. Visit for tours and events.",
		"lastUpdated": "2025-01-15"
	},
	{
		"slug": "cabin",
		"name": "Cabin",
		"category": "network-city",
		"tagline": "A decentralized city for online creators",
		"description": "Cabin is building a network of coliving neighborhoods for people who want to live and work near nature while staying connected to an online community. Members can stay at various Cabin neighborhoods around the world.",
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
		"joinInfo": "Apply through their website for citizenship or neighborhood stays.",
		"lastUpdated": "2025-01-15"
	},
	{
		"slug": "zuzalu",
		"name": "Zuzalu",
		"category": "popup-city",
		"tagline": "A two-month popup village experiment in Montenegro",
		"description": "Zuzalu was a first-of-its-kind popup city experiment that brought together 200 residents for two months in Montenegro in 2023. It explored themes of longevity, public goods, network states, and zero-knowledge technology.",
		"founded": 2023,
		"status": "inactive",
		"location": {
			"hasPhysical": true,
			"coordinates": [42.2917, 18.8403],
			"label": "Lustica Bay, Montenegro"
		},
		"focus": ["longevity", "crypto", "public-goods"],
		"size": "200 residents",
		"links": {
			"website": "https://zuzalu.city",
			"twitter": "https://twitter.com/zaboratory"
		},
		"joinInfo": "The original Zuzalu has concluded. Follow for updates on future events and spinoffs.",
		"lastUpdated": "2025-01-15"
	},
	{
		"slug": "praxis",
		"name": "Praxis",
		"category": "network-state",
		"tagline": "Building a new city from the ground up",
		"description": "Praxis is building a new city focused on vitality—advancing human flourishing through better governance, health, and community. They are assembling a community of builders and acquiring land for their first physical location.",
		"founded": 2019,
		"status": "forming",
		"location": {
			"hasPhysical": false,
			"label": "Location TBD (Mediterranean region)"
		},
		"focus": ["vitality", "governance", "health"],
		"size": "10,000+ community members",
		"links": {
			"website": "https://praxissociety.com",
			"twitter": "https://twitter.com/praboratory"
		},
		"joinInfo": "Apply for citizenship through their website. Various membership tiers available.",
		"lastUpdated": "2025-01-15"
	},
	{
		"slug": "culdesac",
		"name": "Culdesac",
		"category": "intentional-community",
		"tagline": "America's first car-free neighborhood built from scratch",
		"description": "Culdesac is a car-free neighborhood in Tempe, Arizona. Residents live without personal cars in a walkable community with shared amenities, courtyards, and easy access to transit.",
		"founded": 2021,
		"status": "active",
		"location": {
			"hasPhysical": true,
			"coordinates": [33.4255, -111.9400],
			"label": "Tempe, Arizona, USA"
		},
		"focus": ["car-free", "urban-design", "sustainability"],
		"size": "1,000+ residents",
		"links": {
			"website": "https://culdesac.com",
			"twitter": "https://twitter.com/culdesac"
		},
		"joinInfo": "Apply for an apartment through their website. Currently open for leasing.",
		"lastUpdated": "2025-01-15"
	}
]
```

**Step 3: Verify TypeScript compiles**

Run:
```bash
npm run check
```
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/data/communities.json
git commit -m "feat: add community data model and seed data"
```

---

## Task 3: Create Shared Layout and Global Styles

**Files:**
- Modify: `src/app.css`
- Create: `src/routes/+layout.svelte`

**Step 1: Add global styles**

Replace `src/app.css`:
```css
:root {
	--color-bg: #ffffff;
	--color-text: #1f2937;
	--color-text-muted: #6b7280;
	--color-border: #e5e7eb;
	--color-primary: #3b82f6;
	--color-primary-hover: #2563eb;
	--font-sans: system-ui, -apple-system, sans-serif;
	--header-height: 56px;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

html,
body {
	margin: 0;
	padding: 0;
	font-family: var(--font-sans);
	color: var(--color-text);
	background: var(--color-bg);
	line-height: 1.5;
}

a {
	color: var(--color-primary);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

button {
	cursor: pointer;
	font-family: inherit;
}
```

**Step 2: Create layout component**

Create `src/routes/+layout.svelte`:
```svelte
<script lang="ts">
	import '../app.css';
</script>

<div class="app">
	<header class="header">
		<a href="/" class="logo">Network State Atlas</a>
		<nav class="nav">
			<a href="/directory">Directory</a>
			<a href="/about">About</a>
		</nav>
	</header>
	<main class="main">
		<slot />
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		height: var(--header-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-bg);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}

	.logo {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-text);
	}

	.logo:hover {
		text-decoration: none;
	}

	.nav {
		display: flex;
		gap: 1.5rem;
	}

	.main {
		flex: 1;
		margin-top: var(--header-height);
	}
</style>
```

**Step 3: Verify layout renders**

Run:
```bash
npm run dev
```
Expected: Page shows header with "Network State Atlas", Directory, and About links

**Step 4: Commit**

```bash
git add src/app.css src/routes/+layout.svelte
git commit -m "feat: add shared layout with header navigation"
```

---

## Task 4: Build Map Component

**Files:**
- Create: `src/lib/components/Map.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Import Leaflet CSS in app.html**

Edit `src/app.html`, add to `<head>`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
```

**Step 2: Create Map component**

Create `src/lib/components/Map.svelte`:
```svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { Community } from '$lib/types';
	import { CATEGORY_COLORS, CATEGORY_LABELS } from '$lib/types';

	export let communities: Community[] = [];

	let mapElement: HTMLDivElement;
	let map: L.Map | null = null;

	onMount(async () => {
		if (!browser) return;

		const L = await import('leaflet');
		const { MarkerClusterGroup } = await import('leaflet.markercluster');

		map = L.map(mapElement).setView([20, 0], 2);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		const markers = new MarkerClusterGroup();

		communities
			.filter((c) => c.location.hasPhysical && c.location.coordinates)
			.forEach((community) => {
				const [lat, lng] = community.location.coordinates!;
				const color = CATEGORY_COLORS[community.category];

				const icon = L.divIcon({
					className: 'custom-marker',
					html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
					iconSize: [24, 24],
					iconAnchor: [12, 12]
				});

				const marker = L.marker([lat, lng], { icon });

				marker.bindPopup(`
					<div style="min-width: 200px;">
						<div style="display: inline-block; padding: 2px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">
							${CATEGORY_LABELS[community.category]}
						</div>
						<h3 style="margin: 0 0 4px 0; font-size: 16px;">${community.name}</h3>
						<p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${community.tagline}</p>
						<a href="/community/${community.slug}" style="color: #3b82f6; font-size: 13px;">View Profile →</a>
					</div>
				`);

				markers.addLayer(marker);
			});

		map.addLayer(markers);
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div class="map-container" bind:this={mapElement}></div>

<style>
	.map-container {
		width: 100%;
		height: 100%;
	}

	:global(.custom-marker) {
		background: transparent;
		border: none;
	}
</style>
```

**Step 3: Create home page with map**

Create `src/routes/+page.ts`:
```typescript
import type { PageLoad } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const load: PageLoad = async () => {
	return {
		communities: communitiesData as Community[]
	};
};
```

Replace `src/routes/+page.svelte`:
```svelte
<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Network State Atlas</title>
	<meta name="description" content="Discover network states, popup cities, and innovative communities around the world." />
</svelte:head>

<div class="map-page">
	<Map communities={data.communities} />
</div>

<style>
	.map-page {
		height: calc(100vh - var(--header-height));
		width: 100%;
	}
</style>
```

**Step 4: Verify map renders with markers**

Run:
```bash
npm run dev
```
Expected: Full-screen map with 4 markers (communities with physical locations), popups work on click

**Step 5: Commit**

```bash
git add src/app.html src/lib/components/Map.svelte src/routes/+page.ts src/routes/+page.svelte
git commit -m "feat: add interactive map with community markers"
```

---

## Task 5: Build Community Profile Page

**Files:**
- Create: `src/routes/community/[slug]/+page.ts`
- Create: `src/routes/community/[slug]/+page.svelte`

**Step 1: Create page load function**

Create `src/routes/community/[slug]/+page.ts`:
```typescript
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const load: PageLoad = async ({ params }) => {
	const communities = communitiesData as Community[];
	const community = communities.find((c) => c.slug === params.slug);

	if (!community) {
		throw error(404, 'Community not found');
	}

	return { community };
};
```

**Step 2: Create profile page component**

Create `src/routes/community/[slug]/+page.svelte`:
```svelte
<script lang="ts">
	import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	$: community = data.community;
	$: categoryColor = CATEGORY_COLORS[community.category];
</script>

<svelte:head>
	<title>{community.name} | Network State Atlas</title>
	<meta name="description" content={community.tagline} />
</svelte:head>

<article class="profile">
	<header class="hero">
		<span class="category-badge" style="background-color: {categoryColor}">
			{CATEGORY_LABELS[community.category]}
		</span>
		<h1>{community.name}</h1>
		<p class="tagline">{community.tagline}</p>
		<p class="status">
			{STATUS_LABELS[community.status]} since {community.founded}
		</p>
	</header>

	<section class="content">
		<div class="description">
			<h2>About</h2>
			<p>{community.description}</p>
		</div>

		<div class="details">
			<h2>Details</h2>
			<dl>
				<dt>Focus Areas</dt>
				<dd>
					{#each community.focus as tag}
						<span class="tag">{tag}</span>
					{/each}
				</dd>

				<dt>Community Size</dt>
				<dd>{community.size}</dd>

				<dt>Location</dt>
				<dd>
					{#if community.location.hasPhysical}
						{community.location.label}
					{:else}
						Digital Community — {community.location.label}
					{/if}
				</dd>
			</dl>
		</div>

		<div class="join">
			<h2>Get Involved</h2>
			<p>{community.joinInfo}</p>
			{#if community.links.website}
				<a href={community.links.website} target="_blank" rel="noopener" class="cta">
					Visit Website →
				</a>
			{/if}
		</div>

		<div class="links">
			<h2>Links</h2>
			<div class="link-list">
				{#if community.links.website}
					<a href={community.links.website} target="_blank" rel="noopener">Website</a>
				{/if}
				{#if community.links.twitter}
					<a href={community.links.twitter} target="_blank" rel="noopener">Twitter</a>
				{/if}
				{#if community.links.discord}
					<a href={community.links.discord} target="_blank" rel="noopener">Discord</a>
				{/if}
				{#if community.links.telegram}
					<a href={community.links.telegram} target="_blank" rel="noopener">Telegram</a>
				{/if}
				{#if community.links.github}
					<a href={community.links.github} target="_blank" rel="noopener">GitHub</a>
				{/if}
			</div>
		</div>

		<footer class="meta">
			Last updated: {community.lastUpdated}
		</footer>
	</section>
</article>

<style>
	.profile {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.hero {
		margin-bottom: 2rem;
	}

	.category-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		color: white;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	h1 {
		margin: 0.5rem 0;
		font-size: 2rem;
	}

	.tagline {
		font-size: 1.125rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.status {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	h2 {
		font-size: 1.125rem;
		margin: 0 0 0.75rem 0;
	}

	.description p {
		margin: 0;
		line-height: 1.7;
	}

	dl {
		margin: 0;
	}

	dt {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	dd {
		margin: 0 0 1rem 0;
		color: var(--color-text-muted);
	}

	.tag {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: var(--color-border);
		border-radius: 4px;
		font-size: 0.875rem;
		margin-right: 0.5rem;
	}

	.cta {
		display: inline-block;
		margin-top: 0.75rem;
		padding: 0.625rem 1.25rem;
		background: var(--color-primary);
		color: white;
		border-radius: 6px;
		font-weight: 500;
	}

	.cta:hover {
		background: var(--color-primary-hover);
		text-decoration: none;
	}

	.link-list {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.meta {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}
</style>
```

**Step 3: Verify profile page renders**

Run:
```bash
npm run dev
```
Navigate to: http://localhost:5173/community/cabin
Expected: Profile page with all community details, working links

**Step 4: Commit**

```bash
git add src/routes/community/
git commit -m "feat: add community profile page"
```

---

## Task 6: Build Directory Page

**Files:**
- Create: `src/lib/components/CommunityCard.svelte`
- Create: `src/routes/directory/+page.ts`
- Create: `src/routes/directory/+page.svelte`

**Step 1: Create community card component**

Create `src/lib/components/CommunityCard.svelte`:
```svelte
<script lang="ts">
	import type { Community } from '$lib/types';
	import { CATEGORY_LABELS, CATEGORY_COLORS } from '$lib/types';

	export let community: Community;

	$: categoryColor = CATEGORY_COLORS[community.category];
</script>

<a href="/community/{community.slug}" class="card">
	<span class="category-badge" style="background-color: {categoryColor}">
		{CATEGORY_LABELS[community.category]}
	</span>
	<h3>{community.name}</h3>
	<p class="tagline">{community.tagline}</p>
	<p class="location">
		{#if community.location.hasPhysical}
			📍 {community.location.label}
		{:else}
			🌐 {community.location.label}
		{/if}
	</p>
	<div class="tags">
		{#each community.focus.slice(0, 3) as tag}
			<span class="tag">{tag}</span>
		{/each}
	</div>
</a>

<style>
	.card {
		display: block;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		color: var(--color-text);
		transition: box-shadow 0.15s;
	}

	.card:hover {
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.category-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		color: white;
		border-radius: 4px;
		font-size: 0.6875rem;
		font-weight: 500;
	}

	h3 {
		margin: 0.5rem 0 0.25rem;
		font-size: 1.125rem;
	}

	.tagline {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.location {
		margin: 0.75rem 0 0.5rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.tags {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.tag {
		padding: 0.125rem 0.5rem;
		background: var(--color-border);
		border-radius: 4px;
		font-size: 0.75rem;
	}
</style>
```

**Step 2: Create directory page load function**

Create `src/routes/directory/+page.ts`:
```typescript
import type { PageLoad } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const load: PageLoad = async () => {
	return {
		communities: communitiesData as Community[]
	};
};
```

**Step 3: Create directory page**

Create `src/routes/directory/+page.svelte`:
```svelte
<script lang="ts">
	import CommunityCard from '$lib/components/CommunityCard.svelte';
	import { CATEGORY_LABELS, STATUS_LABELS } from '$lib/types';
	import type { CategoryType, StatusType, Community } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery = '';
	let selectedCategory: CategoryType | '' = '';
	let selectedStatus: StatusType | '' = '';
	let sortBy: 'name' | 'founded' | 'updated' = 'name';

	$: filteredCommunities = data.communities
		.filter((c) => {
			if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			if (selectedCategory && c.category !== selectedCategory) {
				return false;
			}
			if (selectedStatus && c.status !== selectedStatus) {
				return false;
			}
			return true;
		})
		.sort((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name);
			if (sortBy === 'founded') return b.founded - a.founded;
			if (sortBy === 'updated') return b.lastUpdated.localeCompare(a.lastUpdated);
			return 0;
		});

	const categories = Object.entries(CATEGORY_LABELS) as [CategoryType, string][];
	const statuses = Object.entries(STATUS_LABELS) as [StatusType, string][];
</script>

<svelte:head>
	<title>Directory | Network State Atlas</title>
	<meta name="description" content="Browse all network states, popup cities, and innovative communities." />
</svelte:head>

<div class="directory">
	<header class="page-header">
		<h1>Directory</h1>
		<p>Browse all communities in the atlas</p>
	</header>

	<div class="filters">
		<input
			type="search"
			placeholder="Search by name..."
			bind:value={searchQuery}
			class="search"
		/>

		<select bind:value={selectedCategory}>
			<option value="">All Categories</option>
			{#each categories as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select bind:value={selectedStatus}>
			<option value="">All Statuses</option>
			{#each statuses as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select bind:value={sortBy}>
			<option value="name">Sort: A-Z</option>
			<option value="founded">Sort: Newest First</option>
			<option value="updated">Sort: Recently Updated</option>
		</select>
	</div>

	{#if filteredCommunities.length === 0}
		<p class="no-results">No communities match your filters. Try broadening your search.</p>
	{:else}
		<div class="grid">
			{#each filteredCommunities as community (community.slug)}
				<CommunityCard {community} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.directory {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0;
		font-size: 2rem;
	}

	.page-header p {
		margin: 0.5rem 0 0;
		color: var(--color-text-muted);
	}

	.filters {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.search {
		flex: 1;
		min-width: 200px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
	}

	select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.no-results {
		text-align: center;
		color: var(--color-text-muted);
		padding: 3rem 1rem;
	}
</style>
```

**Step 4: Verify directory page**

Run:
```bash
npm run dev
```
Navigate to: http://localhost:5173/directory
Expected: Grid of community cards, working filters and search

**Step 5: Commit**

```bash
git add src/lib/components/CommunityCard.svelte src/routes/directory/
git commit -m "feat: add directory page with filtering and search"
```

---

## Task 7: Build About Page

**Files:**
- Create: `src/routes/about/+page.svelte`

**Step 1: Create about page**

Create `src/routes/about/+page.svelte`:
```svelte
<svelte:head>
	<title>About | Network State Atlas</title>
	<meta name="description" content="Learn about network states and how to use this atlas." />
</svelte:head>

<article class="about">
	<h1>About Network State Atlas</h1>

	<section>
		<h2>What is a Network State?</h2>
		<p>
			A network state is a highly aligned online community with a capacity for collective action
			that crowdfunds territory around the world and eventually gains diplomatic recognition from
			pre-existing states. The concept was popularized by Balaji Srinivasan in his 2022 book
			<a href="https://thenetworkstate.com" target="_blank" rel="noopener">The Network State</a>.
		</p>
		<p>
			Unlike traditional nations formed by geography and history, network states begin as digital
			communities united by shared values, then gradually acquire physical presence through
			coordinated action.
		</p>
	</section>

	<section>
		<h2>The Ecosystem</h2>
		<p>
			This atlas catalogs not just network states but the broader ecosystem of innovative
			communities experimenting with new forms of living and governance:
		</p>
		<dl>
			<dt>Network States</dt>
			<dd>Communities explicitly working toward the network state vision with diplomatic recognition as a goal.</dd>

			<dt>Network Cities</dt>
			<dd>Distributed networks of physical locations united by a shared community and purpose.</dd>

			<dt>Popup Cities</dt>
			<dd>Temporary gatherings that bring online communities together in physical space for weeks or months.</dd>

			<dt>Charter Cities</dt>
			<dd>New jurisdictions with special governance frameworks, often operating under unique legal arrangements.</dd>

			<dt>Intentional Communities</dt>
			<dd>Planned residential communities designed around shared values like sustainability or car-free living.</dd>

			<dt>Digital Communities</dt>
			<dd>Online-first communities that may not have physical presence yet but share network state aspirations.</dd>

			<dt>Special Economic Zones</dt>
			<dd>Designated areas with different regulatory frameworks to encourage innovation and investment.</dd>
		</dl>
	</section>

	<section>
		<h2>How to Use This Atlas</h2>
		<p>
			<strong>Explore the map:</strong> The home page shows all communities with physical locations.
			Click markers to see summaries and link through to full profiles.
		</p>
		<p>
			<strong>Browse the directory:</strong> Use filters to find communities by category, status,
			or search by name. The directory includes both physical and digital-only communities.
		</p>
		<p>
			<strong>Get involved:</strong> Each community profile includes information on how to join,
			visit, or learn more.
		</p>
	</section>

	<section>
		<h2>About This Project</h2>
		<p>
			Network State Atlas is an open-source project cataloging the emerging ecosystem of network
			states and related communities. Our goal is to make it easy for curious explorers to
			discover these communities and for active participants to find their tribe.
		</p>
		<p>
			<strong>Contribute:</strong> Know of a community that should be listed? Found an error?
			<a href="https://github.com" target="_blank" rel="noopener">Submit an issue on GitHub</a>.
		</p>
	</section>
</article>

<style>
	.about {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2.5rem;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
	}

	p {
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	dl {
		margin: 0;
	}

	dt {
		font-weight: 600;
		margin-top: 1rem;
	}

	dd {
		margin: 0.25rem 0 0 0;
		color: var(--color-text-muted);
	}
</style>
```

**Step 2: Verify about page**

Run:
```bash
npm run dev
```
Navigate to: http://localhost:5173/about
Expected: About page with all sections rendering correctly

**Step 3: Commit**

```bash
git add src/routes/about/
git commit -m "feat: add about page with network state explainer"
```

---

## Task 8: Add Map Filter Controls

**Files:**
- Modify: `src/lib/components/Map.svelte`
- Create: `src/lib/components/MapFilters.svelte`
- Create: `src/lib/components/MapLegend.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Create legend component**

Create `src/lib/components/MapLegend.svelte`:
```svelte
<script lang="ts">
	import { CATEGORY_LABELS, CATEGORY_COLORS, type CategoryType } from '$lib/types';

	export let visibleCategories: Set<CategoryType>;
	export let onToggle: (category: CategoryType) => void;

	let expanded = true;

	const categories = Object.entries(CATEGORY_LABELS) as [CategoryType, string][];
</script>

<div class="legend" class:collapsed={!expanded}>
	<button class="toggle" on:click={() => (expanded = !expanded)}>
		{expanded ? '▼' : '▶'} Legend
	</button>

	{#if expanded}
		<div class="items">
			{#each categories as [category, label]}
				<label class="item">
					<input
						type="checkbox"
						checked={visibleCategories.has(category)}
						on:change={() => onToggle(category)}
					/>
					<span class="dot" style="background-color: {CATEGORY_COLORS[category]}"></span>
					<span class="label">{label}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>

<style>
	.legend {
		position: absolute;
		bottom: 2rem;
		left: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		font-size: 0.8125rem;
	}

	.toggle {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		background: none;
		border: none;
		text-align: left;
		font-weight: 500;
		cursor: pointer;
	}

	.items {
		padding: 0 0.75rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.label {
		color: var(--color-text);
	}

	input[type='checkbox'] {
		margin: 0;
	}
</style>
```

**Step 2: Create search filter component**

Create `src/lib/components/MapFilters.svelte`:
```svelte
<script lang="ts">
	import { STATUS_LABELS, type StatusType } from '$lib/types';

	export let searchQuery: string;
	export let selectedStatus: StatusType | '';
	export let onSearch: (query: string) => void;
	export let onStatusChange: (status: StatusType | '') => void;

	const statuses = Object.entries(STATUS_LABELS) as [StatusType, string][];
</script>

<div class="filters">
	<input
		type="search"
		placeholder="Search communities..."
		value={searchQuery}
		on:input={(e) => onSearch(e.currentTarget.value)}
		class="search"
	/>
	<select
		value={selectedStatus}
		on:change={(e) => onStatusChange(e.currentTarget.value as StatusType | '')}
	>
		<option value="">All Statuses</option>
		{#each statuses as [value, label]}
			<option {value}>{label}</option>
		{/each}
	</select>
</div>

<style>
	.filters {
		position: absolute;
		top: 1rem;
		left: 1rem;
		display: flex;
		gap: 0.5rem;
		z-index: 1000;
	}

	.search {
		width: 200px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
```

**Step 3: Update Map component to accept filters**

Replace `src/lib/components/Map.svelte`:
```svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { Community, CategoryType, StatusType } from '$lib/types';
	import { CATEGORY_COLORS, CATEGORY_LABELS } from '$lib/types';

	export let communities: Community[] = [];
	export let visibleCategories: Set<CategoryType>;
	export let searchQuery = '';
	export let selectedStatus: StatusType | '' = '';

	let mapElement: HTMLDivElement;
	let map: L.Map | null = null;
	let markersLayer: L.MarkerClusterGroup | null = null;
	let L: typeof import('leaflet') | null = null;

	$: filteredCommunities = communities.filter((c) => {
		if (!c.location.hasPhysical || !c.location.coordinates) return false;
		if (!visibleCategories.has(c.category)) return false;
		if (selectedStatus && c.status !== selectedStatus) return false;
		if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
		return true;
	});

	$: if (map && markersLayer && L) {
		updateMarkers(filteredCommunities);
	}

	function updateMarkers(communities: Community[]) {
		if (!markersLayer || !L) return;

		markersLayer.clearLayers();

		communities.forEach((community) => {
			const [lat, lng] = community.location.coordinates!;
			const color = CATEGORY_COLORS[community.category];

			const icon = L!.divIcon({
				className: 'custom-marker',
				html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
				iconSize: [24, 24],
				iconAnchor: [12, 12]
			});

			const marker = L!.marker([lat, lng], { icon });

			marker.bindPopup(`
				<div style="min-width: 200px;">
					<div style="display: inline-block; padding: 2px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">
						${CATEGORY_LABELS[community.category]}
					</div>
					<h3 style="margin: 0 0 4px 0; font-size: 16px;">${community.name}</h3>
					<p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${community.tagline}</p>
					<a href="/community/${community.slug}" style="color: #3b82f6; font-size: 13px;">View Profile →</a>
				</div>
			`);

			markersLayer!.addLayer(marker);
		});
	}

	onMount(async () => {
		if (!browser) return;

		L = await import('leaflet');
		const { MarkerClusterGroup } = await import('leaflet.markercluster');

		map = L.map(mapElement).setView([20, 0], 2);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		markersLayer = new MarkerClusterGroup();
		map.addLayer(markersLayer);

		updateMarkers(filteredCommunities);
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div class="map-container" bind:this={mapElement}></div>

<style>
	.map-container {
		width: 100%;
		height: 100%;
	}

	:global(.custom-marker) {
		background: transparent;
		border: none;
	}
</style>
```

**Step 4: Update home page to include filters**

Replace `src/routes/+page.svelte`:
```svelte
<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import MapFilters from '$lib/components/MapFilters.svelte';
	import MapLegend from '$lib/components/MapLegend.svelte';
	import type { CategoryType, StatusType } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	const allCategories: CategoryType[] = [
		'network-state',
		'network-city',
		'popup-city',
		'charter-city',
		'intentional-community',
		'digital-community',
		'special-economic-zone'
	];

	let visibleCategories = new Set<CategoryType>(allCategories);
	let searchQuery = '';
	let selectedStatus: StatusType | '' = '';

	function toggleCategory(category: CategoryType) {
		if (visibleCategories.has(category)) {
			visibleCategories.delete(category);
		} else {
			visibleCategories.add(category);
		}
		visibleCategories = visibleCategories;
	}
</script>

<svelte:head>
	<title>Network State Atlas</title>
	<meta
		name="description"
		content="Discover network states, popup cities, and innovative communities around the world."
	/>
</svelte:head>

<div class="map-page">
	<Map
		communities={data.communities}
		{visibleCategories}
		{searchQuery}
		{selectedStatus}
	/>
	<MapFilters
		{searchQuery}
		{selectedStatus}
		onSearch={(q) => (searchQuery = q)}
		onStatusChange={(s) => (selectedStatus = s)}
	/>
	<MapLegend {visibleCategories} onToggle={toggleCategory} />
</div>

<style>
	.map-page {
		height: calc(100vh - var(--header-height));
		width: 100%;
		position: relative;
	}
</style>
```

**Step 5: Verify filters work**

Run:
```bash
npm run dev
```
Expected: Search filters and legend toggles correctly filter map markers

**Step 6: Commit**

```bash
git add src/lib/components/Map.svelte src/lib/components/MapFilters.svelte src/lib/components/MapLegend.svelte src/routes/+page.svelte
git commit -m "feat: add map filtering by category, status, and search"
```

---

## Task 9: Static Build and Final Verification

**Files:**
- None (verification only)

**Step 1: Run TypeScript check**

Run:
```bash
npm run check
```
Expected: No errors

**Step 2: Build static site**

Run:
```bash
npm run build
```
Expected: Build completes successfully, outputs to `build/` directory

**Step 3: Preview production build**

Run:
```bash
npm run preview
```
Expected: Site works at localhost:4173, all pages render correctly

**Step 4: Verify all routes prerendered**

Check that these files exist in `build/`:
- `index.html` (home/map)
- `directory/index.html`
- `about/index.html`
- `community/cabin/index.html`
- `community/prospera/index.html`
- (etc. for all communities)

Run:
```bash
ls -la build/
ls -la build/community/
```

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: verify static build succeeds"
```

---

## Summary

After completing all tasks, you will have:

1. ✅ SvelteKit project with static adapter
2. ✅ TypeScript data model with 5 seed communities
3. ✅ Shared layout with navigation
4. ✅ Interactive Leaflet map with clustered markers
5. ✅ Community profile pages
6. ✅ Filterable directory page
7. ✅ About page explaining network states
8. ✅ Map filtering (category, status, search)
9. ✅ Static build working

**Next steps after MVP:**
- Add more communities to the dataset (15-30 for launch)
- Deploy to Vercel/Netlify
- Add GitHub issue template for community submissions
- Add simple analytics (Plausible/Fathom)
