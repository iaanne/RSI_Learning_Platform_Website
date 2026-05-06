"use client";
import React, { useState } from "react";
import { Zap, Heart } from "lucide-react";

export default function QuizPage() {
  const [level, setLevel] = useState("Mudah"); // Adaptif: Mudah, Sedang, Sulit
  
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      {/* Info Level & Nyawa */}
      <div className="flex justify-between items-center bg-white px-8 py-4 rounded-full shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Zap size={18} fill="currentColor" /></div>
          <span className="font-black text-slate-700">LEVEL: {level}</span>
        </div>
        <div className="flex items-center space-x-2">
           <Heart size={20} className="text-red-500" fill="currentColor" />
           <Heart size={20} className="text-red-500" fill="currentColor" />
           <Heart size={20} className="text-slate-200" fill="currentColor" />
        </div>
      </div>

      {/* Pertanyaan */}
      <div className="text-center space-y-6">
        <div className="w-full bg-slate-100 h-2 rounded-full">
           <div className="bg-indigo-500 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 leading-tight">
          Apa yang dibutuhkan tumbuhan untuk melakukan fotosintesis?
        </h2>
      </div>

      {/* Pilihan Jawaban */}
      <div className="grid grid-cols-1 gap-4">
        {[
          "Cahaya Matahari & Air",
          "Daging & Susu",
          "Nasi & Gorengan",
          "Es Krim"
        ].map((choice, i) => (
          <button key={i} className="group p-6 bg-white border-2 border-slate-100 rounded-3xl text-left font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex justify-between items-center">
            <span>{choice}</span>
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-indigo-500"></div>
          </button>
        ))}
      </div>

      <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all">
        Periksa Jawaban
      </button>
    </div>
  );
}