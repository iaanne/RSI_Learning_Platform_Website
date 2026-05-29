"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

type ProgressItem = {
  subject: string;
  totalScore: number;
  completionPercent: number;
  adaptiveLevel: string;
};

export default function GrafikKemajuan() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProgress(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgScore = progress.length
    ? Math.round(progress.reduce((s, p) => s + (p.totalScore ?? 0), 0) / progress.length)
    : 0;

  const predikat = avgScore >= 85 ? "Sangat Baik" : avgScore >= 75 ? "Baik" : "Perlu Perhatian";

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Grafik Kemajuan 📈</h1>
        <p className="text-slate-500 font-medium">Visualisasi performa akademik berdasarkan kuis adaptif.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Target KKM",   value: "75",       icon: Target,    bg: "bg-emerald-100", color: "text-emerald-600" },
          { label: "Rata-rata",    value: loading ? "..." : `${avgScore}`, icon: TrendingUp, bg: "bg-indigo-100", color: "text-indigo-600" },
          { label: "Predikat",     value: loading ? "..." : predikat,  icon: Award,     bg: "bg-amber-100",   color: "text-amber-600"   },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}><s.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 mb-10 flex items-center space-x-3">
          <Calendar size={20} className="text-indigo-600" />
          <span>Progress Per Mata Pelajaran</span>
        </h3>

        {loading ? (
          <p className="text-slate-400 text-center py-12">Memuat data...</p>
        ) : progress.length === 0 ? (
          <p className="text-slate-400 text-center py-12">Belum ada data kuis.</p>
        ) : (
          <div className="space-y-6">
            {progress.map((p, i) => (
              <div key={i} className="flex items-center space-x-6">
                <span className="w-32 text-sm font-bold text-slate-600 truncate">{p.subject}</span>
                <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      (p.totalScore ?? 0) >= 85 ? "bg-indigo-500" :
                      (p.totalScore ?? 0) >= 75 ? "bg-blue-400" : "bg-rose-400"
                    }`}
                    style={{ width: `${Math.min(p.totalScore ?? 0, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-black text-slate-800">{p.totalScore ?? 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}