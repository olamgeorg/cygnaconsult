import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, useRows } from "../lib/data";
const SECTIONS = [["🛍️", "Shop", "/shop", "Merchandise at great prices"], ["🚗", "Cars", "/cars", "New, foreign & Nigerian used"], ["🏡", "Real Estate", "/real-estate", "Homes, land & commercial"], ["💼", "Services", "/services", "Hire web, cloud & design experts"], ["🧠", "AI Training", "/ai-training", "Custom models & ML solutions"]];
export default function Home() {
  const products = useRows("products", PRODUCTS); const [q, setQ] = useState(""); const nav = useNavigate();
  const rows = (b) => products.filter((p) => p.badge === b).slice(0, 4);
  return (<>
    <section className="bg-gradient-to-br from-navy to-navy-700 px-4 py-16 text-center text-white"><h1 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">One platform. <span className="text-gold">Everything you need.</span></h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">Shop merchandise, find cars and property, hire experts and train custom AI models, all in one place.</p>
      <form className="mx-auto mt-6 flex max-w-xl gap-2" onSubmit={(e) => { e.preventDefault(); nav("/search?q=" + encodeURIComponent(q)); }}><input className="inp" placeholder="What are you looking for?" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn">Search</button></form></section>
    <div className="wrap"><div className="grid grid-cols-2 gap-3 md:grid-cols-5">{SECTIONS.map(([i, t, h, d]) => <Link key={h} to={h} className="card text-center transition hover:ring-gold"><div className="text-3xl">{i}</div><b>{t}</b><p className="text-xs text-slate-500">{d}</p></Link>)}</div>
      {[["Today's Deals", "Deal"], ["Best Sellers", "Best Seller"], ["New Arrivals", "New"]].map(([t, b]) => <section key={b} className="mt-10"><div className="mb-3 flex items-end justify-between"><h2 className="text-xl font-extrabold text-navy">{t}</h2><Link className="text-sm text-gold-dark" to="/shop">See all →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rows(b).map((p) => <ProductCard key={p.id} p={p} />)}</div></section>)}
      <section className="card mt-10 bg-navy text-white"><h2 className="text-xl font-extrabold text-gold">Train your own AI model</h2><p className="my-2 text-slate-300">From data preparation to deployment, our ML engineers build models tailored to your business.</p><Link className="btn" to="/ai-training">Explore AI Lab</Link></section></div></>);
}
