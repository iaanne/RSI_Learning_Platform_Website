// app/api/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/questions?materialId=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("materialId");
    const difficulty = searchParams.get("difficulty");

    const questions = await db.question.findMany({
      where: {
        ...(materialId && { materialId }),
        ...(difficulty && { difficulty }),
      },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("[QUESTIONS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/questions = create new question (TEACHER only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { materialId, questionText, options, correctAnswer, difficulty, orderIndex } = body;

    if (!materialId || !questionText || !options || !correctAnswer) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { success: false, message: "Soal harus memiliki tepat 4 pilihan jawaban" },
        { status: 400 }
      );
    }

    // Cek kapasitas per kesulitan per material
    const diffLevel = difficulty ?? "MEDIUM";
    const maxCapacity: Record<string, number> = { EASY: 10, MEDIUM: 25, HARD: 15 };
    const currentCount = await db.question.count({
      where: { materialId, difficulty: diffLevel },
    });

    if (currentCount >= (maxCapacity[diffLevel] ?? 25)) {
      return NextResponse.json(
        { success: false, message: `Kapasitas soal ${diffLevel} untuk bab ini sudah penuh` },
        { status: 400 }
      );
    }

    const question = await db.question.create({
      data: {
        materialId,
        questionText,
        options,
        correctAnswer,
        difficulty:  diffLevel,
        orderIndex:  orderIndex ?? 0,
        pointReward: diffLevel === "HARD" ? 30 : diffLevel === "MEDIUM" ? 20 : 10,
      },
    });

    return NextResponse.json(
      { success: true, message: "Soal berhasil disimpan", question },
      { status: 201 }
    );
  } catch (error) {
    console.error("[QUESTIONS_POST]", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan soal" }, { status: 500 });
  }
}

// DELETE /api/questions?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id wajib diisi" }, { status: 400 });

    await db.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[QUESTIONS_DELETE]", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus soal" }, { status: 500 });
  }
}