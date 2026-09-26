import { createClient } from '@sanity/client';

// Sanity organization: o39n34uh3
// Sanity project: s7qx1s92 (dataset defaults to "production" — create that
// dataset in Sanity if it doesn't exist yet, per the launch checklist).
export const sanity = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 's7qx1s92',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_API_TOKEN || undefined,
});

// This query field name assumes a Sanity document type named "post" with
// the fields referenced below. Create that content type in Sanity Studio
// (checklist phase 02) to match this shape, or adjust the query here once
// the real schema exists.
//
// Podcast episodes are NOT queried from here — they're pulled live from
// the show's RSS feed instead (see src/lib/podcast.ts). The "episode"
// Sanity schema still exists in studio/ but is currently unused by the
// site.

export type BlogTheme = 'good' | 'true' | 'beautiful';

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  theme?: BlogTheme;
  author?: string;
  body?: unknown;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanity.fetch(`*[_type == "post"] | order(publishedAt desc){
    _id, title, "slug": slug.current, publishedAt, excerpt, theme, author
  }`);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, publishedAt, excerpt, theme, author, body
    }`,
    { slug }
  );
}

// ── Resources page ──────────────────────────────────────────────────────
// Must match LIFE_STAGES in studio/schemaTypes/resource.ts (a separate
// package, so it can't be imported from here). Order matters: it's the
// filter-button order and the automatic sort order within a section.
export const LIFE_STAGES = [
  'Childhood',
  'Adolescent',
  'Teen',
  'Young Adult',
  'Engaged',
  'Married',
  'Later Years',
];

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  lifeStages?: string[];
  type?: string;
  source?: 'ours' | 'curated';
  publisher?: string;
  sortOrder?: number;
  fileUrl?: string;
  externalUrl?: string;
};

export type ResourceSection = {
  _id: string;
  title: string;
  blurb?: string;
  items: Resource[];
};

// "Guide · Ours", "Prayer · USCCB", "Books · Curated"
export function resourceLabel(r: Resource): string {
  const from =
    r.source === 'curated' ? r.publisher?.trim() || 'Curated' : 'Ours';
  return [r.type, from].filter(Boolean).join(' · ');
}

// Earliest life stage first ("All stages" — no stages ticked — last),
// then the optional sortOrder, then title.
function compareResources(a: Resource, b: Resource): number {
  const firstStage = (r: Resource) => {
    const idx = (r.lifeStages || [])
      .map((s) => LIFE_STAGES.indexOf(s))
      .filter((i) => i >= 0);
    return idx.length ? Math.min(...idx) : LIFE_STAGES.length;
  };
  return (
    firstStage(a) - firstStage(b) ||
    (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity) ||
    a.title.localeCompare(b.title)
  );
}

export async function getResourceSections(): Promise<ResourceSection[]> {
  const sections: ResourceSection[] = await sanity.fetch(
    `*[_type == "resourceSection"] | order(order asc, title asc){
      _id, title, blurb,
      "items": *[_type == "resource" && references(^._id)]{
        _id, title, description, lifeStages, type, source, publisher,
        sortOrder, externalUrl, "fileUrl": file.asset->url
      }
    }`
  );
  return sections
    .map((s) => ({
      ...s,
      items: [...(s.items || [])].sort(compareResources),
    }))
    .filter((s) => s.items.length > 0);
}

// "What This Rests On" at the bottom of the Resources page.
export type ChurchDocument = {
  _id: string;
  title: string;
  meta?: string;
  description?: string;
  url: string;
  linkLabel?: string;
  passages?: { _key: string; label: string; url: string }[];
};

export async function getChurchDocuments(): Promise<ChurchDocument[]> {
  return sanity.fetch(
    `*[_type == "churchDocument"] | order(order asc, title asc){
      _id, title, meta, description, url, linkLabel, passages
    }`
  );
}
