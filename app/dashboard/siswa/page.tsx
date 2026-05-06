"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Trophy, Star, ArrowRight, Clock, Flame } from "lucide-react";

export default function SiswaDashboard() {
  const stats = [
    { label: "Materi Selesai", value: "12", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Poin Belajar", value: "1,250", icon: Star, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Peringkat", value: "5", icon: Trophy, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <section className="relative overflow-hidden bg-indigo-700 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Flame size={20} className="text-orange-400 fill-orange-400" />
            <span className="text-sm font-bold text-indigo-100 uppercase tracking-widest">3 Day Streak!</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Semangat Belajar, Talitha! 👋</h1>
          <p className="text-indigo-100 max-w-md">Satu langkah lagi menuju peringkat 3 besar. Ayo selesaikan tantangan hari ini!</p>
        </div>
        {/* Dekorasi Abstract */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full"></div>
      </section>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Adaptive Learning Cards */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Petualangan Belajar 🗺️</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Matematika */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-tighter">
                  Matematika
                </span>
                <div className="flex items-center text-slate-400 text-xs font-bold uppercase">
                  <Clock size={14} className="mr-1" /> 15 Menit
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-2">Perkalian Desimal</h4>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Level kamu: <span className="text-blue-600 font-black italic underline">Medium</span>. 
                Tinggal dikit lagi buat naik ke Level Hard!
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-400">Progres</span>
                  <span className="text-blue-600">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>

              <button className="w-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95">
                <span>Lanjutkan</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Card IPA - Ini yang Connect ke Preview Kamu */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group border-b-8 border-b-orange-500">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-black rounded-full uppercase tracking-tighter">
                  IPA (Sains)
                </span>
                <div className="flex items-center text-slate-400 text-xs font-bold">
                  <Clock size={14} className="mr-1" /> 10 Menit
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-2">Proses Fotosintesis 🌿</h4>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Kamu baru mulai! Pelajari ini untuk membuka <span className="font-bold text-slate-800 italic">Misi Ilmuwan</span>.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Progres Bab</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full">
                  <div className="bg-orange-500 h-full w-[5%] rounded-full"></div>
                </div>
              </div>

              <Link href="/dashboard/siswa/mapel">
                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-slate-200 active:scale-95 transition-all">
                  <span>Mulai Misi</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h4 className="text-xl font-black text-slate-800 mb-1">Butuh Bantuan, Talitha? 🙋‍♀️</h4>
          <p className="text-slate-500 font-medium">Jangan ragu tanya Guru kalau ada yang bingung ya!</p>
        </div>
        <button className="bg-white border-2 border-slate-800 text-slate-800 px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 hover:text-white transition-all">
          Hubungi Guru
        </button>
      </div>
    </div>
  );
}