import React from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, History, Bell } from "lucide-react";

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
        <div className="font-black text-2xl text-indigo-600 mb-10 tracking-tight">
          L-PLATFORM
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard/siswa" className="flex items-center space-x-3 text-indigo-600 font-bold p-3 bg-indigo-50 rounded-2xl transition-all">
            <LayoutDashboard size={20} />
            <span>Beranda</span>
          </Link>
          <Link href="/dashboard/siswa/mapel" className="flex items-center space-x-3 text-slate-500 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all font-semibold">
            <BookOpen size={20} />
            <span>Materi Saya</span>
          </Link>
          <div className="flex items-center space-x-3 text-slate-500 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all font-semibold">
            <History size={20} />
            <span>Riwayat Nilai</span>
          </div>
        </nav>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Progres Mingguan</p>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[65%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Sedikit lagi capai target!</p>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Panel Siswa</h2>
            <p className="text-xs text-slate-400 font-medium">Senin, 14 April 2026</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-700 hidden sm:block">Talitha</span>
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                T
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}