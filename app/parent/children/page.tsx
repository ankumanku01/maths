'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  photo_url?: string;
  teachers: Teacher[];
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/parent/children');
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage information about your children's education.
        </p>
      </div>

      {children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div key={child.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {child.photo_url ? (
                    <img
                      src={child.photo_url}
                      alt={`${child.first_name} ${child.last_name}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {child.first_name} {child.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{child.grade}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Teachers:</h4>
                {child.teachers.length > 0 ? (
                  <div className="space-y-1">
                    {child.teachers.map((teacher) => (
                      <div key={teacher.id} className="text-sm text-gray-600">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No teachers assigned</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/parent/progress?child=${child.id}`}
                  className="btn-primary text-sm text-center"
                >
                  View Progress
                </Link>
                <Link
                  href={`/parent/tests?child=${child.id}`}
                  className="btn-secondary text-sm text-center"
                >
                  Test Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No children found</h3>
          <p className="text-gray-600">
            Contact your school administrator to link your children to your account.
          </p>
        </div>
      )}
    </div>
  );
}
