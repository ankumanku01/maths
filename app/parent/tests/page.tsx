'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ParentTestsPage() {
  const searchParams = useSearchParams();
  const selectedChildId = searchParams.get('child');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
        <p className="mt-1 text-sm text-gray-600">
          View detailed test results and performance analytics for your children.
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Test Results Coming Soon</h3>
        <p className="text-gray-600">
          This feature will show detailed test results, scores, and performance analysis.
        </p>
      </div>
    </div>
  );
}
