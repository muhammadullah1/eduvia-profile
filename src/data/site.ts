export const site = {
  name: 'Eduvia',
  productLine: 'School management platform',
  description:
    'Eduvia is the school operations platform from Abler: admissions, academics, attendance, assessments, fees, and family communication in role-based portals built for real school workflows.',
  locale: 'en_US',
  formEndpoint: '/api/contact',
  abler: {
    name: 'Abler Software Solutions',
    tagline: 'Powered by Abler',
    url: 'https://abler.dev',
    email: 'hello@abler.dev',
    phone: '+92 342 9144154',
    phoneHref: 'tel:+923429144154',
    location: 'Peshawar, Pakistan',
  },
} as const;

export const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Platform', href: '/platform' },
  { label: 'Roles', href: '/roles' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  robots?: string;
};

export function pageUrl(path: string, origin: string): string {
  const base = origin.replace(/\/$/, '');
  if (path === '/' || path === '') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
