// export type UserRole = "customer" | "restaurant";

// export type DietaryPreference =
//   | "no-preference"
//   | "vegetarian"
//   | "vegan"
//   | "halal"
//   | "keto"
//   | "other";

// export type Allergy =
//   | "none"
//   | "nuts"
//   | "dairy"
//   | "gluten"
//   | "seafood"
//   | "eggs"
//   | "other";

// export type PortionPreference = "small" | "medium" | "large";

// export type FoodGoal =
//   | "eat-healthier"
//   | "control-portions"
//   | "reduce-food-waste"
//   | "track-meals";

// export interface AuthUser {
//   uid: string;
//   email: string | null;
//   role: UserRole | null;
// }

// export interface CustomerOnboardingData {
//   firstName: string;
//   lastName: string;
//   profilePhotoName?: string;
//   dietaryPreference: DietaryPreference;
//   allergies: Allergy[];
//   portionPreference: PortionPreference;
//   foodGoals: FoodGoal[];
// }

// export interface RestaurantOnboardingData {
//   restaurantName: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   cuisineType: string;
//   description: string;
//   logoName?: string;
// }

// export interface OnboardingState {
//   role: UserRole | null;
//   customer: CustomerOnboardingData;
//   restaurant: RestaurantOnboardingData;
// }

// export const defaultCustomerOnboarding: CustomerOnboardingData = {
//   firstName: "",
//   lastName: "",
//   dietaryPreference: "no-preference",
//   allergies: [],
//   portionPreference: "medium",
//   foodGoals: [],
// };

// export const defaultRestaurantOnboarding: RestaurantOnboardingData = {
//   restaurantName: "",
//   contactPerson: "",
//   email: "",
//   phone: "",
//   address: "",
//   city: "",
//   cuisineType: "",
//   description: "",
// };
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

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole | null;
}

export interface CustomerOnboardingData {
  firstName: string;
  lastName: string;
  dietaryPreference: DietaryPreference;
  allergies: Allergy[];
  portionPreference: PortionPreference;
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
  dietaryPreference: "no-preference",
  allergies: [],
  portionPreference: "medium",
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