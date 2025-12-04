'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText} from 'lucide-react';
import PaperFilter from '@/components/PaperFilter';
import { QuestionPaper } from '@/types';
import Header from '@/components/Header';

export default function HomePage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch('/api/papers');
      if (response.ok) {
        const data = await response.json();
        setPapers(data);
        setFilteredPapers(data);
      }
    } catch (error) {
      console.error('Failed to fetch papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filtered: QuestionPaper[]) => {
    setFilteredPapers(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <section className="text-center mb-8" aria-labelledby="page-title">
          <h1 id="page-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Download Previous Year Question Papers
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Access previous year question papers for all branches and semesters. 
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
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading question papers...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
                </div>
              ) : papers.length === 0 ? (
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
                      <div className="text-3xl font-bold text-blue-600" aria-label={`${papers.length} total papers`}>
                        {papers.length}
                      </div>
                      <div className="text-sm font-medium text-blue-800 mt-1">Total Papers</div>
                    </div>
                    <div className="bg-green-50 p-5 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                      <div className="text-3xl font-bold text-green-600" aria-label={`${new Set(papers.map(p => p.branch)).size} branches available`}>
                        {new Set(papers.map(p => p.branch)).size}
                      </div>
                      <div className="text-sm font-medium text-green-800 mt-1">Branches</div>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow">
                      <div className="text-3xl font-bold text-purple-600" aria-label={`${new Set(papers.map(p => p.year)).size} years available`}>
                        {new Set(papers.map(p => p.year)).size}
                      </div>
                      <div className="text-sm font-medium text-purple-800 mt-1">Years</div>
                    </div>
                  </div>
                  
                  <PaperFilter papers={papers} onFilterChangeAction={handleFilterChange} />
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">&copy; {new Date().getFullYear()} JGEC Question Papers Portal. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1">Made with ❤️ for students</p>
          </div>
        </div>
      </footer>
    </div>
  );
}