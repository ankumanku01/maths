import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'parent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const subject = searchParams.get('subject');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Verify parent has access to this student
    const accessCheck = await query(
      'SELECT id FROM parent_students WHERE parent_id = $1 AND student_id = $2',
      [session.user.id, studentId]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized access to student data' }, { status: 403 });
    }

    let progressQuery = `
      SELECT 
        sp.*,
        s.name as subject_name,
        lp.title as lesson_title,
        lp.created_at as lesson_date
      FROM student_progress sp
      LEFT JOIN subjects s ON sp.subject_id = s.id
      LEFT JOIN lesson_plans lp ON sp.lesson_plan_id = lp.id
      WHERE sp.student_id = $1
    `;
    
    const queryParams = [studentId];

    if (subject && subject !== 'all') {
      progressQuery += ' AND s.name = $2';
      queryParams.push(subject);
    }

    progressQuery += ' ORDER BY lp.created_at DESC';

    const result = await query(progressQuery, queryParams);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress data' }, { status: 500 });
  }
}
