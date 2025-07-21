'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  photo_url?: string;
  parents: Parent[];
}

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/teacher/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and communicate with your assigned students and their parents.
        </p>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {student.photo_url ? (
                    <img
                      src={student.photo_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{student.grade}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Parents:</h4>
                {student.parents.length > 0 ? (
                  <div className="space-y-1">
                    {student.parents.map((parent) => (
                      <div key={parent.id} className="text-sm text-gray-600">
                        {parent.firstName} {parent.lastName} ({parent.email})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No parents assigned</p>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/teacher/messages/new?student=${student.id}`}
                  className="flex-1 btn-primary text-sm text-center"
                >
                  Send Message
                </Link>
                <button className="flex-1 btn-secondary text-sm">
                  View Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
          <p className="text-gray-600">
            Contact your administrator to get students assigned to your class.
          </p>
        </div>
      )}
    </div>
  );
}
