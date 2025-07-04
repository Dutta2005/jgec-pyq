import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Branch, Prisma, QuestionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const year = searchParams.get('year') || '';
    const branch = searchParams.get('branch') || '';
    const type = searchParams.get('type') || '';

    const whereClause: Prisma.QuestionPaperWhereInput = {};

    if (query.trim()) {
      whereClause.title = {
        contains: query.trim(),
        mode: 'insensitive'
      };
    }

    if (year) {
      whereClause.year = parseInt(year);
    }

    if (branch) {
      whereClause.branch = branch as Branch;
    }

    if (type) {
      whereClause.questionType = type as QuestionType;
    }

    const papers = await prisma.questionPaper.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search papers' },
      { status: 500 }
    );
  }
}