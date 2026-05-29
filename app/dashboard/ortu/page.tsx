"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, TrendingUp, MessageCircle, Bell, Star, AlertCircle, Clock } from "lucide-react";

type StudentProgress = {
  subjectName: string;
  subjectCode: string;
  totalScore: number;
  completionPercent: number;
  adaptiveLevel: string;
  lastActivity: string | null;
};

type ChildInfo = {
  name: string;
  nis: string;
  birthdate: string | null;
  totalPoints: number;
  currentStreak: number;
  livesRemaining: number;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  notifType: string;
  isRead: boolean;
  createdAt: string;
};

export default function OrtuDashboard() {
  const [child, setChild] = useState<ChildInfo | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [progressRes, notifRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/notifications"),
        ]);

        if (progressRes.ok) {
          const data = await progressRes.json();
          setChild(data.child ?? null);
          setProgress(data.progress ?? []);
        } else {
          setError("Gagal memuat data anak.");
        }

        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications((data.notifications ?? []).slice(0, 5));
        }
      } catch {
        setError("Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avgScore =
    progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + (p.totalScore ?? 0), 0) / progress.length)
      : 0;

  const belowKKM = progress.filter((p) => (p.totalScore ?? 0) < 75);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 text-center px-4">
        <AlertCircle size={40} className="text-rose-400" />
        <p className="text-slate-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[32px] p-8 shadow-xl">
        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">
          Pantauan Belajar Anak
        </p>
        <h1 className="text-3xl font-black mb-4">
          {child?.name ?? "Anak Anda"} 👨‍🎓
        </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black">{avgScore}</p>
            <p className="text-xs text-indigo-200 font-bold mt-1">Rata-rata Nilai</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black">{child?.currentStreak ?? 0}</p>
            <p className="text-xs text-indigo-200 font-bold mt-1">Streak Belajar</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black">{child?.totalPoints ?? 0}</p>
            <p className="text-xs text-indigo-200 font-bold mt-1">Total Poin</p>
          </div>
        </div>
      </div>

      {/* KKM Alert */}
      {belowKKM.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-[24px] p-5 flex items-start space-x-4">
          <AlertCircle size={24} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-amber-800">⚠️ Perlu Perhatian Khusus</p>
            <p className="text-amber-700 text-sm mt-1">
              {child?.name ?? "Anak Anda"} masih di bawah KKM (75) pada:{" "}
              <span className="font-bold">{belowKKM.map((p) => p.subjectName).join(", ")}</span>.
              Sistem menyarankan pendampingan belajar.
            </p>
          </div>
        </div>
      )}

      {/* Quick Nav */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: "/dashboard/ortu/grafik", icon: TrendingUp, label: "Grafik Kemajuan", color: "bg-indigo-50 text-indigo-600" },
          { href: "/dashboard/ortu/pesan", icon: MessageCircle, label: "Pesan Guru", color: "bg-emerald-50 text-emerald-600" },
          { href: "/dashboard/ortu", icon: Bell, label: "Notifikasi", color: "bg-amber-50 text-amber-600" },
        ].map((nav) => (
          <Link key={nav.href} href={nav.href}>
            <div className={`${nav.color} rounded-[20px] p-5 text-center hover:scale-105 transition-transform cursor-pointer`}>
              <nav.icon size={28} className="mx-auto mb-2" />
              <p className="text-xs font-black">{nav.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress per subject */}
      <div>
        <h2 className="text-lg font-black text-slate-800 mb-4">Kemampuan Per Bidang</h2>
        {progress.length === 0 ? (
          <div className="bg-slate-50 rounded-[24px] p-8 text-center">
            <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-400 font-semibold">Belum ada data kuis.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.map((p, i) => {
              const score = p.totalScore ?? 0;
              const barColor =
                score >= 85 ? "bg-green-500" : score >= 75 ? "bg-indigo-500" : "bg-amber-400";
              return (
                <div key={i} className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-black text-slate-800">{p.subjectName}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        Level: {p.adaptiveLevel === "HARD" ? "Sulit" : p.adaptiveLevel === "EASY" ? "Mudah" : "Sedang"}
                        {p.lastActivity && (
                          <span className="ml-2 flex items-center inline-flex">
                            <Clock size={10} className="mr-1" />
                            {new Date(p.lastActivity).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      className={`text-xl font-black ${
                        score >= 85 ? "text-green-600" : score >= 75 ? "text-indigo-600" : "text-amber-500"
                      }`}
                    >
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`${barColor} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-400">0</span>
                    <span className="text-xs text-slate-400 font-bold">KKM: 75</span>
                    <span className="text-xs text-slate-400">100</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent notifications */}
      {notifications.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Notifikasi Terbaru</h2>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-[20px] border p-4 ${
                  n.isRead ? "bg-white border-slate-100" : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {!n.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1" />}
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{n.body}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0 ml-2">
                    {new Date(n.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIS info */}
      {child && (
        <div className="bg-slate-50 rounded-[20px] p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Star size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-black text-slate-800">{child.name}</p>
            <p className="text-sm text-slate-500">NIS: {child.nis}</p>
          </div>
        </div>
      )}
    </div>
  );
}