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

// These query field names assume Sanity document types named "post" and
// "episode" with the fields referenced below. Create those content types
// in Sanity Studio (checklist phase 02) to match this shape, or adjust the
// queries here once the real schema exists.

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  body?: unknown;
};

export type PodcastEpisode = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  audioUrl?: string;
  description?: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanity.fetch(`*[_type == "post"] | order(publishedAt desc){
    _id, title, "slug": slug.current, publishedAt, excerpt
  }`);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, publishedAt, excerpt, body
    }`,
    { slug }
  );
}

export async function getEpisodes(): Promise<PodcastEpisode[]> {
  return sanity.fetch(`*[_type == "episode"] | order(publishedAt desc){
    _id, title, "slug": slug.current, publishedAt, audioUrl, description
  }`);
}

export async function getEpisode(slug: string): Promise<PodcastEpisode | null> {
  return sanity.fetch(
    `*[_type == "episode" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, publishedAt, audioUrl, description
    }`,
    { slug }
  );
}
