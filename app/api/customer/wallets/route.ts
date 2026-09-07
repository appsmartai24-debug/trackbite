import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyCustomer } from "@/lib/firebase/verifyCustomer";

export const runtime = "nodejs";

export interface CustomerWalletSummary {
  restaurantId: string;
  restaurantName: string;
  points: number;
  visits: number;
  rewardThreshold: number;
  rewardName: string;
  rewardReady: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const customerUid = await verifyCustomer(req);

    const walletsSnap = await adminDb
      .collection("wallets")
      .where("customerUid", "==", customerUid)
      .get();

    const wallets = await Promise.all(
      walletsSnap.docs.map(async (walletDoc) => {
        const data = walletDoc.data();
        const restaurantId: string = data.restaurantId;
        const restaurantSnap = await adminDb
          .collection("restaurantProfiles")
          .doc(restaurantId)
          .get();
        const restaurant = restaurantSnap.data() ?? {};
        const rewardThreshold: number = restaurant.rewardThreshold ?? 200;
        const rewardName: string = restaurant.rewardName ?? "A free treat";
        const points: number = data.points ?? 0;

        const summary: CustomerWalletSummary = {
          restaurantId,
          restaurantName: restaurant.restaurantName ?? "A restaurant",
          points,
          visits: data.visits ?? 0,
          rewardThreshold,
          rewardName,
          rewardReady: points >= rewardThreshold,
        };
        return summary;
      })
    );

    // Highest points first, so the closest-to-a-reward wallet shows first.
    wallets.sort((a, b) => b.points - a.points);

    return NextResponse.json({ wallets });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 500;
    console.error("customer wallets error", err);
    return NextResponse.json({ error: message }, { status });
  }
}