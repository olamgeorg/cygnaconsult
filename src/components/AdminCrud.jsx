import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useApp } from "../lib/store";
const CFG = {
  products: ["title", "category", "price_ngn:n", "rating:n", "reviews:n", "badge"],
  cars: ["title", "make", "model", "year:n", "mileage:n", "fuel", "transmission", "body_type", "condition", "price_ngn:n", "location", "seller_name", "inspection"],
  properties: ["title", "type", "listing", "price_ngn:n", "beds:n", "baths:n", "sqm:n", "location", "lat:n", "lng:n", "agent_name", "agent_agency", "agent_phone", "amenities"],
  services: ["title", "category", "basic_price:n", "standard_price:n", "premium_price:n", "delivery", "rating:n", "basic_features", "standard_features", "premium_features"],
  experts: ["name", "role", "rating:n", "jobs:n", "work"],
  ai_services: ["title", "description", "use_cases", "accuracy", "delivery", "starter_price:n", "business_price:n", "enterprise_price:n"],
};
export default function AdminCrud() {
  const { notify } = useApp(); const [t, setT] = useState("products"); const [rows, setRows] = useState([]); const [f, setF] = useState({}); const [busy, setBusy] = useState(false);
  const fields = CFG[t]; const hasImg = ["products", "cars", "properties", "experts"].includes(t); const hasGallery = t === "cars" || t === "properties";
  const load = async () => { const { data } = await supabase.from(t).select("*").order("id", { ascending: false }); setRows(data || []); };
  useEffect(() => { setF({}); load(); }, [t]);
  const upload = async (file, key) => { if (!file) return; setBusy(true); const path = `${t}/${Date.now()}-${file.name.replace(/[^\w.]/g, "_")}`; const { error } = await supabase.storage.from("media").upload(path, file); setBusy(false); if (error) return notify(error.message); const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl; setF((x) => key === "image" ? { ...x, image: url } : { ...x, gallery: [x.gallery, url].filter(Boolean).join(", ") }); notify("Photo uploaded"); };
  const save = async (e) => { e.preventDefault(); const row = {}; fields.forEach((k) => { const [n, ty] = k.split(":"); if (f[n] !== undefined && f[n] !== "" && f[n] !== null) row[n] = ty === "n" ? Number(f[n]) : f[n]; });
    if (hasImg && f.image) row.image = f.image; if (hasGallery && f.gallery !== undefined) row.gallery = String(f.gallery).split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = f.id ? await supabase.from(t).update(row).eq("id", f.id) : await supabase.from(t).insert(row); if (error) return notify(error.message); notify("Saved"); setF({}); load(); };
  const del = async (id) => { if (!window.confirm("Delete this record?")) return; const { error } = await supabase.from(t).delete().eq("id", id); if (error) notify(error.message); else load(); };
  return (<div className="grid gap-4"><div className="flex flex-wrap gap-2">{Object.keys(CFG).map((k) => <button key={k} className={t === k ? "btn" : "btn-alt"} onClick={() => setT(k)}>{k}</button>)}</div>
    <form className="card grid gap-2 sm:grid-cols-3" onSubmit={save}><h3 className="font-bold sm:col-span-3">{f.id ? "Edit" : "Add"} {t.slice(0, -1)}</h3>
      {fields.map((k) => { const [n, ty] = k.split(":"); return <input key={n} className="inp" type={ty ? "number" : "text"} step="any" required={k === fields[0]} placeholder={n} value={f[n] ?? ""} onChange={(e) => setF({ ...f, [n]: e.target.value })} />; })}
      {hasImg && <label className="text-sm sm:col-span-3">Main photo <input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0], "image")} />{f.image && <img src={f.image} alt="" className="mt-1 h-16 rounded" />}</label>}
      {hasGallery && <label className="text-sm sm:col-span-3">Add gallery photo <input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0], "gallery")} /><input className="inp mt-1" placeholder="Gallery URLs (comma separated)" value={f.gallery || ""} onChange={(e) => setF({ ...f, gallery: e.target.value })} /></label>}
      <div className="flex gap-2 sm:col-span-3"><button className="btn" disabled={busy}>{busy ? "Uploading…" : "Save"}</button>{f.id && <button type="button" className="btn-alt" onClick={() => setF({})}>Cancel</button>}</div></form>
    <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><tbody>{rows.map((r) => <tr key={r.id} className="border-b"><td className="p-2">{r.image && <img src={r.image} alt="" className="h-10 w-14 rounded object-cover" />}</td><td className="p-2 font-semibold">{r.title ?? r.name}</td><td className="p-2">{r.price_ngn ?? r.basic_price ?? r.starter_price ?? r.rating}</td><td className="p-2"><button className="btn-alt !py-1" onClick={() => setF({ ...r, gallery: (r.gallery || []).join(", ") })}>Edit</button> <button className="btn-alt !py-1" onClick={() => del(r.id)}>Delete</button></td></tr>)}</tbody></table>{!rows.length && <p className="text-sm text-slate-500">No records in the database yet. Add your first one above.</p>}</div></div>);
}

const KEYS = [["company_email", "Company email"], ["company_phone", "Phone / WhatsApp"], ["company_address", "Office address"], ["bank_details", "Bank transfer details (shown to customers after checkout)"], ["paystack_public_key", "Paystack PUBLIC key (starts with pk_)"], ["x_url", "X (Twitter) URL"], ["linkedin_url", "LinkedIn URL"], ["instagram_url", "Instagram URL"]];
export function SettingsEditor() {
  const { settings, notify } = useApp(); const [f, setF] = useState(settings);
  const save = async (e) => { e.preventDefault(); const { error } = await supabase.from("settings").upsert(KEYS.map(([key]) => ({ key, value: f[key] || "" }))); notify(error ? error.message : "Settings saved. Refresh the site to see them everywhere."); };
  return (<form className="card grid max-w-2xl gap-2" onSubmit={save}><h3 className="font-bold">Site settings</h3>{KEYS.map(([k, l]) => <label key={k} className="text-sm">{l}{k === "bank_details" ? <textarea className="inp" rows="3" value={f[k] || ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} /> : <input className="inp" value={f[k] || ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</label>)}<button className="btn w-fit">Save settings</button></form>);
}
