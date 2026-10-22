export type UserRole = "customer" | "restaurant";

export type DietaryPreference =
  | "no-preference"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "keto"
  | "other";

export type Allergy =
  | "none"
  | "nuts"
  | "dairy"
  | "gluten"
  | "seafood"
  | "eggs"
  | "other";

export type PortionPreference = "small" | "medium" | "large";

export type FoodGoal =
  | "eat-healthier"
  | "control-portions"
  | "reduce-food-waste"
  | "track-meals";

export type CuisineType =
  | "italian"
  | "chinese"
  | "indian"
  | "pakistani"
  | "mexican"
  | "japanese"
  | "thai"
  | "middle-eastern"
  | "american"
  | "mediterranean";

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole | null;
}

export interface CustomerOnboardingData {
  firstName: string;
  lastName: string;
  age: string;
  heightCm: string;
  weightKg: string;
  wantsAppetizers: boolean;
  dietaryPreference: DietaryPreference;
  allergies: Allergy[];
  portionPreference: PortionPreference;
  favoriteCuisines: CuisineType[];
  dislikedFoods: string;
  foodGoals: FoodGoal[];
}

export interface RestaurantOnboardingData {
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cuisineType: string;
  description: string;
}

export interface OnboardingState {
  role: UserRole | null;
  customer: CustomerOnboardingData;
  restaurant: RestaurantOnboardingData;
}

export const defaultCustomerOnboarding: CustomerOnboardingData = {
  firstName: "",
  lastName: "",
  age: "",
  heightCm: "",
  weightKg: "",
  wantsAppetizers: false,
  dietaryPreference: "no-preference",
  allergies: [],
  portionPreference: "medium",
  favoriteCuisines: [],
  dislikedFoods: "",
  foodGoals: [],
};

export const defaultRestaurantOnboarding: RestaurantOnboardingData = {
  restaurantName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  cuisineType: "",
  description: "",
};

export interface Meal {
  id: string;
  uid: string; // customer who logged this meal
  clearedPercent: number; // 0-100, how much of the plate was eaten
  portionSize: "small" | "medium" | "large";
  notes?: string; // short AI-generated note about this specific meal
  createdAt: number; // ms epoch, set client-side for ordering
}