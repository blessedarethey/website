# Blessed Are They — Studio

The Sanity Studio for this project: content schemas for blog posts and
podcast episodes, and where staff log in to publish content. Runs
independently of the Astro site in `../` — separate `package.json`, own
dev server, deployed on its own.

## Schemas

- **`post`** — title, slug, publishedAt, excerpt, body (Portable Text).
- **`episode`** — title, slug, publishedAt, audioUrl, description.

Field names match exactly what `../src/lib/sanity.ts` queries — if you add
or rename a field here, update that file's GROQ queries too.

## Local development

```bash
cp .env.example .env   # fill in real values if they differ
npm install
npm run dev
```

Requires being logged in to the Sanity CLI once per machine:

```bash
npx sanity login
```

## Datasets

This Studio talks to whichever dataset `SANITY_STUDIO_DATASET` points at
(see `.env.example`). Per the launch checklist, `production` should be a
separate dataset from whatever you use for local testing — create it from
the Sanity CLI:

```bash
npx sanity dataset create production
```

or from manage.sanity.io → your project → Datasets → Add dataset.

## Deploying the Studio

Deployed at **https://blessed-are-they.sanity.studio** — this is the URL
staff actually use to publish content; log in there directly rather than
running `npm run dev` locally. Re-deploy the same URL after a schema
change (e.g. adding a field) with:

```bash
npm run deploy
```
