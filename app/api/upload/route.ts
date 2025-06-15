import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const year = parseInt(formData.get('year') as string);
    const semester = parseInt(formData.get('semester') as string);
    const branch = formData.get('branch') as string;
    const questionType = formData.get('questionType') as string;
    const title = formData.get('title') as string;

    if (!file || !year || !semester || !branch || !questionType || !title) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file);

    // Save to database
    const paper = await prisma.questionPaper.create({
      data: {
        year,
        semester,
        branch: branch as any,
        questionType: questionType as any,
        title,
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
      },
    });

    return NextResponse.json(paper);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}