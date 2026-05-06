"use client";

import React from "react";
import { AlertCircle, TrendingUp, BookOpen, CheckCircle2, ChevronRight } from "lucide-react";

export default function OrtuDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profil Singkat Anak */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center text-3xl border border-white/30">
              🎓
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Sedang Memantau:</p>
              <h1 className="text-3xl font-bold">Talitha Sukma</h1>
              <p className="text-indigo-100 italic">Kelas 4-A • SD Negeri 1 Surakarta</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-xs text-indigo-100 uppercase font-bold mb-1">Rata-rata Nilai</p>
            <p className="text-3xl font-black">88.5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri & Tengah: Analitik */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status KKM Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start space-x-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Perlu Perhatian Khusus</h4>
              <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                Talitha sedikit kesulitan pada materi <strong>"Pembagian Pecahan"</strong>. 
                Sistem menyarankan pendampingan belajar selama 15 menit malam ini.
              </p>
            </div>
          </div>

          {/* Perkembangan Per Mapel */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <TrendingUp size={20} className="text-indigo-500" />
              <span>Kemampuan Per Bidang</span>
            </h3>
            
            <div className="space-y-6">
              {[
                { label: "Matematika", value: 85, color: "bg-blue-500" },
                { label: "Bahasa Indonesia", value: 92, color: "bg-green-500" },
                { label: "IPA", value: 78, color: "bg-amber-500" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aktivitas Terbaru & Catatan Guru */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terakhir</h3>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="bg-green-100 text-green-600 p-2 h-fit rounded-lg">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 uppercase text-[10px]">Selesai • 2 jam lalu</p>
                  <p className="text-sm text-slate-600 font-medium">Uji Kompetensi: Sistem Tata Surya</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="bg-blue-100 text-blue-600 p-2 h-fit rounded-lg">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 uppercase text-[10px]">Belajar • Kemarin</p>
                  <p className="text-sm text-slate-600 font-medium">Membaca: Sejarah Candi Borobudur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pesan Guru */}
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-3">Catatan Guru</h3>
            <p className="text-sm text-indigo-800 italic leading-relaxed mb-4">
              "Talitha sangat aktif dalam diskusi kelas hari ini. Keaktifannya membantu teman-temannya memahami materi."
            </p>
            <button className="w-full py-2 bg-white text-indigo-600 text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-100 transition-all flex items-center justify-center space-x-2">
              <span>Balas Pesan</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}