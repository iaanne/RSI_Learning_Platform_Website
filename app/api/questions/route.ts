// app/api/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

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