'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Download, Eye } from 'lucide-react';
import { branches, questionTypes, years, semesters } from '@/lib/utils';
import { QuestionPaper } from '@/types';
import { toast } from 'sonner';

export default function PaperFilter() {
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    semester: '',
    questionType: '',
  });

  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchFilteredPapers = async (currentFilters: typeof filters) => {
    if (!currentFilters.year && !currentFilters.branch && !currentFilters.semester && !currentFilters.questionType) {
      setFilteredPapers([]);
      return;
    }

    setIsFetching(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.year) params.append('year', currentFilters.year);
      if (currentFilters.branch) params.append('branch', currentFilters.branch);
      if (currentFilters.semester) params.append('semester', currentFilters.semester);
      if (currentFilters.questionType) params.append('questionType', currentFilters.questionType);

      const response = await fetch(`/api/papers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredPapers(data);
      } else {
        toast.error('Failed to fetch papers');
        setFilteredPapers([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error fetching papers');
      setFilteredPapers([]);
    } finally {
      setIsFetching(false);
    }
  };
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchFilteredPapers(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      year: '',
      branch: '',
      semester: '',
      questionType: '',
    };
    setFilters(newFilters);
    setFilteredPapers([]);
  };

  const handleDownload = async (paper: QuestionPaper) => {
    setDownloadingId(paper.id);
    toast.loading('Downloading...', { id: `download-${paper.id}` });

    try {
      // Fetch the file as a blob
      const response = await fetch(paper.fileUrl);

      if (!response.ok) {
        throw new Error('File not accessible');
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${paper.title}.pdf`;

      // Add to DOM, click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);

      toast.success('Download completed', { id: `download-${paper.id}` });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.', { id: `download-${paper.id}` });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Question Papers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.value} value={semester.value}>
                    {semester.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.questionType} onValueChange={(value) => handleFilterChange('questionType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {filteredPapers.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900">
              Available Papers
              <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredPapers.length}
              </span>
            </h3>
            <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2" role="list" aria-label="Filtered question papers">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" title={paper.title}>{paper.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="inline-block">{paper.year}</span>
                      <span className="mx-1">•</span>
                      <span className="inline-block">{paper.branch}</span>
                      <span className="mx-1">•</span>
                      <span className="inline-block">Sem {paper.semester}</span>
                      <span className="mx-1">•</span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                        {paper.questionType === 'INTERNAL' ? 'Internal' : 'Semester'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      aria-label={`View ${paper.title}`}
                    >
                      <Link href={`/papers/${paper.id}`}>
                        <>
                          <Eye className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </>
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(paper)}
                      disabled={downloadingId === paper.id}
                      aria-label={`Download ${paper.title}`}
                    >
                      <Download className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {downloadingId === paper.id ? 'Downloading...' : 'Download'}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-sm font-medium">Searching papers...</p>
              </div>
            ) : (
              <>
                <Filter className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No papers match your filters</p>
                <p className="text-xs mt-1">Try adjusting your filter criteria to view papers</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}