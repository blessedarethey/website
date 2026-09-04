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
