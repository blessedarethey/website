import { defineCliConfig } from 'sanity/cli';

// Used by the `sanity` CLI itself (deploy, dataset management, etc.) —
// separate from sanity.config.ts, which the Studio app reads at runtime.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 's7qx1s92',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
