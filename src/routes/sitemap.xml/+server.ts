import type { RequestHandler } from './$types';
import type { Community } from '$lib/types';
import communitiesData from '$lib/data/communities.json';

export const prerender = true;

const BASE_URL = 'https://networkstateatlas.com';

export const GET: RequestHandler = async () => {
	const communities = communitiesData as Community[];

	const staticPages = [
		{ path: '', priority: '1.0', changefreq: 'weekly' },
		{ path: '/directory', priority: '0.9', changefreq: 'weekly' },
		{ path: '/about', priority: '0.7', changefreq: 'monthly' }
	];

	const communityPages = communities.map((community) => ({
		path: `/community/${community.slug}`,
		priority: '0.8',
		changefreq: 'weekly',
		lastmod: community.lastUpdated
	}));

	const allPages = [...staticPages, ...communityPages];

	const urls = allPages
		.map(
			(page) => `
    <url>
      <loc>${BASE_URL}${page.path}</loc>
      ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
		)
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
