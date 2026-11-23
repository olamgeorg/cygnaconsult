import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isConfigured } from "../lib/supabase";
import AdminCrud, { SettingsEditor } from "../components/AdminCrud";
import { AdminChats } from "../components/ChatBox";
import { useApp } from "../lib/store";
const STAGES = ["Data Collection", "Cleaning", "Training", "Testing", "Deployment"];
const DEMO_MODELS = [{ id: 1, name: "Churn Predictor v2", type: "Prediction", accuracy: 93.4, stage: "Testing", api_key: "cyg_live_xxxxxxxxxxxxxxxx" }];
function Table({ rows, cols, onStatus }) {
  if (!rows.length) return <p className="text-sm text-slate-500">No records yet.</p>;
  return <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b">{cols.map((c) => <th key={c} className="p-2">{c}</th>)}{onStatus && <th className="p-2">Action</th>}</tr></thead><tbody>{rows.map((r) => <tr key={r.id} className="border-b">{cols.map((c) => <td key={c} className="max-w-[240px] truncate p-2">{typeof r[c] === "object" ? JSON.stringify(r[c]) : String(r[c] ?? "")}</td>)}{onStatus && <td className="p-2"><select className="inp !py-1" value={r.status} onChange={(e) => onStatus(r, e.target.value)}>{["new", "pending", "in_progress", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}</select></td>}</tr>)}</tbody></table></div>;
}
export default function Dashboard() {
  const { user, role, notify, money } = useApp(); const [tab, setTab] = useState("overview"); const [d, setD] = useState({}); const admin = role === "admin";
  const load = async () => { const out = {}; const t = admin ? ["orders", "bookings", "inquiries", "ai_training_requests", "ai_models", "users", "products", "cars", "properties", "services"] : ["orders", "bookings", "ai_training_requests", "ai_models"];
    for (const x of t) { const { data } = await supabase.from(x).select("*").order("id", { ascending: false }).limit(50); out[x] = data || []; } setD(out); };
  useEffect(() => { if (user && isConfigured) load(); }, [user, role]);
  if (!user) return <Navigate to="/signin" />;
  const models = d.ai_models?.length ? d.ai_models : DEMO_MODELS;
  const setStatus = async (table, r, status) => { const { error } = await supabase.from(table).update({ status }).eq("id", r.id); if (error) return notify(error.message); notify("Status updated"); load(); };
  const tabs = ["overview", "orders", "bookings", "ai models", ...(admin ? ["admin", "manage listings", "site settings", "support chats"] : [])];
  return (<div className="wrap"><h1 className="h1">Dashboard</h1><p className="mb-4 text-sm text-slate-500">{user.email} · {admin ? "Administrator" : "Customer"}</p>
    <div className="mb-4 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} className={tab === t ? "btn" : "btn-alt"} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>
    {tab === "overview" && <div className="grid gap-4 sm:grid-cols-4">{[["Orders", d.orders?.length || 0], ["Bookings", d.bookings?.length || 0], ["AI requests", d.ai_training_requests?.length || 0], ["AI models", models.length]].map(([l, v]) => <div key={l} className="card"><p className="text-sm text-slate-500">{l}</p><p className="text-3xl font-extrabold text-navy">{v}</p></div>)}</div>}
    {tab === "orders" && <div className="card"><Table rows={d.orders || []} cols={["id", "total_ngn", "currency", "status", "created_at"]} /></div>}
    {tab === "bookings" && <div className="card"><Table rows={d.bookings || []} cols={["id", "kind", "ref_id", "note", "status", "created_at"]} /></div>}
    {tab === "ai models" && <div className="grid gap-4 md:grid-cols-2">{models.map((m) => { const i = STAGES.indexOf(m.stage); return <div key={m.id} className="card"><b>{m.name}</b> <span className="text-sm text-slate-500">· {m.type} · {m.accuracy}% accuracy</span><div className="mt-3 flex gap-1">{STAGES.map((s, k) => <div key={s} className={`flex-1 rounded p-1 text-center text-[10px] ${k <= i ? "bg-gold" : "bg-slate-200"}`}>{s}</div>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><button className="btn-alt" disabled={m.stage !== "Deployment"} onClick={() => notify("Download link will be emailed to you.")}>Download Model</button><button className="btn-alt" onClick={() => navigator.clipboard?.writeText(m.api_key || "") .then(() => notify("API key copied"))}>Copy API Key</button></div></div>; })}</div>}
    {tab === "admin" && admin && <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-4">{["users", "products", "cars", "properties", "services", "orders", "bookings", "inquiries"].map((k) => <div key={k} className="card"><p className="text-sm capitalize text-slate-500">{k}</p><p className="text-2xl font-extrabold">{d[k]?.length || 0}</p></div>)}</div>
      <div className="card"><h3 className="mb-2 font-bold">Revenue (loaded orders)</h3><p className="text-2xl font-extrabold">{money((d.orders || []).reduce((a, o) => a + Number(o.total_ngn || 0), 0))}</p></div>
      <div className="card"><h3 className="mb-2 font-bold">Orders</h3><Table rows={d.orders || []} cols={["id", "user_id", "total_ngn", "status"]} onStatus={(r, s) => setStatus("orders", r, s)} /></div>
      <div className="card"><h3 className="mb-2 font-bold">Bookings & tour/inspection requests</h3><Table rows={d.bookings || []} cols={["id", "kind", "ref_id", "note", "status"]} onStatus={(r, s) => setStatus("bookings", r, s)} /></div>
      <div className="card"><h3 className="mb-2 font-bold">AI training requests</h3><Table rows={d.ai_training_requests || []} cols={["id", "company", "problem", "model_type", "priority", "status"]} onStatus={(r, s) => setStatus("ai_training_requests", r, s)} /></div>
      <div className="card"><h3 className="mb-2 font-bold">Inquiries</h3><Table rows={d.inquiries || []} cols={["id", "name", "email", "subject", "message"]} /></div>
      <div className="card"><h3 className="mb-2 font-bold">Users</h3><Table rows={d.users || []} cols={["id", "email", "full_name", "role"]} /></div></div>}
    {tab === "manage listings" && admin && <AdminCrud />}
    {tab === "site settings" && admin && <SettingsEditor />}
    {tab === "support chats" && admin && <AdminChats />}
    {!isConfigured && <p className="mt-4 rounded bg-amber-100 p-3 text-sm">Supabase is not configured yet. Add your URL and publishable key in src/lib/supabase.js to load live data.</p>}</div>);
}
