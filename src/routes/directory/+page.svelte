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
	<!-- Open Graph -->
	<meta property="og:title" content="Directory | Network State Atlas" />
	<meta property="og:description" content="Browse all network states, popup cities, and innovative communities." />
	<!-- Twitter -->
	<meta name="twitter:title" content="Directory | Network State Atlas" />
	<meta name="twitter:description" content="Browse all network states, popup cities, and innovative communities." />
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
