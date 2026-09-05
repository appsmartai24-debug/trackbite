import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Allergy, DietaryPreference, FoodGoal, PortionPreference } from "@/types";

export interface CustomerProfile {
  uid: string;
  firstName: string;
  lastName: string;
  dietaryPreferences: DietaryPreference[];
  allergies: Allergy[];
  portionPreference: PortionPreference;
  foodGoals: FoodGoal[];
}

export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  const snap = await getDoc(doc(db, "customerProfiles", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    dietaryPreferences: data.dietaryPreferences ?? [],
    allergies: data.allergies ?? [],
    portionPreference: data.portionPreference ?? "medium",
    foodGoals: data.foodGoals ?? [],
  };
}

export interface CustomerProfileUpdate {
  firstName?: string;
  lastName?: string;
  dietaryPreferences?: DietaryPreference[];
  allergies?: Allergy[];
  portionPreference?: PortionPreference;
  foodGoals?: FoodGoal[];
}

export async function updateCustomerProfile(
  uid: string,
  updates: CustomerProfileUpdate
): Promise<void> {
  await setDoc(
    doc(db, "customerProfiles", uid),
    { ...updates, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export const DIETARY_LABELS: Record<DietaryPreference, string> = {
  "no-preference": "No preference",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  halal: "Halal",
  keto: "Keto",
  other: "Other",
};

export const ALLERGY_LABELS: Record<Allergy, string> = {
  none: "None",
  nuts: "Nuts",
  dairy: "Dairy",
  gluten: "Gluten",
  seafood: "Seafood",
  eggs: "Eggs",
  other: "Other",
};

export const PORTION_LABELS: Record<PortionPreference, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export const FOOD_GOAL_LABELS: Record<FoodGoal, string> = {
  "eat-healthier": "Eat healthier",
  "control-portions": "Control portions",
  "reduce-food-waste": "Reduce food waste",
  "track-meals": "Track meals",
};