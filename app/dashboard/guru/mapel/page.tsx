"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Book, ChevronRight, GraduationCap, Loader2, BookOpen } from "lucide-react";

interface SubjectItem {
  id: string;
  subjectName: string;
  subjectCode: string;
  className: string;
  totalMaterials: number;
  totalStudents: number;
}

const SUBJECT_COLORS: Record<string, { bg: string; light: string; text: string }> = {
  Matematika: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  IPA: { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
  IPS: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
  "Bahasa Indonesia": { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600" },
  "Bahasa Inggris": { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
  PKn: { bg: "bg-rose-500", light: "bg-rose-50", text: "text-rose-600" },
  "Pendidikan Agama": { bg: "bg-teal-500", light: "bg-teal-50", text: "text-teal-600" },
  PJOK: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
  "Seni Budaya": { bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-600" },
};

function getColor(name: string) {
  return SUBJECT_COLORS[name] || { bg: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600" };
}

export default function KelolaMapel() {
  const [items, setItems] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guru/subjects")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kurikulum Kelas</h1>
          <p className="text-slate-500 font-medium">Kelola materi dan kuis adaptif untuk setiap mata pelajaran.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-4 rounded-[20px] flex items-center space-x-3 font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus size={20} strokeWidth={3} />
          <span>Mapel Baru</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-bold bg-white rounded-[40px] border border-slate-100 shadow-sm">Belum ada mata pelajaran yang diampu.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(
            items.reduce<Record<string, SubjectItem[]>>((acc, item) => {
              (acc[item.className] = acc[item.className] || []).push(item);
              return acc;
            }, {})
          ).map(([className, classItems]) => (
            <div key={className} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap size={20} className="text-indigo-500" />
                <h2 className="font-black text-xl text-slate-800">{className}</h2>
                <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{classItems.length} mapel</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classItems.map((item) => {
                  const color = getColor(item.subjectName);
                  return (
                    <div key={item.id} className="group relative bg-slate-50 rounded-3xl p-6 hover:shadow-md transition-all">
                      <div className={`w-12 h-12 ${color.light} ${color.text} rounded-2xl flex items-center justify-center mb-4`}>
                        <BookOpen size={24} />
                      </div>
                      <h3 className="font-black text-lg text-slate-800">{item.subjectName}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">{item.totalMaterials} materi &middot; {item.totalStudents} siswa</p>
                      <div className="flex space-x-2 mt-5">
                        <Link href={`/dashboard/guru/mapel/kelola-soal?csId=${item.id}`} className="flex-1">
                          <button className="w-full py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-indigo-600 transition-all">
                            Kelola Soal
                          </button>
                        </Link>
                        <Link href={`/dashboard/guru/mapel/input-materi?csId=${item.id}`} className="flex-1">
                          <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-xs font-black rounded-2xl hover:bg-slate-50 transition-all">
                            Input Materi
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
