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
