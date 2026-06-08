// app/dashboard/guru/layout.tsx
// CATATAN: TIDAK BOLEH ADA "use client" DI SINI

import React from "react";
import Link from "next/link";
import { Users, BookOpen, FileBarChart, LayoutDashboard } from "lucide-react";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import { db } from "@/lib/db";

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  
  // ID dummy agar tidak error syntax UUID di PostgreSQL
  const userGuruId = "00000000-0000-0000-0000-000000000000"; 

  let namaGuru = "Ibu Guru Pertiwi";
  let kelasWali = "Wali Kelas 4-B";

  try {
    const dataGuru = await db.user.findUnique({
      where: { id: userGuruId },
      include: {
        teacher: {
          include: {
            homeroomClass: true, 
          },
        },
      },
    });

    if (dataGuru) {
      namaGuru = dataGuru.name;
      kelasWali = dataGuru.teacher?.homeroomClass?.[0]?.name || "Bukan Wali Kelas";
    }
  } catch (error) {
    console.log("Database masih kosong, menggunakan data mockup.");
  }

  const menuItems = [
    { name: "Monitoring Siswa", icon: Users,       href: "/dashboard/guru" },
    { name: "Kelola Mapel",     icon: BookOpen,    href: "/dashboard/guru/mapel" },
    { name: "Laporan Mingguan", icon: FileBarChart, href: "/dashboard/guru/laporan" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* SIDEBAR (Sudah digabung ke sini) */}
      <aside className="w-72 bg-slate-900 text-slate-300 hidden md:flex flex-col fixed h-full shadow-2xl">
        <div className="p-8 text-white">
          <div className="font-black text-2xl flex items-center space-x-3 tracking-tighter">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-lg">
              G
            </div>
            <span>GURU PANEL</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl mt-6 border border-slate-700/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Kelas Anda</p>
            <p className="text-sm font-bold text-indigo-400">{kelasWali}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            // Karena tidak bisa pakai usePathname, kita pakai hover style standar 
            // agar sidebar tetap interaktif dan tidak crash
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 text-slate-400 hover:bg-indigo-600 hover:text-white group"
              >
                <item.icon size={22} className="group-hover:text-white text-slate-500" />
                <span className="font-bold tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout diubah menggunakan tag <a> murni mengarah ke API Route */}
        <div className="p-6 border-t border-slate-800/50">
          <a
            href="/api/auth/logout" 
            className="w-full flex items-center space-x-3 text-slate-500 hover:text-rose-400 p-4 rounded-2xl transition-all hover:bg-rose-500/5"
          >
            <span className="font-bold">Keluar Sistem</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center space-x-2 text-slate-400">
            <LayoutDashboard size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Dashboard &bull; Live
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-right">
              <p className="text-sm font-black text-slate-800 leading-none">{namaGuru}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1">Admin Guru</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}