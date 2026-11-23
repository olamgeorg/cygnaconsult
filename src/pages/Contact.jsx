import { useState } from "react";
import { useApp } from "../lib/store";
export default function Contact() {
  const { submit, settings } = useApp(); const [f, setF] = useState({ name: "", email: "", subject: "", message: "" }); const [ok, setOk] = useState(false); const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  if (ok) return <div className="wrap text-center"><h1 className="h1">Thank you</h1><p>We will reply within one business day.</p></div>;
  return (<div className="wrap grid max-w-4xl gap-8 md:grid-cols-2"><div><h1 className="h1">Contact Cygnaconsult</h1><p>Email: {settings.company_email}</p>{settings.company_phone && <p>Phone: {settings.company_phone}</p>}<p>Web: cygna.com.ng</p><p>Office: {settings.company_address}</p><p className="mt-2 text-sm text-slate-500">Mon–Fri, 9:00–18:00 WAT</p></div>
    <form className="card grid gap-2" onSubmit={async (e) => { e.preventDefault(); if (await submit("inquiries", f)) setOk(true); }}><input className="inp" required placeholder="Full name" onChange={set("name")} /><input className="inp" required type="email" placeholder="Email" onChange={set("email")} /><input className="inp" placeholder="Subject" onChange={set("subject")} /><textarea className="inp" required rows="5" placeholder="How can we help?" onChange={set("message")} /><button className="btn">Send message</button></form></div>);
}
