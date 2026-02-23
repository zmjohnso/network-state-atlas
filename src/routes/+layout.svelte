<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';

	const SITE_NAME = 'Network State Atlas';
	const BASE_URL = 'https://networkstateatlas.com';
	const DEFAULT_DESCRIPTION = 'Discover network states, popup cities, and innovative communities around the world.';

	$: canonicalUrl = `${BASE_URL}${$page.url.pathname}`;
</script>

<svelte:head>
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph defaults -->
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card defaults -->
	<meta name="twitter:card" content="summary_large_image" />

	<!-- Umami Analytics -->
	{#if PUBLIC_UMAMI_WEBSITE_ID}
		<script defer src="https://cloud.umami.is/script.js" data-website-id={PUBLIC_UMAMI_WEBSITE_ID}></script>
	{/if}
</svelte:head>

<div class="app">
	<header class="header">
		<a href="/" class="logo">Network State Atlas</a>
		<nav class="nav">
			<a href="/directory">Directory</a>
			<a href="/submit">Submit</a>
			<a href="/about">About</a>
			<button class="theme-toggle" on:click={() => theme.toggle()} aria-label="Toggle theme">
				{#if $theme === 'light'}
					<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
					</svg>
				{:else}
					<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" y1="1" x2="12" y2="3"></line>
						<line x1="12" y1="21" x2="12" y2="23"></line>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
						<line x1="1" y1="12" x2="3" y2="12"></line>
						<line x1="21" y1="12" x2="23" y2="12"></line>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
					</svg>
				{/if}
			</button>
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
		align-items: center;
		gap: 1.5rem;
	}

	.main {
		flex: 1;
		margin-top: var(--header-height);
	}

	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		color: var(--color-text);
		transition: background-color 0.2s;
	}

	.theme-toggle:hover {
		background: var(--color-border);
	}

	.icon {
		width: 18px;
		height: 18px;
	}
</style>
