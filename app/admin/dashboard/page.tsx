'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, BarChart3, Users } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import FileUpload from '@/components/FileUpload';
import PaperTable from '@/components/PaperTable';
import { QuestionPaper } from '@/types';

export default function AdminDashboardPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
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
      }
    } catch (error) {
      console.error('Failed to fetch papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchPapers();
  };

  const handleDeleteSuccess = () => {
    fetchPapers();
  };

  const stats = {
    totalPapers: papers.length,
    branches: new Set(papers.map(p => p.branch)).size,
    years: new Set(papers.map(p => p.year)).size,
    internal: papers.filter(p => p.questionType === 'INTERNAL').length,
    semester: papers.filter(p => p.questionType === 'SEMESTER').length,
  };

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
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Question Papers</CardTitle>
                <p className="text-sm text-gray-600">
                  View, download, and delete uploaded question papers
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <PaperTable papers={papers} onDeleteSuccess={handleDeleteSuccess} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}