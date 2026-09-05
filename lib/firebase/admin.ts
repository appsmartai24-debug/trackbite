import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// SERVER-ONLY. Never import this file from a "use client" component.
// It uses a service account with elevated privileges to read data
// across users (e.g. a restaurant reading a customer's meal history
// after the customer scans their Food ID) — access that Firestore's
// client-side security rules deliberately do NOT allow.

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local (see README)."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminApp = createAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);