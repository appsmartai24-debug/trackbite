import { auth } from "@/lib/firebase/config";

/**
 * Calls a restaurant-only API route with the caller's Firebase ID token
 * attached. The server verifies this token and uses its own uid as the
 * restaurantId — never trust a restaurantId sent in the request body,
 * since that could be forged by any caller.
 */
export async function authedFetch<T = unknown>(path: string, body: object): Promise<T> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("You're not signed in. Please log in again.");

  const res = await fetch(path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}