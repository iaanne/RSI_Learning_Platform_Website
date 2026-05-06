"use client";
import React, { useState } from "react";
import { ChevronLeft, Save, Video, FileText, Plus, Trash2, Globe } from "lucide-react";
import Link from "next/link";

export default function InputMateriSederhana() {
  const [poinMateri, setPoinMateri] = useState([
    "Tumbuhan bernapas menggunakan stomata.",
    "Akar menyerap air dari dalam tanah.",
    "Klorofil adalah zat hijau daun yang menangkap cahaya."
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/guru/mapel" className="flex items-center text-slate-500 font-bold text-sm hover:text-blue-600 w-fit">
        <ChevronLeft size={18} /> Kembali ke Daftar Mapel
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Input Materi Baru 📝</h1>
          <p className="text-slate-500 text-sm font-medium">Mata Pelajaran: <span className="text-blue-600">IPA (Sains)</span></p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-lg shadow-indigo-100 transition-all">
          <Save size={18} />
          <span>Simpan ke Siswa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Identitas Bab */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Judul Bab / Materi</label>
          <input 
            type="text" 
            defaultValue="Bagaimana Tumbuhan Makan (Fotosintesis)"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-lg text-slate-700"
          />
        </div>

        {/* Input Video */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 font-black uppercase tracking-widest text-xs">
            <Video size={18} />
            <span>Link Video Penjelasan</span>
          </div>
          <div className="relative">
            <Globe className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="https://youtube.com/watch?v=..." 
              className="w-full p-4 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-500 font-medium"
            />
          </div>
          <p className="text-xs text-slate-400 italic">*Video ini akan muncul di halaman belajar siswa paling atas.</p>
        </div>

        {/* Input Poin Materi */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
              <FileText size={18} />
              <span>Poin-Poin Penting (Buku Digital)</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {poinMateri.map((poin, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-xs">
                  {index + 1}
                </div>
                <input 
                  type="text" 
                  value={poin}
                  onChange={() => {}} 
                  className="flex-1 p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-medium text-slate-700"
                />
                <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <button 
              onClick={() => setPoinMateri([...poinMateri, ""])}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span>Tambah Baris Materi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}