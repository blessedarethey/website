import type { APIRoute } from 'astro';
import { getBlogPosts } from '../lib/sanity';
import { getEpisodes } from '../lib/podcast';

// Hand-rolled instead of @astrojs/sitemap: that integration only picks up
// routes it can enumerate at build time, but /blog/[slug] and
// /podcast/[slug] are server-rendered from Sanity/RSS data that changes
// without a rebuild. Serving this as a real SSR endpoint means new posts
// and episodes show up here automatically as soon as they're published.
export const prerender = false;

const STATIC_PATHS = [
  '/',
  '/about',
  '/about/denise',
  '/about/tuzdy',
  '/about/kirsten',
  '/curriculum',
  '/events',
  '/podcast',
  '/blog',
  '/merch',
  '/resources',
  '/educator-portal',
  '/donate',
];

function urlEntry(loc: string, lastmod?: string) {
  return `  <url>\n    <loc>${loc}</loc>\n${
    lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''
  }  </url>`;
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://www.blessedarethey.com').replace(/\/$/, '');

  const entries = STATIC_PATHS.map((path) => urlEntry(`${base}${path}`));

  // Best-effort: if Sanity or the podcast feed is unreachable, still serve
  // a valid sitemap with just the static pages rather than a 500.
  try {
    const posts = await getBlogPosts();
    for (const post of posts) {
      entries.push(urlEntry(`${base}/blog/${post.slug}`, post.publishedAt));
    }
  } catch {
    // omit blog posts this request
  }

  try {
    const episodes = await getEpisodes();
    for (const ep of episodes) {
      entries.push(
        urlEntry(`${base}/podcast/${ep.slug}`, ep.publishedAt || undefined)
      );
    }
  } catch {
    // omit episodes this request
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
