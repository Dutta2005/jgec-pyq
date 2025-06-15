import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');
    const questionType = searchParams.get('questionType');

    const where: any = {};
    if (year) where.year = parseInt(year);
    if (branch) where.branch = branch;
    if (semester) where.semester = parseInt(semester);
    if (questionType) where.questionType = questionType;

    const papers = await prisma.questionPaper.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { semester: 'desc' },
        { uploadedAt: 'desc' }
      ]
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.log('Error ', error)
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }

    const paper = await prisma.questionPaper.findUnique({
      where: { id }
    });

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    const { deleteFromCloudinary } = await import('@/lib/cloudinary');
    await deleteFromCloudinary(paper.cloudinaryId);

    // Delete from database
    await prisma.questionPaper.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error ', error)
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}