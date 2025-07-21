import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'parent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT 
        s.*,
        array_agg(DISTINCT jsonb_build_object(
          'id', t.id, 
          'firstName', t.first_name, 
          'lastName', t.last_name, 
          'email', t.email
        )) FILTER (WHERE t.id IS NOT NULL) as teachers
      FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      LEFT JOIN teacher_students ts ON s.id = ts.student_id
      LEFT JOIN users t ON ts.teacher_id = t.id AND t.role = 'teacher'
      WHERE ps.parent_id = $1 AND s.is_active = true
      GROUP BY s.id
      ORDER BY s.first_name, s.last_name
    `, [session.user.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching parent children:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}
