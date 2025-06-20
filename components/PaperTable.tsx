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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No question papers found
              </TableCell>
            </TableRow>
          ) : (
            papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-medium">{paper.title}</TableCell>
                <TableCell>{paper.year}</TableCell>
                <TableCell>{paper.branch}</TableCell>
                <TableCell>{paper.semester}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    paper.questionType === 'INTERNAL' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {paper.questionType === 'INTERNAL' ? 'Internal' : 'Semester'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(paper.uploadedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdate(paper)}
                      className='cursor-pointer'
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" disabled={deletingId === paper.id} className='cursor-pointer'>
                          <Trash2 className="h-4 w-4" />
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
                          <AlertDialogAction onClick={() => handleDelete(paper.id)}>
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
  );
}