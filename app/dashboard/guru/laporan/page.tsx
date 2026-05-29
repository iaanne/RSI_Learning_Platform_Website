"use client";
import React, { useState, useEffect } from "react";
import { Send, Download, FileCheck, CheckCircle2 } from "lucide-react";

export default function LaporanMingguan() {
  const [catatan, setCatatan]     = useState("");
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState("");
  const [classSubjectId, setClassSubjectId] = useState<string | null>(null);

  // Get first classSubjectId available utk guru ini
  useEffect(() => {
    fetch("/api/materials")
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setClassSubjectId(data[0].classSubjectId);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSend() {
    if (!classSubjectId) {
      setError("Belum ada data kelas tersedia.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classSubjectId, catatanKelas: catatan }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.message ?? "Gagal mengirim laporan.");
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
            <FileCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Review Laporan Mingguan</h2>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-12 space-y-4">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="text-xl font-black text-slate-800">Laporan Berhasil Dikirim!</p>
            <p className="text-slate-500 text-sm">Semua orang tua telah menerima laporan mingguan.</p>
            <button
              onClick={() => { setSent(false); setCatatan(""); }}
              className="mt-4 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm"
            >
              Kirim Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-4 border-t border-slate-50 pt-6">
            <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Status Data Siswa</p>
                <p className="text-xs text-slate-500">Data progress siswa akan diambil otomatis.</p>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Siap Kirim
              </span>
            </div>

            <div className="p-4 border border-slate-100 rounded-2xl">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Catatan Umum Kelas (Opsional)
              </label>
              <textarea
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: Seluruh siswa menunjukkan kemajuan pesat pada materi pecahan..."
                rows={3}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 font-bold px-2">{error}</p>
            )}

            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex-1 bg-blue-600 disabled:opacity-60 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
              >
                <Send size={18} />
                <span>{sending ? "Mengirim..." : "Kirim Laporan ke Semua Ortu"}</span>
              </button>
              <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">
                <Download size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}