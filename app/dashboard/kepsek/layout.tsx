"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, GraduationCap, ShieldCheck, LogOut } from "lucide-react";

export default function KepsekLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview Sekolah", icon: LayoutGrid, href: "/dashboard/kepsek" },
    { name: "Manajemen Guru", icon: Users, href: "/dashboard/kepsek/guru" },
    { name: "Data Seluruh Siswa", icon: GraduationCap, href: "/dashboard/kepsek/siswa" },
    { name: "Audit Keamanan", icon: ShieldCheck, href: "/dashboard/kepsek/audit" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-indigo-950 text-indigo-200 hidden md:flex flex-col fixed h-full shadow-2xl">
        <div className="p-8 text-white border-b border-indigo-900/50">
          <h1 className="font-black text-2xl tracking-tighter">SDN 01 SOLO</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-2">Super Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                  ? "text-white bg-indigo-600 shadow-lg shadow-indigo-600/20" 
                  : "hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-indigo-900/50">
          <button className="flex items-center space-x-3 text-indigo-400 hover:text-rose-400 transition-colors text-sm font-bold group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}