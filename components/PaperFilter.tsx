'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Download } from 'lucide-react';
import { branches, questionTypes, years, semesters } from '@/lib/utils';
import { QuestionPaper } from '@/types';
import { toast } from 'sonner';

interface PaperFilterProps {
  papers: QuestionPaper[];
  onFilterChange: (filteredPapers: QuestionPaper[]) => void;
}

export default function PaperFilter({ papers, onFilterChange }: PaperFilterProps) {
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    semester: '',
    questionType: '',
  });

  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Apply filters
    let filtered = papers;

    if (newFilters.year) {
      filtered = filtered.filter(paper => paper.year.toString() === newFilters.year);
    }
    if (newFilters.branch) {
      filtered = filtered.filter(paper => paper.branch === newFilters.branch);
    }
    if (newFilters.semester) {
      filtered = filtered.filter(paper => paper.semester.toString() === newFilters.semester);
    }
    if (newFilters.questionType) {
      filtered = filtered.filter(paper => paper.questionType === newFilters.questionType);
    }

    setFilteredPapers(filtered);
    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      branch: '',
      semester: '',
      questionType: '',
    });
    setFilteredPapers([]);
    onFilterChange(papers);
  };

  const handleDownload = async (paper: QuestionPaper) => {
    setDownloadingId(paper.id);
    
    try {
      // First, try to validate the URL
      const response = await fetch(paper.fileUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error('File not accessible');
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = paper.fileUrl;
      link.target = '_blank';
      link.download = `${paper.title}.pdf`;
      
      // Add to DOM, click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast('Failed to download file. Please try again or contact admin.');
      
      // Fallback: try opening in new tab
      try {
        window.open(paper.fileUrl, '_blank');
      } catch (fallbackError) {
        console.log('Fallback error:', fallbackError);
        toast('Unable to access the file.');
      }
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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

        {filteredPapers.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Available Papers ({filteredPapers.length})</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{paper.title}</p>
                    <p className="text-sm text-gray-500">
                      {paper.year} • {paper.branch} • Semester {paper.semester} • {paper.questionType}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(paper)}
                    disabled={downloadingId === paper.id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingId === paper.id ? 'Downloading...' : 'Download'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}