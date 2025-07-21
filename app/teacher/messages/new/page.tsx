'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade: string;
  parents: Parent[];
}

interface Parent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function NewMessagePage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      const response = await fetch('/api/teacher/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.map((student: any) => ({
          _id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          grade: student.grade,
          parents: student.parents.map((p: any) => ({
            _id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email
          }))
        })));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const selectedStudentData = students.find(s => s._id === selectedStudent);

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
    setSelectedParents([]); // Reset parent selection when student changes
  };

  const handleParentChange = (parentId: string, checked: boolean) => {
    setSelectedParents(prev =>
      checked
        ? [...prev, parentId]
        : prev.filter(id => id !== parentId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const messageData = {
        recipientIds: selectedParents,
        studentId: selectedStudent,
        subject: formData.subject,
        content: formData.content,
      };

      const response = await fetch('/api/teacher/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        router.push('/teacher/messages');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectSuggestions = () => [
    'Academic Progress Update',
    'Homework Assignment Help',
    'Behavior Observation',
    'Upcoming Test Information',
    'Extra Support Recommendation',
    'Positive Achievement Recognition',
    'Parent-Teacher Conference Request'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Send New Message</h1>
        <p className="mt-1 text-sm text-gray-600">
          Communicate with parents about their child's progress and activities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Selection */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Student</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student *
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} - {student.grade}
                </option>
              ))}
            </select>
          </div>

          {/* Parent Selection */}
          {selectedStudentData && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send to Parents *
              </label>
              <div className="space-y-2">
                {selectedStudentData.parents.map((parent) => (
                  <label key={parent._id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedParents.includes(parent._id)}
                      onChange={(e) => handleParentChange(parent._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {parent.firstName} {parent.lastName} ({parent.email})
                    </span>
                  </label>
                ))}
              </div>
              {selectedParents.length === 0 && (
                <p className="text-sm text-red-600 mt-1">Please select at least one parent.</p>
              )}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Message Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="input-field"
              placeholder="Enter message subject..."
              required
            />
            
            {/* Subject Suggestions */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {getSubjectSuggestions().map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, subject: suggestion }))}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content *
            </label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="input-field"
              placeholder="Write your message here..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and constructive in your communication.
            </p>
          </div>
        </div>

        {/* Message Templates */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Message Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Progress Update</h3>
              <p className="text-sm text-gray-600 mb-3">
                Template for sharing academic progress updates.
              </p>
              <button
                type="button"
                onClick={() => setFormData({
                  subject: 'Academic Progress Update',
                  content: `Dear Parent,\n\nI hope this message finds you well. I wanted to share an update on [Student Name]'s academic progress in my class.\n\n[Student Name] has been showing [positive improvements/areas of concern] in [specific subject/skill]. Specifically:\n\n- [Achievement/Observation 1]\n- [Achievement/Observation 2]\n- [Achievement/Observation 3]\n\nI recommend [specific suggestions for home support].\n\nPlease feel free to reach out if you have any questions or would like to schedule a meeting.\n\nBest regards,\n[Teacher Name]`
                })}
                className="btn-secondary text-sm"
              >
                Use Template
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Homework Support</h3>
              <p className="text-sm text-gray-600 mb-3">
                Template for homework assistance requests.
              </p>
              <button
                type="button"
                onClick={() => setFormData({
                  subject: 'Homework Assignment Help',
                  content: `Dear Parent,\n\nI wanted to reach out regarding [Student Name]'s homework in [subject].\n\n[Student Name] has been working hard, but I noticed they may need some additional support with [specific topic/concept]. \n\nFor tonight's homework:\n- [Specific instruction 1]\n- [Specific instruction 2]\n- [Specific instruction 3]\n\nIf [Student Name] continues to struggle, please don't hesitate to reach out. We can arrange additional support or modify the assignment as needed.\n\nThank you for your support at home.\n\nBest regards,\n[Teacher Name]`
                })}
                className="btn-secondary text-sm"
              >
                Use Template
              </button>
            </div>
          </div>
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
            disabled={isSubmitting || selectedParents.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
