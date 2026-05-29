"use client";
import React, { useState } from "react";
import { ChevronLeft, Save, Video, FileText, Plus, Trash2, Globe, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function InputMateri() {
  const searchParams   = useSearchParams();
  const classSubjectId = searchParams.get("classSubjectId") ?? "";

  const [title, setTitle]         = useState("");
  const [embedUrl, setEmbedUrl]   = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [poinMateri, setPoinMateri] = useState<string[]>([""]);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");

  function updatePoin(i: number, val: string) {
    setPoinMateri(prev => prev.map((p, idx) => idx === i ? val : p));
  }
  function removePoin(i: number) {
    setPoinMateri(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setError("");
    if (!title.trim()) { setError("Judul materi wajib diisi."); return; }
    if (!classSubjectId) { setError("classSubjectId tidak ditemukan. Kembali ke halaman Mapel."); return; }

    const contentText = poinMateri.filter(p => p.trim()).join("\n");

    setSaving(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classSubjectId,
          title:       title.trim(),
          contentText: contentText || null,
          embedUrl:    embedUrl.trim() || undefined,
          videoTitle:  videoTitle.trim() || title.trim(),
          difficulty:  "MEDIUM",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
        setTitle(""); setEmbedUrl(""); setVideoTitle(""); setPoinMateri([""]);
      } else {
        setError(data.message ?? "Gagal menyimpan materi.");
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/guru/mapel" className="flex items-center text-slate-500 font-bold text-sm hover:text-blue-600 w-fit">
        <ChevronLeft size={18} /> Kembali ke Daftar Mapel
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Input Materi Baru 📝</h1>
          <p className="text-slate-500 text-sm font-medium">
            {classSubjectId ? `Class Subject ID: ${classSubjectId.slice(0,8)}...` : "Pilih mata pelajaran terlebih dahulu"}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-lg shadow-indigo-100 transition-all"
        >
          <Save size={18} />
          <span>{saving ? "Menyimpan..." : "Simpan ke Siswa"}</span>
        </button>
      </div>

      {saved && (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold">
          <CheckCircle2 size={20} />
          <span>Materi berhasil disimpan!</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Judul */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Judul Bab / Materi *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Bagaimana Tumbuhan Makan (Fotosintesis)"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-lg text-slate-700"
          />
        </div>

        {/* Video */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 font-black uppercase tracking-widest text-xs">
            <Video size={18} />
            <span>Link Video Penjelasan (Opsional)</span>
          </div>
          <input
            type="text"
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            placeholder="Judul video (opsional)"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-400 font-medium text-slate-700"
          />
          <div className="relative">
            <Globe className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="text"
              value={embedUrl}
              onChange={e => setEmbedUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full p-4 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-500 font-medium"
            />
          </div>
          <p className="text-xs text-slate-400 italic">*Hanya URL YouTube yang valid diterima.</p>
        </div>

        {/* Poin Materi */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
            <FileText size={18} />
            <span>Poin-Poin Penting</span>
          </div>
          <div className="space-y-4">
            {poinMateri.map((poin, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={poin}
                  onChange={e => updatePoin(i, e.target.value)}
                  placeholder={`Poin ke-${i + 1}...`}
                  className="flex-1 p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-medium text-slate-700"
                />
                <button onClick={() => removePoin(i)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setPoinMateri(p => [...p, ""])}
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