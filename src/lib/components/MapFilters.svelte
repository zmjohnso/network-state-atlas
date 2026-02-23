<script lang="ts">
	import { STATUS_LABELS, type StatusType } from '$lib/types';

	export let searchQuery: string;
	export let selectedStatus: StatusType | '';
	export let onSearch: (query: string) => void;
	export let onStatusChange: (status: StatusType | '') => void;

	const statuses = Object.entries(STATUS_LABELS) as [StatusType, string][];

	let filtersOpen = false;
	let panelElement: HTMLDivElement;

	function handleClickOutside(event: MouseEvent) {
		if (filtersOpen && panelElement && !panelElement.contains(event.target as Node)) {
			filtersOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="filters" bind:this={panelElement}>
	<button class="toggle-btn" on:click|stopPropagation={() => (filtersOpen = !filtersOpen)}>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
		Filters
	</button>
	<div class="controls" class:open={filtersOpen}>
		<input
			type="search"
			placeholder="Search communities..."
			value={searchQuery}
			on:input={(e) => onSearch(e.currentTarget.value)}
			class="search"
		/>
		<select
			value={selectedStatus}
			on:change={(e) => onStatusChange(e.currentTarget.value as StatusType | '')}
		>
			<option value="">All Statuses</option>
			{#each statuses as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.filters {
		position: absolute;
		top: 1rem;
		left: 3.5rem;
		display: flex;
		gap: 0.5rem;
		z-index: 1000;
	}

	.toggle-btn {
		display: none;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
	}

	.search {
		width: 200px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.filters {
			left: auto;
			right: 0.75rem;
			flex-direction: column;
			align-items: flex-end;
		}

		.toggle-btn {
			display: flex;
		}

		.controls {
			display: none;
			flex-direction: column;
			background: var(--color-bg);
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
			padding: 0.75rem;
			gap: 0.5rem;
		}

		.controls.open {
			display: flex;
		}

		.search {
			width: 100%;
			box-shadow: none;
		}

		select {
			box-shadow: none;
		}
	}
</style>
