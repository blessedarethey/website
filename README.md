# Blessed Are They — website

Astro (SSR) site backed by Sanity, deployed to Netlify.

## Stack

- **Astro** — `output: 'server'`, so pages render per-request. Needed once the
  donation portal and subscriber login are added (both require server code).
- **Sanity** — content backend (blog posts, podcast episodes). Project ID
  `s7qx1s92`, organization `o39n34uh3`, dataset `production`.
- **Netlify** — hosting, via the `@astrojs/netlify` adapter.

## Local development

```bash
cp .env.example .env   # fill in real values if they differ
npm install
npm run dev
```

## Content

Blog posts and podcast episodes are read from Sanity document types named
`post` and `episode` (see `src/lib/sanity.ts` for the expected fields).
Those document types still need to be created in Sanity Studio — until then,
`/blog` and `/podcast` render an empty state rather than erroring.

## Known issue

Astro is pinned to `7.2.10` (not `^7.2.10`) because `astro@7.3.0` broke an
internal export that `@astrojs/netlify@8.2.5` depends on, and the build fails
under that combination. Safe to bump once the adapter publishes a fix —
just confirm `npm run build` still succeeds before merging the upgrade.

## Status

Early scaffold: Home, About, Blog, and Podcast pages exist with placeholder
copy. Donations, subscriber login, and the real visual design are later
phases — see the launch checklist for the full sequence.
