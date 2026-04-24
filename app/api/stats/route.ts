import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalPapers,
      internalPapers,
      semesterPapers,
      distinctBranches,
      distinctYears,
    ] = await Promise.all([
      prisma.questionPaper.count(),
      prisma.questionPaper.count({ where: { questionType: 'INTERNAL' } }),
      prisma.questionPaper.count({ where: { questionType: 'SEMESTER' } }),
      prisma.questionPaper.findMany({
        distinct: ['branch'],
        select: { branch: true },
      }),
      prisma.questionPaper.findMany({
        distinct: ['year'],
        select: { year: true },
      }),
    ]);

    return NextResponse.json({
      totalPapers,
      branches: distinctBranches.length,
      years: distinctYears.length,
      internal: internalPapers,
      semester: semesterPapers,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
