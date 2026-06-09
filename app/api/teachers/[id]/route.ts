// app/api/teachers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // --- DEBUG LOG ---
    // Cek terminal VS Code/Server kamu saat refresh halaman mapel
    console.log("DEBUG SESSION DATA:", session); 
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Pastikan role ada sebelum di-toUpperCase
    const role = session.role ? String(session.role).toUpperCase() : "";
    console.log("DEBUG ROLE DETECTED:", role);

    // SCENARIO 1: GURU
    if (role === "TEACHER") {
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

      return NextResponse.json({ success: true, teacher: currentTeacher });
    }

    // SCENARIO 2: PRINCIPAL
    if (role === "PRINCIPAL") {
      // ... (kode principal tetap sama)
      const teachers = await db.teacher.findMany({ /* ... */ });
      return NextResponse.json({ success: true, teachers: teachers });
    }

    // Jika sampai di sini, artinya role tidak dikenal
    console.log("DEBUG: Role tidak dikenal, akses ditolak.");
    return NextResponse.json({ success: false, message: "Forbidden: Role tidak valid" }, { status: 403 });

  } catch (error) {
    console.error("[TEACHERS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}