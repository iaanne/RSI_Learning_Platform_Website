// app/api/teachers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/teachers
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (session.role !== "PRINCIPAL") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const teachers = await db.teacher.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, isActive: true } },
        homeroomClass: { select: { id: true, name: true, gradeLevel: true } },
        classSubjects: {
          include: {
            subject: { select: { name: true } },
            class:   { select: { name: true } },
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("[TEACHERS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}