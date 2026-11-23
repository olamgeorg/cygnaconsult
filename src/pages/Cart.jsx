import { Link } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../lib/store";
export default function Cart() {
  const { cart, removeFromCart, money, total, placeOrder, payWithCard, notify, settings } = useApp();
  const [done, setDone] = useState(null), [addr, setAddr] = useState(""), [method, setMethod] = useState("Bank transfer"), [busy, setBusy] = useState(false);
  if (done) return (<div className="wrap max-w-xl text-center"><h1 className="h1">{done.paid ? "Payment received" : "Order placed"}</h1><p>Thank you for shopping with Cygnaconsult.</p>
    {!done.paid && done.method === "Bank transfer" && <p className="card mt-3 whitespace-pre-line text-left text-sm">{settings.bank_details || "Payment instructions will be emailed to you."}</p>}
    {!done.paid && done.method === "Card" && <p className="mt-3 text-sm">Your card payment was not completed. Your order is saved as pending; contact us to retry.</p>}<Link className="btn mt-4" to="/shop">Continue shopping</Link></div>);
  if (!cart.length) return <div className="wrap text-center"><h1 className="h1">Your cart is empty</h1><Link className="btn" to="/shop">Browse the shop</Link></div>;
  const place = async () => { if (!addr.trim()) return notify("Enter a delivery address."); setBusy(true); const r = await placeOrder(method, addr); if (r.error) { setBusy(false); return notify(r.error); } let paid = false; if (method === "Card") paid = await payWithCard(r.id, r.total); setBusy(false); setDone({ paid, method }); };
  return (<div className="wrap grid gap-6 lg:grid-cols-3"><div className="lg:col-span-2"><h1 className="h1">Cart</h1>{cart.map((i) => <div key={i.id} className="card mb-2 flex items-center justify-between"><span>{i.icon} {i.title} × {i.qty}</span><span className="flex items-center gap-3"><b>{money(i.price_ngn * i.qty)}</b><button className="btn-alt !py-1" onClick={() => removeFromCart(i.id)}>Remove</button></span></div>)}</div>
    <aside className="card h-fit"><h2 className="font-bold">Checkout</h2><input className="inp my-2" placeholder="Delivery address" value={addr} onChange={(e) => setAddr(e.target.value)} />
      <select className="inp mb-2" value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Payment method"><option>Bank transfer</option><option>Pay on delivery</option>{settings.paystack_public_key && <option value="Card">Card (Paystack, charged in NGN)</option>}</select>
      <p className="mb-2 text-lg font-extrabold">Total: {money(total)}</p><button className="btn w-full" disabled={busy} onClick={place}>{busy ? "Processing…" : method === "Card" ? "Pay now" : "Place Order"}</button></aside></div>);
}
