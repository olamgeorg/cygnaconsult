import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, useRows } from "../lib/data";
import { useApp } from "../lib/store";
export default function Wishlist() {
  const { wish } = useApp(); const products = useRows("products", PRODUCTS); const list = products.filter((p) => wish.includes(p.id));
  return (<div className="wrap"><h1 className="h1">Your Wishlist</h1>{!list.length ? <p>No saved items yet. <Link className="text-gold-dark underline" to="/shop">Browse the shop</Link>.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}</div>);
}
