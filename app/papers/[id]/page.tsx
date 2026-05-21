import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { prisma } from '@/lib/db';
import Header from '@/components/Header';
import PaperActions from '@/components/PaperActions';
import { PaperJsonLd } from '@/components/JsonLd';

const BRANCH_FULL_NAMES: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  IT: 'Information Technology',
  ECE: 'Electronics & Communication Engineering',
  EE: 'Electrical Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getPaper(id: string) {
  try {
    const paper = await prisma.questionPaper.findUnique({
      where: { id },
    });
    return paper;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPaper(id);

  if (!paper) {
    return {
      title: 'Paper Not Found',
      description: 'The requested question paper could not be found.',
    };
  }

  const branchFullName = BRANCH_FULL_NAMES[paper.branch] || paper.branch;
  const examType = paper.questionType === 'INTERNAL' ? 'Internal Exam' : 'Semester Exam';

  const title = `${paper.branch} Sem ${paper.semester} ${examType} ${paper.year} - JGEC PYQ`;
  const description = `Download ${branchFullName} (${paper.branch}) ${examType} question paper for Semester ${paper.semester}, Year ${paper.year} from JGEC (Jalpaiguri Government Engineering College). Free PDF download.`;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jgec-pyq.vercel.app';

  return {
    title,
    description,
    keywords: [
      'JGEC PYQ',
      `JGEC ${paper.branch} question paper`,
      `JGEC semester ${paper.semester} paper`,
      `${branchFullName} question paper`,
      `JGEC ${paper.year} paper`,
      `JGEC ${examType.toLowerCase()}`,
      'previous year question paper',
      'JGEC exam paper download',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${BASE_URL}/papers/${paper.id}`,
      images: [
        {
          url: '/jgec.png',
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/papers/${paper.id}`,
    },
  };
}

export default async function PaperViewerPage({ params }: PageProps) {
  const { id } = await params;
  const paper = await getPaper(id);

  if (!paper) {
    notFound();
  }

  const branchFullName = BRANCH_FULL_NAMES[paper.branch] || paper.branch;
  const examType = paper.questionType === 'INTERNAL' ? 'Internal Exam' : 'Semester Exam';

  // Serialize dates for the JSON-LD component
  const paperForJsonLd = {
    ...paper,
    uploadedAt: paper.uploadedAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PaperJsonLd paper={paperForJsonLd} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
        {/* Back button */}
        <div>
          <Button variant="ghost" asChild className="-ml-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Papers
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <CardTitle className="text-base sm:text-lg truncate" title={paper.title}>
                  {paper.title}
                </CardTitle>
              </div>
              <PaperActions fileUrl={paper.fileUrl} title={paper.title} />
            </div>
            <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded">{paper.year}</span>
              <span className="px-2 py-1 bg-gray-100 rounded" title={branchFullName}>{paper.branch}</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Semester {paper.semester}</span>
              <span className={`px-2 py-1 rounded ${
                paper.questionType === 'INTERNAL' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {examType}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h1 className="sr-only">
                {paper.title} — {branchFullName} {examType} Semester {paper.semester} ({paper.year}) | JGEC PYQ
              </h1>
              <div className="h-[70vh] border rounded-md overflow-hidden bg-gray-100">
                <iframe
                  src={paper.fileUrl}
                  title={`Question paper: ${paper.title}`}
                  className="w-full h-full"
                  aria-label={`PDF viewer for ${paper.title}`}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Having trouble viewing? Try downloading the PDF or opening it in a new tab.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SEO breadcrumb text */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">JGEC PYQ</Link></li>
            <li aria-hidden="true">/</li>
            <li>{paper.branch}</li>
            <li aria-hidden="true">/</li>
            <li>Semester {paper.semester}</li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{paper.title}</li>
          </ol>
        </nav>
      </main>
    </div>
  );
}
