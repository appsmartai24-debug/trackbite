import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { verifyCustomer } from "@/lib/firebase/verifyCustomer";
import { MEAL_PHOTO_BUCKET, getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Only the photos of a customer's most recent meals are kept. Older ones are
// deleted from storage automatically, which keeps the free 1 GB plan nearly empty.
const KEEP_MEALS_WITH_PHOTOS = 5;
const MAX_IMAGE_BASE64_CHARS = 4_500_000;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parseDataUrl(dataUrl: unknown): { mediaType: string; base64: string } | null {
  if (typeof dataUrl !== "string") return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { mediaType: match[1], base64: match[2] };
}

async function pruneOldPhotos(uid: string) {
  const snap = await adminDb
    .collection("meals")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(60)
    .get();

  const withPhotos = snap.docs.filter(
    (d) => d.get("beforePhotoPath") || d.get("afterPhotoPath")
  );
  const stale = withPhotos.slice(KEEP_MEALS_WITH_PHOTOS);
  if (stale.length === 0) return;

  const paths = stale
    .flatMap((d) => [d.get("beforePhotoPath"), d.get("afterPhotoPath")])
    .filter((p): p is string => typeof p === "string" && p.startsWith(`${uid}/`));

  if (paths.length > 0) {
    const { error } = await getSupabaseAdmin().storage.from(MEAL_PHOTO_BUCKET).remove(paths);
    if (error) throw new Error(`Supabase remove failed: ${error.message}`);
  }

  const batch = adminDb.batch();
  stale.forEach((d) =>
    batch.update(d.ref, {
      beforePhotoPath: FieldValue.delete(),
      afterPhotoPath: FieldValue.delete(),
    })
  );
  await batch.commit();
}

export async function POST(req: NextRequest) {
  let uid: string;
  try {
    uid = await verifyCustomer(req);
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: { mealId?: unknown; beforeImage?: unknown; afterImage?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const mealId = typeof body.mealId === "string" ? body.mealId : "";
  const before = parseDataUrl(body.beforeImage);
  const after = parseDataUrl(body.afterImage);
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(mealId) || !before || !after) {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
  if (before.base64.length > MAX_IMAGE_BASE64_CHARS || after.base64.length > MAX_IMAGE_BASE64_CHARS) {
    return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  }

  try {
    // The meal must exist and belong to the caller.
    const mealRef = adminDb.collection("meals").doc(mealId);
    const mealSnap = await mealRef.get();
    if (!mealSnap.exists || mealSnap.get("uid") !== uid) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const beforePhotoPath = `${uid}/${mealId}/before.${EXTENSIONS[before.mediaType]}`;
    const afterPhotoPath = `${uid}/${mealId}/after.${EXTENSIONS[after.mediaType]}`;

    const bucket = getSupabaseAdmin().storage.from(MEAL_PHOTO_BUCKET);
    const [beforeRes, afterRes] = await Promise.all([
      bucket.upload(beforePhotoPath, Buffer.from(before.base64, "base64"), {
        contentType: before.mediaType,
        upsert: true,
      }),
      bucket.upload(afterPhotoPath, Buffer.from(after.base64, "base64"), {
        contentType: after.mediaType,
        upsert: true,
      }),
    ]);

    if (beforeRes.error || afterRes.error) {
      console.error("meal-photos upload failed", beforeRes.error ?? afterRes.error);
      return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 502 });
    }

    await mealRef.update({ beforePhotoPath, afterPhotoPath });

    // Cleaning up old photos must never make the save itself fail.
    try {
      await pruneOldPhotos(uid);
    } catch (err) {
      console.warn("meal-photos prune failed", err);
    }

    return NextResponse.json({ beforePhotoPath, afterPhotoPath });
  } catch (err) {
    console.error("meal-photos error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}