# Blessed Are They — Studio

The Sanity Studio for this project: content schemas for blog posts and
podcast episodes, and where staff log in to publish content. Runs
independently of the Astro site in `../` — separate `package.json`, own
dev server, deployed on its own.

## Schemas

- **`post`** — title, slug, publishedAt, excerpt, body (Portable Text).
- **`episode`** — title, slug, publishedAt, audioUrl, description. Unused by
  the live site — podcast episodes are pulled from the RSS feed instead
  (see `../src/lib/podcast.ts`).

Field names match exactly what `../src/lib/sanity.ts` queries — if you add
or rename a field here, update that file's GROQ queries too.

The homepage's email signup form is a Kit (kit.com) embed, not a Sanity
schema — Kit's own dashboard is the subscriber list.

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

## Resources page

The Resources page (`/resources`) is driven by two document types:

- **Resource section** — a shelf on the page ("For Girls", "For Parents",
  …): name, subtitle, and a number for its order on the page.
- **Resource** — one item: title, short description, which section it's
  in, which life stages it's for (none ticked = "All stages"), type,
  source, and either an uploaded PDF, a link, or neither ("coming soon").

Within a section, items sort automatically by their earliest life stage
(Childhood first, "All stages" last); the optional **Sort order** field
only reorders items that share a stage.

The life-stage list lives in two places that must match:
`schemaTypes/resource.ts` (the Studio checkboxes) and `LIFE_STAGES` in the
site's `src/lib/sanity.ts` (the page's filter buttons).

A third type, **Church document**, drives the "What This Rests On"
section at the bottom of the page: title, label (e.g. "Encyclical ·
1968"), description, link, optional link text, optional key-passage links
(used for the Catechism), and a number for its order.

### One-time import of the original resources

`seed/resources.ndjson` holds the six sections and 24 resources that were
hard-coded on the page before it moved to Sanity. The 8 PDFs are pulled
from the live site during import. Run once, from this folder:

```bash
npx sanity dataset import seed/resources.ndjson production --replace
```

`--replace` makes it safe to re-run: the documents have fixed IDs, so a
second run overwrites them rather than creating duplicates. Don't re-run
it after staff have started editing resources, or their edits to these
24 items will be overwritten.

The six original Church documents are in `seed/church-documents.ndjson`,
imported the same way:

```bash
npx sanity dataset import seed/church-documents.ndjson --dataset production --replace
```
