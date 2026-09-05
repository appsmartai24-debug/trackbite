import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyRestaurant } from "@/lib/firebase/verifyRestaurant";
import { awardPoints } from "@/lib/server/wallet";

export const runtime = "nodejs";

const MAX_POINTS_PER_AWARD = 500; // sanity cap against accidental fat-finger input

export async function POST(req: NextRequest) {
  try {
    const restaurantId = await verifyRestaurant(req);
    const { customerUid, points } = await req.json();

    if (!customerUid || typeof customerUid !== "string") {
      return NextResponse.json({ error: "Missing customerUid" }, { status: 400 });
    }
    const pointsToAward = Number(points);
    if (!Number.isFinite(pointsToAward) || pointsToAward <= 0) {
      return NextResponse.json({ error: "points must be a positive number" }, { status: 400 });
    }
    if (pointsToAward > MAX_POINTS_PER_AWARD) {
      return NextResponse.json(
        { error: `points can't exceed ${MAX_POINTS_PER_AWARD} in a single visit` },
        { status: 400 }
      );
    }

    const [wallet, restaurantSnap] = await Promise.all([
      awardPoints(restaurantId, customerUid, Math.round(pointsToAward)),
      adminDb.collection("restaurantProfiles").doc(restaurantId).get(),
    ]);

    const restaurant = restaurantSnap.data() ?? {};
    const rewardThreshold: number = restaurant.rewardThreshold ?? 200;
    const rewardName: string = restaurant.rewardName ?? "A free treat";

    return NextResponse.json({
      points: wallet.points,
      visits: wallet.visits,
      rewardThreshold,
      rewardName,
      rewardReady: wallet.points >= rewardThreshold,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 500;
    console.error("award-points error", err);
    return NextResponse.json({ error: message }, { status });
  }
}