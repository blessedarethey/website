# Blessed Are They — website

Astro (SSR) site backed by Sanity, deployed to Cloudflare Workers.

## Stack

- **Astro** — `output: 'server'`, so pages render per-request. Needed once the
  donation portal and subscriber login are added (both require server code).
- **Sanity** — content backend (blog posts, podcast episodes). Project ID
  `s7qx1s92`, organization `o39n34uh3`, dataset `production`.
- **Cloudflare Workers** — hosting, via the `@astrojs/cloudflare` adapter.
  Cloudflare builds and deploys automatically on every push to `main`
  (Workers Builds: `npm run build`, then `npx wrangler deploy`). Worker
  settings live in `wrangler.jsonc`.

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

## Versions

`astro` and `@astrojs/cloudflare` are pinned to exact versions because the
adapter depends on Astro internals and needs a matching Astro release. When
upgrading, bump them together and confirm `npm run build` still succeeds
before merging.

To try the production build locally the way Cloudflare runs it:

```bash
npm run build
npx wrangler dev
```

## Status

Early scaffold: Home, About, Blog, and Podcast pages exist with placeholder
copy. Donations, subscriber login, and the real visual design are later
phases — see the launch checklist for the full sequence.
