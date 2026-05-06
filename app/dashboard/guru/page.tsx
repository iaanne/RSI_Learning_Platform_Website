"use client";

import React from "react";
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle2, Users, TrendingUp, Target } from "lucide-react";

export default function GuruDashboard() {
  const students = [
    { id: "001", name: "Talitha Sukma", avg: 88, status: "Sangat Baik", progress: 90 },
    { id: "002", name: "Budi Santoso", avg: 65, status: "Butuh Perhatian", progress: 45 },
    { id: "003", name: "Citra Lestari", avg: 95, status: "Sangat Baik", progress: 100 },
    { id: "004", name: "Dimas Anggara", avg: 72, status: "Normal", progress: 65 },
  ];

  // Statistik Ringkas
  const stats = [
    { label: "Total Siswa", value: "32", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Rata-rata Kelas", value: "78.5", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Butuh Perhatian", value: "3", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Header Tabel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Monitoring Siswa 📊</h1>
          <p className="text-slate-500 text-sm font-medium">Data real-time perkembangan kemampuan adaptif siswa.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm w-full md:w-72 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium" 
            />
          </div>
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* 3. Tabel Siswa */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Siswa</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Rata-rata</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      s.status === "Butuh Perhatian" 
                        ? "bg-rose-100 text-rose-600" 
                        : s.status === "Sangat Baik" 
                        ? "bg-emerald-100 text-emerald-600" 
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {s.status === "Butuh Perhatian" ? <AlertCircle size={12}/> : <CheckCircle2 size={12}/>}
                      <span>{s.status}</span>
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-lg">{s.avg}%</span>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${s.avg > 80 ? 'bg-emerald-500' : s.avg > 60 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                          style={{ width: `${s.avg}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm">
                      <MessageSquare size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}