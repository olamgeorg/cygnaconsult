import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import { CARS, useRows } from "../lib/data";
import { Gallery } from "../components/Img";
import { useApp } from "../lib/store";
export default function Cars() {
  const cars = useRows("cars", CARS); const [f, setF] = useState({}); const [cmp, setCmp] = useState([]); const { money } = useApp();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const list = cars.filter((c) => (!f.make || c.make === f.make) && (!f.fuel || c.fuel === f.fuel) && (!f.body || c.body_type === f.body) && (!f.cond || c.condition === f.cond) && (!f.year || c.year >= +f.year) && (!f.max || c.price_ngn <= +f.max));
  const opt = (k) => [...new Set(cars.map((c) => c[k]))].map((v) => <option key={v}>{v}</option>);
  const toggle = (c) => setCmp((x) => x.find((y) => y.id === c.id) ? x.filter((y) => y.id !== c.id) : [...x, c].slice(-3));
  return (<div className="wrap"><h1 className="h1">Cars</h1><div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
    <select className="inp" onChange={set("make")}><option value="">Make</option>{opt("make")}</select><select className="inp" onChange={set("fuel")}><option value="">Fuel</option>{opt("fuel")}</select>
    <select className="inp" onChange={set("body")}><option value="">Body type</option>{opt("body_type")}</select><select className="inp" onChange={set("cond")}><option value="">Condition</option>{["New", "Foreign Used", "Nigerian Used"].map((v) => <option key={v}>{v}</option>)}</select>
    <input className="inp" type="number" placeholder="Min year" onChange={set("year")} /><input className="inp" type="number" placeholder="Max price (NGN)" onChange={set("max")} /></div>
    {cmp.length > 1 && <div className="card mb-4 overflow-x-auto"><table className="w-full text-sm"><tbody>{[["Car", "title"], ["Year", "year"], ["Mileage", "mileage"], ["Fuel", "fuel"], ["Transmission", "transmission"], ["Condition", "condition"], ["Price", "price_ngn"]].map(([l, k]) => <tr key={k} className="border-b"><th className="p-2 text-left">{l}</th>{cmp.map((c) => <td key={c.id} className="p-2">{k === "price_ngn" ? money(c[k]) : c[k]}</td>)}</tr>)}</tbody></table></div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CarCard key={c.id} c={c} onCompare={toggle} comparing={!!cmp.find((x) => x.id === c.id)} />)}</div>{!list.length && <p>No cars match your filters.</p>}</div>);
}
export function CarDetail() {
  const { id } = useParams(); const cars = useRows("cars", CARS); const c = cars.find((x) => String(x.id) === id); const { money, book } = useApp(); const [offer, setOffer] = useState("");
  if (!c) return <div className="wrap"><p>Car not found.</p><Link className="btn" to="/cars">Back to cars</Link></div>;
  return (<div className="wrap"><Link to="/cars" className="text-sm text-gold-dark">← All cars</Link><div className="mt-3 grid gap-6 lg:grid-cols-2">
    <Gallery images={[c.image, ...(c.gallery || [])].filter(Boolean)} icon={c.icon} />
    <div><h1 className="h1">{c.title}</h1><p className="text-2xl font-extrabold text-navy">{money(c.price_ngn)}</p><span className="rounded bg-navy px-2 py-0.5 text-xs text-white">{c.condition}</span>
      <dl className="card mt-3 grid grid-cols-2 gap-2 text-sm">{[["Make", c.make], ["Model", c.model], ["Year", c.year], ["Mileage", Number(c.mileage).toLocaleString() + " km"], ["Fuel", c.fuel], ["Transmission", c.transmission], ["Body", c.body_type], ["Location", c.location]].map(([k, v]) => <div key={k}><dt className="text-slate-500">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
      <div className="card mt-3 text-sm"><b>Inspection report</b><ul className="mt-1">{(c.inspection ? c.inspection.split(",").map((s) => s.trim()) : ["Engine & transmission: Pass", "Brakes & suspension: Pass", "Body & paint: Minor cosmetic wear", "Accident history: None reported", "Documents: Customs & registration verified"]).map((x) => <li key={x}>✓ {x}</li>)}</ul></div>
      <div className="card mt-3 text-sm"><b>Seller</b><p>{c.seller_name || "Cygna Verified Dealer"} · ★ 4.8 · Responds within 1 hour · {c.location}</p></div>
      <div className="mt-3 flex flex-wrap gap-2"><button className="btn" onClick={() => book("car:Book Inspection", c.id)}>Book Inspection</button><input className="inp !w-40" type="number" placeholder="Your offer (NGN)" value={offer} onChange={(e) => setOffer(e.target.value)} /><button className="btn-alt" onClick={() => offer && book("car:Make Offer", c.id, "Offer NGN " + offer)}>Make Offer</button></div></div></div></div>);
}
