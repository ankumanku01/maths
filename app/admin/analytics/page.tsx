'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor system usage, performance metrics, and educational outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-2xl text-blue-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Students</span>
              <span className="font-semibold text-2xl text-green-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lesson Plans</span>
              <span className="font-semibold text-2xl text-purple-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tests Completed</span>
              <span className="font-semibold text-2xl text-orange-600">0</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📊</div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
          <div className="text-sm text-gray-600">Student Engagement</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
          <div className="text-sm text-gray-600">Average Improvement</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
          <div className="text-sm text-gray-600">Teacher Satisfaction</div>
        </div>
      </div>
    </div>
  );
}
