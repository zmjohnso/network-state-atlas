<script lang="ts">
	import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS } from '$lib/types';
	import MiniMap from '$lib/components/MiniMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: community = data.community;
	$: categoryColor = CATEGORY_COLORS[community.category];

	$: jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": community.name,
		"description": community.description,
		"url": community.links.website || `https://networkstateatlas.com/community/${community.slug}`,
		"foundingDate": community.founded.toString(),
		...(community.location.hasPhysical && community.location.coordinates ? {
			"location": {
				"@type": "Place",
				"geo": {
					"@type": "GeoCoordinates",
					"latitude": community.location.coordinates[0],
					"longitude": community.location.coordinates[1]
				},
				"name": community.location.label
			}
		} : {}),
		"sameAs": [
			community.links.website,
			community.links.twitter,
			community.links.discord,
			community.links.telegram,
			community.links.github
		].filter(Boolean)
	};
</script>

<svelte:head>
	<title>{community.name} | Network State Atlas</title>
	<meta name="description" content={community.tagline} />
	<!-- Open Graph -->
	<meta property="og:title" content="{community.name} | Network State Atlas" />
	<meta property="og:description" content={community.tagline} />
	<!-- Twitter -->
	<meta name="twitter:title" content="{community.name} | Network State Atlas" />
	<meta name="twitter:description" content={community.tagline} />
	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
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
				{#if community.location.hasPhysical && community.location.coordinates}
					<MiniMap
						coordinates={community.location.coordinates}
						name={community.name}
						color={categoryColor}
					/>
				{/if}
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
