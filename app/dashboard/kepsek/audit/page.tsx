"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, UserPlus, Activity, RefreshCw } from "lucide-react";

type LogEntry = {
  id: string;
  title: string;
  body: string;
  notifType: string;
  createdAt: string;
};

export default function SecurityAudit() {
  const [logs, setLogs]       = useState<LogEntry[]>([]);
  const [counts, setCounts]   = useState({ teachers: 0, students: 0, parents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [notifRes, usersRes] = await Promise.all([
        fetch("/api/notifications"),
        fetch("/api/users"),
      ]);
      if (notifRes.ok) {
        const { notifications } = await notifRes.json();
        setLogs(notifications ?? []);
      }
      if (usersRes.ok) {
        const users: any[] = await usersRes.json();
        setCounts({
          teachers: users.filter(u => u.role === "TEACHER").length,
          students: users.filter(u => u.role === "STUDENT").length,
          parents:  users.filter(u => u.role === "PARENT").length,
        });
      }
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-3xl flex items-center justify-center shadow-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Security Center</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Integrity & Security</p>
          </div>
        </div>
        <button onClick={load} className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-6 flex items-center space-x-2 text-lg">
            <Activity className="text-indigo-600" size={20} />
            <span>Aktivitas Sistem</span>
          </h3>

          {loading ? (
            <p className="text-slate-400 font-medium">Memuat log...</p>
          ) : logs.length === 0 ? (
            <p className="text-slate-400 font-medium">Belum ada aktivitas tercatat.</p>
          ) : (
            <div className="space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center space-x-4">
                    <div className="text-xs font-black text-slate-300 font-mono w-16">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="h-10 w-1 bg-slate-100 group-hover:bg-indigo-500 transition-colors rounded-full" />
                    <div>
                      <p className="font-black text-slate-700 leading-none">{log.title}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{log.body}</p>
                    </div>
                  </div>
                  <UserPlus size={16} className="text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white">
          <h4 className="font-black text-emerald-400 uppercase tracking-widest text-[10px] mb-4">Statistik Keamanan</h4>
          <div className="space-y-4">
            {[
              { label: "Total Guru",   val: counts.teachers },
              { label: "Total Siswa",  val: counts.students },
              { label: "Total Ortu",   val: counts.parents  },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-sm font-bold opacity-60">{row.label}</span>
                <span className="font-black">{loading ? "..." : row.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">bcrypt cost 12 Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}