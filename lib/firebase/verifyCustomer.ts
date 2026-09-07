import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

/**
 * Verifies the "Authorization: Bearer <idToken>" header sent by a
 * customer client and returns the customer's uid.
 *
 * Mirrors verifyRestaurant — we always trust the uid embedded in a
 * verified Firebase ID token, never one a client could pass directly,
 * so a customer can only ever read their own wallets.
 */
export async function verifyCustomer(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Missing customer authorization token");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
}