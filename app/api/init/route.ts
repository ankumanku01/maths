import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await query(
      'SELECT id FROM users WHERE email = $1',
      ['sujan1nepal@gmail.com']
    );
    
    if (existingAdmin.rows.length > 0) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('precioussn', 12);
    
    await query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
      ['sujan1nepal@gmail.com', hashedPassword, 'admin', 'Sujan', 'Nepal']
    );

    return NextResponse.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}
