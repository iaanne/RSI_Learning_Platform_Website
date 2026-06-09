// app/api/teachers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.role?.toUpperCase();

    // SCENARIO 1: JIKA YANG AKSES ADALAH GURU (TEACHER)
    if (userRole === "TEACHER") {
      const currentTeacher = await db.teacher.findUnique({
        where: { userId: session.userId },
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
      });

      if (!currentTeacher) {
        return NextResponse.json({ success: false, message: "Data guru tidak ditemukan" }, { status: 404 });
      }

      // Mengembalikan data khusus untuk komponen KelolaMapel Guru
      return NextResponse.json({ success: true, teacher: currentTeacher });
    }

    // SCENARIO 2: JIKA YANG AKSES ADALAH KEPSEK / PRINCIPAL
    if (userRole === "PRINCIPAL") {
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

      // Ditransformasikan sedikit agar Typenya cocok dengan `type Teacher` di halaman Kepsek
      const formattedTeachers = teachers.map((t) => ({
        id: t.id,
        name: t.user?.name ?? "Tanpa Nama",
        email: t.user?.email ?? "-",
        nip: (t as any).nip ?? "-", // sesuaikan field NIP di skema database kamu
        phone: (t as any).phone ?? null,
        isActive: t.user?.isActive ?? false,
        createdAt: (t as any).createdAt ?? new Date().toISOString(),
      }));

      // Mengembalikan objek pembungkus `.teachers` agar KepsekGuruPage tidak kosong
      return NextResponse.json({ success: true, teachers: formattedTeachers });
    }

    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  } catch (error) {
    console.error("[TEACHERS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}