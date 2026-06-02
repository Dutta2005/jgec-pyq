import nextDynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import Header from '@/components/Header';
import { HomePageJsonLd } from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

const PaperFilter = nextDynamic(() => import('@/components/PaperFilter'), {
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

        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-gray-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 rounded-full p-3 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">Help Us Grow the PYQ Collection</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Have a question paper that&apos;s not listed here? You can upload it and help your fellow JGEC students.
                Every single paper you share makes a real difference — your small effort goes a long way for hundreds of students.
              </p>
            </div>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe4Bhsh5KipUv9fcVO22a5-JqOD00gb1bm7xKN7QVovGnKPfw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            id="contribute-button"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-md hover:bg-blue-400 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C12 2 12.8 6.5 14.5 8.5C16.2 10.5 20 12 20 12C20 12 16.2 13.5 14.5 15.5C12.8 17.5 12 22 12 22C12 22 11.2 17.5 9.5 15.5C7.8 13.5 4 12 4 12C4 12 7.8 10.5 9.5 8.5C11.2 6.5 12 2 12 2Z" />
              <path d="M19 2C19 2 19.4 4 20.2 4.8C21 5.6 23 6 23 6C23 6 21 6.4 20.2 7.2C19.4 8 19 10 19 10C19 10 18.6 8 17.8 7.2C17 6.4 15 6 15 6C15 6 17 5.6 17.8 4.8C18.6 4 19 2 19 2Z" />
              <path d="M5 14C5 14 5.3 15.5 5.9 16.1C6.5 16.7 8 17 8 17C8 17 6.5 17.3 5.9 17.9C5.3 18.5 5 20 5 20C5 20 4.7 18.5 4.1 17.9C3.5 17.3 2 17 2 17C2 17 3.5 16.7 4.1 16.1C4.7 15.5 5 14 5 14Z" />
            </svg>
            Contribute Here
          </a>
        </div>

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