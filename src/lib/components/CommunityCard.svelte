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
