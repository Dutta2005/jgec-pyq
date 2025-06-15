-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSE', 'IT', 'ECE', 'EE', 'ME', 'CE');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('INTERNAL', 'SEMESTER');

-- CreateTable
CREATE TABLE "question_papers" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "branch" "Branch" NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_papers_pkey" PRIMARY KEY ("id")
);
