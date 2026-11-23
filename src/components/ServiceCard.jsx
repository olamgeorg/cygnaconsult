import { useApp } from "../lib/store";
export default function ServiceCard({ s, onRequest }) {
  const { money } = useApp();
  const pk = [["Basic", "basic"], ["Standard", "standard"], ["Premium", "premium"]].map(([n, k], i) => [n, s[k + "_price"] ?? s.pk?.[i]?.[1], s[k + "_features"] ? s[k + "_features"].split(",").map((x) => x.trim()).filter(Boolean) : s.pk?.[i]?.[2] || []]);
  return (<article className="card"><div className="flex items-center gap-3"><span className="text-4xl">{s.icon}</span><div><h3 className="font-bold">{s.title}</h3><p className="text-sm text-amber-600">★ {s.rating} · Delivery {s.delivery}</p></div></div>
    <div className="mt-3 grid gap-2 sm:grid-cols-3">{pk.map(([name, price, f]) => <div key={name} className="rounded-xl border border-slate-200 p-3 text-sm"><b className="text-navy">{name}</b><p className="text-lg font-extrabold">{money(price)}</p><ul className="text-slate-600">{f.map((x) => <li key={x}>✓ {x}</li>)}</ul>
      <button className="btn mt-2 w-full !py-1" onClick={() => onRequest(s, name)}>Select</button></div>)}</div></article>);
}
