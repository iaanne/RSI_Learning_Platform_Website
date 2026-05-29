// app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const subjects = await db.subject.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("[SUBJECTS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}