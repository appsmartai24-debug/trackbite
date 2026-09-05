import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// SERVER-ONLY (Admin SDK). Wallet documents are never read or written
// directly from either client app — Firestore rules deny client access
// entirely. All access goes through the /api/wallet routes so that a
// restaurant can only ever touch its own wallet for a given customer,
// and points can only move forward (awarded), never be forged client-side.

export interface WalletData {
  restaurantId: string;
  customerUid: string;
  points: number;
  visits: number;
}

export function walletDocId(restaurantId: string, customerUid: string): string {
  return `${restaurantId}_${customerUid}`;
}

export async function getOrCreateWallet(
  restaurantId: string,
  customerUid: string
): Promise<WalletData> {
  const ref = adminDb.collection("wallets").doc(walletDocId(restaurantId, customerUid));
  const snap = await ref.get();

  if (snap.exists) {
    const data = snap.data() ?? {};
    return {
      restaurantId,
      customerUid,
      points: data.points ?? 0,
      visits: data.visits ?? 0,
    };
  }

  const fresh: WalletData = { restaurantId, customerUid, points: 0, visits: 0 };
  await ref.set({ ...fresh, createdAt: FieldValue.serverTimestamp() });
  return fresh;
}

export async function awardPoints(
  restaurantId: string,
  customerUid: string,
  points: number
): Promise<WalletData> {
  const ref = adminDb.collection("wallets").doc(walletDocId(restaurantId, customerUid));

  const updated = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? snap.data() ?? {} : {};
    const nextPoints = (current.points ?? 0) + points;
    const nextVisits = (current.visits ?? 0) + 1;

    tx.set(
      ref,
      {
        restaurantId,
        customerUid,
        points: nextPoints,
        visits: nextVisits,
        lastVisit: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { restaurantId, customerUid, points: nextPoints, visits: nextVisits };
  });

  return updated;
}

export class InsufficientPointsError extends Error {
  constructor() {
    super("Customer doesn't have enough points for this reward yet.");
    this.name = "InsufficientPointsError";
  }
}

/**
 * Redeems a reward: subtracts the reward's threshold from the wallet
 * (any points earned beyond the threshold carry over rather than being
 * lost) and writes a record to `redemptions` for the restaurant's own
 * history. Throws InsufficientPointsError if the wallet doesn't actually
 * qualify — checked server-side so a client can't force a redemption.
 */
export async function redeemReward(
  restaurantId: string,
  customerUid: string,
  rewardThreshold: number,
  rewardName: string
): Promise<WalletData> {
  const walletRef = adminDb.collection("wallets").doc(walletDocId(restaurantId, customerUid));

  const updated = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const current = snap.exists ? snap.data() ?? {} : {};
    const currentPoints = current.points ?? 0;

    if (currentPoints < rewardThreshold) {
      throw new InsufficientPointsError();
    }

    const nextPoints = currentPoints - rewardThreshold;

    tx.set(
      walletRef,
      {
        restaurantId,
        customerUid,
        points: nextPoints,
        visits: current.visits ?? 0,
        lastRedeemedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const redemptionRef = adminDb.collection("redemptions").doc();
    tx.set(redemptionRef, {
      restaurantId,
      customerUid,
      rewardName,
      pointsRedeemed: rewardThreshold,
      redeemedAt: FieldValue.serverTimestamp(),
    });

    return { restaurantId, customerUid, points: nextPoints, visits: current.visits ?? 0 };
  });

  return updated;
}