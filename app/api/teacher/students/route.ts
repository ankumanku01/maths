import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT 
        s.*,
        array_agg(DISTINCT jsonb_build_object(
          'id', p.id, 
          'firstName', p.first_name, 
          'lastName', p.last_name, 
          'email', p.email
        )) FILTER (WHERE p.id IS NOT NULL) as parents
      FROM students s
      JOIN teacher_students ts ON s.id = ts.student_id
      LEFT JOIN parent_students ps ON s.id = ps.student_id
      LEFT JOIN users p ON ps.parent_id = p.id AND p.role = 'parent'
      WHERE ts.teacher_id = $1 AND ts.is_active = true AND s.is_active = true
      GROUP BY s.id
      ORDER BY s.first_name, s.last_name
    `, [session.user.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
