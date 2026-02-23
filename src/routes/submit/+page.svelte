<script lang="ts">
	import { CATEGORY_LABELS, STATUS_LABELS } from '$lib/types';
	import type { CategoryType, StatusType } from '$lib/types';

	let name = '';
	let category: CategoryType = 'network-state';
	let tagline = '';
	let description = '';
	let founded = '';
	let status: StatusType = 'active';
	let locationLabel = '';
	let hasPhysical = false;
	let lat = '';
	let lng = '';
	let focus = '';
	let size = '';
	let website = '';
	let twitter = '';
	let discord = '';
	let telegram = '';
	let github = '';
	let joinInfo = '';

	function handleSubmit() {
		const lines = [
			`## Community Details`,
			``,
			`**Name:** ${name}`,
			`**Category:** ${CATEGORY_LABELS[category]}`,
			`**Tagline:** ${tagline}`,
			`**Status:** ${STATUS_LABELS[status]}`,
			founded ? `**Founded:** ${founded}` : '',
			``,
			`## Description`,
			``,
			description,
			``,
			`## Location`,
			``,
			`**Location:** ${locationLabel || 'N/A'}`,
			`**Has Physical Location:** ${hasPhysical ? 'Yes' : 'No'}`,
			hasPhysical && lat && lng ? `**Coordinates:** ${lat}, ${lng}` : '',
			``,
			`## Community Info`,
			``,
			focus ? `**Focus Areas:** ${focus}` : '',
			size ? `**Size:** ${size}` : '',
			joinInfo ? `**How to Join:** ${joinInfo}` : '',
			``,
			`## Links`,
			``,
			website ? `- Website: ${website}` : '',
			twitter ? `- Twitter: ${twitter}` : '',
			discord ? `- Discord: ${discord}` : '',
			telegram ? `- Telegram: ${telegram}` : '',
			github ? `- GitHub: ${github}` : '',
		]
			.filter(Boolean)
			.join('\n');

		const title = encodeURIComponent(`Add Community: ${name}`);
		const body = encodeURIComponent(lines);
		const url = `https://github.com/zmjohnso/network-state-atlas/issues/new?title=${title}&body=${body}`;

		window.open(url, '_blank');
	}
</script>

<svelte:head>
	<title>Submit a Community | Network State Atlas</title>
	<meta
		name="description"
		content="Submit a network state, popup city, or innovative community to the Network State Atlas."
	/>
	<meta property="og:title" content="Submit a Community | Network State Atlas" />
	<meta
		property="og:description"
		content="Submit a network state, popup city, or innovative community to the Network State Atlas."
	/>
	<meta name="twitter:title" content="Submit a Community | Network State Atlas" />
	<meta
		name="twitter:description"
		content="Submit a network state, popup city, or innovative community to the Network State Atlas."
	/>
</svelte:head>

<div class="submit-page">
	<h1>Submit a Community</h1>
	<p class="intro">
		Know of a network state, popup city, or innovative community that should be on the atlas? Fill
		out the form below and we'll create a GitHub issue to track the submission.
	</p>

	<form on:submit|preventDefault={handleSubmit}>
		<fieldset>
			<legend>Basic Info</legend>

			<label>
				Name <span class="required">*</span>
				<input type="text" bind:value={name} required placeholder="e.g. Praxis" />
			</label>

			<label>
				Category <span class="required">*</span>
				<select bind:value={category} required>
					{#each Object.entries(CATEGORY_LABELS) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			</label>

			<label>
				Tagline <span class="required">*</span>
				<input
					type="text"
					bind:value={tagline}
					required
					placeholder="A short one-line description"
				/>
			</label>

			<label>
				Description <span class="required">*</span>
				<textarea bind:value={description} required rows="4" placeholder="What is this community about?"></textarea>
			</label>

			<div class="row">
				<label>
					Founded Year
					<input type="number" bind:value={founded} placeholder="e.g. 2021" min="1900" max="2100" />
				</label>

				<label>
					Status <span class="required">*</span>
					<select bind:value={status} required>
						{#each Object.entries(STATUS_LABELS) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>
				</label>
			</div>
		</fieldset>

		<fieldset>
			<legend>Location</legend>

			<label>
				Location Label
				<input type="text" bind:value={locationLabel} placeholder="e.g. Roatán, Honduras" />
			</label>

			<label class="checkbox-label">
				<input type="checkbox" bind:checked={hasPhysical} />
				Has a physical location
			</label>

			{#if hasPhysical}
				<div class="row">
					<label>
						Latitude
						<input type="number" bind:value={lat} step="any" placeholder="e.g. 16.32" />
					</label>
					<label>
						Longitude
						<input type="number" bind:value={lng} step="any" placeholder="e.g. -86.53" />
					</label>
				</div>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Community Info</legend>

			<label>
				Focus Areas
				<input type="text" bind:value={focus} placeholder="e.g. governance, technology, sustainability" />
			</label>

			<label>
				Community Size
				<input type="text" bind:value={size} placeholder="e.g. 500+ members" />
			</label>

			<label>
				How to Join
				<textarea bind:value={joinInfo} rows="2" placeholder="How can someone get involved?"></textarea>
			</label>
		</fieldset>

		<fieldset>
			<legend>Links</legend>

			<label>
				Website
				<input type="url" bind:value={website} placeholder="https://" />
			</label>

			<label>
				Twitter
				<input type="url" bind:value={twitter} placeholder="https://twitter.com/..." />
			</label>

			<label>
				Discord
				<input type="url" bind:value={discord} placeholder="https://discord.gg/..." />
			</label>

			<label>
				Telegram
				<input type="url" bind:value={telegram} placeholder="https://t.me/..." />
			</label>

			<label>
				GitHub
				<input type="url" bind:value={github} placeholder="https://github.com/..." />
			</label>
		</fieldset>

		<button type="submit" class="submit-btn">Submit via GitHub Issue</button>
		<p class="note">
			This will open a new GitHub issue pre-filled with your submission. You'll need a GitHub
			account to complete the submission.
		</p>
	</form>
</div>

<style>
	.submit-page {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.intro {
		color: var(--color-text-muted);
		margin-bottom: 2rem;
		line-height: 1.7;
	}

	fieldset {
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	legend {
		font-weight: 600;
		font-size: 1.1rem;
		padding: 0 0.5rem;
	}

	label {
		display: block;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.required {
		color: #ef4444;
	}

	input[type='text'],
	input[type='number'],
	input[type='url'],
	select,
	textarea {
		display: block;
		width: 100%;
		margin-top: 0.25rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		transition: border-color 0.2s;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	textarea {
		resize: vertical;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		color: var(--color-text);
	}

	.checkbox-label input[type='checkbox'] {
		width: auto;
		margin: 0;
	}

	.submit-btn {
		display: block;
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: var(--color-primary);
		border: none;
		border-radius: 8px;
		transition: background-color 0.2s;
	}

	.submit-btn:hover {
		background: var(--color-primary-hover);
	}

	.note {
		text-align: center;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin-top: 0.75rem;
	}
</style>
