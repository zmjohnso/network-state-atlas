export type CategoryType =
	| 'network-state'
	| 'network-city'
	| 'popup-city'
	| 'charter-city'
	| 'intentional-community'
	| 'digital-community'
	| 'special-economic-zone';

export type StatusType = 'concept' | 'forming' | 'active' | 'inactive';

export interface CommunityLocation {
	hasPhysical: boolean;
	coordinates?: [number, number]; // [lat, lng]
	label: string;
}

export interface CommunityLinks {
	website?: string;
	twitter?: string;
	discord?: string;
	telegram?: string;
	github?: string;
}

export interface Community {
	slug: string;
	name: string;
	category: CategoryType;
	tagline: string;
	description: string;
	founded: number;
	status: StatusType;
	location: CommunityLocation;
	focus: string[];
	size: string;
	links: CommunityLinks;
	joinInfo: string;
	lastUpdated: string;
}

export const CATEGORY_LABELS: Record<CategoryType, string> = {
	'network-state': 'Network State',
	'network-city': 'Network City',
	'popup-city': 'Popup City',
	'charter-city': 'Charter City',
	'intentional-community': 'Intentional Community',
	'digital-community': 'Digital Community',
	'special-economic-zone': 'Special Economic Zone'
};

export const CATEGORY_COLORS: Record<CategoryType, string> = {
	'network-state': '#3b82f6',
	'network-city': '#8b5cf6',
	'popup-city': '#f59e0b',
	'charter-city': '#10b981',
	'intentional-community': '#ec4899',
	'digital-community': '#6366f1',
	'special-economic-zone': '#14b8a6'
};

export const STATUS_LABELS: Record<StatusType, string> = {
	concept: 'Concept',
	forming: 'Forming',
	active: 'Active',
	inactive: 'Inactive'
};
