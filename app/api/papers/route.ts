import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma, Branch, QuestionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');
    const questionType = searchParams.get('questionType');

    const where: Prisma.QuestionPaperWhereInput = {};
    
    if (year) where.year = parseInt(year);
    if (semester) where.semester = parseInt(semester);
    
    if (branch && Object.values(Branch).includes(branch as Branch)) {
      where.branch = branch as Branch;
    }
    
    if (questionType && Object.values(QuestionType).includes(questionType as QuestionType)) {
      where.questionType = questionType as QuestionType;
    }

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
    console.log('Error ', error);
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
    console.log('Error ', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}