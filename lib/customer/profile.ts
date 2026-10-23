
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase/config";
// import { Allergy, CuisineType, DietaryPreference, FoodGoal, PortionPreference } from "@/types";

// export interface CustomerProfile {
//   uid: string;
//   firstName: string;
//   lastName: string;
//   age: number | null;
//   heightCm: number | null;
//   weightKg: number | null;
//   wantsAppetizers: boolean;
//   dietaryPreferences: DietaryPreference[];
//   allergies: Allergy[];
//   portionPreference: PortionPreference;
//   favoriteCuisines: CuisineType[];
//   dislikedFoods: string[];
//   foodGoals: FoodGoal[];
// }

// export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
//   const snap = await getDoc(doc(db, "customerProfiles", uid));
//   if (!snap.exists()) return null;
//   const data = snap.data();
//   return {
//     uid,
//     firstName: data.firstName ?? "",
//     lastName: data.lastName ?? "",
//     age: typeof data.age === "number" ? data.age : null,
//     heightCm: typeof data.heightCm === "number" ? data.heightCm : null,
//     weightKg: typeof data.weightKg === "number" ? data.weightKg : null,
//     wantsAppetizers: data.wantsAppetizers === true,
//     dietaryPreferences: data.dietaryPreferences ?? [],
//     allergies: data.allergies ?? [],
//     portionPreference: data.portionPreference ?? "medium",
//     favoriteCuisines: data.favoriteCuisines ?? [],
//     dislikedFoods: data.dislikedFoods ?? [],
//     foodGoals: data.foodGoals ?? [],
//   };
// }

// export interface CustomerProfileUpdate {
//   firstName?: string;
//   lastName?: string;
//   age?: number;
//   heightCm?: number;
//   weightKg?: number;
//   wantsAppetizers?: boolean;
//   dietaryPreferences?: DietaryPreference[];
//   allergies?: Allergy[];
//   portionPreference?: PortionPreference;
//   favoriteCuisines?: CuisineType[];
//   dislikedFoods?: string[];
//   foodGoals?: FoodGoal[];
// }

// export async function updateCustomerProfile(
//   uid: string,
//   updates: CustomerProfileUpdate
// ): Promise<void> {
//   await setDoc(
//     doc(db, "customerProfiles", uid),
//     { ...updates, updatedAt: serverTimestamp() },
//     { merge: true }
//   );
// }

// export const DIETARY_LABELS: Record<DietaryPreference, string> = {
//   "no-preference": "No preference",
//   vegetarian: "Vegetarian",
//   vegan: "Vegan",
//   halal: "Halal",
//   keto: "Keto",
//   other: "Other",
// };

// export const ALLERGY_LABELS: Record<Allergy, string> = {
//   none: "None",
//   nuts: "Nuts",
//   dairy: "Dairy",
//   gluten: "Gluten",
//   seafood: "Seafood",
//   eggs: "Eggs",
//   other: "Other",
// };

// export const PORTION_LABELS: Record<PortionPreference, string> = {
//   small: "Small",
//   medium: "Medium",
//   large: "Large",
// };

// export const FOOD_GOAL_LABELS: Record<FoodGoal, string> = {
//   "eat-healthier": "Eat healthier",
//   "control-portions": "Control portions",
//   "reduce-food-waste": "Reduce food waste",
//   "track-meals": "Track meals",
// };

// export const CUISINE_LABELS: Record<CuisineType, string> = {
//   italian: "Italian",
//   chinese: "Chinese",
//   indian: "Indian",
//   pakistani: "Pakistani",
//   mexican: "Mexican",
//   japanese: "Japanese",
//   thai: "Thai",
//   "middle-eastern": "Middle Eastern",
//   american: "American",
//   mediterranean: "Mediterranean",
// };

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Allergy, CuisineType, DietaryPreference, FoodGoal, HungerLevel, PortionPreference } from "@/types";
import { freshHunger } from "@/lib/customer/hunger";

export interface CustomerProfile {
  uid: string;
  firstName: string;
  lastName: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  wantsAppetizers: boolean;
  dietaryPreferences: DietaryPreference[];
  allergies: Allergy[];
  portionPreference: PortionPreference;
  favoriteCuisines: CuisineType[];
  dislikedFoods: string[];
  foodGoals: FoodGoal[];
  /** Today's hunger level. Already null if it has expired (see HUNGER_FRESH_MS). */
  currentHunger: HungerLevel | null;
}

export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  const snap = await getDoc(doc(db, "customerProfiles", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    age: typeof data.age === "number" ? data.age : null,
    heightCm: typeof data.heightCm === "number" ? data.heightCm : null,
    weightKg: typeof data.weightKg === "number" ? data.weightKg : null,
    wantsAppetizers: data.wantsAppetizers === true,
    dietaryPreferences: data.dietaryPreferences ?? [],
    allergies: data.allergies ?? [],
    portionPreference: data.portionPreference ?? "medium",
    favoriteCuisines: data.favoriteCuisines ?? [],
    dislikedFoods: data.dislikedFoods ?? [],
    foodGoals: data.foodGoals ?? [],
    currentHunger: freshHunger(
      data.currentHunger,
      typeof data.hungerUpdatedAt?.toMillis === "function" ? data.hungerUpdatedAt.toMillis() : null
    ),
  };
}

export interface CustomerProfileUpdate {
  firstName?: string;
  lastName?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  wantsAppetizers?: boolean;
  dietaryPreferences?: DietaryPreference[];
  allergies?: Allergy[];
  portionPreference?: PortionPreference;
  favoriteCuisines?: CuisineType[];
  dislikedFoods?: string[];
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

/** Saves today's hunger level (or clears it with null). */
export async function setCustomerHunger(uid: string, level: HungerLevel | null): Promise<void> {
  await setDoc(
    doc(db, "customerProfiles", uid),
    {
      currentHunger: level,
      hungerUpdatedAt: level ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    },
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

export const CUISINE_LABELS: Record<CuisineType, string> = {
  italian: "Italian",
  chinese: "Chinese",
  indian: "Indian",
  pakistani: "Pakistani",
  mexican: "Mexican",
  japanese: "Japanese",
  thai: "Thai",
  "middle-eastern": "Middle Eastern",
  american: "American",
  mediterranean: "Mediterranean",
};