import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Meal } from "@/types";

export interface LogMealInput {
  uid: string;
  clearedPercent: number;
  portionSize: Meal["portionSize"];
  notes?: string;
}

/** Writes a real meal record for the signed-in customer. */
export async function logMeal(input: LogMealInput): Promise<string> {
  const docRef = await addDoc(collection(db, "meals"), {
    uid: input.uid,
    clearedPercent: input.clearedPercent,
    portionSize: input.portionSize,
    notes: input.notes ?? "",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Reads the signed-in customer's own recent meals, most recent first. */
export async function getRecentMeals(uid: string, count = 10): Promise<Meal[]> {
  const q = query(
    collection(db, "meals"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
    return {
      id: d.id,
      uid: data.uid,
      clearedPercent: data.clearedPercent ?? 0,
      portionSize: data.portionSize ?? "medium",
      notes: data.notes ?? "",
      createdAt,
    };
  });
}

/** Aggregate stats across all of a customer's tracked meals. */
export interface MealStats {
  mealsTracked: number;
  pointsEarned: number;
  foodSavedKg: number;
}

export async function getMealStats(uid: string): Promise<MealStats> {
  const q = query(collection(db, "meals"), where("uid", "==", uid));
  const snap = await getDocs(q);

  let pointsEarned = 0;
  let foodSavedKg = 0;
  snap.docs.forEach((d) => {
    const cleared = d.data().clearedPercent ?? 0;
    pointsEarned += Math.round(cleared * 0.5);
    foodSavedKg += (cleared / 100) * 0.4;
  });

  return {
    mealsTracked: snap.size,
    pointsEarned,
    foodSavedKg: Math.round(foodSavedKg * 10) / 10,
  };
}