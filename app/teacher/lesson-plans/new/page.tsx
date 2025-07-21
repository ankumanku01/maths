'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default function NewLessonPlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    subject: '',
    duration: '',
    learningObjectives: [''],
    materialsNeeded: [''],
  });
  const [uploadedFile, setUploadedFile] = useState<{ url: string; filename: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const lessonPlanData = {
        ...formData,
        pdfFile: uploadedFile?.url,
      };

      const response = await fetch('/api/teacher/lesson-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonPlanData),
      });

      if (response.ok) {
        router.push('/teacher/lesson-plans');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create lesson plan');
      }
    } catch (error) {
      console.error('Error creating lesson plan:', error);
      alert('Error creating lesson plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addListItem = (field: 'learningObjectives' | 'materialsNeeded') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'learningObjectives' | 'materialsNeeded', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'learningObjectives' | 'materialsNeeded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Lesson Plan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Design and organize your lesson content with learning objectives and materials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="e.g., Introduction to Fractions"
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
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade *
              </label>
              <select
                required
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="input-field"
              >
                <option value="">Select Grade</option>
                <option value="1st Grade">1st Grade</option>
                <option value="2nd Grade">2nd Grade</option>
                <option value="3rd Grade">3rd Grade</option>
                <option value="4th Grade">4th Grade</option>
                <option value="5th Grade">5th Grade</option>
                <option value="6th Grade">6th Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="input-field"
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English Language Arts">English Language Arts</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Art">Art</option>
                <option value="Physical Education">Physical Education</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              placeholder="Brief description of the lesson..."
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Objectives</h2>
          <p className="text-sm text-gray-600 mb-4">
            What should students be able to do after this lesson?
          </p>
          <div className="space-y-3">
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateListItem('learningObjectives', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Learning objective ${index + 1}`}
                />
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('learningObjectives', index)}
                    className="btn-secondary px-3"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('learningObjectives')}
              className="btn-secondary text-sm"
            >
              + Add Objective
            </button>
          </div>
        </div>

        {/* Materials Needed */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Materials Needed</h2>
          <p className="text-sm text-gray-600 mb-4">
            List all materials and resources required for this lesson.
          </p>
          <div className="space-y-3">
            {formData.materialsNeeded.map((material, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => updateListItem('materialsNeeded', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Material ${index + 1}`}
                />
                {formData.materialsNeeded.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('materialsNeeded', index)}
                    className="btn-secondary px-3"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('materialsNeeded')}
              className="btn-secondary text-sm"
            >
              + Add Material
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Lesson Plan Document</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload your detailed lesson plan PDF document.
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
              uploadType="lesson-plan"
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
            {isSubmitting ? 'Creating...' : 'Create Lesson Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
