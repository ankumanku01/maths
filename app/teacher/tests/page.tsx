'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Test {
  id: string;
  title: string;
  test_type: 'pre' | 'post';
  lesson_plan_title: string;
  total_marks: number;
  status: string;
  created_at: string;
}

export default function TeacherTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [filter, setFilter] = useState<'all' | 'pre' | 'post'>('all');

  useEffect(() => {
    // For now, show empty state - implement tests API later
    setTests([]);
  }, []);

  const filteredTests = filter === 'all' ? tests : tests.filter(test => test.test_type === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tests & Assessments</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage pre and post-lesson assessments.
          </p>
        </div>
        <Link
          href="/teacher/tests/new"
          className="btn-primary"
        >
          📝 Create New Test
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Tests', count: tests.length },
            { key: 'pre', label: 'Pre-Tests', count: tests.filter(t => t.test_type === 'pre').length },
            { key: 'post', label: 'Post-Tests', count: tests.filter(t => t.test_type === 'post').length },
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

      {/* Tests List */}
      {filteredTests.length > 0 ? (
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div key={test.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                  <p className="text-sm text-gray-600">
                    {test.test_type === 'pre' ? 'Pre-Test' : 'Post-Test'} • {test.lesson_plan_title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Marks: {test.total_marks} • Created: {new Date(test.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  test.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests created yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first test to assess student understanding before and after lessons.
          </p>
          <Link
            href="/teacher/tests/new"
            className="btn-primary inline-flex items-center"
          >
            📝 Create Your First Test
          </Link>
        </div>
      )}
    </div>
  );
}
