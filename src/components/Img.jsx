import { useState } from "react";
export default function Img({ src, icon, className = "" }) {
  return src ? <img src={src} alt="" loading="lazy" className={`object-cover ${className}`} /> : <div className={`grid place-items-center bg-slate-100 text-5xl ${className}`}>{icon}</div>;
}
export function Gallery({ images = [], icon }) {
  const [i, setI] = useState(0);
  return (<div><Img src={images[i]} icon={icon} className="h-64 w-full rounded-2xl !text-8xl" />
    {images.length > 1 && <div className="mt-2 grid grid-cols-4 gap-2">{images.map((s, k) => <button key={s + k} onClick={() => setI(k)} className={`overflow-hidden rounded-lg ring-2 ${k === i ? "ring-gold" : "ring-transparent"}`}><img src={s} alt="" className="h-16 w-full object-cover" /></button>)}</div>}</div>);
}
