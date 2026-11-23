import { Link } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../lib/store";
const Q = [["Home", "/"], ["Shop", "/shop"], ["Cars", "/cars"], ["Real Estate", "/real-estate"], ["Services", "/services"], ["AI Training", "/ai-training"], ["About", "/about"], ["Contact", "/contact"]];
export default function Footer() {
  const { submit, settings } = useApp(); const [email, setEmail] = useState("");
  return (<footer className="mt-12 bg-navy text-slate-300"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
    <div><h4 className="mb-2 font-bold text-white">About Cygnaconsult</h4><p className="text-sm">Cygnaconsult builds marketplaces for merchandise, vehicles and property, and delivers web, cloud and applied AI services to businesses worldwide.</p></div>
    <div><h4 className="mb-2 font-bold text-white">Quick Links</h4><ul className="grid gap-1 text-sm">{Q.map(([l, h]) => <li key={h}><Link className="hover:text-gold" to={h}>{l}</Link></li>)}</ul></div>
    <div><h4 className="mb-2 font-bold text-white">Contact</h4><p className="text-sm">{settings.company_email}<br />{settings.company_phone && <>{settings.company_phone}<br /></>}cygna.com.ng<br />{settings.company_address}</p></div>
    <div><h4 className="mb-2 font-bold text-white">Newsletter</h4>
      <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (await submit("inquiries", { email, subject: "Newsletter", name: "Subscriber", message: "Newsletter signup" })) setEmail(""); }}>
        <input className="inp" type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} /><button className="btn">Join</button></form>
      <p className="mt-3 flex gap-3 text-sm"><a className="hover:text-gold" href={settings.x_url} target="_blank" rel="noreferrer">X</a><a className="hover:text-gold" href={settings.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a><a className="hover:text-gold" href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram</a></p></div></div>
    <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-gold">© Cygnaconsult - cygna.com.ng - All rights reserved.<br />Copyright © Cygnaconsult. Powered by cygna.</div></footer>);
}
