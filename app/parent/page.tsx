'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  grade: string;
  photo?: string;
}

interface ProgressSummary {
  studentId: string;
  studentName: string;
  recentTests: number;
  averageScore: number;
  improvement: number;
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Student[]>([]);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary[]>([]);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/parent/children');
      if (response.ok) {
        const data = await response.json();
        setChildren(data.map((child: any) => ({
          id: child.id,
          name: `${child.first_name} ${child.last_name}`,
          grade: child.grade,
          photo: child.photo_url
        })));

        // Mock progress data for now - implement actual progress API later
        const mockProgress = data.map((child: any) => ({
          studentId: child.id,
          studentName: `${child.first_name} ${child.last_name}`,
          recentTests: Math.floor(Math.random() * 5) + 2,
          averageScore: Math.floor(Math.random() * 20) + 80,
          improvement: Math.floor(Math.random() * 20) + 5,
        }));
        setProgressSummary(mockProgress);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const ChildCard = ({ child }: { child: Student }) => {
    const progress = progressSummary.find(p => p.studentId === child.id);
    
    return (
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {child.photo ? (
              <img src={child.photo} alt={child.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-600">{child.grade}</p>
          </div>
        </div>

        {progress && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.recentTests}</div>
              <div className="text-xs text-gray-600">Recent Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.averageScore}%</div>
              <div className="text-xs text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+{progress.improvement}%</div>
              <div className="text-xs text-gray-600">Improvement</div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Link
            href={`/parent/progress?child=${child.id}`}
            className="flex-1 btn-primary text-sm text-center"
          >
            View Progress
          </Link>
          <Link
            href={`/parent/tests?child=${child.id}`}
            className="flex-1 btn-secondary text-sm text-center"
          >
            Test Results
          </Link>
        </div>
      </div>
    );
  };

  const RecentActivity = ({ activity }: { activity: { type: string; message: string; time: string; student: string } }) => (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">{activity.student}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name?.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your children's educational progress and stay connected with their teachers.
        </p>
      </div>

      {/* Children Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{children.length}</div>
          <div className="text-sm text-gray-600">Children</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {progressSummary.reduce((acc, p) => acc + p.recentTests, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {progressSummary.length > 0 
              ? Math.round(progressSummary.reduce((acc, p) => acc + p.averageScore, 0) / progressSummary.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Overall Average</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600">
            +{progressSummary.length > 0 
              ? Math.round(progressSummary.reduce((acc, p) => acc + p.improvement, 0) / progressSummary.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Improvement</div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <RecentActivity 
              activity={{
                type: 'test',
                message: 'New math test result available',
                time: '2 hours ago',
                student: 'Emma Johnson'
              }}
            />
            <RecentActivity 
              activity={{
                type: 'message',
                message: 'Message from Mrs. Smith',
                time: '1 day ago',
                student: 'Michael Johnson'
              }}
            />
            <RecentActivity 
              activity={{
                type: 'progress',
                message: 'Science lesson plan completed',
                time: '2 days ago',
                student: 'Emma Johnson'
              }}
            />
          </div>
          <Link
            href="/parent/messages"
            className="block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all activity →
          </Link>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/parent/progress"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📈</span>
              <div>
                <div className="font-medium text-gray-900">View Progress Reports</div>
                <div className="text-sm text-gray-600">Check detailed academic progress</div>
              </div>
            </Link>
            <Link
              href="/parent/tests"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <div className="font-medium text-gray-900">Review Test Results</div>
                <div className="text-sm text-gray-600">See latest test scores and feedback</div>
              </div>
            </Link>
            <Link
              href="/parent/messages/new"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">💬</span>
              <div>
                <div className="font-medium text-gray-900">Contact Teachers</div>
                <div className="text-sm text-gray-600">Send message to your child's teachers</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
