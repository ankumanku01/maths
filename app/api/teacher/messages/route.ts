import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !['teacher', 'parent'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT 
        m.*,
        jsonb_build_object(
          'id', fu.id, 
          'firstName', fu.first_name, 
          'lastName', fu.last_name, 
          'role', fu.role
        ) as from_user,
        jsonb_build_object(
          'id', tu.id, 
          'firstName', tu.first_name, 
          'lastName', tu.last_name, 
          'role', tu.role
        ) as to_user,
        CASE 
          WHEN m.student_id IS NOT NULL THEN
            jsonb_build_object(
              'id', s.id,
              'firstName', s.first_name,
              'lastName', s.last_name
            )
          ELSE NULL
        END as student
      FROM messages m
      JOIN users fu ON m.from_user_id = fu.id
      JOIN users tu ON m.to_user_id = tu.id
      LEFT JOIN students s ON m.student_id = s.id
      WHERE m.from_user_id = $1 OR m.to_user_id = $1
      ORDER BY m.created_at DESC
    `, [session.user.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !['teacher', 'parent'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientIds, studentId, subject, content } = await request.json();

    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
    }

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
    }

    const messages = [];

    // Send message to each recipient
    for (const recipientId of recipientIds) {
      const messageResult = await query(`
        INSERT INTO messages (from_user_id, to_user_id, student_id, subject, content)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [session.user.id, recipientId, studentId, subject, content]);

      messages.push(messageResult.rows[0]);
    }

    return NextResponse.json({ 
      success: true, 
      messages,
      count: messages.length 
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
