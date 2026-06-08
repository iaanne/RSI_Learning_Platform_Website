// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const profile: Record<string, unknown> = {
      name: session.name,
      role: session.role,
    };

    if (session.role === "PARENT") {
      const parent = await db.parent.findUnique({
        where: { userId: session.userId },
        include: {
          students: {
            include: {
              class: { select: { name: true } },
              user: { select: { name: true } },
            },
          },
        },
      });
      if (parent) {
        profile.students = parent.students.map((s) => ({
          name: s.user.name,
          className: s.class?.name ?? null,
          nis: s.nis,
        }));
      }
    }

    return NextResponse.json({ success: true, ...profile });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
