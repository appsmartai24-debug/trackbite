import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyRestaurant } from "@/lib/firebase/verifyRestaurant";
import { InsufficientPointsError, redeemReward } from "@/lib/server/wallet";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const restaurantId = await verifyRestaurant(req);
    const { customerUid } = await req.json();

    if (!customerUid || typeof customerUid !== "string") {
      return NextResponse.json({ error: "Missing customerUid" }, { status: 400 });
    }

    const restaurantSnap = await adminDb.collection("restaurantProfiles").doc(restaurantId).get();
    const restaurant = restaurantSnap.data() ?? {};
    const rewardThreshold: number = restaurant.rewardThreshold ?? 200;
    const rewardName: string = restaurant.rewardName ?? "A free treat";

    const wallet = await redeemReward(restaurantId, customerUid, rewardThreshold, rewardName);

    return NextResponse.json({
      points: wallet.points,
      visits: wallet.visits,
      rewardThreshold,
      rewardName,
      rewardReady: wallet.points >= rewardThreshold,
      redeemed: true,
    });
  } catch (err) {
    if (err instanceof InsufficientPointsError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 500;
    console.error("redeem-reward error", err);
    return NextResponse.json({ error: message }, { status });
  }
}