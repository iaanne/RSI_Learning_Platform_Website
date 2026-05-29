"use client";
import React, { useEffect, useState } from "react";
import { UserPlus, Search, Mail, Phone, Users, TrendingUp } from "lucide-react";

type Teacher = {
  id: string;
  name: string;
  email: string;
  nip: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function KepsekGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teachers");
        if (res.ok) {
          const data = await res.json();
          setTeachers(data.teachers ?? []);
        } else {
          setError("Gagal memuat data guru.");
        }
      } catch {
        setError("Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = teachers.filter((t) => t.isActive).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Manajemen Guru</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau efektivitas dan kinerja tenaga pendidik.
          </p>
        </div>
        <button className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors">
          <UserPlus size={18} />
          <span>Tambah Tenaga Pendidik</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Guru", value: teachers.length, icon: Users, color: "bg-indigo-50 text-indigo-600" },
          { label: "Guru Aktif", value: activeCount, icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "Tidak Aktif", value: teachers.length - activeCount, icon: Users, color: "bg-rose-50 text-rose-600" },
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

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama, email, atau NIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Teacher list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-semibold">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {search ? "Tidak ada guru yang cocok dengan pencarian." : "Belum ada data guru."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-lg shrink-0">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-black text-slate-800">{teacher.name}</p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        teacher.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {teacher.isActive ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">NIP: {teacher.nip}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center text-xs text-slate-400">
                      <Mail size={12} className="mr-1" /> {teacher.email}
                    </span>
                    {teacher.phone && (
                      <span className="flex items-center text-xs text-slate-400">
                        <Phone size={12} className="mr-1" /> {teacher.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  Detail Kinerja
                </button>
                <button className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          Menampilkan {filtered.length} dari {teachers.length} guru
        </p>
      )}
    </div>
  );
}