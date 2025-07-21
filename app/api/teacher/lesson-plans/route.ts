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
        lp.*,
        s.name as subject_name
      FROM lesson_plans lp
      LEFT JOIN subjects s ON lp.subject_id = s.id
      WHERE lp.teacher_id = $1
      ORDER BY lp.created_at DESC
    `, [session.user.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      title, 
      description, 
      grade, 
      subject, 
      duration, 
      learningObjectives, 
      materialsNeeded,
      pdfFile 
    } = await request.json();

    if (!title || !grade || !subject) {
      return NextResponse.json({ error: 'Title, grade, and subject are required' }, { status: 400 });
    }

    // Find or create subject
    let subjectResult = await query('SELECT id FROM subjects WHERE name = $1', [subject]);
    let subjectId;
    
    if (subjectResult.rows.length === 0) {
      const newSubject = await query(
        'INSERT INTO subjects (name, code, grade_level) VALUES ($1, $2, $3) RETURNING id',
        [subject, subject.toUpperCase().substring(0, 5), grade]
      );
      subjectId = newSubject.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;
    }

    // Create lesson plan
    const lessonPlan = await query(`
      INSERT INTO lesson_plans (
        title, description, teacher_id, subject_id, grade, 
        duration_minutes, learning_objectives, materials_needed, 
        pdf_file_url, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `, [
      title, 
      description, 
      session.user.id, 
      subjectId, 
      grade,
      duration ? parseInt(duration) : null,
      learningObjectives,
      materialsNeeded,
      pdfFile,
      'draft'
    ]);

    return NextResponse.json(lessonPlan.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating lesson plan:', error);
    return NextResponse.json({ error: 'Failed to create lesson plan' }, { status: 500 });
  }
}
