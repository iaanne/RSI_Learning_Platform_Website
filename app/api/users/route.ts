// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/users
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PRINCIPAL") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const users = await db.user.findMany({
      where: { ...(role && { role }) },
      select: {
        id: true, name: true, email: true,
        role: true, isActive: true, createdAt: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/users = create student + parent pair (PRINCIPAL only)
// POST /api/users = Create Student+Parent OR Teacher (PRINCIPAL only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PRINCIPAL") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { type, name, email, namaSiswa, kelas, namaOrtu, emailOrtu, classId } = body;

    const defaultPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    // ==========================================
    // SCENARIO A: MEMBUAT AKUN GURU (TEACHER)
    // ==========================================
    if (type === "TEACHER") {
      if (!name || !email) {
        return NextResponse.json({ success: false, message: "Nama dan Email guru wajib diisi" }, { status: 400 });
      }

      const result = await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            passwordHash,
            role: "TEACHER",
            name,
            isActive: true,
          },
        });

        // OTOMATIS: Membuat data pendamping di tabel Teacher agar tidak memicu error 404 di dashboard guru
        const teacher = await tx.teacher.create({
          data: { userId: user.id },
        });

        return { user, defaultPassword };
      });

      return NextResponse.json({
        success: true,
        message: "Akun Guru berhasil dibuat",
        email: result.user.email,
        defaultPassword: result.defaultPassword,
      }, { status: 201 });
    }

    // ==========================================
    // SCENARIO B: MEMBUAT AKUN SISWA + ORTU (Bawaan Aslimu)
    // ==========================================
    if (!namaSiswa || !kelas || !namaOrtu || !emailOrtu) {
      return NextResponse.json({ success: false, message: "Field siswa dan orang tua wajib diisi" }, { status: 400 });
    }

    const baseStudentEmail = `${namaSiswa.toLowerCase().replace(/\s+/g, "")}.${kelas.toLowerCase()}@siswa.sch.id`;
    const baseParentEmail  = emailOrtu.toLowerCase();

    const result = await db.$transaction(async (tx) => {
      // Create parent user
      const parentUser = await tx.user.create({
        data: {
          email: baseParentEmail,
          passwordHash,
          role: "PARENT",
          name: namaOrtu,
          isActive: true,
        },
      });

      const parent = await tx.parent.create({
        data: { userId: parentUser.id },
      });

      // Create student user
      const studentUser = await tx.user.create({
        data: {
          email: baseStudentEmail,
          passwordHash,
          role: "STUDENT",
          name: namaSiswa,
          isActive: true,
        },
      });

      const nis = `${Date.now()}`.slice(-8);

      const student = await tx.student.create({
        data: {
          userId:   studentUser.id,
          parentId: parent.id,
          classId:  classId ?? null,
          nis,
        },
      });

      return { parentUser, studentUser, defaultPassword };
    });

    return NextResponse.json({
      success: true,
      message: "Akun Siswa & Orang Tua berhasil dibuat",
      studentEmail:    result.studentUser.email,
      parentEmail:     result.parentUser.email,
      defaultPassword: result.defaultPassword,
    }, { status: 201 });

  } catch (error: any) {
    console.error("[USERS_POST]", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, message: "Email sudah digunakan" }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Gagal membuat akun" }, { status: 500 });
  }
}