import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME ?? "rsi_learning_platform",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const students = await prisma.student.findMany({
    include: {
      user: { select: { name: true } },
      class: {
        include: {
          classSubjects: {
            include: {
              subject: true,
              materials: { where: { isPublished: true }, select: { id: true, title: true } },
            },
          },
        },
      },
    },
  });

  for (const s of students) {
    if (!s.class) continue;

    let totalPoints = 0;
    const totalScores: number[] = [];

    for (const cs of s.class.classSubjects) {
      if (cs.materials.length === 0) continue;

      // Pick 1-3 materials to have simulated quiz sessions
      const numCompleted = Math.min(cs.materials.length, 1 + Math.floor(Math.random() * 3));
      const shuffled = [...cs.materials].sort(() => Math.random() - 0.5).slice(0, numCompleted);

      let maxScore = 0;
      for (const m of shuffled) {
        const scorePct = 30 + Math.floor(Math.random() * 60); // 30-89%
        const correctCount = Math.round((scorePct / 100) * 10);
        const wrongCount = 10 - correctCount;

        // Check if session already exists for this material+student
        const existing = await prisma.quizSession.findFirst({
          where: { studentId: s.id, materialId: m.id, finishedAt: { not: null } },
        });
        if (existing) continue;

        const session = await prisma.quizSession.create({
          data: {
            studentId: s.id,
            classSubjectId: cs.id,
            materialId: m.id,
            score: scorePct,
            correctCount,
            wrongCount,
            livesUsed: Math.floor(Math.random() * 3),
            streakCount: Math.floor(Math.random() * 5),
            resultLevel: scorePct >= 85 ? "EXCELLENT" : scorePct >= 75 ? "PASSED" : "FAILED",
            startedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
            finishedAt: new Date(),
          },
        });

        // Create point log
        await prisma.pointLog.create({
          data: {
            studentId: s.id,
            pointsEarned: scorePct,
            sourceType: "QUIZ",
            sourceId: session.id,
            description: `Quiz: ${m.title} - Skor ${scorePct}%`,
          },
        });

        totalPoints += scorePct;
        if (scorePct > maxScore) maxScore = scorePct;
        totalScores.push(scorePct);
      }

      // Update or create StudentProgress
      const pct = Math.min(Math.round((numCompleted / cs.materials.length) * 100), 100);
      const avgScore = totalScores.length > 0
        ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
        : 0;

      const existingProg = await prisma.studentProgress.findFirst({
        where: { studentId: s.id, classSubjectId: cs.id },
      });

      if (existingProg) {
        await prisma.studentProgress.update({
          where: { id: existingProg.id },
          data: {
            completionPercent: Math.max(existingProg.completionPercent ?? 0, pct),
            totalScore: Math.max(existingProg.totalScore ?? 0, maxScore || avgScore),
            lastActivity: new Date(),
          },
        });
      } else {
        await prisma.studentProgress.create({
          data: {
            studentId: s.id,
            classSubjectId: cs.id,
            completionPercent: pct,
            totalScore: maxScore || avgScore,
            lastActivity: new Date(),
          },
        });
      }
    }

    // Update student total points & streak
    const streak = 1 + Math.floor(Math.random() * 5);
    await prisma.student.update({
      where: { id: s.id },
      data: {
        totalPoints: { increment: totalPoints },
        currentStreak: streak,
        livesRemaining: 3,
      },
    });

    console.log(`${s.user.name}: +${totalPoints} pts, streak ${streak}, ${totalScores.length} quiz sessions`);
  }

  console.log("\nDone! Kinerja siswa berhasil di-seed.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
