'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      // Redirect based on role
      if (session.user?.role === 'admin') {
        router.push('/admin');
      } else if (session.user?.role === 'teacher') {
        router.push('/teacher');
      } else if (session.user?.role === 'parent') {
        router.push('/parent');
      }
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">EduManage</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
