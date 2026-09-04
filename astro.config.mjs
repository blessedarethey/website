import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// SSR ('server') rather than static output — the donation portal and the
// subscriber login (added in later phases) both need server-side code to
// run on each request, not just at build time.
export default defineConfig({
  output: 'server',
  adapter: netlify({
    // Local-dev-only emulation features. edgeFunctions is off because this
    // project has no netlify/edge-functions directory — the adapter still
    // tries to spawn a local Deno server for it by default, and on a
    // machine without a compatible Deno install that hangs `astro dev`
    // with an unhandled rejection before any page can render.
    devFeatures: { edgeFunctions: false },
  }),
  site: 'https://blessedarethey.org', // TODO: replace with the real domain once purchased/confirmed
  // The Netlify adapter auto-enables session storage via Netlify Blobs unless
  // told otherwise, which pushed the account toward a paid plan before we
  // needed it. Nothing on the site uses sessions yet — turn this back on
  // (remove the `false` and configure a driver) once the subscriber-login
  // phase actually needs them.
  session: false,
});
