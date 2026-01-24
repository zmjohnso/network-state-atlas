import type { PageLoad } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const load: PageLoad = async () => {
	return {
		communities: communitiesData as Community[]
	};
};
