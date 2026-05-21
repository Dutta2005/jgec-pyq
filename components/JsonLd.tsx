import type { QuestionPaper } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jgec-pyq.vercel.app';

const BRANCH_FULL_NAMES: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  IT: 'Information Technology',
  ECE: 'Electronics & Communication Engineering',
  EE: 'Electrical Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
};

export function HomePageJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JGEC PYQ',
    alternateName: 'JGEC Previous Year Questions',
    url: BASE_URL,
    description:
      'Free download of JGEC (Jalpaiguri Government Engineering College) previous year question papers for all branches — CSE, IT, ECE, EE, ME, CE — and all semesters.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Jalpaiguri Government Engineering College',
    alternateName: 'JGEC',
    url: 'https://jgec.ac.in',
    description:
      'Jalpaiguri Government Engineering College (JGEC) is a government engineering college located in Jalpaiguri, West Bengal, India.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}

export function PaperJsonLd({ paper }: { paper: QuestionPaper }) {
  const branchFullName = BRANCH_FULL_NAMES[paper.branch] || paper.branch;
  const examType = paper.questionType === 'INTERNAL' ? 'Internal Exam' : 'Semester Exam';

  const documentSchema = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: paper.title,
    description: `${branchFullName} ${examType} question paper for Semester ${paper.semester}, Year ${paper.year} — JGEC (Jalpaiguri Government Engineering College).`,
    url: `${BASE_URL}/papers/${paper.id}`,
    encodingFormat: 'application/pdf',
    about: {
      '@type': 'Course',
      name: branchFullName,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Jalpaiguri Government Engineering College',
        alternateName: 'JGEC',
      },
    },
    datePublished: paper.uploadedAt,
    dateModified: paper.updatedAt,
    inLanguage: 'en',
    isAccessibleForFree: true,
    keywords: [
      'JGEC PYQ',
      `JGEC ${paper.branch} question paper`,
      `JGEC semester ${paper.semester}`,
      `${branchFullName} question paper`,
      `JGEC ${paper.year} paper`,
      'previous year question paper',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(documentSchema) }}
    />
  );
}
