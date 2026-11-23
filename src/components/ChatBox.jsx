import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useApp } from "../lib/store";
export default function ChatBox() {
  const { user, notify } = useApp(); const [msgs, setMsgs] = useState([]); const [t, setT] = useState(""); const end = useRef();
  useEffect(() => {
    if (!user) return;
    supabase.from("chats").select("*").eq("user_id", user.id).order("id").then(({ data }) => setMsgs(data || []));
    const ch = supabase.channel("chat-" + user.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "chats", filter: `user_id=eq.${user.id}` }, (p) => setMsgs((m) => m.find((x) => x.id === p.new.id) ? m : [...m, p.new])).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs]);
  const send = async (e) => { e.preventDefault(); if (!t.trim()) return; const { error } = await supabase.from("chats").insert({ user_id: user.id, sender: "customer", message: t }); if (error) return notify(error.message); setT(""); };
  if (!user) return <p className="text-sm">Please <a className="text-gold-dark underline" href="/signin">sign in</a> to chat with an expert.</p>;
  return (<div><div className="mb-2 h-48 overflow-y-auto rounded-lg bg-slate-50 p-2 text-sm">{!msgs.length && <p className="text-slate-400">Say hello. An expert will reply here.</p>}{msgs.map((m) => <p key={m.id} className={`my-1 w-fit max-w-[85%] rounded-lg px-3 py-1 ${m.sender === "customer" ? "ml-auto bg-gold" : "bg-navy text-white"}`}>{m.message}</p>)}<div ref={end} /></div>
    <form className="flex gap-2" onSubmit={send}><input className="inp" placeholder="Type your message…" value={t} onChange={(e) => setT(e.target.value)} /><button className="btn">Send</button></form></div>);
}
export function AdminChats() {
  const { user, notify } = useApp(); const [rows, setRows] = useState([]); const [r, setR] = useState({});
  const load = async () => { const { data } = await supabase.from("chats").select("*").order("id"); setRows(data || []); }; useEffect(() => { load(); }, []);
  const by = rows.reduce((a, m) => ((a[m.user_id] = a[m.user_id] || []).push(m), a), {});
  const reply = async (uid) => { if (!r[uid]?.trim()) return; const { error } = await supabase.from("chats").insert({ user_id: uid, sender: "expert", message: r[uid] }); if (error) return notify(error.message); setR({ ...r, [uid]: "" }); load(); };
  return (<div className="grid gap-3"><button className="btn-alt w-fit" onClick={load}>Refresh</button>{!Object.keys(by).length && <p className="text-sm text-slate-500">No chats yet.</p>}
    {Object.entries(by).map(([uid, ms]) => <div key={uid} className="card text-sm"><b>Customer {uid.slice(0, 8)}</b>{ms.map((m) => <p key={m.id} className={m.sender === "expert" ? "text-navy" : "text-slate-700"}><i>{m.sender}:</i> {m.message}</p>)}<div className="mt-2 flex gap-2"><input className="inp" placeholder="Reply…" value={r[uid] || ""} onChange={(e) => setR({ ...r, [uid]: e.target.value })} /><button className="btn" onClick={() => reply(uid)}>Reply</button></div></div>)}</div>);
}
