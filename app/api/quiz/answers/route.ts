// app/api/quiz/answers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, questionId, answerGiven } = await req.json();
    if (!sessionId || !questionId || !answerGiven) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const student = await db.student.findFirst({ where: { userId: session.userId } });
    if (!student) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const quizSession = await db.quizSession.findFirst({
      where: { id: sessionId, studentId: student.id, finishedAt: null },
    });
    if (!quizSession) {
      return NextResponse.json({ success: false, message: "Sesi tidak ditemukan" }, { status: 404 });
    }

    const question = await db.question.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ success: false, message: "Soal tidak ditemukan" }, { status: 404 });

    // Cari key (A/B/C/D) yang nilainya cocok dengan correctAnswer, lalu bandingkan dengan jawaban siswa
    let correctKey = answerGiven;
    if (Array.isArray(question.options)) {
      const labels = ["A", "B", "C", "D"];
      const idx = (question.options as string[]).findIndex((o) => String(o).trim() === String(question.correctAnswer).trim());
      if (idx >= 0) correctKey = labels[idx];
    } else if (question.options && typeof question.options === "object") {
      const opts = question.options as Record<string, string>;
      const entry = Object.entries(opts).find(([, v]) => String(v).trim() === String(question.correctAnswer).trim());
      if (entry) correctKey = entry[0];
    }
    const isCorrect = correctKey === answerGiven;

    await db.quizAnswer.create({
      data: { sessionId, questionId, answerGiven, isCorrect },
    });

    // Update streak & counts
    const newCorrectCount = quizSession.correctCount + (isCorrect ? 1 : 0);
    const newWrongCount   = quizSession.wrongCount   + (isCorrect ? 0 : 1);
    const newStreak       = isCorrect ? quizSession.streakCount + 1 : 0;

    await db.quizSession.update({
      where: { id: sessionId },
      data: { correctCount: newCorrectCount, wrongCount: newWrongCount, streakCount: newStreak },
    });

    // Adaptive level logic
    let nextLevel = question.difficulty ?? "MEDIUM";
    if (isCorrect && newStreak >= 2)  nextLevel = "HARD";
    else if (!isCorrect && newStreak === 0 && newWrongCount >= 2) nextLevel = "EASY";

    // Fetch next question
    const answered = await db.quizAnswer.findMany({
      where: { sessionId },
      select: { questionId: true },
    });
    const answeredIds = answered.map(a => a.questionId);

    const TOTAL_QUESTIONS = 10;
    const done = answeredIds.length >= TOTAL_QUESTIONS;

    let nextQuestion = null;
    if (!done) {
      nextQuestion = await db.question.findFirst({
        where: {
          materialId: quizSession.materialId,
          difficulty: nextLevel,
          id: { notIn: answeredIds },
        },
        select: { id: true, questionText: true, options: true, difficulty: true, pointReward: true },
      });

      // Fallback to any difficulty if target level empty
      if (!nextQuestion) {
        nextQuestion = await db.question.findFirst({
          where: { materialId: quizSession.materialId, id: { notIn: answeredIds } },
          select: { id: true, questionText: true, options: true, difficulty: true, pointReward: true },
        });
      }
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: correctKey,
      streak: newStreak,
      currentLevel: nextLevel,
      nextQuestion,
      done: done || !nextQuestion,
    });
  } catch (error) {
    console.error("[QUIZ_ANSWERS]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}