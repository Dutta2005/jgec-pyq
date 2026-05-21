import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jgec-pyq.vercel.app';

  // Fetch all papers for dynamic routes
  const papers = await prisma.questionPaper.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const paperUrls: MetadataRoute.Sitemap = papers.map((paper: { id: string; updatedAt: Date }) => ({
    url: `${baseUrl}/papers/${paper.id}`,
    lastModified: paper.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...paperUrls,
  ];
}
