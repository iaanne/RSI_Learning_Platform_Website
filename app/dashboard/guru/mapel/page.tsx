"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Book, ChevronRight, GraduationCap } from "lucide-react";

type ClassSubject = {
  id: string;
  subject: { name: string };
  class: { name: string };
};

const COLORS = [
  { light: "bg-blue-50",    text: "text-blue-600"   },
  { light: "bg-orange-50",  text: "text-orange-600" },
  { light: "bg-emerald-50", text: "text-emerald-600"},
  { light: "bg-indigo-50",  text: "text-indigo-600" },
  { light: "bg-rose-50",    text: "text-rose-600"   },
  { light: "bg-amber-50",   text: "text-amber-600"  },
];

export default function KelolaMapel() {
  const [mapels, setMapels]   = useState<ClassSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teachers")
      .then(r => r.json())
      .then((data: any) => {
        // data is array of teachers; get first teacher's classSubjects
        if (Array.isArray(data) && data.length > 0) {
          setMapels(data[0].classSubjects ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // fallback dummy if API returns empty
  const DUMMY_MAPELS = ["Matematika","IPA","IPS","Bahasa Indonesia","PPKn","Seni Budaya"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kurikulum Kelas 📚</h1>
          <p className="text-slate-500 font-medium">Kelola materi dan kuis adaptif untuk setiap mata pelajaran.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-4 rounded-[20px] flex items-center space-x-3 font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={20} strokeWidth={3} />
          <span>Mapel Baru</span>
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400 font-medium">Memuat mata pelajaran...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(mapels.length > 0 ? mapels : DUMMY_MAPELS.map((n, i) => ({
            id: String(i), subject: { name: n }, class: { name: "4-B" }
          }))).map((item, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-16 h-16 ${c.light} ${c.text} rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Book size={32} />
                </div>
                <h3 className="font-black text-2xl text-slate-800 mb-1">{item.subject.name}</h3>
                <div className="flex items-center space-x-2 text-slate-400 text-sm font-bold mb-8">
                  <GraduationCap size={16} />
                  <span>{item.class.name}</span>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href={`/dashboard/guru/mapel/kelola-soal?classSubjectId=${item.id}`}>
                    <button className="w-full py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2">
                      <span>Kelola Soal</span>
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                  <Link href={`/dashboard/guru/mapel/input-materi?classSubjectId=${item.id}`}>
                    <button className="w-full py-4 bg-slate-50 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-100 transition-all">
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