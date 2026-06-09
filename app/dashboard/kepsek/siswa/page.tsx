"use client";
import React, { useEffect, useState } from "react";
import { Search, UserPlus, BookOpen, TrendingUp, AlertCircle } from "lucide-react";

type Student = {
  id: string;
  name: string;
  nis: string;
  birthdate: string | null;
  totalPoints: number;
  currentStreak: number;
  className: string;
  parentName: string | null;
  parentEmail: string | null;
  isActive: boolean;
};

export default function KepsekSiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Add account form state
  const [form, setForm] = useState({
    namaSiswa: "",
    kelas: "",
    namaOrtu: "",
    emailOrtu: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addResult, setAddResult] = useState<{ usernameSiswa: string; usernameOrtu: string; password: string } | null>(null);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students ?? []);
      } else {
        setError("Gagal memuat data siswa.");
      }
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  const classes = [...new Set(students.map((s) => s.className))].sort();

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass ? s.className === filterClass : true;
    return matchSearch && matchClass;
  });

  async function handleAddAccount() {
    if (!form.namaSiswa || !form.kelas || !form.namaOrtu || !form.emailOrtu) {
      setAddError("Semua field wajib diisi.");
      return;
    }
    setAddLoading(true);
    setAddError("");
    setAddResult(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAddResult(data);
        setForm({ namaSiswa: "", kelas: "", namaOrtu: "", emailOrtu: "" });
        load(); // refresh list
      } else {
        setAddError(data.error ?? "Gagal membuat akun.");
      }
    } catch {
      setAddError("Gagal terhubung ke server.");
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Registrasi Akun Siswa &amp; Ortu</h1>
          <p className="text-slate-500 text-sm mt-1">
            Generate username dan password default untuk akses keluarga.
          </p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddResult(null); setAddError(""); }}
          className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={18} />
          <span>Tambah Pasangan Akun</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Siswa", value: students.length, icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
          { label: "Siswa Aktif", value: students.filter((s) => s.isActive).length, icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "Tidak Aktif", value: students.filter((s) => !s.isActive).length, icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-[20px] p-5 flex items-center space-x-4`}>
            <s.icon size={28} />
            <div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-bold opacity-70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau NIS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Student list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-semibold">{error}</div>
      ) : (
        <>
          {/* Table header */}
          <div className="grid grid-cols-5 text-xs font-bold text-slate-400 uppercase px-4 pb-1 border-b border-slate-100">
            <span className="col-span-2">Siswa (Username)</span>
            <span>Pasangan Ortu</span>
            <span>Status Password</span>
            <span>Opsi Akun</span>
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                Tidak ada siswa yang cocok.
              </div>
            ) : (
              filtered.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border border-slate-100 rounded-[20px] p-4 grid grid-cols-5 items-center gap-2 hover:border-indigo-200 transition-colors"
                >
                  {/* Student info */}
                  <div className="col-span-2 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm shrink-0">
                      {student.className}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-400">NIS: {student.nis}</p>
                    </div>
                  </div>

                  {/* Parent info */}
                  <div>
                    {student.parentName ? (
                      <>
                        <p className="text-sm font-bold text-slate-700">{student.parentName}</p>
                        <p className="text-xs text-slate-400">{student.parentEmail}</p>
                      </>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        student.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {student.isActive ? "SUDAH GANTI PASS" : "DEFAULT"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors" title="Edit">
                      ✏️
                    </button>
                    <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors" title="Reset password">
                      🔑
                    </button>
                    <button className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors" title="Nonaktifkan">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {filtered.length > 0 && (
            <p className="text-center text-xs text-slate-400">
              Menampilkan {filtered.length} dari {students.length} siswa
            </p>
          )}
        </>
      )}

      {/* Mekanisme info box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[20px] p-5 flex items-start space-x-3">
        <UserPlus size={20} className="text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-indigo-800 text-sm">Mekanisme Pendaftaran Akun</p>
          <p className="text-xs text-indigo-600 mt-1">
            Akun Siswa dan Ortu didaftarkan secara berpasangan. Setelah didaftarkan, berikan
            username dan password default ke masing-masing keluarga. Sistem akan memaksa mereka
            mengganti password saat login pertama kali.
          </p>
        </div>
      </div>

      {/* Add account modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-800 mb-6">Tambah Pasangan Akun</h2>

            {addResult ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                  <p className="font-bold text-green-800 mb-3">✅ Akun berhasil dibuat!</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Username Siswa:</span> {(addResult as any).studentEmail ?? addResult.usernameSiswa}</p>
                    <p><span className="font-bold">Username Ortu:</span> {(addResult as any).parentEmail ?? addResult.usernameOrtu}</p>
                    <p><span className="font-bold">Password Default:</span> <code className="bg-slate-100 px-2 py-0.5 rounded">{addResult.password}</code></p>
                  </div>
                  <p className="text-xs text-green-600 mt-3">Berikan kredensial ini ke keluarga. Mereka wajib ganti password saat login pertama.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Nama Siswa", key: "namaSiswa", placeholder: "Contoh: Budi Santoso" },
                  { label: "Kelas", key: "kelas", placeholder: "Contoh: 4-B" },
                  { label: "Nama Orang Tua", key: "namaOrtu", placeholder: "Contoh: Bapak Santoso" },
                  { label: "Email Orang Tua", key: "emailOrtu", placeholder: "ortu@email.com" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">{field.label}</label>
                    <input
                      type={field.key === "emailOrtu" ? "email" : "text"}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                ))}

                {addError && (
                  <p className="text-rose-500 text-sm font-semibold">{addError}</p>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddAccount}
                    disabled={addLoading}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50"
                  >
                    {addLoading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}