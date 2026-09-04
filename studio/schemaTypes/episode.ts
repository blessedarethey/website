import { defineField, defineType } from 'sanity';

// Field names/shapes here must match the query in the site's
// src/lib/sanity.ts (getEpisodes/getEpisode) — slug.current is what that
// query reads as "slug". audioUrl is a plain URL (not an uploaded file)
// so it can point at wherever the episode is actually hosted — see the
// launch checklist's Podcast phase for choosing a host and deciding how
// episodes appear on the site.
export default defineType({
  name: 'episode',
  title: 'Podcast episode',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      description:
        'Direct link to the episode audio — from the podcast host’s feed once one is chosen.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', publishedAt: 'publishedAt' },
    prepare({ title, publishedAt }) {
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : 'Not published',
      };
    },
  },
});
