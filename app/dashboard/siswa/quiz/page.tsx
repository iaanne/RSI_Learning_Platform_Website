"use client";
import React, { useState } from "react";
import { Zap, Heart, Check, X } from "lucide-react";
import Link from "next/link";

export default function QuizPagePreview() {
  const [level] = useState("Mudah"); 
  const [selected, setSelected] = useState<number | null>(null);

  const choices = [
    "Cahaya Matahari & Air",
    "Daging & Susu",
    "Nasi & Gorengan",
    "Es Krim"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10 px-6">
      <div className="flex justify-between items-center bg-white px-8 py-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shadow-inner">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="font-black text-slate-700 tracking-tighter">LEVEL: {level}</span>
        </div>
        <div className="flex items-center space-x-2">
           {[1, 2, 3].map((h) => (
             <Heart key={h} size={24} className={h <= 2 ? "text-red-500" : "text-slate-200"} fill="currentColor" />
           ))}
        </div>
      </div>

      <div className="text-center space-y-8">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
           <div className="bg-indigo-500 h-full w-1/3 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 leading-tight px-4">
          Apa yang dibutuhkan tumbuhan untuk melakukan fotosintesis?
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {choices.map((choice, i) => (
          <button 
            key={i} 
            onClick={() => setSelected(i)}
            className={`group p-6 rounded-[28px] text-left font-bold text-lg transition-all flex justify-between items-center border-4
              ${selected === i 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                : 'border-white bg-white text-slate-600 hover:border-slate-100 shadow-sm'}
            `}
          >
            <span>{choice}</span>
            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center
              ${selected === i ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-100'}
            `}>
                {selected === i && <Check size={16} strokeWidth={4} />}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <button 
            disabled={selected === null}
            className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-2xl hover:bg-slate-800 disabled:opacity-20 active:scale-95 transition-all"
        >
            Periksa Jawaban
        </button>
        <Link href="/dashboard/siswa/mapel" className="block text-center text-slate-400 font-bold text-sm hover:underline">
            Nanti saja, aku mau belajar lagi
        </Link>
      </div>
    </div>
  );
}