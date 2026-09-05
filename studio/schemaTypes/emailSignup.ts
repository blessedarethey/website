import { defineField, defineType } from 'sanity';

// Written by the site itself (src/pages/api/subscribe.ts) whenever someone
// submits either homepage email form — not something staff create by hand.
// Field names here must match that route's writeClient.create() call.
export default defineType({
  name: 'emailSignup',
  title: 'Email signup',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'list',
      title: 'List',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Early access (Phase I curriculum)', value: 'early-access' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
  ],
  // Newest first, so the most recent signups are always at the top of the
  // document list without staff needing to sort manually.
  orderings: [
    {
      name: 'submittedAtDesc',
      title: 'Submitted at, newest first',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { email: 'email', list: 'list', submittedAt: 'submittedAt' },
    prepare({ email, list, submittedAt }) {
      const listLabel = { newsletter: 'Newsletter', 'early-access': 'Early access' }[
        list as string
      ];
      return {
        title: email,
        subtitle: [listLabel, submittedAt ? new Date(submittedAt).toLocaleString() : null]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
