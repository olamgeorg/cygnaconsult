import Img from "./Img";
import { useApp } from "../lib/store";
import { useNavigate } from "react-router-dom";
export default function ProductCard({ p }) {
  const { money, addToCart, toggleWish, wish } = useApp(); const nav = useNavigate();
  return (<article className="card flex flex-col"><div className="relative h-36 overflow-hidden rounded-xl"><Img src={p.image} icon={p.icon || "🛍️"} className="h-36 w-full" />
    {p.badge && <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold">{p.badge}</span>}
    <button className="absolute right-2 top-2 text-xl" onClick={() => toggleWish(p.id)} aria-label="Wishlist">{wish.includes(p.id) ? "♥" : "♡"}</button></div>
    <h3 className="mt-3 line-clamp-2 font-semibold">{p.title}</h3><p className="text-sm text-amber-600">★ {p.rating} <span className="text-slate-500">({Number(p.reviews).toLocaleString()} reviews)</span></p>
    <p className="my-1 text-lg font-extrabold text-navy">{money(p.price_ngn)}</p>
    <div className="mt-auto flex gap-2"><button className="btn flex-1" onClick={() => addToCart(p)}>Add to Cart</button><button className="btn-alt flex-1" onClick={() => { addToCart(p); nav("/cart"); }}>Buy Now</button></div></article>);
}
