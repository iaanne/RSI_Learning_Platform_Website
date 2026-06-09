"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Book, ChevronRight, GraduationCap } from "lucide-react";

type ClassSubject = {
  id: string;
  subject: { name: string };
  class: { name: string };
};

// Mengubah array warna ikon agar sesuai dengan palet baru (Green, Orange, Yellow, Blue, Purple, Teal)
const COLORS = [
  { light: "bg-[#E8F5E9]", text: "text-[#2E7D32]" }, // Green
  { light: "bg-[#FFF8E1]", text: "text-[#FF8F00]" }, // Orange
  { light: "bg-[#E0F2F1]", text: "text-[#00897B]" }, // Teal
  { light: "bg-[#E3F2FD]", text: "text-[#1976D2]" }, // Blue
  { light: "bg-[#F3E5F5]", text: "text-[#7B1FA2]" }, // Purple
  { light: "bg-[#FFFDE7]", text: "text-[#FFD600]" }, // Yellow
];

export default function KelolaMapel() {
  const [mapels, setMapels]   = useState<ClassSubject[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    fetch("/api/teachers")
      .then((r) => {
        if (!r.ok) throw new Error(`Gagal mengambil data (Status: ${r.status})`);
        return r.json();
      })
      .then((res) => {
        // Membaca format pembungkus data yang baru
        if (res.success && res.teacher && res.teacher.classSubjects) {
          setMapels(res.teacher.classSubjects);
        } else if (Array.isArray(res.teachers)) {
          // Fallback jika diakses principal/akun testing
          setMapels(res.teachers[0]?.classSubjects ?? []);
        } else {
          setMapels([]);
        }
      })
      .catch((err) => {
        console.error("Error load mapel:", err);
      })
      .finally(() => setLoading(false));
  }, []);
  
  const DUMMY_MAPELS = ["Matematika", "IPA", "IPS", "Bahasa Indonesia", "PPKn", "Seni Budaya"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Judul menggunakan warna hijau gelap utama */}
          <h1 className="text-3xl font-black text-[#2E7D32] tracking-tight">Kurikulum Kelas 📚</h1>
          <p className="text-[#2E7D32]/70 font-medium">Kelola materi dan kuis adaptif untuk setiap mata pelajaran.</p>
        </div>
        {/* Tombol Mapel Baru menggunakan warna --green (#4CAF50) */}
        <button className="bg-[#4CAF50] text-white px-6 py-4 rounded-[24px] flex items-center space-x-3 font-black shadow-[0_8px_32px_rgba(76,175,80,0.2)] hover:bg-[#2E7D32] transition-all">
          <Plus size={20} strokeWidth={3} />
          <span>Mapel Baru</span>
        </button>
      </div>

      {loading ? (
        <p className="text-[#2E7D32]/50 font-medium">Memuat mata pelajaran...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(mapels.length > 0 ? mapels : DUMMY_MAPELS.map((n, i) => ({
            id: String(i), subject: { name: n }, class: { name: "4-B" }
          }))).map((item, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              // Card menggunakan border radius kustom 24px dan shadow baru
              <div key={item.id} className="bg-white p-8 rounded-[24px] border border-[#E8F5E9] shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 group">
                {/* Box ikon mengikuti skema warna dinamis */}
                <div className={`w-16 h-16 ${c.light} ${c.text} rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Book size={32} />
                </div>
                <h3 className="font-black text-2xl text-[#2E7D32] mb-1">{item.subject.name}</h3>
                <div className="flex items-center space-x-2 text-[#2E7D32]/50 text-sm font-bold mb-8">
                  <GraduationCap size={16} />
                  <span>{item.class.name}</span>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href={`/dashboard/guru/mapel/kelola-soal?classSubjectId=${item.id}`}>
                    {/* Tombol utama diubah dari hitam ke warna --green (#4CAF50) */}
                    <button className="w-full py-4 bg-[#4CAF50] text-white text-sm font-black rounded-[24px] hover:bg-[#2E7D32] transition-all flex items-center justify-center space-x-2 shadow-sm">
                      <span>Kelola Soal</span>
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                  <Link href={`/dashboard/guru/mapel/input-materi?classSubjectId=${item.id}`}>
                    {/* Tombol sekunder menggunakan background --green-light dengan hover ke --yellow-light */}
                    <button className="w-full py-4 bg-[#E8F5E9] text-[#2E7D32] text-sm font-black rounded-[24px] hover:bg-[#FFFDE7] transition-all">
                      Input Materi
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}