'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LessonPlan {
  _id: string;
  title: string;
  grade: string;
  subject: string;
  pdfFile?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch('/api/teacher/lesson-plans');
      if (response.ok) {
        const data = await response.json();
        setLessonPlans(data.map((plan: any) => ({
          _id: plan.id,
          title: plan.title,
          grade: plan.grade,
          subject: plan.subject_name || 'General',
          status: plan.status,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at
        })));
      }
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
    }
  };

  const filteredLessonPlans = filter === 'all' 
    ? lessonPlans 
    : lessonPlans.filter(plan => plan.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage your lesson plans and educational content.
          </p>
        </div>
        <Link
          href="/teacher/lesson-plans/new"
          className="btn-primary"
        >
          📚 Create New Lesson Plan
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Plans', count: lessonPlans.length },
            { key: 'published', label: 'Published', count: lessonPlans.filter(p => p.status === 'published').length },
            { key: 'draft', label: 'Drafts', count: lessonPlans.filter(p => p.status === 'draft').length },
            { key: 'archived', label: 'Archived', count: lessonPlans.filter(p => p.status === 'archived').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Lesson Plans Grid */}
      {filteredLessonPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessonPlans.map((plan) => (
            <div key={plan._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    ✏️
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    🗑️
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {plan.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{plan.grade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{plan.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{new Date(plan.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/teacher/lesson-plans/${plan._id}`}
                  className="flex-1 btn-primary text-sm text-center"
                >
                  View Details
                </Link>
                <Link
                  href={`/teacher/tests/new?lessonPlan=${plan._id}`}
                  className="flex-1 btn-secondary text-sm text-center"
                >
                  Create Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No lesson plans yet' : `No ${filter} lesson plans`}
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first lesson plan.
          </p>
          <Link
            href="/teacher/lesson-plans/new"
            className="btn-primary inline-flex items-center"
          >
            📚 Create Your First Lesson Plan
          </Link>
        </div>
      )}
    </div>
  );
}
