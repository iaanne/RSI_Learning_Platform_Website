"use client";

import React from "react";
import { Send, Download, FileCheck } from "lucide-react";

export default function LaporanMingguan() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
            <FileCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Review Laporan Mingguan</h2>
            <p className="text-slate-500 text-sm">Minggu ke-2, April 2026</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-50 pt-6">
          <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">Status Data Siswa</p>
              <p className="text-xs text-slate-500">20/20 Siswa sudah memiliki nilai minggu ini.</p>
            </div>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Siap Kirim</span>
          </div>

          <div className="p-4 border border-slate-100 rounded-2xl">
            <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Umum Kelas (Opsional)</label>
            <textarea 
              className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Seluruh siswa menunjukkan kemajuan pesat pada materi pecahan..."
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-200">
            <Send size={18} />
            <span>Kirim Laporan ke Semua Ortu</span>
          </button>
          <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}