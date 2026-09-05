import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

/**
 * Verifies the "Authorization: Bearer <idToken>" header sent by a
 * restaurant client and returns the restaurant's uid.
 *
 * We deliberately trust the restaurantId embedded in a verified Firebase
 * ID token rather than one passed in the request body — a restaurant
 * could otherwise claim to be any restaurantId and award itself points
 * on someone else's wallet.
 *
 * Throws a plain Error with a short message on any failure; callers
 * should catch it and return a 401.
 */
export async function verifyRestaurant(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Missing restaurant authorization token");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
}