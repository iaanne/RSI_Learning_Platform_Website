"use client";
import { Book, PlayCircle, PenTool, Lock } from "lucide-react";

export default function DetailMapel() {
  const babList = [
    { id: 1, title: "Bagian Tubuh Tumbuhan", status: "selesai", type: "Materi" },
    { id: 2, title: "Fotosintesis", status: "sedang-belajar", type: "Video" },
    { id: 3, title: "Quiz Mingguan", status: "terkunci", type: "Quiz" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-green-600 p-8 rounded-[32px] text-white">
        <h1 className="text-3xl font-black">IPA (Sains) 🔬</h1>
        <p className="opacity-80">Selesaikan misi untuk mendapatkan lencana Ilmuwan Muda!</p>
      </div>

      <div className="relative space-y-6">
        {/* Garis penghubung antar bab (Visual Road) */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200 -z-10"></div>

        {babList.map((bab) => (
          <div key={bab.id} className="flex items-center space-x-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              bab.status === 'selesai' ? 'bg-green-500 text-white' : 
              bab.status === 'sedang-belajar' ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 'bg-slate-300 text-slate-500'
            }`}>
              {bab.status === 'terkunci' ? <Lock size={24}/> : <Book size={24}/>}
            </div>
            
            <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">{bab.title}</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{bab.type}</span>
              </div>
              <button disabled={bab.status === 'terkunci'} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-30">
                Mulai
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}