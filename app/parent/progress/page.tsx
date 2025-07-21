'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface ProgressData {
  studentId: string;
  subject: string;
  lessonTitle: string;
  preTestScore: number;
  postTestScore: number;
  improvement: number;
  teacherNotes: string;
  date: string;
}

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const selectedChildId = searchParams.get('child');
  
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>(selectedChildId || '');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  useEffect(() => {
    // TODO: Fetch actual data from API
    const mockChildren = [
      { id: '1', name: 'Emma Johnson', grade: '4th Grade' },
      { id: '2', name: 'Michael Johnson', grade: '2nd Grade' },
    ];

    const mockProgress = [
      {
        studentId: '1',
        subject: 'Mathematics',
        lessonTitle: 'Introduction to Fractions',
        preTestScore: 72,
        postTestScore: 89,
        improvement: 17,
        teacherNotes: 'Emma showed excellent understanding of fraction concepts. She improved significantly in problem-solving.',
        date: '2024-01-15'
      },
      {
        studentId: '1',
        subject: 'Science',
        lessonTitle: 'Solar System Exploration',
        preTestScore: 85,
        postTestScore: 94,
        improvement: 9,
        teacherNotes: 'Great enthusiasm for space topics. Emma asked thoughtful questions about planetary orbits.',
        date: '2024-01-10'
      },
      {
        studentId: '2',
        subject: 'English',
        lessonTitle: 'Reading Comprehension',
        preTestScore: 88,
        postTestScore: 95,
        improvement: 7,
        teacherNotes: 'Michael is becoming a confident reader. His vocabulary has expanded considerably.',
        date: '2024-01-12'
      },
    ];

    setChildren(mockChildren);
    setProgressData(mockProgress);
    
    if (selectedChildId) {
      setSelectedChild(selectedChildId);
    } else if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0].id);
    }
  }, [selectedChildId]);

  const filteredProgress = progressData.filter(progress => 
    progress.studentId === selectedChild &&
    (filterSubject === 'all' || progress.subject === filterSubject)
  );

  const subjects = [...new Set(progressData.map(p => p.subject))];
  const selectedChildData = children.find(c => c.id === selectedChild);

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 15) return 'text-green-600 bg-green-50';
    if (improvement >= 5) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement >= 15) return '🚀';
    if (improvement >= 5) return '📈';
    return '📊';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Progress Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your child's academic progress across subjects and lessons.
        </p>
      </div>

      {/* Child and Subject Selection */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="input-field"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} - {child.grade}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="input-field"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedChildData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{filteredProgress.length}</div>
              <div className="text-sm text-gray-600">Completed Lessons</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">
                {filteredProgress.length > 0
                  ? Math.round(filteredProgress.reduce((acc, p) => acc + p.postTestScore, 0) / filteredProgress.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600">
                +{filteredProgress.length > 0
                  ? Math.round(filteredProgress.reduce((acc, p) => acc + p.improvement, 0) / filteredProgress.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Improvement</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.max(...filteredProgress.map(p => p.improvement), 0)}%
              </div>
              <div className="text-sm text-gray-600">Best Improvement</div>
            </div>
          </div>

          {/* Progress Details */}
          <div className="space-y-6">
            {filteredProgress.length > 0 ? (
              filteredProgress.map((progress, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{progress.lessonTitle}</h3>
                      <p className="text-sm text-gray-600">{progress.subject} • {new Date(progress.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getImprovementColor(progress.improvement)}`}>
                      {getImprovementIcon(progress.improvement)} +{progress.improvement}% improvement
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{progress.preTestScore}%</div>
                      <div className="text-sm text-red-700">Pre-Test Score</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{progress.postTestScore}%</div>
                      <div className="text-sm text-green-700">Post-Test Score</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">+{progress.improvement}%</div>
                      <div className="text-sm text-blue-700">Improvement</div>
                    </div>
                  </div>

                  {progress.teacherNotes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Teacher's Notes</h4>
                      <p className="text-sm text-gray-700">{progress.teacherNotes}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 card">
                <div className="text-gray-400 text-6xl mb-4">📈</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
                <p className="text-gray-600">
                  {filterSubject === 'all' 
                    ? `No progress reports available for ${selectedChildData.name} yet.`
                    : `No ${filterSubject} progress reports available yet.`
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
