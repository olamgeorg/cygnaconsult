// Verifies a Paystack payment on the server and marks the order as paid.
// Secrets (never in the website code): supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { reference, order_id } = await req.json();
    const url = Deno.env.get("SUPABASE_URL")!;
    const authed = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization")! } } });
    const { data: { user } } = await authed.auth.getUser();
    if (!user) return json({ error: "Not signed in" }, 401);
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: order } = await admin.from("orders").select("*").eq("id", order_id).eq("user_id", user.id).single();
    if (!order) return json({ error: "Order not found" }, 404);
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}` } });
    const j = await r.json();
    const paid = j.status === true && j.data?.status === "success" && j.data?.currency === "NGN" && j.data?.amount >= Math.round(Number(order.total_ngn) * 100);
    if (paid) await admin.from("orders").update({ status: "paid", payment_ref: reference }).eq("id", order_id);
    return json({ paid });
  } catch (e) { return json({ error: String((e as Error).message || e) }, 400); }
});
