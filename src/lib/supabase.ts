import { createClient } from "@supabase/supabase-js";

// Lazily create clients to avoid crashing at import time when env vars are missing
let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("⚠️ Supabase not configured — SUPABASE_URL or SUPABASE_ANON_KEY missing");
    return null;
  }

  _supabase = createClient(url, anonKey);
  return _supabase;
}

export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn("⚠️ Supabase admin not configured — SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
    return null;
  }

  _supabaseAdmin = createClient(url, serviceKey);
  return _supabaseAdmin;
}

// Legacy exports for backward compatibility
export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      console.warn("⚠️ supabase singleton is deprecated — use getSupabase() instead");
      const client = getSupabase();
      return client ? (client as any)[prop] : undefined;
    },
  }
) as ReturnType<typeof createClient>;

export const supabaseAdmin = new Proxy(
  {},
  {
    get(_, prop) {
      console.warn("⚠️ supabaseAdmin singleton is deprecated — use getSupabaseAdmin() instead");
      const client = getSupabaseAdmin();
      return client ? (client as any)[prop] : undefined;
    },
  }
) as ReturnType<typeof createClient>;
