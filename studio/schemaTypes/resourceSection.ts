import { defineField, defineType } from 'sanity';

// A shelf on the Resources page ("For Girls", "For Parents", …). Staff can
// add, rename, or reorder these without a code change. Field names must
// match getResourceSections() in the site's src/lib/sanity.ts.
export default defineType({
  name: 'resourceSection',
  title: 'Resource section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section name',
      type: 'string',
      description: 'Shown as the heading of the section, e.g. "For Girls".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blurb',
      title: 'Subtitle',
      type: 'string',
      description:
        'One short line under the heading, e.g. "Before and through puberty".',
    }),
    defineField({
      name: 'order',
      title: 'Order on the page',
      type: 'number',
      description:
        'Lower numbers show first. Sections appear two to a row, left then right.',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Order on the page',
      name: 'pageOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', blurb: 'blurb', order: 'order' },
    prepare({ title, blurb, order }) {
      return {
        title,
        subtitle: [order != null ? `#${order}` : null, blurb]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
