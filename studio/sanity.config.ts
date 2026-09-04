import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

// Env vars here must use the SANITY_STUDIO_ prefix — that's the only
// prefix Sanity Studio's Vite-based dev server exposes to client code.
// See .env.example for the values to copy into a local .env.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 's7qx1s92';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'blessed-are-they',
  title: 'Blessed Are They',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
