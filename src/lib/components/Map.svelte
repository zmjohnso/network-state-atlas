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
		await import('leaflet.markercluster');

		map = L.map(mapElement).setView([20, 0], 2);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		const markers = new L.MarkerClusterGroup();

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
