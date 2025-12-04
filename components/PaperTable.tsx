'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Eye, Edit } from 'lucide-react';
import { QuestionPaper } from '@/types';
import { toast } from 'sonner';

interface PaperTableProps {
  papers: QuestionPaper[];
  onDeleteSuccessAction: () => void;
  onUpdateClick?: (paper: QuestionPaper) => void;
}

export default function PaperTable({ papers, onDeleteSuccessAction, onUpdateClick }: PaperTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/papers?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast("Question paper deleted successfully");
        onDeleteSuccessAction();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.log('Delete error:', error);
      toast("Failed to delete question paper");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (paper: QuestionPaper) => {
    if (onUpdateClick) {
      onUpdateClick(paper);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                <span className="font-semibold">Title</span>
              </TableHead>
              <TableHead className="min-w-[80px]">
                <span className="font-semibold">Year</span>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <span className="font-semibold">Branch</span>
              </TableHead>
              <TableHead className="min-w-[90px]">
                <span className="font-semibold">Semester</span>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <span className="font-semibold">Type</span>
              </TableHead>
              <TableHead className="min-w-[110px]">
                <span className="font-semibold">Uploaded</span>
              </TableHead>
              <TableHead className="min-w-[140px]">
                <span className="font-semibold">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Eye className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium">No question papers found</p>
                    <p className="text-sm text-gray-400 mt-1">Papers will appear here once uploaded</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              papers.map((paper) => (
                <TableRow key={paper.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">
                    <span className="line-clamp-2" title={paper.title}>{paper.title}</span>
                  </TableCell>
                  <TableCell className="text-gray-700">{paper.year}</TableCell>
                  <TableCell className="text-gray-700">{paper.branch}</TableCell>
                  <TableCell className="text-gray-700">{paper.semester}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      paper.questionType === 'INTERNAL' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {paper.questionType === 'INTERNAL' ? 'Internal' : 'Semester'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 whitespace-nowrap">{formatDate(paper.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        asChild
                        title="View paper"
                        aria-label={`View ${paper.title}`}
                      >
                        <a href={`/papers/${paper.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdate(paper)}
                        className="cursor-pointer"
                        title="Edit paper details"
                        aria-label={`Edit ${paper.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled={deletingId === paper.id} 
                            className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            title="Delete paper"
                            aria-label={`Delete ${paper.title}`}
                          >
                            {deletingId === paper.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question Paper</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{paper.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(paper.id)}
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
