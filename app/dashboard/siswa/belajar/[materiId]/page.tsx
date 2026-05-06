"use client";
import { ChevronLeft, Play, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function MateriPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/dashboard/siswa" className="flex items-center text-slate-500 font-bold text-sm hover:text-indigo-600 transition-all">
        <ChevronLeft size={20} /> Kembali ke Beranda
      </Link>

      <div className="space-y-4 text-center">
        <span className="bg-amber-100 text-amber-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          IPA • BAB 2
        </span>
        <h1 className="text-4xl font-black text-slate-800">Bagaimana Tumbuhan Makan?</h1>
      </div>

      {/* Video Placeholder */}
      <div className="aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative group flex items-center justify-center cursor-pointer">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all">
          <Play size={40} fill="currentColor" />
        </div>
        <p className="absolute bottom-6 text-white/70 text-sm font-medium">Klik untuk putar video penjelasan</p>
      </div>

      {/* Ringkasan Materi */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Proses Fotosintesis</h2>
        <div className="space-y-4">
          {[
            "Tumbuhan memasak makanannya sendiri menggunakan cahaya matahari.",
            "Mereka membutuhkan air, udara (Karbondioksida), dan zat hijau daun.",
            "Hasil masakan tumbuhan adalah Oksigen yang kita hirup!"
          ].map((text, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-green-500 text-white p-1 rounded-full"><CheckCircle size={16}/></div>
              <p className="text-slate-700 font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="group bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center space-x-3 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
          <span>Lanjut ke Quiz</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}