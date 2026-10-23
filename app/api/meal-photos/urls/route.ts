import { NextRequest, NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/firebase/verifyCustomer";
import { MEAL_PHOTO_BUCKET, getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SIGNED_URL_SECONDS = 60 * 60; // links stop working after 1 hour
const MAX_PATHS = 20;

export async function POST(req: NextRequest) {
  let uid: string;
  try {
    uid = await verifyCustomer(req);
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: { paths?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const paths = Array.isArray(body.paths) ? body.paths : [];
  const valid = paths.filter(
    (p): p is string =>
      typeof p === "string" && p.startsWith(`${uid}/`) && !p.includes("..")
  );
  if (valid.length === 0 || valid.length > MAX_PATHS) {
    return NextResponse.json({ urls: {} });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .storage.from(MEAL_PHOTO_BUCKET)
      .createSignedUrls(valid, SIGNED_URL_SECONDS);
    if (error) throw error;

    const urls: Record<string, string> = {};
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
    }
    return NextResponse.json({ urls });
  } catch (err) {
    console.error("meal-photos urls error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}