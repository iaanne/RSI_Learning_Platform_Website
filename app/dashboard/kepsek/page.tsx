"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Users, BookCheck, AlertCircle } from "lucide-react";

type SchoolData = {
  totalStudents: number;
  totalTeachers: number;
  schoolAvgScore: number;
};

type ClassRank = {
  name: string;
  pct: number;
};

export default function KepsekDashboard() {
  const [data, setData]       = useState<SchoolData>({ totalStudents: 0, totalTeachers: 0, schoolAvgScore: 0 });
  const [classes, setClasses] = useState<ClassRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/progress?role=PRINCIPAL");
        if (res.ok) {
          const d = await res.json();
          if (d.totalStudents !== undefined) setData(d);
        }

        const studRes = await fetch("/api/students?includeProgress=true");
        if (studRes.ok) {
          const students: any[] = await studRes.json();

          const classMap: Record<string, { total: number; count: number }> = {};
          for (const s of students) {
            const className = s.class?.name ?? "Unknown";
            const progList: any[] = s.progress ?? [];
            const avg = progList.length > 0
              ? progList.reduce((sum: number, p: any) => sum + (p.totalScore ?? 0), 0) / progList.length
              : 0;
            if (!classMap[className]) classMap[className] = { total: 0, count: 0 };
            classMap[className].total += avg;
            classMap[className].count += 1;
          }

          const ranked: ClassRank[] = Object.entries(classMap)
            .map(([name, { total, count }]) => ({
              name,
              pct: Math.round(count > 0 ? total / count : 0),
            }))
            .sort((a, b) => b.pct - a.pct);

          setClasses(ranked);
        }
      } catch {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const stats = [
    { label: "Total Siswa",      value: loading ? "..." : String(data.totalStudents),  icon: Users,        color: "text-emerald-600",   bg: "bg-emerald-50"   },
    { label: "Rata-rata Nilai",  value: loading ? "..." : `${data.schoolAvgScore}%`,   icon: BookCheck,    color: "text-teal-600",      bg: "bg-teal-50"   },
    { label: "Guru Aktif",       value: loading ? "..." : String(data.totalTeachers),  icon: TrendingUp,   color: "text-cyan-600",      bg: "bg-cyan-50" },
    { label: "Siswa Tertinggal", value: loading ? "..." : "0",                         icon: AlertCircle,  color: "text-amber-600",     bg: "bg-amber-50" },
  ];

  function barColor(pct: number) {
    if (pct >= 85) return "bg-emerald-500";
    if (pct >= 75) return "bg-teal-400";
    if (pct >= 60) return "bg-amber-400";
    return "bg-rose-400";
  }

  const displayClasses: ClassRank[] = classes.length > 0 ? classes : [
    { name: "Kelas 6-A", pct: 95 },
    { name: "Kelas 4-B", pct: 88 },
    { name: "Kelas 5-C", pct: 72 },
    { name: "Kelas 1-A", pct: 60 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Laporan Eksekutif Sekolah</h1>
          <p className="text-slate-500 font-medium mt-1">Ringkasan performa akademik tahun ajaran 2026/2027.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs tracking-wide self-start">
          🟢 SISTEM AKTIF
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-emerald-50/60 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
              <s.icon size={22} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Class Ranking */}
      <div className="bg-white p-8 rounded-[32px] border border-emerald-50/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Peringkat Ketuntasan Per Kelas</h3>
            <p className="text-xs text-slate-400 mt-0.5">Berdasarkan akumulasi nilai pengerjaan modul siswa.</p>
          </div>
          {classes.length === 0 && !loading && (
            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-500 font-bold rounded-full">Demo Data</span>
          )}
        </div>
        {loading ? (
          <p className="text-slate-400 text-sm">Memuat data kelas...</p>
        ) : (
          <div className="space-y-6">
            {displayClasses.map((item, i) => (
              <div key={i} className="flex items-center space-x-6">
                <span className="w-24 text-sm font-bold text-slate-600 shrink-0">{item.name}</span>
                <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden p-[2px]">
                  <div
                    className={`${barColor(item.pct)} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-black text-slate-800 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

{/* Landing Page Style Bottom Panels */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"> {/* Tambah items-stretch agar tinggi card kanan-kiri selalu sama seimbang */}
  
  {/* Card Kiri: Manajemen Pengguna */}
  <div className="bg-gradient-to-br from-emerald-800 to-teal-950 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
    <div className="absolute right-0 bottom-0 opacity-10 text-9xl pointer-events-none transform translate-x-10 translate-y-10 select-none">
      🍃
    </div>
    <div className="z-10">
      <h3 className="font-bold text-xl mb-3">Manajemen Pengguna</h3>
      <p className="text-emerald-200/90 text-sm mb-6 leading-relaxed max-w-md">
        Sebagai Kepala Sekolah, Anda memegang kendali penuh validasi berkas, penugasan kelas, serta hak akses login Guru dan Siswa.
      </p>
    </div>
    <div className="z-10 mt-auto"> {/* mt-auto memaksa tombol selalu berada di paling bawah card secara rapi */}
      <Link href="/dashboard/kepsek/guru">
        <button className="bg-white text-emerald-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md inline-block">
          Kelola Akun Guru
        </button>
      </Link>
    </div>
  </div>

  {/* Card Kanan: Log Keamanan Sistem */}
  <div className="bg-white rounded-[32px] p-8 border border-emerald-50/60 shadow-sm flex flex-col justify-between min-h-[220px]">
    <div>
      <h3 className="font-bold text-slate-800 text-xl mb-3">Log Keamanan Sistem</h3>
      <p className="text-sm text-slate-500 leading-relaxed max-w-md">
        Pantau seluruh aktivitas mutasi data database, riwayat login, serta eksekusi sistem demi menjaga integritas data akademik SDN 01 Solo.
      </p>
    </div>
    <div className="mt-auto">
      <Link href="/dashboard/kepsek/audit">
        <button className="px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 inline-flex">
          Buka Audit Log <span className="text-emerald-400">→</span>
        </button>
      </Link>
    </div>
  </div>

</div>
    </div>
  );
}