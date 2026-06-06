"use client";

import React from "react";
import Link from "next/navigation"; // Gunakan next/link jika di Next.js biasa, Next 13+ app router support standard HTML tag or 'next/link'
import NextLink from "next/link"; 
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
    <div className="flex min-h-screen w-full bg-[#F4F9F4]">
      
      {/* 1. SIDEBAR FIXED */}
      <aside 
        className="bg-emerald-950 text-emerald-200 flex flex-col fixed top-0 bottom-0 left-0 z-50 shadow-2xl shrink-0"
        style={{ width: "288px" }}
      >
        {/* Header Sidebar */}
        <div className="p-8 text-white border-b border-emerald-900/50 shrink-0">
          <h1 className="font-black text-2xl tracking-tighter flex items-center gap-2">
            🍃 <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">SDN 01 SOLO</span>
          </h1>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-2">Executive Admin Panel</p>
        </div>
        
        {/* Menu Navigasi */}
        <nav className="flex-1 p-6 flex flex-col gap-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <NextLink 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm shrink-0 w-full ${
                  isActive 
                    ? "text-white bg-emerald-600 shadow-lg shadow-emerald-600/30" 
                    : "text-emerald-300/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                <span>{item.name}</span>
              </NextLink>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-8 border-t border-emerald-900/50 shrink-0">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/auth/login";
            }}
            className="flex items-center gap-3 text-emerald-400 hover:text-rose-400 transition-colors text-sm font-bold group w-full text-left"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Lebar dinamis dikurangi lebar sidebar) */}
      <div 
        className="flex-1 flex flex-col min-w-0 min-h-screen" 
        style={{ marginLeft: "288px" }} // Menggunakan marginLeft agar konten terdorong sempurna dari kiri
      >
        <main className="flex-1 p-6 md:p-10 w-full max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}