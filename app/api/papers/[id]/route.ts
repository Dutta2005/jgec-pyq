import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { title, year, semester, branch, questionType } = body;

    // Validate required fields
    if (!title || !year || !semester || !branch || !questionType) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if paper exists
    const existingPaper = await prisma.questionPaper.findUnique({
      where: { id }
    });

    if (!existingPaper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Update the paper
    const updatedPaper = await prisma.questionPaper.update({
      where: { id },
      data: {
        title,
        year: parseInt(year),
        semester: parseInt(semester),
        branch: branch as any,
        questionType: questionType as any,
      },
    });

    return NextResponse.json(updatedPaper);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}