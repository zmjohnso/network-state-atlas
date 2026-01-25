<script lang="ts">
	import { STATUS_LABELS, type StatusType } from '$lib/types';

	export let searchQuery: string;
	export let selectedStatus: StatusType | '';
	export let onSearch: (query: string) => void;
	export let onStatusChange: (status: StatusType | '') => void;

	const statuses = Object.entries(STATUS_LABELS) as [StatusType, string][];
</script>

<div class="filters">
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

<style>
	.filters {
		position: absolute;
		top: 1rem;
		left: 3.5rem;
		display: flex;
		gap: 0.5rem;
		z-index: 1000;
	}

	.search {
		width: 200px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
