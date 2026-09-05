import { XMLParser } from 'fast-xml-parser';

// Episodes are pulled live from the show's RSS feed (Anchor / Spotify for
// Podcasters) rather than entered by hand in Sanity — chosen over the
// Sanity "episode" schema so publishing an episode on the podcast host is
// the only step; nothing has to be re-entered here. That schema is left in
// Sanity Studio unused in case that decision changes later.
export const FEED_URL = 'https://anchor.fm/s/116517680/podcast/rss';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  // itunes:image, enclosure, etc. carry their data in attributes rather
  // than text content — 'href'/'url' below all read from those.
});

export type Episode = {
  /** Stable id from the feed (<guid>) — not shown, used to build the slug. */
  guid: string;
  slug: string;
  title: string;
  publishedAt: string;
  description?: string;
  audioUrl?: string;
  /** Seconds, if the feed's <itunes:duration> could be parsed. */
  durationSeconds?: number;
  imageUrl?: string;
  /** From <itunes:episode>, if the host sets it — not every feed does. */
  episodeNumber?: number;
};

// Strips tags and collapses whitespace from a feed description (which is
// HTML — see set:html usage on the episode pages) down to a plain-text
// excerpt for contexts too tight for the full show notes, like a listing
// row. Cuts at the last whole word inside the limit rather than mid-word.
export function excerpt(html: string, maxChars = 140): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars)}…`;
}

function slugify(title: string, guid: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Feeds occasionally reuse a title (a rerun, a trailer) — the guid's
  // last path segment disambiguates without making every slug ugly.
  const guidTail = guid.split(/[/:]/).pop()?.slice(-6) || '';
  return base || `episode-${guidTail}`;
}

// <itunes:duration> is either plain seconds ("1845") or HH:MM:SS /
// MM:SS ("30:45") depending on host — Anchor emits seconds, but this
// covers a feed migration to another host too.
function parseDuration(raw: unknown): number | undefined {
  if (raw == null) return undefined;
  const str = String(raw).trim();
  if (/^\d+$/.test(str)) return Number(str);
  const parts = str.split(':').map(Number);
  if (parts.some(Number.isNaN)) return undefined;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function toEpisode(item: any): Episode | null {
  const title = item?.title ? String(item.title) : '';
  const guid =
    (typeof item?.guid === 'object' ? item.guid?.['#text'] : item?.guid) ||
    item?.link ||
    title;
  if (!title || !guid) return null;

  const enclosure = item?.enclosure;
  const audioUrl = enclosure?.['@_url'];

  const itunesImage = item?.['itunes:image']?.['@_href'];
  const episodeNumber = Number(item?.['itunes:episode']);

  return {
    guid: String(guid),
    slug: slugify(title, String(guid)),
    title,
    publishedAt: item?.pubDate ? new Date(item.pubDate).toISOString() : '',
    description:
      item?.description || item?.['itunes:summary'] || undefined,
    audioUrl: audioUrl ? String(audioUrl) : undefined,
    durationSeconds: parseDuration(item?.['itunes:duration']),
    imageUrl: itunesImage ? String(itunesImage) : undefined,
    episodeNumber: Number.isFinite(episodeNumber) ? episodeNumber : undefined,
  };
}

let cache: { at: number; episodes: Episode[] } | null = null;
const CACHE_MS = 5 * 60 * 1000; // avoid hammering the feed on every request

export async function getEpisodes(): Promise<Episode[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.episodes;

  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Podcast feed responded ${res.status}`);
  const xml = await res.text();

  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  const episodes = items
    .map(toEpisode)
    .filter((ep): ep is Episode => ep !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  cache = { at: Date.now(), episodes };
  return episodes;
}

export async function getEpisode(slug: string): Promise<Episode | null> {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.slug === slug) || null;
}
