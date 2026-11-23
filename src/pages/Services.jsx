import { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { SERVICES, EXPERTS, useRows } from "../lib/data";
import ChatBox from "../components/ChatBox";
import { useApp } from "../lib/store";
export default function Services() {
  const { submit } = useApp(); const experts = useRows("experts", EXPERTS); const [req, setReq] = useState(null); const [f, setF] = useState({ name: "", email: "", message: "" });
  const send = async (e) => { e.preventDefault(); if (await submit("inquiries", { name: f.name, email: f.email, subject: `Service request: ${req.s.title} (${req.pkg})`, message: f.message })) setReq(null); };
  return (<div className="wrap"><h1 className="h1">Services</h1><p className="mb-4 text-slate-600">Hire vetted experts in website development, AI, cloud, design and e-commerce.</p>
    <div className="grid gap-4">{SERVICES.map((s) => <ServiceCard key={s.id} s={s} onRequest={(s, pkg) => setReq({ s, pkg })} />)}</div>
    <h2 className="h1 mt-10">Expert profiles</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{experts.map((x) => <div key={x.name} className="card text-sm">{x.image ? <img src={x.image} alt="" className="mb-2 h-14 w-14 rounded-full object-cover" /> : <div className="mb-2 grid h-14 w-14 place-items-center rounded-full bg-navy text-lg font-bold text-gold">{x.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>}<b>{x.name}</b><p>{x.role}</p><p className="text-amber-600">★ {x.rating} · {x.jobs} projects</p><p className="text-slate-500">Portfolio: {x.work}</p>
      <button className="btn mt-2 w-full" onClick={() => setReq({ s: { title: "Direct hire: " + x.name }, pkg: "Custom" })}>Hire Expert</button></div>)}</div>
    <h2 className="h1 mt-10">How it works</h2><div className="grid gap-3 sm:grid-cols-4">{["Post Project", "Get Quote", "Pay Securely", "Delivery"].map((s, i) => <div key={s} className="card border-t-4 border-gold"><b className="text-gold-dark">{i + 1}</b><p className="font-semibold">{s}</p></div>)}</div>
    <div className="card mt-10"><h3 className="mb-2 font-bold">Chat with an expert</h3><ChatBox /></div>
    {req && <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><form onSubmit={send} className="card w-full max-w-md"><h3 className="font-bold">Request Service</h3><p className="mb-2 text-sm text-slate-500">{req.s.title} · {req.pkg}</p>
      <input className="inp mb-2" required placeholder="Full name" onChange={(e) => setF({ ...f, name: e.target.value })} /><input className="inp mb-2" required type="email" placeholder="Email" onChange={(e) => setF({ ...f, email: e.target.value })} /><textarea className="inp mb-2" required placeholder="Describe your project" onChange={(e) => setF({ ...f, message: e.target.value })} />
      <div className="flex gap-2"><button className="btn">Submit</button><button type="button" className="btn-alt" onClick={() => setReq(null)}>Cancel</button></div></form></div>}</div>);
}
