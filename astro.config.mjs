import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// SSR ('server') rather than static output — the donation portal and the
// subscriber login (added in later phases) both need server-side code to
// run on each request, not just at build time.
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  site: 'https://blessedarethey.org', // TODO: replace with the real domain once purchased/confirmed
});
