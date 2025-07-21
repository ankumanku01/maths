'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade: string;
  photo?: string;
  parents: string[];
  teachers: string[];
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    parents: [] as string[],
    teachers: [] as string[],
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<{ url: string; filename: string } | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchUsers();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      if (response.ok) {
        const studentsData = await response.json();
        setStudents(studentsData.map((student: any) => ({
          _id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          grade: student.grade,
          photo: student.photo_url,
          parents: student.parents || [],
          teachers: student.teachers || [],
          createdAt: student.created_at
        })));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        grade: formData.grade,
        parents: formData.parents,
        teachers: formData.teachers,
        photo: uploadedPhoto?.url,
      };

      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          grade: '',
          parents: [],
          teachers: [],
        });
        setUploadedPhoto(null);
        setShowForm(false);
        fetchStudents();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student');
    } finally {
      setIsLoading(false);
    }
  };

  const teachers = users.filter(user => user.role === 'teacher');
  const parents = users.filter(user => user.role === 'parent');

  const handleParentChange = (parentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      parents: checked
        ? [...prev.parents, parentId]
        : prev.parents.filter(id => id !== parentId)
    }));
  };

  const handleTeacherChange = (teacherId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      teachers: checked
        ? [...prev.teachers, teacherId]
        : prev.teachers.filter(id => id !== teacherId)
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage student profiles with photos and parent/teacher assignments.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          👨‍🎓 Add New Student
        </button>
      </div>

      {/* Student Creation Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold mb-6">Add New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="input-field"
                  required
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

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                </label>
                {uploadedPhoto ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={uploadedPhoto.url}
                        alt="Student photo"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-green-800">Photo uploaded</p>
                        <p className="text-sm text-green-600">{uploadedPhoto.filename}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedPhoto(null)}
                        className="ml-auto text-green-600 hover:text-green-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileUpload
                    uploadType="student-photo"
                    accept=".jpg,.jpeg,.png"
                    onUploadComplete={setUploadedPhoto}
                    maxSize={5}
                  />
                )}
              </div>

              {/* Parent Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Parents
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {parents.length > 0 ? (
                    parents.map((parent) => (
                      <label key={parent._id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.parents.includes(parent._id)}
                          onChange={(e) => handleParentChange(parent._id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {parent.firstName} {parent.lastName} ({parent.email})
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No parents available. Create parent accounts first.</p>
                  )}
                </div>
              </div>

              {/* Teacher Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Teachers
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <label key={teacher._id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.teachers.includes(teacher._id)}
                          onChange={(e) => handleTeacherChange(teacher._id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {teacher.firstName} {teacher.lastName} ({teacher.email})
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No teachers available. Create teacher accounts first.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? 'Creating...' : 'Create Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {student.photo ? (
                          <img src={student.photo} alt={student.firstName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span className="text-lg">👤</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.parents.length} assigned
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.teachers.length} assigned
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
