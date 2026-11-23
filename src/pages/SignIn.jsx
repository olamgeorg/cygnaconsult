import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../lib/store";
export default function SignIn() {
  const { user, notify } = useApp(); const [email, setE] = useState(""), [pw, setP] = useState(""), [up, setUp] = useState(false), [name, setName] = useState("");
  if (user) return <Navigate to="/dashboard" />;
  const go = async (e) => { e.preventDefault(); const r = up ? await supabase.auth.signUp({ email, password: pw, options: { data: { full_name: name } } }) : await supabase.auth.signInWithPassword({ email, password: pw }); notify(r.error ? r.error.message : up ? "Check your email to confirm your account." : "Welcome back."); };
  return (<div className="wrap max-w-md"><h1 className="h1">{up ? "Create your account" : "Sign in"}</h1><form className="card grid gap-2" onSubmit={go}>{up && <input className="inp" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />}<input className="inp" type="email" required placeholder="Email" value={email} onChange={(e) => setE(e.target.value)} /><input className="inp" type="password" required minLength="6" placeholder="Password" value={pw} onChange={(e) => setP(e.target.value)} /><button className="btn">{up ? "Sign up" : "Sign in"}</button></form>
    <button className="btn-alt mt-3 w-full" onClick={async () => { const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/dashboard" } }); if (error) notify(error.message); }}>Continue with Google</button>
    <button className="mt-3 w-full text-sm text-gold-dark" onClick={() => setUp(!up)}>{up ? "Already have an account? Sign in" : "New here? Create an account"}</button></div>);
}
