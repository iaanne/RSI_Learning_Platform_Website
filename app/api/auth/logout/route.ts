// app/api/auth/logout/route.ts
// =============================================================================
// POST /api/auth/logout
// Hapus cookie sesi → redirect ke /auth/login
// =============================================================================

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearSessionCookie();

    return NextResponse.json(
      { success: true, message: "Logout berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
