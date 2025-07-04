'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Upload, FileText, BarChart3, Users, Edit } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import FileUpload from '@/components/FileUpload';
import PaperTable from '@/components/PaperTable';
import PaperSearch from '@/components/PaperSearch';
import { QuestionPaper } from '@/types';
import { toast } from 'sonner';

interface SearchFilters {
  query: string;
  year: string;
  branch: string;
  type: string;
}

export default function AdminDashboardPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    query: '',
    year: '',
    branch: '',
    type: ''
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    year: '',
    semester: '',
    branch: '',
    questionType: ''
  });

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    // Update filtered papers when papers change
    setFilteredPapers(papers);
  }, [papers]);

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

  const handleSearch = async (filters: SearchFilters) => {
    setIsSearching(true);
    setActiveFilters(filters);
    
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.year) params.append('year', filters.year);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.type) params.append('type', filters.type);

      const response = await fetch(`/api/papers/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredPapers(data);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast("Failed to search papers");
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetSearch = () => {
    setActiveFilters({
      query: '',
      year: '',
      branch: '',
      type: ''
    });
    setFilteredPapers(papers);
  };

  const handleUploadSuccess = () => {
    fetchPapers();
  };

  const handleDeleteSuccess = () => {
    fetchPapers();
  };

  const handleUpdateClick = (paper: QuestionPaper) => {
    setEditingPaper(paper);
    setEditForm({
      title: paper.title,
      year: paper.year.toString(),
      semester: paper.semester.toString(),
      branch: paper.branch,
      questionType: paper.questionType
    });
  };

  const handleUpdateSubmit = async () => {
    if (!editingPaper) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/papers/${editingPaper.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          year: parseInt(editForm.year),
          semester: parseInt(editForm.semester),
          branch: editForm.branch,
          questionType: editForm.questionType,
        }),
      });

      if (response.ok) {
        toast("Question paper updated successfully");
        fetchPapers();
        setEditingPaper(null);
        setEditForm({
          title: '',
          year: '',
          semester: '',
          branch: '',
          questionType: ''
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast("Failed to update question paper");
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = {
    totalPapers: papers.length,
    branches: new Set(papers.map(p => p.branch)).size,
    years: new Set(papers.map(p => p.year)).size,
    internal: papers.filter(p => p.questionType === 'INTERNAL').length,
    semester: papers.filter(p => p.questionType === 'SEMESTER').length,
  };

  const hasActiveSearch = activeFilters.query || activeFilters.year || activeFilters.branch || activeFilters.type;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage question papers and view statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPapers}</p>
                  <p className="text-sm text-gray-600">Total Papers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.branches}</p>
                  <p className="text-sm text-gray-600">Branches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.years}</p>
                  <p className="text-sm text-gray-600">Years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">I</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.internal}</p>
                  <p className="text-sm text-gray-600">Internal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.semester}</p>
                  <p className="text-sm text-gray-600">Semester</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Papers
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manage Papers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUpload onUploadSuccessAction={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-4">
              {/* Search Component */}
              <PaperSearch
                onSearchAction={handleSearch}
                onResetAction={handleResetSearch}
                isLoading={isSearching}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Manage Question Papers</span>
                    {hasActiveSearch && (
                      <span className="text-sm font-normal text-gray-600">
                        Showing {filteredPapers.length} of {papers.length} papers
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {hasActiveSearch 
                      ? 'Search results - view, download, edit, and delete question papers'
                      : 'View, download, edit, and delete uploaded question papers'
                    }
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <PaperTable 
                      papers={filteredPapers} 
                      onDeleteSuccessAction={handleDeleteSuccess}
                      onUpdateClick={handleUpdateClick}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <AlertDialog open={!!editingPaper} onOpenChange={(open) => !open && setEditingPaper(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Question Paper
              </AlertDialogTitle>
              <AlertDialogDescription>
                Update the details of the question paper. Changes will be saved immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Enter paper title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Select
                    value={editForm.year}
                    onValueChange={(value) => setEditForm({ ...editForm, year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 4 }, (_, i) => {
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
                  <Label htmlFor="edit-semester">Semester</Label>
                  <Select
                    value={editForm.semester}
                    onValueChange={(value) => setEditForm({ ...editForm, semester: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-branch">Branch</Label>
                <Select
                  value={editForm.branch}
                  onValueChange={(value) => setEditForm({ ...editForm, branch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="edit-type">Question Type</Label>
                <Select
                  value={editForm.questionType}
                  onValueChange={(value) => setEditForm({ ...editForm, questionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNAL">Internal Exam</SelectItem>
                    <SelectItem value="SEMESTER">Semester Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdating}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUpdateSubmit}
                disabled={isUpdating || !editForm.title || !editForm.year || !editForm.semester || !editForm.branch || !editForm.questionType}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Paper'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}