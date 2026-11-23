import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../lib/store";
import { supabase } from "../lib/supabase";
import { RATES } from "../lib/data";
const LINKS = [["Home", "/"], ["Shop", "/shop"], ["Cars", "/cars"], ["Real Estate", "/real-estate"], ["Services", "/services"], ["AI Training", "/ai-training"], ["About", "/about"], ["Contact", "/contact"]];
export default function Navbar() {
  const { cur, setCur, cart, wish, user } = useApp(); const [open, setOpen] = useState(false); const [q, setQ] = useState(""); const nav = useNavigate();
  const cls = ({ isActive }) => `rounded px-2 py-1 text-sm ${isActive ? "text-gold" : "text-white hover:text-gold"}`;
  return (<header className="sticky top-0 z-40 bg-navy text-white shadow">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
      <Link to="/" className="text-2xl font-extrabold tracking-[0.25em]">CYGNA<span className="text-gold">.</span></Link>
      <form className="order-3 w-full flex-1 md:order-none md:w-auto" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { nav("/search?q=" + encodeURIComponent(q)); setOpen(false); } }}>
        <input className="inp !bg-white/10 !text-white placeholder:text-slate-300 !border-white/20" placeholder="Search shop, cars, homes, services, AI…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" /></form>
      <button className="ml-auto text-2xl lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      <nav className={`${open ? "flex" : "hidden"} w-full flex-wrap items-center gap-1 lg:flex lg:w-auto`}>
        {LINKS.map(([l, h]) => <NavLink key={h} to={h} end={h === "/"} className={cls} onClick={() => setOpen(false)}>{l}</NavLink>)}
        <select className="rounded bg-navy-700 px-2 py-1 text-sm" value={cur} onChange={(e) => setCur(e.target.value)} aria-label="Currency">{Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}</select>
        <NavLink to="/wishlist" className={cls}>♥ {wish.length}</NavLink>{user ? <><NavLink to="/dashboard" className={cls}>Dashboard</NavLink><button className="px-2 text-sm hover:text-gold" onClick={() => supabase.auth.signOut()}>Sign Out</button></> : <NavLink to="/signin" className={cls}>Sign In</NavLink>}
        <NavLink to="/cart" className="btn !py-1" onClick={() => setOpen(false)}>Cart ({cart.reduce((a, c) => a + c.qty, 0)})</NavLink></nav></div></header>);
}
