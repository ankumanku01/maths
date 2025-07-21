'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default function NewTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonPlanId = searchParams.get('lessonPlan');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: 'pre' as 'pre' | 'post',
    totalMarks: '',
    duration: '',
    instructions: '',
  });
  const [uploadedFile, setUploadedFile] = useState<{ url: string; filename: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, redirect back to tests list - implement test creation API later
      router.push('/teacher/tests');
    } catch (error) {
      console.error('Error creating test:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
        <p className="mt-1 text-sm text-gray-600">
          Design pre or post-lesson assessments to measure student understanding.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="e.g., Fractions Pre-Test"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type *
              </label>
              <select
                required
                value={formData.testType}
                onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value as 'pre' | 'post' }))}
                className="input-field"
              >
                <option value="pre">Pre-Test (Before Lesson)</option>
                <option value="post">Post-Test (After Lesson)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: e.target.value }))}
                className="input-field"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="input-field"
                placeholder="60"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              placeholder="Brief description of the test..."
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              rows={4}
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="input-field"
              placeholder="Instructions for students taking the test..."
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Document</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload your test questions in PDF format. The system will extract questions automatically.
          </p>
          
          {uploadedFile ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium text-green-800">File uploaded successfully</p>
                  <p className="text-sm text-green-600">{uploadedFile.filename}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <FileUpload
              uploadType="test"
              accept=".pdf"
              onUploadComplete={setUploadedFile}
            />
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Creating...' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  );
}
