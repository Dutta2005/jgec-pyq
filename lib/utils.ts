import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const branches = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'EE', label: 'Electrical Engineering' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
];

export const questionTypes = [
  { value: 'INTERNAL', label: 'Internal Exam' },
  { value: 'SEMESTER', label: 'Semester Exam' },
];

export const years = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

export const semesters = Array.from({ length: 8 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Semester ${i + 1}`,
}));