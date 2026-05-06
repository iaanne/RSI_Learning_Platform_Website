"use client";
import React from "react";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

export default function GrafikKemajuan() {
  const dataMingguan = [
    { minggu: "Minggu 1", skor: 70 },
    { minggu: "Minggu 2", skor: 85 },
    { minggu: "Minggu 3", skor: 82 },
    { minggu: "Minggu 4", skor: 95 },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center md:text-left">Tren Belajar Talitha 📈</h1>
        <p className="text-slate-500 font-medium text-center md:text-left">Visualisasi performa akademik berdasarkan kuis adaptif mingguan.</p>
      </header>

      {/* Statistik Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><Target size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target KKM</p>
            <p className="text-xl font-black text-slate-800">75.00</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peningkatan</p>
            <p className="text-xl font-black text-slate-800 text-emerald-500">+12.5%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl"><Award size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predikat</p>
            <p className="text-xl font-black text-slate-800">Sangat Baik</p>
          </div>
        </div>
      </div>

      {/* Visualisasi Grafik Sederhana (CSS Based) */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 mb-10 flex items-center space-x-3">
          <Calendar size={20} className="text-indigo-600" />
          <span>Grafik Skor Bulanan (April 2026)</span>
        </h3>
        <div className="flex items-end justify-between h-64 gap-4 px-4 border-b-2 border-slate-100">
          {dataMingguan.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-black px-3 py-1.5 rounded-lg">
                {d.skor}
              </div>
              {/* Bar */}
              <div 
                className={`w-full max-w-[60px] rounded-t-2xl transition-all duration-1000 group-hover:brightness-110 ${
                  d.skor > 80 ? 'bg-indigo-500' : 'bg-indigo-300'
                }`}
                style={{ height: `${d.skor}%` }}
              ></div>
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.minggu}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}