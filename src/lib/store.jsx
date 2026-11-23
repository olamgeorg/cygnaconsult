import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isConfigured } from "./supabase";
import { RATES, SYMBOL } from "./data";
const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const DEFAULTS = { company_email: "hello@cygna.com.ng", company_phone: "", company_address: "Lagos, Nigeria", bank_details: "", paystack_public_key: "", x_url: "https://x.com", linkedin_url: "https://linkedin.com", instagram_url: "https://instagram.com" };
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export function AppProvider({ children }) {
  const [cur, setCur] = useState("NGN"); const [cart, setCart] = useState(() => load("cg_cart")); const [wish, setWish] = useState(() => load("cg_wish"));
  const [user, setUser] = useState(null); const [role, setRole] = useState("customer"); const [toast, setToast] = useState(""); const [settings, setSettings] = useState(DEFAULTS);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (!isConfigured) return; supabase.from("settings").select("*").then(({ data }) => { if (data) setSettings((s) => ({ ...s, ...Object.fromEntries(data.filter((r) => r.value).map((r) => [r.key, r.value])) })); }); }, []);
  useEffect(() => { if (!user || !isConfigured) return setRole("customer"); supabase.from("users").select("role").eq("id", user.id).single().then(({ data }) => setRole(data?.role || "customer")); }, [user]);
  useEffect(() => { try { localStorage.setItem("cg_cart", JSON.stringify(cart)); localStorage.setItem("cg_wish", JSON.stringify(wish)); } catch { /* storage unavailable */ } }, [cart, wish]);
  const notify = useCallback((m) => { setToast(m); setTimeout(() => setToast(""), 3000); }, []);
  const money = (n) => SYMBOL[cur] + Math.round(Number(n) * RATES[cur]).toLocaleString();
  const addToCart = (p) => { setCart((c) => { const f = c.find((x) => x.id === p.id); return f ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }]; }); notify("Added to cart"); };
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const toggleWish = (id) => setWish((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  const total = cart.reduce((a, p) => a + p.price_ngn * p.qty, 0);
  const placeOrder = async (method = "Bank transfer", address = "") => {
    if (!user) return { error: "Please sign in to checkout." };
    const amount = total;
    const { data, error } = await supabase.from("orders").insert({ user_id: user.id, items: cart, total_ngn: amount, currency: cur, payment_method: method, address }).select("id").single();
    if (error) return { error: isConfigured ? error.message : "Connect Supabase in src/lib/supabase.js to save orders." };
    setCart([]); return { ok: true, id: data.id, total: amount };
  };
  const payWithCard = (orderId, amount) => new Promise((resolve) => {
    const key = settings.paystack_public_key; if (!key) { notify("Card payments are not enabled yet."); return resolve(false); }
    const run = () => window.PaystackPop.setup({ key, email: user.email, amount: Math.round(amount * 100), currency: "NGN", ref: `CYG-${orderId}-${Date.now()}`,
      callback: (res) => { supabase.functions.invoke("verify-payment", { body: { reference: res.reference, order_id: orderId } }).then(({ data, error }) => resolve(!error && !!data?.paid)); }, onClose: () => resolve(false) }).openIframe();
    if (window.PaystackPop) return run();
    const s = document.createElement("script"); s.src = "https://js.paystack.co/v1/inline.js"; s.onload = run; s.onerror = () => { notify("Could not load the payment provider."); resolve(false); }; document.body.appendChild(s);
  });
  const submit = async (table, row) => { const { error } = await supabase.from(table).insert(row); if (error) { notify(isConfigured ? error.message : "Connect Supabase to save this request."); return false; } notify("Sent successfully. We will contact you shortly."); return true; };
  const book = (kind, ref_id, note = "") => { if (!user) { notify("Please sign in first."); return false; } return submit("bookings", { user_id: user.id, kind, ref_id, note }); };
  return <Ctx.Provider value={{ cur, setCur, money, cart, addToCart, removeFromCart, total, wish, toggleWish, user, role, notify, submit, book, placeOrder, payWithCard, settings, toast }}>{children}</Ctx.Provider>;
}
