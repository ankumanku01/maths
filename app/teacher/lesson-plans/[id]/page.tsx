'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LessonPlan {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  duration_minutes: number;
  learning_objectives: string[];
  materials_needed: string[];
  pdf_file_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function LessonPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLessonPlan();
  }, [params.id]);

  const fetchLessonPlan = async () => {
    try {
      // For now, redirect back to list - implement detail API later
      router.push('/teacher/lesson-plans');
    } catch (error) {
      console.error('Error fetching lesson plan:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/teacher/lesson-plans"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Lesson Plans
        </Link>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lesson Plan Details
        </h1>
        <p className="text-gray-600">
          This feature is coming soon. Please return to the lesson plans list.
        </p>
      </div>
    </div>
  );
}
