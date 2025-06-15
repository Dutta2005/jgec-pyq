'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings } from 'lucide-react';
import PaperFilter from '@/components/PaperFilter';
import { QuestionPaper } from '@/types';
import Link from 'next/link';
import logo from '@/public/jgec.png';

export default function HomePage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
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
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* <GraduationCap className="h-8 w-8 text-primary" />*/}
              <img src={logo.src} alt="JGEC Logo" className="h-12 w-12" />
              <h1 className="text-xl font-bold">JGEC Question Papers</h1>
            </div>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Download Previous Year Question Papers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access previous year question papers for all branches and semesters. 
            Filter by year, branch, semester, and question type to find exactly what you need.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Question Papers Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
                      <div className="text-sm text-blue-800">Total Papers</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {new Set(papers.map(p => p.branch)).size}
                      </div>
                      <div className="text-sm text-green-800">Branches</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(papers.map(p => p.year)).size}
                      </div>
                      <div className="text-sm text-purple-800">Years</div>
                    </div>
                  </div>
                  
                  <PaperFilter papers={papers} onFilterChange={handleFilterChange} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 College Question Papers Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}