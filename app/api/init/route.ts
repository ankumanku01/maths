import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'sujan1nepal@gmail.com' });
    
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('precioussn', 12);
    
    const adminUser = new User({
      email: 'sujan1nepal@gmail.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Sujan',
      lastName: 'Nepal',
    });

    await adminUser.save();

    return NextResponse.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}
