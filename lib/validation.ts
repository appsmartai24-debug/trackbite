export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`;
  return null;
}


export const HEIGHT_CM_RANGE = { min: 50, max: 250 };
export const WEIGHT_KG_RANGE = { min: 10, max: 500 };

function validateMeasurement(
  value: string,
  label: string,
  unit: string,
  range: { min: number; max: number }
): string | null {
  if (!value.trim()) return `${label} is required.`;
  const num = Number(value);
  if (!Number.isFinite(num)) return `${label} must be a number.`;
  if (num < range.min || num > range.max)
    return `${label} must be between ${range.min} and ${range.max} ${unit}.`;
  return null;
}

export function validateHeightCm(value: string): string | null {
  return validateMeasurement(value, "Height", "cm", HEIGHT_CM_RANGE);
}

export function validateWeightKg(value: string): string | null {
  return validateMeasurement(value, "Weight", "kg", WEIGHT_KG_RANGE);
}