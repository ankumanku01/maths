export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'parent';
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade: string;
  photo?: string;
  parents: string[]; // Parent user IDs
  teachers: string[]; // Teacher user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonPlan {
  _id: string;
  title: string;
  grade: string;
  subject: string;
  teacher: string; // Teacher user ID
  pdfFile: string;
  extractedText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Test {
  _id: string;
  title: string;
  type: 'pre' | 'post';
  lessonPlan: string; // LessonPlan ID
  teacher: string; // Teacher user ID
  pdfFile: string;
  extractedText?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id: string;
  questionText: string;
  marks: number;
  order: number;
}

export interface StudentResult {
  _id: string;
  student: string; // Student ID
  test: string; // Test ID
  answers: Answer[];
  totalMarks: number;
  obtainedMarks: number;
  createdAt: Date;
}

export interface Answer {
  question: string; // Question ID
  answer: string;
  marksObtained: number;
}

export interface Message {
  _id: string;
  from: string; // User ID
  to: string; // User ID
  student?: string; // Student ID (if message is about a specific student)
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
}
