"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Users, BookCheck, AlertCircle } from "lucide-react";

export default function KepsekDashboard() {
  const [data, setData] = useState({
    totalStudents: 0, totalTeachers: 0, schoolAvgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress?role=PRINCIPAL")
      .then(r => r.json())
      .then(d => { if (d.totalStudents !== undefined) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Siswa",      value: loading ? "..." : String(data.totalStudents),   icon: Users,        color: "text-blue-600",   bg: "bg-blue-100"   },
    { label: "Rata-rata Nilai",  value: loading ? "..." : `${data.schoolAvgScore}%`,    icon: BookCheck,    color: "text-green-600",  bg: "bg-green-100"  },
    { label: "Guru Aktif",       value: loading ? "..." : String(data.totalTeachers),   icon: TrendingUp,   color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Siswa Tertinggal", value: "—",                                            icon: AlertCircle,  color: "text-red-600",    bg: "bg-red-100"    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Laporan Eksekutif Sekolah</h1>
        <p className="text-slate-500 font-medium">Ringkasan performa akademik tahun ajaran 2026/2027.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <s.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8">Peringkat Ketuntasan Per Kelas</h3>
        <div className="space-y-6">
          {[
            { kelas: "Kelas 6-A", pct: 95, color: "bg-indigo-600" },
            { kelas: "Kelas 4-B", pct: 88, color: "bg-blue-500"   },
            { kelas: "Kelas 5-C", pct: 72, color: "bg-amber-500"  },
            { kelas: "Kelas 1-A", pct: 60, color: "bg-red-500"    },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-6">
              <span className="w-24 text-sm font-bold text-slate-600">{item.kelas}</span>
              <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
              <span className="w-12 text-sm font-black text-slate-800">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100">
          <h3 className="font-bold text-xl mb-6">Manajemen Pengguna</h3>
          <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
            Sebagai Super Admin, Anda memiliki kontrol penuh atas akun Guru dan Siswa.
          </p>
          <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors">
            Kelola Akun Guru
          </button>
        </div>
        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Log Sistem Terakhir</h3>
          <p className="text-sm text-slate-400">Lihat detail di halaman Audit Keamanan.</p>
        </div>
      </div>
    </div>
  );
}