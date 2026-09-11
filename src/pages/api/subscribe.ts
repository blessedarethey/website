import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

// Separate from the read client in lib/sanity.ts on purpose: writes must
// bypass the CDN (useCdn: false) and need a token with write access, which
// is a different credential than that client's optional read-only token —
// see studio/README.md for how to create SANITY_WRITE_TOKEN.
const writeClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 's7qx1s92',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_LISTS = new Set(['newsletter', 'early-access']);

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: unknown; list?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const list = typeof body.list === 'string' ? body.list : '';

  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }
  if (!VALID_LISTS.has(list)) {
    return json({ error: 'Invalid signup source.' }, 400);
  }

  if (!import.meta.env.SANITY_WRITE_TOKEN) {
    // Deploy is missing SANITY_WRITE_TOKEN — fail with a clear signal in the
    // Netlify function logs rather than a confusing error from Sanity.
    console.error('subscribe: SANITY_WRITE_TOKEN is not set');
    return json({ error: 'Signups are temporarily unavailable — please try again later.' }, 500);
  }

  try {
    await writeClient.create({
      _type: 'emailSignup',
      email,
      list,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('subscribe: Sanity write failed', err);
    return json({ error: 'Something went wrong — please try again.' }, 500);
  }

  return json({ ok: true }, 200);
};
