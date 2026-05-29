// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/notifications
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const notifications = await db.notification.findMany({
      where:   { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take:    20,
    });

    const unreadCount = await db.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PUT /api/notifications — mark all as read
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await db.notification.updateMany({
      where: { userId: session.userId, isRead: false },
      data:  { isRead: true },
    });

    return NextResponse.json({ success: true, message: "Semua notifikasi ditandai sudah dibaca" });
  } catch (error) {
    console.error("[NOTIFICATIONS_PUT]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}