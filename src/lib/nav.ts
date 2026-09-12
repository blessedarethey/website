// Site-wide nav — shared by the header (link list + active-state coloring)
// and anywhere else that needs to link to a section. `key` matches the
// `active` prop pages pass to <Layout>. Podcast/Blog already exist as real
// Astro routes; the rest are real hrefs pages will fill in as they're built.
export type NavKey =
  | 'home'
  | 'about'
  | 'curriculum'
  | 'events'
  | 'podcast'
  | 'blog'
  | 'merch'
  | 'resources'
  | 'educator-portal'
  | 'donate';

// Merch and Educator Portal are temporarily pulled from the nav at the
// user's request (not ready for visitors yet) — the pages themselves still
// exist (see src/pages/merch.astro and educator-portal.astro, each with
// its own redirect that this note points back to) so re-adding these two
// lines is all it takes to bring both back.
export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'curriculum', label: 'Curriculum', href: '/curriculum' },
  { key: 'events', label: 'Events', href: '/events' },
  { key: 'podcast', label: 'Podcast', href: '/podcast' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'resources', label: 'Resources', href: '/resources' },
];

export const DONATE_HREF = '/donate';
