'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface TeacherStats {
  totalStudents: number;
  totalLessonPlans: number;
  totalTests: number;
  recentResults: number;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalLessonPlans: 0,
    totalTests: 0,
    recentResults: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      totalStudents: 25,
      totalLessonPlans: 8,
      totalTests: 12,
      recentResults: 5,
    });
  }, []);

  const StatCard = ({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, href, icon }: { title: string; description: string; href: string; icon: string }) => (
    <a
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name?.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your teaching activities and student progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="My Students"
          value={stats.totalStudents}
          color="text-blue-600"
          icon="👥"
        />
        <StatCard
          title="Lesson Plans"
          value={stats.totalLessonPlans}
          color="text-green-600"
          icon="📚"
        />
        <StatCard
          title="Tests Created"
          value={stats.totalTests}
          color="text-purple-600"
          icon="📝"
        />
        <StatCard
          title="Recent Results"
          value={stats.recentResults}
          color="text-orange-600"
          icon="📈"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickAction
              title="Create Lesson Plan"
              description="Plan and upload your next lesson"
              href="/teacher/lesson-plans/new"
              icon="📚"
            />
            <QuickAction
              title="Create Test"
              description="Design pre/post assessments"
              href="/teacher/tests/new"
              icon="📝"
            />
            <QuickAction
              title="View Student Progress"
              description="Check recent test results"
              href="/teacher/results"
              icon="📊"
            />
            <QuickAction
              title="Send Message"
              description="Communicate with parents"
              href="/teacher/messages/new"
              icon="💬"
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Math Lesson Plan uploaded</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pre-test results reviewed</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Message sent to parent</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-green-700">Average Improvement</div>
            <div className="text-xs text-gray-600">Pre to Post Test</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <div className="text-sm text-blue-700">Test Completion Rate</div>
            <div className="text-xs text-gray-600">This Month</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">78%</div>
            <div className="text-sm text-purple-700">Average Score</div>
            <div className="text-xs text-gray-600">Recent Tests</div>
          </div>
        </div>
      </div>
    </div>
  );
}
