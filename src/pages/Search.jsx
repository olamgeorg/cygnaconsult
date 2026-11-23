import { useSearchParams, Link } from "react-router-dom";
import { PRODUCTS, CARS, PROPERTIES, SERVICES, useRows } from "../lib/data";
import { useApp } from "../lib/store";
const AI = [["Custom AI Model Training", "ai-training"], ["Computer Vision", "ai-training"], ["NLP", "ai-training"], ["Fine-tuning LLMs", "ai-training"], ["Predictive Analytics", "ai-training"], ["AI Chatbot Training", "ai-training"]];
export default function Search() {
  const [sp] = useSearchParams(); const q = (sp.get("q") || "").toLowerCase(); const { money } = useApp();
  const products = useRows("products", PRODUCTS), cars = useRows("cars", CARS), props = useRows("properties", PROPERTIES);
  const toks = q.split(/\s+/).filter(Boolean); const m = (s) => toks.every((t) => s.toLowerCase().includes(t));
  const groups = [["Shop", products.filter((x) => m(x.title + x.category)).map((x) => [x.id, x.title, money(x.price_ngn), "/shop"])],
    ["Cars", cars.filter((x) => m(x.title + x.make + x.model + x.location)).map((x) => [x.id, x.title, money(x.price_ngn), `/cars/${x.id}`])],
    ["Real Estate", props.filter((x) => m(x.title + x.type + x.location)).map((x) => [x.id, x.title, money(x.price_ngn), `/real-estate/${x.id}`])],
    ["Services", SERVICES.filter((x) => m(x.title + x.category)).map((x) => [x.id, x.title, "From " + money(x.basic_price), "/services"])],
    ["AI Training", AI.filter(([t]) => m(t + " ai machine learning model")).map(([t, h], i) => [i, t, "Request a quote", "/ai-training"])]];
  const any = groups.some(([, r]) => r.length);
  return (<div className="wrap"><h1 className="h1">Results for “{sp.get("q")}”</h1>{!any && <p>No results found. Try a different keyword such as “toyota”, “apartment” or “website”.</p>}
    {groups.map(([g, rows]) => rows.length > 0 && <section key={g} className="mb-6"><h2 className="mb-2 font-bold text-navy">{g}</h2><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{rows.map(([id, t, p, h]) => <Link key={g + id} to={h} className="card hover:ring-gold"><b>{t}</b><p className="text-sm text-slate-600">{p}</p></Link>)}</div></section>)}</div>);
}
