import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface RestaurantProfile {
  uid: string;
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cuisineType: string;
  description: string;
  // Reward programme settings — every restaurant runs its own,
  // independent from every other restaurant on Trackbite.
  rewardThreshold: number; // points needed before a reward is ready
  rewardName: string; // e.g. "Free dessert"
}

const DEFAULT_REWARD_THRESHOLD = 200;
const DEFAULT_REWARD_NAME = "A free treat";

export async function getRestaurantProfile(uid: string): Promise<RestaurantProfile | null> {
  const snap = await getDoc(doc(db, "restaurantProfiles", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    restaurantName: data.restaurantName ?? "",
    contactPerson: data.contactPerson ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    cuisineType: data.cuisineType ?? "",
    description: data.description ?? "",
    rewardThreshold: data.rewardThreshold ?? DEFAULT_REWARD_THRESHOLD,
    rewardName: data.rewardName ?? DEFAULT_REWARD_NAME,
  };
}

export interface RewardSettingsUpdate {
  rewardThreshold: number;
  rewardName: string;
}

/** Restaurant-only write — updates just the reward programme fields. */
export async function updateRewardSettings(
  uid: string,
  updates: RewardSettingsUpdate
): Promise<void> {
  await setDoc(
    doc(db, "restaurantProfiles", uid),
    { ...updates, updatedAt: serverTimestamp() },
    { merge: true }
  );
}