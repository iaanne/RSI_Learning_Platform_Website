"use client";
import React, { useState } from "react";
import { UserPlus, Search, Edit3, Trash2, Key, Link as LinkIcon, UserCheck } from "lucide-react";

export default function AccountManagement() {
  // Dummy data untuk simulasi
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Budi Santoso", class: "4-B", usn: "budi.4b", ortu: "Bpk. Santoso", ortuUsn: "ortu.budi", status: "Sudah Ganti Pass" },
    { id: 2, name: "Talitha Sukma", class: "4-B", usn: "talitha.4b", ortu: "Ibu Sukma", ortuUsn: "ortu.talitha", status: "Default" },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Registrasi Akun Siswa & Ortu</h2>
          <p className="text-slate-500 font-medium">Generate username dan password default untuk akses keluarga.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black flex items-center space-x-3 shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
          <UserPlus size={20} />
          <span>Tambah Pasangan Akun</span>
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
             <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500">
               <option>Semua Kelas</option>
               <option>Kelas 4-A</option>
               <option>Kelas 4-B</option>
             </select>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input type="text" placeholder="Cari NISN atau Nama..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 outline-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
              <th className="px-8 py-5">Siswa (Username)</th>
              <th className="px-8 py-5">Pasangan Ortu (Username)</th>
              <th className="px-8 py-5">Status Password</th>
              <th className="px-8 py-5 text-center">Opsi Akun</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-indigo-50/20 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">{acc.class}</div>
                    <div>
                      <p className="font-black text-slate-800 leading-none">{acc.name}</p>
                      <p className="text-xs text-indigo-500 font-mono mt-1 font-bold">{acc.usn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <LinkIcon size={14} className="text-slate-300" />
                    <div>
                      <p className="font-bold text-slate-700 leading-none">{acc.ortu}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">{acc.ortuUsn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    acc.status === 'Default' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {acc.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all" title="Edit Data">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl shadow-sm transition-all" title="Reset Password">
                      <Key size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all" title="Hapus Akun">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Box untuk Kepsek */}
      <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start space-x-4">
        <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg">
          <UserCheck size={20} />
        </div>
        <div>
          <h4 className="font-black text-indigo-900 leading-tight">Mekanisme Pendaftaran Akun</h4>
          <p className="text-sm text-indigo-700/70 mt-1">
            Akun Siswa dan Ortu didaftarkan secara berpasangan. Setelah didaftarkan, berikan username dan password default ke masing-masing keluarga. Sistem akan memaksa mereka mengganti password saat login pertama kali.
          </p>
        </div>
      </div>
    </div>
  );
}