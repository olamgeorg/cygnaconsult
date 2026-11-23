import { Link } from "react-router-dom";
import Img from "./Img";
import { useApp } from "../lib/store";
export default function CarCard({ c, onCompare, comparing }) {
  const { money } = useApp();
  return (<article className="card flex flex-col"><Img src={c.image} icon={c.icon || "🚗"} className="h-36 w-full rounded-xl" />
    <span className="mt-2 w-fit rounded bg-navy px-2 py-0.5 text-xs text-white">{c.condition}</span><h3 className="mt-1 font-semibold">{c.title}</h3>
    <p className="text-sm text-slate-600">{c.make} {c.model} · {c.year} · {Number(c.mileage).toLocaleString()} km · {c.fuel} · {c.transmission}</p><p className="text-sm text-slate-500">📍 {c.location}</p>
    <p className="my-1 text-lg font-extrabold text-navy">{money(c.price_ngn)}</p>
    <div className="mt-auto flex gap-2"><Link to={`/cars/${c.id}`} className="btn flex-1">View Details</Link>{onCompare && <button className="btn-alt" onClick={() => onCompare(c)}>{comparing ? "Remove" : "Compare"}</button>}</div></article>);
}
