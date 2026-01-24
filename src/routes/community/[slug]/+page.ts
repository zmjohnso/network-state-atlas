import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const load: PageLoad = async ({ params }) => {
	const communities = communitiesData as Community[];
	const community = communities.find((c) => c.slug === params.slug);

	if (!community) {
		throw error(404, 'Community not found');
	}

	return { community };
};
