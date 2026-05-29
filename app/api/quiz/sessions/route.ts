import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");
    const studentId = searchParams.get("studentId");

    // Auth from cookie
    const authHeader = request.headers.get("cookie") || "";
    const tokenMatch = authHeader.match(/token=([^;]+)/);
    let userId: string | null = null;
    let userRole: string | null = null;

    if (tokenMatch) {
      try {
        const payload = verifyToken(tokenMatch[1]);
        if (payload) {
          userId = payload.userId;
          userRole = payload.role;
        }
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    let targetStudentId = studentId;

    // If student role, always use own id
    if (userRole === "STUDENT" || userRole === "student") {
      const student = await prisma.students.findFirst({
        where: { user_id: userId! },
      });
      targetStudentId = student?.id ?? null;
    }

    const where: Record<string, unknown> = {};
    if (targetStudentId) where.student_id = targetStudentId;
    if (materialId) where.material_id = materialId;

    const sessions = await prisma.quiz_sessions.findMany({
      where,
      orderBy: { started_at: "desc" },
      take: 50,
      include: {
        materials: {
          select: { title: true },
        },
      },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      materialId: s.material_id,
      materialTitle: s.materials?.title ?? "Unknown",
      score: s.score ?? 0,
      correctCount: s.correct_count ?? 0,
      wrongCount: s.wrong_count ?? 0,
      resultLevel: s.result_level ?? "MEDIUM",
      streakCount: s.streak_count ?? 0,
      startedAt: s.started_at,
      finishedAt: s.finished_at,
    }));

    return NextResponse.json({ sessions: formatted });
  } catch (error) {
    console.error("[quiz/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}