"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Bell, UserCircle, LogOut } from "lucide-react";

export default function OrtuLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "Ringkasan Anak", icon: LayoutDashboard, href: "/dashboard/ortu" },
    { name: "Grafik Kemajuan", icon: LineChart, href: "/dashboard/ortu/grafik" },
    { name: "Pesan Guru", icon: Bell, href: "/dashboard/ortu/pesan" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-slate-50">
          <div className="font-black text-2xl text-indigo-600 flex items-center space-x-2 tracking-tighter">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">P</div>
            <span>ParentHub</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 mt-4">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                  ? "text-white bg-indigo-600 shadow-xl shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <Link href="/auth/login" className="flex items-center space-x-3 text-rose-500 hover:bg-rose-50 p-4 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} />
            <span>Keluar Sistem</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Pantauan Belajar Talitha</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">Bapak/Ibu Sukma</p>
              <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest mt-0.5">Wali Murid Kelas 4-A</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
               <UserCircle size={32} />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}