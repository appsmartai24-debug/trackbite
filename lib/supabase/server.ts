import { createClient, SupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this file from a "use client" component.
// It uses the Supabase secret key, which can read and delete every file.

export const MEAL_PHOTO_BUCKET = "meal-photos";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  }

  client = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}