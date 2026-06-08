// app/api/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // 1. Validasi Autentikasi
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeProgress = searchParams.get("includeProgress") === "true";

    // Opsi include dasar untuk Prisma
    const baseInclude: any = {
      user: { select: { id: true, name: true, email: true } },
      class: { select: { id: true, name: true } },
    };

    // Tambahkan include progress secara dinamis dengan aman tanpa langsung merusak tipe data spread
    if (includeProgress) {
      baseInclude.progress = {
        select: {
          totalScore: true,
          completionPercent: true,
          adaptiveLevel: true,
          lastActivity: true,
          classSubjectId: true,
        },
      };
    }

    let students = [];

    // 2. Logika Berdasarkan Role
    if (session.role === "TEACHER") {
      const teacher = await db.teacher.findUnique({
        where: { userId: session.userId },
        include: {
          // Sesuaikan nama field ini dengan schema.prisma kamu (homeroomClass atau homeroomClasses)
          homeroomClass: true, 
        },
      });

      // Validasi jika data guru atau kelas perwaliannya tidak ditemukan
      if (!teacher || !teacher.homeroomClass) {
        return NextResponse.json([]);
      }

      // Jika homeroomClass di skema berupa Array (Many-to-Many)
      const classIds = Array.isArray(teacher.homeroomClass)
        ? teacher.homeroomClass.map((c) => c.id)
        : [teacher.homeroomClass.id]; // Jika One-to-One / Objek Tunggal

      if (classIds.length === 0) {
        return NextResponse.json([]);
      }

      students = await db.student.findMany({
        where: { classId: { in: classIds } },
        include: baseInclude,
        orderBy: { user: { name: "asc" } },
      });

    } else if (session.role === "PRINCIPAL") {
      // Kepala sekolah melihat seluruh data siswa
      students = await db.student.findMany({
        include: baseInclude,
        orderBy: { user: { name: "asc" } },
      });

    } else {
      // Role lain (Siswa/Orang tua) dilarang mengakses rute monitoring ini
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}