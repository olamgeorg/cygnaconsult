import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Gallery } from "../components/Img";
import { Link, useParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { PROPERTIES, useRows } from "../lib/data";
import { useApp } from "../lib/store";
function MapView({ list }) {
  const ref = useRef();
  useEffect(() => { const m = L.map(ref.current).setView([6.5244, 3.3792], 9); L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(m); const pts = [];
    list.forEach((p) => { if (p.lat && p.lng) { const el = document.createElement("div"); el.innerHTML = `<b></b><br/><span></span><br/><a href="/real-estate/${Number(p.id)}">View property</a>`; el.querySelector("b").textContent = p.title; el.querySelector("span").textContent = p.location; L.circleMarker([p.lat, p.lng], { radius: 9, color: "#0b1630", fillColor: "#f5a623", fillOpacity: 1 }).addTo(m).bindPopup(el); pts.push([p.lat, p.lng]); } });
    if (pts.length) m.fitBounds(pts, { padding: [30, 30] }); return () => m.remove(); }, [list]);
  return <div ref={ref} className="z-0 h-[28rem] w-full rounded-2xl" />;
}
export default function RealEstate() {
  const [view, setView] = useState("grid");
  const props = useRows("properties", PROPERTIES); const [f, setF] = useState({}); const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const list = props.filter((p) => (!f.listing || p.listing === f.listing) && (!f.type || p.type === f.type) && (!f.beds || p.beds >= +f.beds) && (!f.loc || p.location.toLowerCase().includes(f.loc.toLowerCase())) && (!f.max || p.price_ngn <= +f.max));
  return (<div className="wrap"><h1 className="h1">Real Estate</h1><div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
    <select className="inp" onChange={set("listing")}><option value="">Sale or Rent</option><option>For Sale</option><option>For Rent</option></select>
    <select className="inp" onChange={set("type")}><option value="">Property type</option>{["House", "Apartment", "Land", "Commercial"].map((t) => <option key={t}>{t}</option>)}</select>
    <input className="inp" type="number" placeholder="Min beds" onChange={set("beds")} /><input className="inp" placeholder="Location" onChange={set("loc")} /><input className="inp" type="number" placeholder="Max price (NGN)" onChange={set("max")} /></div>
    <div className="mb-3 flex gap-2"><button className={view === "grid" ? "btn" : "btn-alt"} onClick={() => setView("grid")}>Cards</button><button className={view === "map" ? "btn" : "btn-alt"} onClick={() => setView("map")}>Map</button></div>{view === "map" ? <MapView list={list} /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PropertyCard key={p.id} p={p} />)}</div>}{!list.length && <p>No properties match your filters.</p>}</div>);
}
export function PropertyDetail() {
  const { id } = useParams(); const props = useRows("properties", PROPERTIES); const p = props.find((x) => String(x.id) === id); const { money, book } = useApp();
  const [down, setDown] = useState(30), [rate, setRate] = useState(18), [yrs, setYrs] = useState(20);
  if (!p) return <div className="wrap"><p>Property not found.</p><Link className="btn" to="/real-estate">Back</Link></div>;
  const P = p.price_ngn * (1 - down / 100), r = rate / 1200, n = yrs * 12, m = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
  return (<div className="wrap"><Link to="/real-estate" className="text-sm text-gold-dark">← All properties</Link><div className="mt-3 grid gap-6 lg:grid-cols-2">
    <Gallery images={[p.image, ...(p.gallery || [])].filter(Boolean)} icon={p.icon} />
    <div><h1 className="h1">{p.title}</h1><p className="text-2xl font-extrabold text-navy">{money(p.price_ngn)}</p><p className="text-slate-600">{p.listing} · {p.type} · {p.beds} bd · {p.baths} ba · {p.sqm} sqm · 📍 {p.location}</p>
      <div className="card mt-3 text-sm"><b>Amenities</b><p>{p.amenities || "24/7 security · Backup power · Water treatment · Parking · High-speed internet ready · Gym access"}</p></div>
      <div className="card mt-3 text-sm"><b>Agent</b><p>{p.agent_name || "Chiamaka Obi"} · {p.agent_agency || "Cygna Realty"} · Licensed agent{p.agent_phone ? " · " + p.agent_phone : ""}</p></div>
      <div className="mt-3 flex gap-2"><button className="btn" onClick={() => book("property:Tour Request", p.id)}>Request a Tour</button><button className="btn-alt" onClick={() => book("property:Agent Contact", p.id)}>Contact Agent</button></div>
      <div className="card mt-3 text-sm"><b>Mortgage calculator</b><div className="my-2 grid grid-cols-3 gap-2"><label>Down %<input className="inp" type="number" value={down} onChange={(e) => setDown(+e.target.value)} /></label><label>Rate %<input className="inp" type="number" value={rate} onChange={(e) => setRate(+e.target.value)} /></label><label>Years<input className="inp" type="number" value={yrs} onChange={(e) => setYrs(+e.target.value || 1)} /></label></div>Estimated monthly payment: <b className="text-lg">{money(m)}</b></div></div></div></div>);
}
