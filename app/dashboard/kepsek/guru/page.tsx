"use client";
import React from "react";
import { UserPlus, Mail, Key, BarChart3, Users2, AlertCircle, ChevronRight } from "lucide-react";

export default function ManajemenGuruRinci() {
  const gurus = [
    { 
      name: "Ibu Pertiwi, S.Pd", 
      role: "Wali Kelas 4-B", 
      status: "Aktif",
      jmlSiswa: 32,
      ketuntasan: 88, // % siswa yg mencapai KKM
      tertinggal: 2,  // jumlah anak yg butuh perhatian
      lastUpdate: "Materi IPA Bab 2"
    },
    { 
      name: "Ibu Siti Aminah", 
      role: "Wali Kelas 6-A", 
      status: "Aktif",
      jmlSiswa: 28,
      ketuntasan: 95,
      tertinggal: 0,
      lastUpdate: "Try Out Matve"
    },
    { 
      name: "Bpk. Rahmad, M.Pd", 
      role: "Guru PJOK", 
      status: "Aktif",
      jmlSiswa: 120, // Total semua kelas
      ketuntasan: 72,
      tertinggal: 8,
      lastUpdate: "Praktek Basket"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header dengan Ringkasan Kinerja */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-900 p-8 rounded-[40px] text-white shadow-2xl">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Evaluasi Kinerja Pengajar 👨‍🏫</h2>
          <p className="text-indigo-200 font-medium mt-1">Pantau efektivitas materi dan perkembangan siswa per kelas.</p>
        </div>
        <button className="bg-white text-indigo-900 px-6 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-indigo-50 transition-all shadow-lg">
          <UserPlus size={18} />
          <span>Tambah Tenaga Pendidik</span>
        </button>
      </div>

      {/* Grid Manajemen & Monitoring */}
      <div className="grid grid-cols-1 gap-6">
        {gurus.map((g, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              
              {/* Profil Singkat */}
              <div className="flex items-center space-x-4 min-w-[250px]">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {g.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-xl text-slate-800 leading-none">{g.name}</h4>
                  <p className="text-indigo-500 text-sm font-bold mt-2">{g.role}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {g.status}
                  </span>
                </div>
              </div>

              {/* Indikator Kinerja (Sesuai Proposal: Perkembangan Anak & Ketertinggalan) */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-50 px-0 lg:px-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Siswa</p>
                  <div className="flex items-center space-x-2">
                    <Users2 size={16} className="text-slate-400" />
                    <span className="font-black text-slate-700">{g.jmlSiswa} Anak</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ketuntasan</p>
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={16} className="text-emerald-500" />
                    <span className="font-black text-slate-700">{g.ketuntasan}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tertinggal</p>
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className={g.tertinggal > 0 ? "text-rose-500" : "text-slate-300"} />
                    <span className={`font-black ${g.tertinggal > 0 ? "text-rose-600" : "text-slate-400"}`}>
                      {g.tertinggal} Siswa
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Update Terakhir</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{g.lastUpdate}</p>
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 lg:flex-none bg-slate-50 hover:bg-indigo-600 hover:text-white px-4 py-3 rounded-2xl transition-all text-slate-500 font-bold text-xs flex items-center space-x-2">
                  <Mail size={16} />
                  <span className="lg:hidden">Email</span>
                </button>
                <button className="flex-1 lg:flex-none bg-slate-50 hover:bg-amber-500 hover:text-white px-4 py-3 rounded-2xl transition-all text-slate-500 font-bold text-xs flex items-center space-x-2">
                  <Key size={16} />
                  <span className="lg:hidden">Reset</span>
                </button>
                <button className="flex-1 lg:flex-none bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-2xl transition-all font-black text-xs flex items-center space-x-2">
                  <span>Detail Kinerja</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Legend / Keterangan */}
      <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-200 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs font-bold text-slate-500">Ketuntasan Di Atas KKM</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
          <span className="text-xs font-bold text-slate-500">Butuh Intervensi Kepsek</span>
        </div>
      </div>
    </div>
  );
}