// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/reports
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    let reports;

    if (session.role === "TEACHER") {
      const teacher = await db.teacher.findUnique({ where: { userId: session.userId } });
      if (!teacher) return NextResponse.json([]);

      reports = await db.weeklyReport.findMany({
        where:   { teacherId: teacher.id },
        include: {
          student:      { include: { user: { select: { name: true } } } },
          classSubject: { include: { subject: { select: { name: true } } } },
        },
        orderBy: { generatedAt: "desc" },
      });
    } else if (session.role === "PARENT") {
      const parent = await db.parent.findUnique({
        where:   { userId: session.userId },
        include: { students: true },
      });
      if (!parent) return NextResponse.json([]);

      const studentIds = parent.students.map((s) => s.id);
      reports = await db.weeklyReport.findMany({
        where:   { studentId: { in: studentIds } },
        include: {
          classSubject: { include: { subject: { select: { name: true } } } },
        },
        orderBy: { generatedAt: "desc" },
      });
    } else {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/reports = generate & send weekly report (TEACHER only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const teacher = await db.teacher.findUnique({
      where:   { userId: session.userId },
      include: { homeroomClass: { include: { students: true } } },
    });

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Data guru tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const { classSubjectId, catatanKelas } = body;

    // Get all students in homeroom class
    const allStudents = teacher.homeroomClass.flatMap((c) => c.students);
    if (allStudents.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada siswa di kelas ini" },
        { status: 400 }
      );
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // start of week

    // Create report for each student
    const reports = await db.$transaction(
      allStudents.map((student) =>
        db.weeklyReport.upsert({
          where: {
            // use a composite approach — create or update for this week
            id: "00000000-0000-0000-0000-000000000000", // will not match, forces create
          },
          update: {},
          create: {
            studentId:      student.id,
            classSubjectId: classSubjectId,
            teacherId:      teacher.id,
            weekStart:      weekStart,
            avgScore:       0,
            completionRate: 0,
            recommendation: catatanKelas ?? null,
            kkm_achieved:   false,
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: `Laporan berhasil dikirim ke ${allStudents.length} orang tua`,
        count:   allStudents.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REPORTS_POST]", error);
    return NextResponse.json({ success: false, message: "Gagal mengirim laporan" }, { status: 500 });
  }
}