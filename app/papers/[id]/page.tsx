'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';
import type { QuestionPaper } from '@/types';
import Header from '@/components/Header';
import { toast } from 'sonner';

interface ViewerState {
  paper: QuestionPaper | null;
  isLoading: boolean;
  error: string | null;
}

interface PaperViewerPageState extends ViewerState {
  isDownloading: boolean;
}

export default function PaperViewerPage() {
  const params = useParams<{ id: string }>();
  const [state, setState] = useState<PaperViewerPageState>({
    paper: null,
    isLoading: true,
    error: null,
    isDownloading: false,
  });

  useEffect(() => {
    const fetchPaper = async () => {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/papers/${params.id}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Failed to load paper');
        }
        const paper: QuestionPaper = await response.json();
        setState({ paper, isLoading: false, error: null, isDownloading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load paper';
        setState({ paper: null, isLoading: false, error: errorMessage, isDownloading: false });
      }
    };

    fetchPaper();
  }, [params?.id]);

  const handleDownload = async () => {
    if (!state.paper) return;
    
    setState(prev => ({ ...prev, isDownloading: true }));
    toast.loading('Downloading...', { id: 'paper-download' });
    
    try {
      const response = await fetch(state.paper.fileUrl);
      
      if (!response.ok) {
        throw new Error('File not accessible');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${state.paper.title}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(blobUrl);
      
      toast.success('Download completed', { id: 'paper-download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.', { id: 'paper-download' });
    } finally {
      setState(prev => ({ ...prev, isDownloading: false }));
    }
  };

  const { paper, isLoading, error, isDownloading } = state;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                <CardTitle className="text-base sm:text-lg truncate" title={paper?.title}>
                  {paper?.title || 'Loading question paper...'}
                </CardTitle>
              </div>
              {paper && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    aria-label={`Download ${paper.title}`}
                  >
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Open in New Tab</span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
            {paper && (
              <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded">{paper.year}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">{paper.branch}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Semester {paper.semester}</span>
                <span className={`px-2 py-1 rounded ${
                  paper.questionType === 'INTERNAL' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {paper.questionType === 'INTERNAL' ? 'Internal Exam' : 'Semester Exam'}
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 font-medium">Loading question paper...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <p className="font-semibold text-lg text-gray-900 mb-2">Failed to Load Paper</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                  <Button asChild>
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {paper && !isLoading && !error && (
              <div className="space-y-2">
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
