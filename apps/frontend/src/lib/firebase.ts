// Firebase client SDK — singleton initialisation
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app;
let auth: any;
let googleProvider: any;

if (typeof window !== "undefined") {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.warn("Firebase init failed", e);
  }
} else {
  // Server-side (SSR / Next.js Build) mock
  auth = {};
  googleProvider = {};
}

export { auth, googleProvider };

/**
 * Manages a single invisible reCAPTCHA verifier instance.
 * Firebase requires the verifier to be created ONCE, rendered, then reused.
 * Calling clear() + re-creating is only needed on fatal errors.
 */
let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(): RecaptchaVerifier {
  if (!recaptchaVerifierInstance) {
    recaptchaVerifierInstance = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved — signInWithPhoneNumber will proceed
        },
        "expired-callback": () => {
          // Token expired — clear so it gets recreated on next attempt
          clearRecaptchaVerifier();
        },
      }
    );
  }
  return recaptchaVerifierInstance;
}

export function clearRecaptchaVerifier() {
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch {}
    recaptchaVerifierInstance = null;
  }
}
