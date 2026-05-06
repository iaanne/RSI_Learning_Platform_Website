"use client";
import { ChevronLeft, Play, ArrowRight, CheckCircle, Volume2 } from "lucide-react";
import Link from "next/link";

export default function MateriPagePreview() {
  // Data Hardcoded Materi
  const dataMateri = {
    bab: "BAB 2",
    mapel: "IPA",
    judul: "Bagaimana Tumbuhan Makan?",
    poin: [
      "Tumbuhan memasak makanannya sendiri menggunakan cahaya matahari.",
      "Mereka membutuhkan air, udara (Karbondioksida), dan zat hijau daun.",
      "Hasil masakan tumbuhan adalah Oksigen yang kita hirup!"
    ]
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <Link href="/dashboard/siswa/mapel" className="flex items-center text-slate-500 font-bold text-sm hover:text-indigo-600 transition-all">
        <ChevronLeft size={20} /> Kembali ke Daftar Bab
      </Link>

      <div className="space-y-4 text-center">
        <span className="bg-amber-100 text-amber-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          {dataMateri.mapel} • {dataMateri.bab}
        </span>
        <div className="flex items-center justify-center space-x-3">
            <h1 className="text-4xl font-black text-slate-800">{dataMateri.judul}</h1>
            <button className="p-2 bg-slate-100 rounded-full hover:bg-indigo-100 text-indigo-600 transition-all">
                <Volume2 size={20} />
            </button>
        </div>
      </div>

      {/* Video Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative group flex items-center justify-center cursor-pointer border-4 border-white">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-xl">
          <Play size={40} fill="currentColor" />
        </div>
        <p className="absolute bottom-6 text-white/70 text-sm font-medium tracking-wide">Klik untuk putar video penjelasan</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Proses Fotosintesis 🍃</h2>
        <div className="space-y-4">
          {dataMateri.poin.map((text, i) => (
            <div key={i} className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors">
              <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg shadow-green-100">
                <CheckCircle size={18}/>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed text-lg">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Link href="/dashboard/siswa/quiz">
            <button className="group bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center space-x-3 shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            <span>Lanjut ke Quiz</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
        </Link>
      </div>
    </div>
  );
}