import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// SSR ('server') rather than static output — the blog, podcast, and
// resources pages read Sanity and the podcast feed on each request, so new
// content shows up without a rebuild.
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // Images are already resized ahead of time and served as plain files;
    // 'passthrough' keeps it that way instead of switching on Cloudflare
    // Images (a separate, metered product).
    imageService: 'passthrough',
  }),
  site: 'https://www.blessedarethey.com',
  // Nothing on the site uses sessions yet. With sessions on, the Cloudflare
  // adapter would also provision a KV namespace for them — turn this back
  // on (remove the `false`) once the subscriber-login phase needs it.
  session: false,
});
