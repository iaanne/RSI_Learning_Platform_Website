// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/messages
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const messages = await db.message.findMany({
      where: { receiverId: session.userId },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      orderBy: { sentAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    // PARENT hanya bisa reply 
    // TEACHER dan STUDENT bisa send
    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: "receiverId dan content wajib diisi" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Pesan maksimal 1000 karakter" },
        { status: 400 }
      );
    }

    // Cek receiver exist
    const receiver = await db.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ success: false, message: "Penerima tidak ditemukan" }, { status: 404 });
    }

    // PARENT tdk bisa message parents
    if (session.role === "PARENT" && receiver.role === "PARENT") {
      return NextResponse.json(
        { success: false, message: "Orang tua hanya dapat membalas pesan guru" },
        { status: 403 }
      );
    }

    const message = await db.message.create({
      data: {
        senderId:   session.userId,
        receiverId,
        content,
        isRead:     false,
      },
    });

    // Create notif utk receiver
    await db.notification.create({
      data: {
        userId:    receiverId,
        title:     "Pesan Baru",
        body:      `Pesan baru dari ${session.name}`,
        notifType: "MESSAGE",
        isRead:    false,
      },
    });

    return NextResponse.json(
      { success: true, message: "Pesan berhasil dikirim", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return NextResponse.json({ success: false, message: "Gagal mengirim pesan" }, { status: 500 });
  }
}