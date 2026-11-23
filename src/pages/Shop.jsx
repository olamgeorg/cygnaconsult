import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, useRows } from "../lib/data";
export default function Shop() {
  const products = useRows("products", PRODUCTS); const [cat, setCat] = useState(""); const [rating, setRating] = useState(0); const [max, setMax] = useState(""); const [sort, setSort] = useState("");
  let list = products.filter((p) => (!cat || p.category === cat) && p.rating >= rating && (!max || p.price_ngn <= +max));
  if (sort === "lo") list = [...list].sort((a, b) => a.price_ngn - b.price_ngn); if (sort === "hi") list = [...list].sort((a, b) => b.price_ngn - a.price_ngn); if (sort === "rt") list = [...list].sort((a, b) => b.rating - a.rating);
  return (<div className="wrap"><h1 className="h1">Shop</h1><div className="mb-4 grid gap-2 sm:grid-cols-4">
    <select className="inp" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{[...new Set(products.map((p) => p.category))].map((c) => <option key={c}>{c}</option>)}</select>
    <select className="inp" value={rating} onChange={(e) => setRating(+e.target.value)}><option value="0">Any rating</option><option value="4">4★ & up</option><option value="4.5">4.5★ & up</option></select>
    <input className="inp" type="number" placeholder="Max price (NGN)" value={max} onChange={(e) => setMax(e.target.value)} />
    <select className="inp" value={sort} onChange={(e) => setSort(e.target.value)}><option value="">Sort: Featured</option><option value="lo">Price: Low to High</option><option value="hi">Price: High to Low</option><option value="rt">Top Rated</option></select></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>{!list.length && <p>No products match your filters.</p>}</div>);
}
