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

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'curriculum', label: 'Curriculum', href: '/curriculum' },
  { key: 'events', label: 'Events', href: '/events' },
  { key: 'podcast', label: 'Podcast', href: '/podcast' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'merch', label: 'Merch', href: '/merch' },
  { key: 'resources', label: 'Resources', href: '/resources' },
  { key: 'educator-portal', label: 'Educator Portal', href: '/educator-portal' },
];

export const DONATE_HREF = '/donate';
