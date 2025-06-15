export interface QuestionPaper {
  id: string;
  year: number;
  semester: number;
  branch: 'CSE' | 'IT' | 'ECE' | 'EE' | 'ME' | 'CE';
  questionType: 'INTERNAL' | 'SEMESTER';
  title: string;
  fileName: string;
  fileUrl: string;
  cloudinaryId: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface FilterState {
  year: string;
  branch: string;
  semester: string;
  questionType: string;
}

export interface UploadFormData {
  year: number;
  semester: number;
  branch: string;
  questionType: string;
  title: string;
  file: File;
}