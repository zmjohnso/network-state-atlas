<script lang="ts">
	import { CATEGORY_LABELS, CATEGORY_COLORS, type CategoryType } from '$lib/types';

	export let visibleCategories: Set<CategoryType>;
	export let onToggle: (category: CategoryType) => void;

	let expanded = true;

	const categories = Object.entries(CATEGORY_LABELS) as [CategoryType, string][];
</script>

<div class="legend" class:collapsed={!expanded}>
	<button class="toggle" on:click={() => (expanded = !expanded)}>
		{expanded ? '▼' : '▶'} Legend
	</button>

	{#if expanded}
		<div class="items">
			{#each categories as [category, label]}
				<label class="item">
					<input
						type="checkbox"
						checked={visibleCategories.has(category)}
						on:change={() => onToggle(category)}
					/>
					<span class="dot" style="background-color: {CATEGORY_COLORS[category]}"></span>
					<span class="label">{label}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>

<style>
	.legend {
		position: absolute;
		bottom: 2rem;
		left: 1rem;
		background: var(--color-bg);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		font-size: 0.8125rem;
	}

	.toggle {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		background: none;
		border: none;
		text-align: left;
		font-weight: 500;
		cursor: pointer;
	}

	.items {
		padding: 0 0.75rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.label {
		color: var(--color-text);
	}

	input[type='checkbox'] {
		margin: 0;
	}
</style>
