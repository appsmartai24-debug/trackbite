const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "An account with this email already exists. Please log in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password is too weak. Please use at least 6 characters.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "No account found with this email. Please create one.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed":
    "Network error. Please check your connection and try again.",
  "auth/user-disabled": "This account has been disabled. Please contact support.",
  "auth/operation-not-allowed":
    "Email/password sign-in is not enabled. Please contact support.",
};

export function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    if (AUTH_ERROR_MESSAGES[code]) {
      return AUTH_ERROR_MESSAGES[code];
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("permission-denied")) {
      return "You do not have permission to perform this action.";
    }
    if (error.message.includes("unavailable")) {
      return "Service is temporarily unavailable. Please try again later.";
    }
  }

  return "Something went wrong. Please try again.";
}
