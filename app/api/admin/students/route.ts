import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT 
        s.*,
        array_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.first_name || ' ' || p.last_name, 'email', p.email)) FILTER (WHERE p.id IS NOT NULL) as parents,
        array_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.first_name || ' ' || t.last_name, 'email', t.email)) FILTER (WHERE t.id IS NOT NULL) as teachers
      FROM students s
      LEFT JOIN parent_students ps ON s.id = ps.student_id
      LEFT JOIN users p ON ps.parent_id = p.id AND p.role = 'parent'
      LEFT JOIN teacher_students ts ON s.id = ts.student_id
      LEFT JOIN users t ON ts.teacher_id = t.id AND t.role = 'teacher'
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, grade, parents, teachers, photo } = await request.json();

    if (!firstName || !lastName || !grade) {
      return NextResponse.json({ error: 'First name, last name, and grade are required' }, { status: 400 });
    }

    // Generate unique student ID
    const studentIdResult = await query('SELECT COUNT(*) as count FROM students');
    const studentCount = parseInt(studentIdResult.rows[0].count) + 1;
    const studentId = `STU${studentCount.toString().padStart(4, '0')}`;

    // Create student
    const studentResult = await query(
      'INSERT INTO students (student_id, first_name, last_name, grade, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [studentId, firstName, lastName, grade, photo]
    );

    const student = studentResult.rows[0];

    // Assign parents
    if (parents && parents.length > 0) {
      for (const parentId of parents) {
        await query(
          'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES ($1, $2, $3)',
          [parentId, student.id, 'parent']
        );
      }
    }

    // Assign teachers
    if (teachers && teachers.length > 0) {
      for (const teacherId of teachers) {
        await query(
          'INSERT INTO teacher_students (teacher_id, student_id, academic_year) VALUES ($1, $2, $3)',
          [teacherId, student.id, '2024-2025']
        );
      }
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
