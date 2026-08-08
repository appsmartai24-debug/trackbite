"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CustomerOnboardingData,
  defaultCustomerOnboarding,
  defaultRestaurantOnboarding,
  OnboardingState,
  RestaurantOnboardingData,
  UserRole,
} from "@/types";

const STORAGE_KEY = "trackbite-onboarding";

const defaultState: OnboardingState = {
  role: null,
  customer: defaultCustomerOnboarding,
  restaurant: defaultRestaurantOnboarding,
};

interface OnboardingContextValue {
  state: OnboardingState;
  setRole: (role: UserRole) => void;
  updateCustomer: (data: Partial<CustomerOnboardingData>) => void;
  updateRestaurant: (data: Partial<RestaurantOnboardingData>) => void;
  clearOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function loadState(): OnboardingState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {
    // ignore parse errors
  }
  return defaultState;
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const setRole = useCallback((role: UserRole) => {
    setState((prev) => ({ ...prev, role }));
  }, []);

  const updateCustomer = useCallback((data: Partial<CustomerOnboardingData>) => {
    setState((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...data },
    }));
  }, []);

  const updateRestaurant = useCallback((data: Partial<RestaurantOnboardingData>) => {
    setState((prev) => ({
      ...prev,
      restaurant: { ...prev.restaurant, ...data },
    }));
  }, []);

  const clearOnboarding = useCallback(() => {
    setState(defaultState);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ state, setRole, updateCustomer, updateRestaurant, clearOnboarding }),
    [state, setRole, updateCustomer, updateRestaurant, clearOnboarding]
  );

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
