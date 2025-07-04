'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';

interface SearchFilters {
  query: string;
  year: string;
  branch: string;
  type: string;
}

interface PaperSearchProps {
  onSearchAction: (filters: SearchFilters) => void;
  onResetAction: () => void;
  isLoading?: boolean;
}

export default function PaperSearch({ onSearchAction, onResetAction, isLoading = false }: PaperSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    year: 'all',
    branch: 'all',
    type: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    const searchFilters = {
      query: filters.query,
      year: filters.year === 'all' ? '' : filters.year,
      branch: filters.branch === 'all' ? '' : filters.branch,
      type: filters.type === 'all' ? '' : filters.type
    };
    onSearchAction(searchFilters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      year: 'all',
      branch: 'all',
      type: 'all'
    });
    setIsExpanded(false);
    onResetAction();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = filters.query || (filters.year !== 'all') || (filters.branch !== 'all') || (filters.type !== 'all');

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search papers by title..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button onClick={handleSearch} disabled={isLoading} className="shrink-0">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Expanded filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select
                  value={filters.branch}
                  onValueChange={(value) => setFilters({ ...filters, branch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="ECE">Electronics & Communication Engineering</SelectItem>
                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="INTERNAL">Internal Exam</SelectItem>
                    <SelectItem value="SEMESTER">Semester Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active filters indicator and reset button */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {filters.query && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Title: &quot;{filters.query}&quot;
                  </span>
                )}
                {filters.year !== 'all' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Year: {filters.year}
                  </span>
                )}
                {filters.branch !== 'all' && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    Branch: {filters.branch}
                  </span>
                )}
                {filters.type !== 'all' && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                    Type: {filters.type === 'INTERNAL' ? 'Internal' : 'Semester'}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}