'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X } from 'lucide-react';
import { branches, questionTypes, years, semesters } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadSuccessAction: () => void;
}

export default function FileUpload({ onUploadSuccessAction }: FileUploadProps) {
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    branch: '',
    questionType: '',
    title: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.questionType) newErrors.questionType = 'Question type is required';
    if (!file) newErrors.file = 'PDF file is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      // TypeScript guard - validation already ensures file is not null
      if (!file) return;
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('year', formData.year);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('branch', formData.branch);
      uploadFormData.append('questionType', formData.questionType);
      uploadFormData.append('title', formData.title);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        toast.success('Question paper uploaded successfully');
        
        // Reset form
        setFormData({
          year: '',
          semester: '',
          branch: '',
          questionType: '',
          title: '',
        });
        setFile(null);
        setErrors({});
        onUploadSuccessAction();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.log('Upload error:', error);
      toast.error('Failed to upload question paper. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Question Paper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year" className="text-sm font-medium">
                Year <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Select 
                value={formData.year} 
                onValueChange={(value) => {
                  setFormData({ ...formData, year: value });
                  setErrors(prev => ({ ...prev, year: '' }));
                }}
              >
                <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
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
              {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
            </div>

            <div>
              <Label htmlFor="semester" className="text-sm font-medium">
                Semester <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Select 
                value={formData.semester} 
                onValueChange={(value) => {
                  setFormData({ ...formData, semester: value });
                  setErrors(prev => ({ ...prev, semester: '' }));
                }}
              >
                <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
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
              {errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch" className="text-sm font-medium">
                Branch <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Select 
                value={formData.branch} 
                onValueChange={(value) => {
                  setFormData({ ...formData, branch: value });
                  setErrors(prev => ({ ...prev, branch: '' }));
                }}
              >
                <SelectTrigger className={errors.branch ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select branch" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && <p className="text-xs text-red-500 mt-1">{errors.branch}</p>}
            </div>

            <div>
              <Label htmlFor="questionType" className="text-sm font-medium">
                Question Type <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Select 
                value={formData.questionType} 
                onValueChange={(value) => {
                  setFormData({ ...formData, questionType: value });
                  setErrors(prev => ({ ...prev, questionType: '' }));
                }}
              >
                <SelectTrigger className={errors.questionType ? 'border-red-500' : ''}>
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
              {errors.questionType && <p className="text-xs text-red-500 mt-1">{errors.questionType}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500" aria-label="required">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="Enter question paper title"
              className={errors.title ? 'border-red-500' : ''}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && <p id="title-error" className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium">
              PDF File <span className="text-red-500" aria-label="required">*</span>
            </Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 
                errors.file ? 'border-red-500 hover:border-red-600' : 
                'border-gray-300 hover:border-gray-400'
              }`}
              role="button"
              tabIndex={0}
              aria-label="Upload PDF file area"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const dropzone = e.currentTarget;
                  dropzone.click();
                }
              }}
            >
              <input {...getInputProps()} aria-label="PDF file input" />
              {file ? (
                <div className="flex items-center justify-center gap-2 max-w-full">
                  <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate sm:max-w-none max-w-[120px]">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setErrors(prev => ({ ...prev, file: '' }));
                    }}
                    aria-label="Remove selected file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" aria-hidden="true" />
                  <p className="text-lg font-medium text-gray-700">
                    {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">or click to select a file</p>
                  <p className="text-xs text-gray-400 mt-2">Max file size: 5MB • PDF format only</p>
                </div>
              )}
            </div>
            {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading}
            aria-label="Upload question paper"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              'Upload Question Paper'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}