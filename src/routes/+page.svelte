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
