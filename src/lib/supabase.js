import { createClient } from "@supabase/supabase-js";
// The ONLY place credentials live. Paste your values here. Publishable key only; never a service_role key.
const SUPABASE_URL = "https://qoyyfjaxxhjrpkgzkuby.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Qc1hUwDlf90V3WNSzxBpog_ddx5HpQG";
export const isConfigured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_");
export const supabase = createClient(isConfigured ? SUPABASE_URL : "https://not-configured.supabase.co", isConfigured ? SUPABASE_PUBLISHABLE_KEY : "not-configured");
