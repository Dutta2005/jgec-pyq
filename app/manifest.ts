import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JGEC PYQ - Previous Year Question Papers',
    short_name: 'JGEC PYQ',
    description:
      'Download free JGEC (Jalpaiguri Government Engineering College) previous year question papers for CSE, IT, ECE, EE, ME, CE — all semesters.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f4ff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/jgec.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/jgec.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
