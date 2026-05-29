"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, Bell, Clock, Search, Send } from "lucide-react";

type Msg = {
  id: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  sender: { id: string; name: string; role: string };
};

export default function PesanGuru() {
  const [messages, setMessages]   = useState<Msg[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [reply, setReply]         = useState<{ toId: string; toName: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending]     = useState(false);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {}
    finally { setLoading(false); }
  }

  async function handleReply() {
    if (!reply || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: reply.toId, content: replyText }),
      });
      if (res.ok) {
        setReplyText("");
        setReply(null);
        loadMessages();
      }
    } catch {}
    finally { setSending(false); }
  }

  const visible = messages.filter(m =>
    m.sender.name.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kotak Pesan 💬</h1>
          <p className="text-slate-500 font-medium">Komunikasi langsung dengan tenaga pendidik.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pesan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 font-medium text-center py-12">Memuat pesan...</p>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 p-8 rounded-[40px] text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={24} />
          </div>
          <h4 className="font-black text-slate-800">Belum ada pesan</h4>
          <p className="text-sm text-slate-400 mt-1">Guru akan menghubungi Anda di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((p) => (
            <div
              key={p.id}
              className={`p-8 rounded-[32px] border transition-all ${
                !p.isRead
                  ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/20"
                  : "bg-slate-50/50 border-transparent"
              }`}
            >
              <div className="flex items-start space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  !p.isRead ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  <MessageSquare size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-lg font-black ${!p.isRead ? "text-slate-800" : "text-slate-500"}`}>
                        {p.sender.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">
                        <Clock size={12} />
                        <span>{new Date(p.sentAt).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                    {!p.isRead && <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />}
                  </div>
                  <p className={`mt-4 leading-relaxed font-medium ${!p.isRead ? "text-slate-600" : "text-slate-400"}`}>
                    {p.content}
                  </p>
                  <button
                    onClick={() => setReply({ toId: p.sender.id, toName: p.sender.name })}
                    className="mt-4 text-xs font-black text-indigo-500 hover:text-indigo-700"
                  >
                    Balas Pesan →
                  </button>
                </div>
              </div>

              {reply?.toId === p.sender.id && (
                <div className="mt-6 ml-20 space-y-3">
                  <textarea
                    className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200"
                    placeholder={`Balas ke ${reply.toName}...`}
                    rows={3}
                    maxLength={1000}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{replyText.length}/1000</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => { setReply(null); setReplyText(""); }}
                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={sending || !replyText.trim()}
                        className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-60"
                      >
                        <Send size={14} />
                        <span>{sending ? "Mengirim..." : "Kirim"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}