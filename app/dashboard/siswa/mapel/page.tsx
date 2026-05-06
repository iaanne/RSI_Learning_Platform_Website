"use client";
import React, { useState } from "react";
import { Book, PlayCircle, PenTool, Lock, ChevronLeft, CheckCircle2, Star, BookOpen } from "lucide-react";
import Link from "next/link";

export default function DetailMapelMulti() {
  // State untuk memilih mapel yang aktif
  const [activeTab, setActiveTab] = useState("ipa");

  // Konfigurasi Data per Mapel
  const dataMapel = {
    ipa: {
      nama: "IPA (Sains)",
      emoji: "🔬",
      warna: "from-green-600 to-emerald-500",
      progress: 35,
      units: [
        {
          id: "U1",
          babTitle: "Bab 1: Tumbuhan Sumber Kehidupan",
          tasks: [
            { id: "1", title: "Bagian Tubuh Tumbuhan", status: "selesai", type: "Materi", icon: <Book size={20}/> },
            { id: "2", title: "Proses Fotosintesis", status: "sedang-belajar", type: "Video", icon: <PlayCircle size={20}/> },
          ]
        },
        {
          id: "U2",
          babTitle: "Bab 2: Wujud Benda",
          tasks: [
            { id: "3", title: "Benda Padat & Cair", status: "terkunci", type: "Materi", icon: <Book size={20}/> },
          ]
        }
      ]
    },
    indo: {
      nama: "Bahasa Indonesia",
      emoji: "📚",
      warna: "from-blue-600 to-indigo-500",
      progress: 60,
      units: [
        {
          id: "B1",
          babTitle: "Bab 1: Menyimak Cerita Rakyat",
          tasks: [
            { id: "i1", title: "Tokoh & Penokohan", status: "selesai", type: "Materi", icon: <Book size={20}/> },
            { id: "i2", title: "Alur Cerita", status: "selesai", type: "Quiz", icon: <PenTool size={20}/> },
          ]
        },
        {
          id: "B2",
          babTitle: "Bab 2: Menulis Laporan",
          tasks: [
            { id: "i3", title: "Struktur Laporan Observasi", status: "sedang-belajar", type: "Materi", icon: <Book size={20}/> },
          ]
        }
      ]
    }
  };

  const currentMapel = dataMapel[activeTab as keyof typeof dataMapel];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 pb-20">
      <Link href="/dashboard/siswa" className="flex items-center text-slate-400 font-bold text-sm hover:text-indigo-600 transition-all w-fit">
        <ChevronLeft size={20} /> Kembali ke Beranda
      </Link>

      {/* 1. Selector Mapel (Tabs) */}
      <div className="flex p-2 bg-slate-100 rounded-[24px] w-fit space-x-2">
        <button 
          onClick={() => setActiveTab("ipa")}
          className={`px-6 py-3 rounded-[18px] font-black text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'ipa' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>🔬 IPA</span>
        </button>
        <button 
          onClick={() => setActiveTab("indo")}
          className={`px-6 py-3 rounded-[18px] font-black text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'indo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>📚 B. Indonesia</span>
        </button>
      </div>

      {/* 2. Dynamic Header Berdasarkan Mapel Aktif */}
      <div className={`bg-gradient-to-br ${currentMapel.warna} p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden transition-all duration-500`}>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">
            {currentMapel.nama} {currentMapel.emoji}
          </h1>
          <div className="mt-8 flex items-center space-x-4 max-w-sm">
            <div className="flex-1 bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-md">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000" 
                style={{ width: `${currentMapel.progress}%` }}
              ></div>
            </div>
            <span className="font-black text-sm tracking-tighter">{currentMapel.progress}% Selesai</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
           <BookOpen size={200} fill="white" />
        </div>
      </div>

      {/* 3. Daftar Bab Berdasarkan Mapel Aktif */}
      <div className="space-y-12">
        {currentMapel.units.map((unit) => (
          <section key={unit.id}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="px-5 py-2 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-xs text-slate-500 uppercase tracking-[0.2em]">
                {unit.babTitle}
              </div>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid gap-4 ml-4">
              {unit.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group flex items-center p-5 rounded-3xl border transition-all ${
                    task.status === 'terkunci' ? 'bg-slate-50/50 opacity-50' : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 ${
                    task.status === 'selesai' ? 'bg-emerald-100 text-emerald-600' :
                    task.status === 'sedang-belajar' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {task.status === 'selesai' ? <CheckCircle2 size={24}/> : task.status === 'terkunci' ? <Lock size={20}/> : task.icon}
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.type}</p>
                    <h4 className="font-black text-slate-700">{task.title}</h4>
                  </div>

                  {task.status !== 'terkunci' && (
                    <Link href="/dashboard/siswa/belajar">
                      <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                        {task.status === 'selesai' ? 'Ulangi' : 'Gas!'}
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}