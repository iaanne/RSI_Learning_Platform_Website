import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TrendingUp, Users, BookCheck, AlertCircle } from "lucide-react";

interface ClassStat {
  name: string;
  pct: number;
  color: string;
}

const BAR_COLORS = ["bg-indigo-600", "bg-blue-500", "bg-amber-500", "bg-red-500"];

export default async function KepsekDashboard() {
  const session = await getSession();
  if (!session || session.role !== "PRINCIPAL") redirect("/auth/login");

  const [totalSiswa, totalGuru, progressData, notifications, tertinggalCount] = await Promise.all([
    db.student.count(),
    db.teacher.count(),
    db.studentProgress.findMany({
      select: { completionPercent: true, classSubject: { select: { class: { select: { name: true } } } } },
    }),
    db.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.student.count({ where: { progress: { some: { completionPercent: { lt: 70 } } } } }),
  ]);

  const avgKkm = progressData.length > 0
    ? Math.round(progressData.reduce((sum, p) => sum + (p.completionPercent ?? 0), 0) / progressData.length)
    : 0;

  const classStats: ClassStat[] = [];
  const classMap = new Map<string, number[]>();
  for (const p of progressData) {
    const name = p.classSubject.class.name;
    if (!classMap.has(name)) classMap.set(name, []);
    classMap.get(name)!.push(p.completionPercent ?? 0);
  }
  for (const [name, vals] of classMap) {
    classStats.push({ name, pct: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), color: BAR_COLORS[classStats.length % BAR_COLORS.length] });
  }
  classStats.sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Laporan Eksekutif Sekolah</h1>
        <p className="text-slate-500 font-medium">Ringkasan performa akademik tahun ajaran 2026/2027.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Siswa", value: totalSiswa.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Rata-rata KKM", value: `${avgKkm}%`, icon: BookCheck, color: "text-green-600", bg: "bg-green-100" },
          { label: "Guru Aktif", value: totalGuru.toString(), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
          { label: "Siswa Tertinggal", value: tertinggalCount.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <s.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8">Peringkat Ketuntasan Per Kelas</h3>
        <div className="space-y-6">
          {classStats.map((item, i) => (
            <div key={i} className="flex items-center space-x-6">
              <span className="w-24 text-sm font-bold text-slate-600">{item.name}</span>
              <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
              </div>
              <span className="w-12 text-sm font-black text-slate-800">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100">
          <h3 className="font-bold text-xl mb-6">Manajemen Pengguna</h3>
          <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
            Sebagai Super Admin, Anda memiliki kontrol penuh atas akun Guru dan Siswa. Gunakan fitur ini untuk mereset kata sandi atau menambah tenaga pengajar baru.
          </p>
          <a href="/dashboard/kepsek/guru" className="inline-block bg-white text-indigo-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors">
            Kelola Akun Guru
          </a>
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Log Sistem Terakhir</h3>
          <div className="space-y-4">
            {notifications.length > 0 ? notifications.map((log, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span>{log.body}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-400">Belum ada aktivitas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
