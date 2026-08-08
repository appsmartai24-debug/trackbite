import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./config";
import {
  CustomerOnboardingData,
  RestaurantOnboardingData,
  UserRole,
} from "@/types";

export async function registerUser(
  email: string,
  password: string,
  role: UserRole,
  customerData?: CustomerOnboardingData,
  restaurantData?: RestaurantOnboardingData
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (role === "customer" && customerData) {
    await setDoc(doc(db, "customerProfiles", user.uid), {
      uid: user.uid,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      dietaryPreferences: customerData.dietaryPreference === "no-preference"
        ? []
        : [customerData.dietaryPreference],
      allergies: customerData.allergies.filter((a) => a !== "none"),
      portionPreference: customerData.portionPreference,
      foodGoals: customerData.foodGoals,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  if (role === "restaurant" && restaurantData) {
    await setDoc(doc(db, "restaurantProfiles", user.uid), {
      uid: user.uid,
      restaurantName: restaurantData.restaurantName,
      contactPerson: restaurantData.contactPerson,
      email: restaurantData.email,
      phone: restaurantData.phone,
      address: restaurantData.address,
      city: restaurantData.city,
      cuisineType: restaurantData.cuisineType,
      description: restaurantData.description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await sendEmailVerification(user);
  } catch {
    // Email verification may fail if not configured in Firebase Console
  }

  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return data.role === "customer" || data.role === "restaurant"
    ? data.role
    : null;
}

export function getRoleRedirectPath(role: UserRole): string {
  return role === "customer" ? "/customer" : "/restaurant";
}
