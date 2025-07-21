import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string; // 'lesson-plan', 'test', 'student-photo'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type based on upload type
    const allowedTypes = {
      'lesson-plan': ['application/pdf'],
      'test': ['application/pdf'],
      'student-photo': ['image/jpeg', 'image/png', 'image/jpg'],
    };

    const allowedMimeTypes = allowedTypes[uploadType as keyof typeof allowedTypes];
    if (!allowedMimeTypes || !allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: ${allowedMimeTypes?.join(', ')}` 
      }, { status: 400 });
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Create upload directory structure
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${uploadType}/${filename}`;

    // TODO: Save file metadata to database
    // const fileRecord = await saveFileToDatabase({
    //   userId: session.user.id,
    //   filename: originalName,
    //   filepath: publicUrl,
    //   fileType: file.type,
    //   fileSize: file.size,
    //   uploadType
    // });

    return NextResponse.json({ 
      success: true,
      filename: originalName,
      url: publicUrl,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ 
      error: 'File upload failed' 
    }, { status: 500 });
  }
}
