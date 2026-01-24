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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let markersLayer: any = null;
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
		await import('leaflet.markercluster');

		map = L.map(mapElement).setView([20, 0], 2);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		markersLayer = new L.MarkerClusterGroup();
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
