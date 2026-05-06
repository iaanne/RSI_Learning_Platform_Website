"use client";
import React from "react";
import { MessageSquare, Bell, Clock, Search, MoreHorizontal } from "lucide-react";

export default function PesanGuru() {
  const pesan = [
    { 
      id: 1, 
      sender: "Ibu Pertiwi (Wali Kelas)", 
      msg: "Bapak/Ibu, Talitha hari ini sangat luar biasa di pelajaran Matematika. Dia membantu temannya yang kesulitan.", 
      time: "1 jam lalu",
      isNew: true
    },
    { 
      id: 2, 
      sender: "Bpk. Rahmad (Guru PJOK)", 
      msg: "Pengingat: Besok ada pengambilan nilai praktik renang. Mohon siapkan perlengkapan Talitha.", 
      time: "Kemarin",
      isNew: false
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kotak Pesan 💬</h1>
          <p className="text-slate-500 font-medium">Komunikasi langsung dengan tenaga pendidik.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input type="text" placeholder="Cari pesan..." className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
      </div>

      <div className="space-y-4">
        {pesan.map((p) => (
          <div key={p.id} className={`p-8 rounded-[32px] border transition-all flex items-start space-x-6 ${
            p.isNew ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-100/20' : 'bg-slate-50/50 border-transparent text-slate-500'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              p.isNew ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'
            }`}>
              <MessageSquare size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`text-lg font-black ${p.isNew ? 'text-slate-800' : 'text-slate-500'}`}>
                    {p.sender}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">
                    <Clock size={12} />
                    <span>{p.time}</span>
                  </div>
                </div>
                {p.isNew && <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>}
              </div>
              <p className={`mt-4 leading-relaxed font-medium ${p.isNew ? 'text-slate-600' : 'text-slate-400'}`}>
                "{p.msg}"
              </p>
            </div>
            <button className="text-slate-300 hover:text-indigo-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="bg-white border border-dashed border-slate-300 p-8 rounded-[40px] text-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={24} />
        </div>
        <h4 className="font-black text-slate-800">Tidak ada pengumuman sekolah hari ini</h4>
        <p className="text-sm text-slate-400 mt-1">Kami akan memberitahu Anda jika ada info penting.</p>
      </div>
    </div>
  );
}