import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import Header from '@/components/Header';
import { HomePageJsonLd } from '@/components/JsonLd';

const PaperFilter = dynamic(() => import('@/components/PaperFilter'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-gray-500">Loading filters...</p>
    </div>
  ),
});

async function getStats() {
  try {
    const [
      totalPapers,
      internalPapers,
      semesterPapers,
      distinctBranches,
      distinctYears,
    ] = await Promise.all([
      prisma.questionPaper.count(),
      prisma.questionPaper.count({ where: { questionType: 'INTERNAL' } }),
      prisma.questionPaper.count({ where: { questionType: 'SEMESTER' } }),
      prisma.questionPaper.findMany({
        distinct: ['branch'],
        select: { branch: true },
      }),
      prisma.questionPaper.findMany({
        distinct: ['year'],
        select: { year: true },
      }),
    ]);

    return {
      totalPapers,
      branches: distinctBranches.length,
      years: distinctYears.length,
      internal: internalPapers,
      semester: semesterPapers,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { totalPapers: 0, branches: 0, years: 0, internal: 0, semester: 0 };
  }
}

const BRANCHES = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
];

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HomePageJsonLd />
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <section className="text-center mb-8" aria-labelledby="page-title">
          <h1 id="page-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            JGEC Previous Year Question Papers (PYQ)
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Access and download previous year question papers of{' '}
            <strong>Jalpaiguri Government Engineering College (JGEC)</strong> for all branches and semesters.
            Filter by year, branch, semester, and question type to find exactly what you need.
          </p>
        </section>

        <section className="grid gap-8" aria-labelledby="library-section">
          <Card className="bg-white/80 backdrop-blur-sm shadow-md">
            <CardHeader>
              <CardTitle id="library-section" className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                Question Papers Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalPapers === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Papers Available</h3>
                  <p className="text-gray-600">Question papers will appear here once uploaded by administrators.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="region" aria-label="Library statistics">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                      <div className="text-3xl font-bold text-blue-600" aria-label={`${stats.totalPapers} total papers`}>
                        {stats.totalPapers}
                      </div>
                      <div className="text-sm font-medium text-blue-800 mt-1">Total Papers</div>
                    </div>
                    <div className="bg-green-50 p-5 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                      <div className="text-3xl font-bold text-green-600" aria-label={`${stats.branches} branches available`}>
                        {stats.branches}
                      </div>
                      <div className="text-sm font-medium text-green-800 mt-1">Branches</div>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow">
                      <div className="text-3xl font-bold text-purple-600" aria-label={`${stats.years} years available`}>
                        {stats.years}
                      </div>
                      <div className="text-sm font-medium text-purple-800 mt-1">Years</div>
                    </div>
                  </div>
                  
                  <PaperFilter />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* SEO Content Section — keyword-rich, visible to crawlers */}
        <section className="mt-12 space-y-8" aria-labelledby="about-section">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm border">
            <h2 id="about-section" className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" aria-hidden="true" />
              About JGEC PYQ
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>JGEC PYQ</strong> is a free platform to access previous year question papers of{' '}
              <strong>Jalpaiguri Government Engineering College (JGEC)</strong>, one of the premier government
              engineering colleges in West Bengal, India. Our goal is to help JGEC students prepare better
              for their internal and semester examinations by providing easy access to past exam papers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you are preparing for your semester exams or internal assessments, you can find
              question papers from multiple years, organized by branch, semester, and exam type. All papers
              are available for free download in PDF format.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
              Available Branches
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We provide JGEC previous year question papers for the following engineering branches:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BRANCHES.map((branch) => (
                <div
                  key={branch.code}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-gray-900">{branch.code}</span>
                    <span className="text-gray-600 text-sm ml-2">— {branch.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  What is JGEC PYQ?
                </summary>
                <p className="mt-2 text-gray-700 leading-relaxed pl-4">
                  JGEC PYQ is a free online platform that provides previous year question papers of
                  Jalpaiguri Government Engineering College (JGEC). Students can download papers for all
                  branches including CSE, IT, ECE, EE, ME, and CE.
                </p>
              </details>
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  How do I download JGEC question papers?
                </summary>
                <p className="mt-2 text-gray-700 leading-relaxed pl-4">
                  Simply use the filters above to select your year, branch, semester, and exam type.
                  Then click the download button on any question paper to save it as a PDF file.
                </p>
              </details>
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  Are the question papers free to download?
                </summary>
                <p className="mt-2 text-gray-700 leading-relaxed pl-4">
                  Yes! All JGEC previous year question papers on this platform are completely free to
                  download. No registration or payment required.
                </p>
              </details>
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  Which semesters are covered?
                </summary>
                <p className="mt-2 text-gray-700 leading-relaxed pl-4">
                  We cover question papers for all 8 semesters across all engineering branches at JGEC.
                  Both internal exam and semester exam papers are available.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">&copy; {new Date().getFullYear()} JGEC PYQ — Previous Year Question Papers Portal. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1">
              Jalpaiguri Government Engineering College (JGEC) | Made with ❤️ for students
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}