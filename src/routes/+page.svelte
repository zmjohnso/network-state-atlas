<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
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
	let initialized = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		searchQuery = params.get('q') ?? '';
		selectedStatus = (params.get('status') as StatusType | '') ?? '';
		const catParam = params.get('categories');
		if (catParam) {
			const cats = catParam.split(',').filter((c): c is CategoryType =>
				allCategories.includes(c as CategoryType)
			);
			visibleCategories = new Set<CategoryType>(cats);
		}
		initialized = true;
	});

	function syncUrl() {
		if (!initialized || !browser) return;
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (selectedStatus) params.set('status', selectedStatus);
		if (visibleCategories.size < allCategories.length && visibleCategories.size > 0) {
			params.set('categories', [...visibleCategories].join(','));
		}
		const qs = params.toString();
		goto(qs ? `?${qs}` : '/', { replaceState: true, keepFocus: true, noScroll: true });
	}

	function toggleCategory(category: CategoryType) {
		if (visibleCategories.has(category)) {
			visibleCategories.delete(category);
		} else {
			visibleCategories.add(category);
		}
		visibleCategories = visibleCategories;
		syncUrl();
	}

	$: searchQuery, selectedStatus, syncUrl();
</script>

<svelte:head>
	<title>Network State Atlas</title>
	<meta
		name="description"
		content="Discover network states, popup cities, and innovative communities around the world."
	/>
	<!-- Open Graph -->
	<meta property="og:title" content="Network State Atlas" />
	<meta property="og:description" content="Discover network states, popup cities, and innovative communities around the world." />
	<!-- Twitter -->
	<meta name="twitter:title" content="Network State Atlas" />
	<meta name="twitter:description" content="Discover network states, popup cities, and innovative communities around the world." />
	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Network State Atlas",
		"url": "https://networkstateatlas.com",
		"description": "Discover network states, popup cities, and innovative communities around the world.",
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://networkstateatlas.com/directory?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	})}</script>`}
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
		position: fixed;
		top: var(--header-height);
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
