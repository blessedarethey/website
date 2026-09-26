import { defineField, defineType } from 'sanity';

// One item on the Resources page. Field names and the life-stage values
// must match getResourceSections() and LIFE_STAGES in the site's
// src/lib/sanity.ts — the values double as the filter buttons' labels.
export const LIFE_STAGES = [
  'Childhood',
  'Adolescent',
  'Teen',
  'Young Adult',
  'Engaged',
  'Married',
  'Later Years',
];

const TYPES = [
  'Handout',
  'Chart',
  'Guide',
  'Parent Guide',
  'Checklist',
  'Prayer',
  'Books',
  'Video',
  'Article',
];

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown under the title.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'reference',
      to: [{ type: 'resourceSection' }],
      description: 'Which section of the page this appears in.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lifeStages',
      title: 'Life stages',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: LIFE_STAGES.map((stage) => ({ title: stage, value: stage })),
        layout: 'grid',
      },
      description:
        'Tick every stage this is for. Leave all unticked if it applies to everyone — it will show as "All stages" under every filter.',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: TYPES.map((t) => ({ title: t, value: t })),
      },
      description: 'Shown in the small label, e.g. "Guide · Ours".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Ours (made by Blessed Are They)', value: 'ours' },
          { title: 'Curated (from someone else)', value: 'curated' },
        ],
        layout: 'radio',
      },
      initialValue: 'ours',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher name (optional)',
      type: 'string',
      description:
        'For curated items, shows this instead of "Curated" in the label — e.g. "USCCB".',
      hidden: ({ parent }) => parent?.source !== 'curated',
    }),
    defineField({
      name: 'file',
      title: 'Upload a file',
      type: 'file',
      options: { accept: '.pdf,application/pdf' },
      description:
        'Upload the PDF here. Or paste a link below instead. Leave both empty to show it as "Coming soon".',
    }),
    defineField({
      name: 'externalUrl',
      title: '…or link to it elsewhere',
      type: 'url',
      description: 'For something hosted on another website.',
      validation: (rule) =>
        rule.custom((url, context) => {
          const doc = context.document as { file?: { asset?: unknown } };
          return url && doc?.file?.asset
            ? 'Use either an uploaded file or a link, not both.'
            : true;
        }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order (optional)',
      type: 'number',
      description:
        'Items are sorted by life stage automatically (Childhood first, "All stages" last). Use this only to reorder items within the same stage — lower numbers first.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section.title',
      stages: 'lifeStages',
      hasFile: 'file.asset',
      url: 'externalUrl',
    },
    prepare({ title, section, stages, hasFile, url }) {
      const status = hasFile ? 'PDF' : url ? 'Link' : 'Coming soon';
      const stageText = stages?.length ? stages.join(', ') : 'All stages';
      return {
        title,
        subtitle: [section, stageText, status].filter(Boolean).join(' · '),
      };
    },
  },
});
