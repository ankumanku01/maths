'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalTeachers: number;
  totalParents: number;
  totalStudents: number;
  totalLessonPlans: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalParents: 0,
    totalStudents: 0,
    totalLessonPlans: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      totalTeachers: 5,
      totalParents: 15,
      totalStudents: 45,
      totalLessonPlans: 12,
    });
  }, []);

  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}>
          <span className={`text-2xl ${color}`}>📊</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to the EduManage admin panel. Here's an overview of your system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          color="text-blue-600"
        />
        <StatCard
          title="Total Parents"
          value={stats.totalParents}
          color="text-green-600"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          color="text-purple-600"
        />
        <StatCard
          title="Lesson Plans"
          value={stats.totalLessonPlans}
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">Manage Users</span>
              <p className="text-sm text-gray-600">Create and manage teacher and parent accounts</p>
            </a>
            <a
              href="/admin/students"
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">Manage Students</span>
              <p className="text-sm text-gray-600">Add and organize student profiles</p>
            </a>
            <a
              href="/admin/analytics"
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">View Analytics</span>
              <p className="text-sm text-gray-600">Monitor system usage and performance</p>
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System initialized successfully</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Admin account created</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
