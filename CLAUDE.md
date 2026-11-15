# Notes for Claude

Website for Blessed Are They, a Catholic nonprofit: https://www.blessedarethey.com

## Working with the owner

- The owner is not a developer. Give one step at a time in plain language,
  with exact Terminal commands to copy and paste. Ask for a screenshot when
  they're on an unfamiliar screen (Cloudflare, GitHub, Sanity) rather than
  guessing what they see.
- Flow for every change:
  1. Make the change on a new branch, check it with `npm run build` (and
     screenshots at desktop and phone widths for visual changes), commit, push.
  2. Give them commands to test it locally. Their copy of the repo is
     `~/Desktop/bat-website-test`:
     ```bash
     cd ~/Desktop/bat-website-test
     git fetch origin BRANCH
     git checkout -b BRANCH origin/BRANCH
     npm install
     npm run dev
     ```
     Then they open http://localhost:4321. (Ctrl+C stops the server.)
  3. They reply "it works, merge it". Then fast-forward the branch into
     `main`, push, and delete the branch. Cloudflare publishes `main`
     automatically in a couple of minutes.
- Afterward, they can get back to main with
  `git checkout main && git pull`.
- Check the site on phone widths too. Mobile layout has needed fixes
  before.

## How the site works

- **Astro** (`output: 'server'`): pages render on each request, so new
  Sanity content and podcast episodes appear without a rebuild.
- **Hosting: Cloudflare Workers** via `@astrojs/cloudflare` (moved from
  Netlify in Nov 2026). Workers Builds runs `npm run build` and then
  `npx wrangler deploy` on every push to `main`. Worker name:
  `blessedarethey-website`. Settings are in `wrangler.jsonc`. The root
  domain redirects to www with a Cloudflare Redirect Rule.
- `astro`, `@astrojs/cloudflare` and `wrangler` are pinned to exact
  versions. Upgrade them together and confirm the build still passes.
- **Sanity** (project `s7qx1s92`, dataset `production`) holds the blog
  posts, resources, resource sections and church documents. Schemas are in
  `studio/schemaTypes`. After a schema change, the owner runs
  `npm run deploy` inside `studio/` to update the hosted Studio. Page code
  is in `src/lib/sanity.ts`.
- **Podcast** episodes come from the Spotify/Anchor RSS feed in
  `src/lib/podcast.ts`.
- **Shared settings:** site-wide text such as the description is in
  `src/lib/site.ts`. Nav links are in `src/lib/nav.ts`. The header, footer,
  SEO tags and Google Analytics (`G-JNDCM9YMFR`) are in
  `src/layouts/Layout.astro`.
- `src/pages/sitemap.xml.ts` builds the sitemap. Add new pages there.
- The owner keeps a "Publishing Blog/Resources to the BAT Website" guide as
  a claude.ai artifact
  (https://claude.ai/artifact/1pwo57xLQz6g3FezpDadYf). Update it when the
  publishing steps in Sanity change.

## Design system

The brand's design system is a claude.ai artifact:
https://claude.ai/artifact/DDznxvBuZAqYYRpq4JgUao. Use the Artifact tool's
`read` action to read `project/README.md` (the brand book) and
`project/tokens.json` (exact values). Read it before any visual change, and
follow it over older designs.

- The site's color, font and spacing variables are in
  `src/styles/global.css`, under the same names as the tokens
  (`--color-cream`, `--font-serif`, and so on). Use the variables. Don't
  type hex values into pages.
- The essentials:
  - Grounds are cream, stone and white. Ink is charcoal, with `heading` for
    headings.
  - The accents (amber, rose, sage, dusk) are fills and rules only, never
    text on a light ground. Their `deep-` partners are for text.
  - The one action color is `deep-rose` with white text.
  - Three items side by side take amber, rose and sage, in that order.
  - Fonts: Roca for headlines (italic, never uppercase), Karla for body text
    and uppercase labels, Sorts Mill Goudy for Scripture and Church
    quotations.
  - Flat design: rules instead of boxes, no shadows, no gradients, no emoji.
- The system's print-only parts (workbooks, covers, flyers) and the extra
  print colors aren't used on the website.

## Decisions already made

- Email sign-ups go to Kit (the form posts directly to Kit). Don't store
  sign-ups in Sanity. That idea was dropped.
- No public street address anywhere on the site.
- No YouTube link in the footer. Facebook and Instagram only.
- The Venmo QR code on the donate page is black.
- Don't guess who is in a photo. Ask the owner to confirm names before
  using it.
- Don't run `npm audit fix --force`. It makes breaking upgrades.
- The owner's email address is private. Keep it out of the code and out
  of commit messages.
