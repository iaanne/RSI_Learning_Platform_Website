// app/api/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeProgress = searchParams.get("includeProgress") === "true";

    let whereClause: any = {}; 

    if (session.role === "TEACHER") {
      const teacher = await db.teacher.findUnique({
        where: { userId: session.userId },
        include: {
          homeroomClass: { select: { id: true }},
          classSubjects: { select: { classId: true }},
        },
      });

      if (!teacher) {
        return NextResponse.json([]);
      }

      const homeroomClassIds = teacher.homeroomClass.map((c) => c.id);
      const subjectClassIds = teacher.classSubjects.map((cs) => cs.classId);

      const allClassIds = Array.from(new Set([...homeroomClassIds, ...subjectClassIds])); 

      if (allClassIds.length === 0) {
        return NextResponse.json([]);
      }

      whereClause = { classId: { in: allClassIds } };

    } else if (session.role === "PRINCIPAL") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

      const students = await db.student.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true } },
          class: { select: { id: true, name: true } },
          ...(includeProgress && {
            progress: {
              select: {
                totalScore: true,
                completionPercent: true,
                adaptiveLevel: true,
                lastActivity: true,
                classSubjectId: true,
              },
            },
          }),
        },
        orderBy: { user: { name: "asc" } },
      });

      return NextResponse.json(students);
    } catch (error) {
      console.error("[STUDENTS_GET]", error);
      return NextResponse.json(
        { success: false, message: "Terjadi kesalahan server" },
        { status: 500 }
      );
    }
  } 