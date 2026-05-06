"use client";
import React from "react";
import { ChevronLeft, Plus, Brain, Trash2, Edit3, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function KelolaSoalSederhana() {
  const dummySoal = [
    { id: 1, tanya: "Bagian tumbuhan yang ada di dalam tanah disebut?", level: "Mudah", opsi: "Akar" },
    { id: 2, tanya: "Apa gas yang dilepaskan tumbuhan saat fotosintesis?", level: "Sedang", opsi: "Oksigen" },
    { id: 3, tanya: "Mengapa fotosintesis sangat penting bagi manusia?", level: "Sulit", opsi: "Menghasilkan Oksigen untuk bernapas" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/guru/mapel" className="flex items-center text-slate-500 font-bold text-sm hover:text-blue-600 w-fit">
        <ChevronLeft size={18} /> Kembali
      </Link>

      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Bank Soal Adaptif 🧠</h1>
          <p className="text-slate-500 text-sm font-medium">IPA: Bab 2 - Fotosintesis</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
          <Plus size={18} />
          <span>Buat Soal Baru</span>
        </button>
      </div>

      {/* Info Mekanisme Adaptif */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-indigo-100">
        <div className="space-y-1">
          <h4 className="text-lg font-black flex items-center space-x-2">
            <Brain size={24} />
            <span>Mode Adaptif Aktif</span>
          </h4>
          <p className="text-indigo-100 text-sm opacity-80 max-w-md">Sistem akan otomatis menyesuaikan soal berdasarkan kemampuan siswa (Mudah → Sedang → Sulit).</p>
        </div>
        <div className="hidden md:flex space-x-4">
          <div className="text-center">
            <p className="text-2xl font-black">10</p>
            <p className="text-[10px] uppercase font-bold opacity-60">Mudah</p>
          </div>
          <div className="text-center border-x border-white/20 px-4">
            <p className="text-2xl font-black">15</p>
            <p className="text-[10px] uppercase font-bold opacity-60">Sedang</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">5</p>
            <p className="text-[10px] uppercase font-bold opacity-60">Sulit</p>
          </div>
        </div>
      </div>

      {/* List Soal */}
      <div className="space-y-4">
        {dummySoal.map((soal) => (
          <div key={soal.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all group relative overflow-hidden">
            {/* Indikator Level di samping */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${
              soal.level === 'Mudah' ? 'bg-green-500' : 
              soal.level === 'Sedang' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    soal.level === 'Mudah' ? 'bg-green-100 text-green-700' :
                    soal.level === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    Level {soal.level}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-800 leading-tight">
                  <span className="text-slate-300 mr-2">Q:</span>
                  {soal.tanya}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-green-600 font-bold bg-green-50 w-fit px-3 py-1 rounded-lg">
                  <CheckCircle size={14} />
                  <span>Jawaban: {soal.opsi}</span>
                </div>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 justify-end">
                <button className="p-4 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all">
                  <Edit3 size={20} />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-6 border-4 border-dashed border-slate-100 rounded-[32px] text-slate-300 font-black text-xl hover:text-indigo-400 hover:border-indigo-100 transition-all flex items-center justify-center space-x-3">
        <Plus size={28} />
        <span>Tambah Soal Ke Bab Ini</span>
      </button>
    </div>
  );
}