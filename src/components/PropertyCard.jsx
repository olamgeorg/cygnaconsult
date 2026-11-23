import { Link } from "react-router-dom";
import Img from "./Img";
import { useApp } from "../lib/store";
export default function PropertyCard({ p }) {
  const { money } = useApp();
  return (<article className="card flex flex-col"><div className="relative h-36 overflow-hidden rounded-xl"><Img src={p.image} icon={p.icon || "🏡"} className="h-36 w-full" /><span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-bold">{p.listing}</span><span className="absolute bottom-2 right-2 rounded bg-white/80 px-2 text-xs">📍 map view</span></div>
    <h3 className="mt-2 font-semibold">{p.title}</h3><p className="text-sm text-slate-600">{p.type} · {p.beds ? `${p.beds} bd · ` : ""}{p.baths ? `${p.baths} ba · ` : ""}{p.sqm} sqm</p><p className="text-sm text-slate-500">📍 {p.location}</p>
    <p className="my-1 text-lg font-extrabold text-navy">{money(p.price_ngn)}{p.listing === "For Rent" && <span className="text-sm font-normal"> /yr</span>}</p><Link to={`/real-estate/${p.id}`} className="btn mt-auto">View Property</Link></article>);
}
