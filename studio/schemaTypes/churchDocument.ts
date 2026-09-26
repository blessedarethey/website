import { defineArrayMember, defineField, defineType } from 'sanity';

// One entry in the "What This Rests On" section at the bottom of the
// Resources page (Humanae Vitae, Theology of the Body, the Catechism, …).
// Field names must match getChurchDocuments() in the site's
// src/lib/sanity.ts.
export default defineType({
  name: 'churchDocument',
  title: 'Church document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Humanae Vitae".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'meta',
      title: 'Label',
      type: 'string',
      description:
        'The small line above the title — the kind of document and its year, e.g. "Encyclical · 1968".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Where to read it, usually its page on vatican.va.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link text (optional)',
      type: 'string',
      description: 'Leave blank to show "Read at Vatican.va".',
    }),
    defineField({
      name: 'passages',
      title: 'Key passages (optional)',
      type: 'array',
      description:
        'Extra links listed under the description — used for the Catechism\'s four passages. Leave empty for most documents.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'passage',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "1601–1666 · The Sacrament of Matrimony".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order on the page',
      type: 'number',
      description: 'Lower numbers show first.',
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
    select: { title: 'title', meta: 'meta', order: 'order' },
    prepare({ title, meta, order }) {
      return {
        title,
        subtitle: [order != null ? `#${order}` : null, meta]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
