<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let coordinates: [number, number];
	export let name: string;
	export let color: string;

	let mapElement: HTMLDivElement;
	let map: L.Map | null = null;

	onMount(async () => {
		if (!browser) return;

		const L = await import('leaflet');

		const mapInstance = L.map(mapElement, {
			scrollWheelZoom: false,
			zoomControl: true
		}).setView(coordinates, 10);

		map = mapInstance;

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(mapInstance);

		const icon = L.divIcon({
			className: 'custom-marker',
			html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
			iconSize: [24, 24],
			iconAnchor: [12, 12]
		});

		L.marker(coordinates, { icon })
			.bindPopup(name)
			.addTo(mapInstance);

		mapInstance.invalidateSize();
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div class="mini-map" bind:this={mapElement}></div>

<style>
	.mini-map {
		width: 100%;
		height: 250px;
		border-radius: 8px;
		margin-top: 0.5rem;
		z-index: 0;
	}

	:global(.mini-map .custom-marker) {
		background: transparent;
		border: none;
	}
</style>
