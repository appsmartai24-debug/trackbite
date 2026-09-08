import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyRestaurant } from "@/lib/firebase/verifyRestaurant";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const restaurantId = await verifyRestaurant(req);

    const [walletsSnap, redemptionsSnap] = await Promise.all([
      adminDb.collection("wallets").where("restaurantId", "==", restaurantId).get(),
      adminDb.collection("redemptions").where("restaurantId", "==", restaurantId).get(),
    ]);

    const customersServed = walletsSnap.size;
    const activePoints = walletsSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().points ?? 0),
      0
    );
    // const redeemedPoints = redemptionsSnap.docs.reduce(
    //   (sum, doc) => sum + (doc.data().pointsRedeemed ?? 0),
    //   0
    // );

    // return NextResponse.json({
    //   customersServed,
    //   rewardsRedeemed: redemptionsSnap.size,
    //   // Lifetime total, so it doesn't drop every time a reward is redeemed.
    //   totalPointsAwarded: activePoints + redeemedPoints,
    // });

        const redeemedPoints = redemptionsSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().pointsRedeemed ?? 0),
      0
    );

    const recentRedemptions = redemptionsSnap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          rewardName: data.rewardName ?? "Reward",
          pointsRedeemed: data.pointsRedeemed ?? 0,
          redeemedAt: data.redeemedAt?.toMillis?.() ?? 0,
        };
      })
      .sort((a, b) => b.redeemedAt - a.redeemedAt)
      .slice(0, 5);

    return NextResponse.json({
      customersServed,
      rewardsRedeemed: redemptionsSnap.size,
      // Lifetime total, so it doesn't drop every time a reward is redeemed.
      totalPointsAwarded: activePoints + redeemedPoints,
      recentRedemptions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 500;
    console.error("restaurant stats error", err);
    return NextResponse.json({ error: message }, { status });
  }
}