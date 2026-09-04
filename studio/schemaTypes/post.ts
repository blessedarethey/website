import { defineField, defineType } from 'sanity';

// Field names/shapes here must match the query in the site's
// src/lib/sanity.ts (getBlogPosts/getBlogPost) — slug.current is what
// that query reads as "slug". body is rendered as real Portable Text
// via @portabletext/to-html on the post page.
export default defineType({
  name: 'post',
  title: 'Blog post',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the blog index.',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'The Good', value: 'good' },
          { title: 'The True', value: 'true' },
          { title: 'The Beautiful', value: 'beautiful' },
        ],
        layout: 'radio',
      },
      description:
        'Which of the three columns this post appears under on the blog index.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Shown as "Written by:" at the end of the post.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
  preview: {
    select: { title: 'title', publishedAt: 'publishedAt', theme: 'theme' },
    prepare({ title, publishedAt, theme }) {
      const themeLabel = { good: 'Good', true: 'True', beautiful: 'Beautiful' }[
        theme as string
      ];
      return {
        title,
        subtitle: [
          themeLabel,
          publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published',
        ]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
