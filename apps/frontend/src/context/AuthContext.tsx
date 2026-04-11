"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider, getRecaptchaVerifier, clearRecaptchaVerifier, isFirebaseReady } from "@/lib/firebase";

// ─── Profile (stored locally alongside Firebase UID) ─────────────────────────
type LocalProfile = {
  name: string;
  address: string;
};

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextType {
  // Firebase user (null while loading or not logged in)
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLoggedIn: boolean;

  // Derived helpers (consistent with old API so other components don't break)
  user: { phone: string; name: string; address: string; email: string } | null;

  // Auth actions
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, isNew?: boolean) => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<void>;
  verifyPhoneOTP: (code: string) => Promise<void>;

  // Profile (name + address saved in localStorage)
  setProfile: (name: string, address: string) => void;
  logout: () => Promise<void>;

  // Error state
  authError: string | null;
  clearAuthError: () => void;

  // Deprecated shim — kept so old call-sites still compile
  login: (phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PROFILE_KEY = "casano_user_profile";

function loadProfile(): LocalProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: "", address: "" };
}

function saveProfile(p: LocalProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfileState] = useState<LocalProfile>({ name: "", address: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  // Phone auth confirmation result lives here between OTP send & verify
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    if (!isFirebaseReady) {
      // Firebase not configured — skip auth listener, allow app to load
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) setProfileState(loadProfile());
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Google ──────────────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseReady) { setAuthError("Auth is not configured. Please add Firebase credentials."); return; }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setAuthError(e.message ?? "Google sign-in failed.");
    }
  };

  // ── Email / Password ────────────────────────────────────────────────────────
  const loginWithEmail = async (email: string, password: string, isNew = false) => {
    setAuthError(null);
    try {
      if (isNew) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      const msg: Record<string, string> = {
        "auth/wrong-password": "Incorrect password.",
        "auth/user-not-found": "No account with that email. Try signing up.",
        "auth/email-already-in-use": "Email already in use. Try signing in.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Invalid email address.",
      };
      setAuthError(msg[e.code] ?? e.message ?? "Authentication failed.");
    }
  };

  // ── Phone OTP — step 1: send ─────────────────────────────────────────────────
  const sendPhoneOTP = async (phoneNumber: string) => {
    setAuthError(null);
    try {
      // Get (or create) the singleton reCAPTCHA verifier
      const verifier = getRecaptchaVerifier();

      // render() is safe to call multiple times — it's a no-op if already rendered
      await verifier.render();

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber, // must be E.164 format: "+91XXXXXXXXXX"
        verifier
      );
      confirmationRef.current = result;
    } catch (e: any) {
      // On any error clear the verifier so it's recreated fresh next attempt
      clearRecaptchaVerifier();

      const phoneErrors: Record<string, string> = {
        "auth/invalid-phone-number": "Invalid phone number. Use a 10-digit Indian number.",
        "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
        "auth/captcha-check-failed": "reCAPTCHA check failed. Please refresh the page and try again.",
        "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",
        "auth/user-disabled": "This phone number has been disabled.",
        "auth/missing-phone-number": "Please enter a phone number.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
      setAuthError(phoneErrors[e.code] ?? e.message ?? "Failed to send OTP. Please try again.");
      throw e;
    }
  };

  // ── Phone OTP — step 2: verify ───────────────────────────────────────────────
  const verifyPhoneOTP = async (code: string) => {
    setAuthError(null);
    if (!confirmationRef.current) {
      setAuthError("Session expired. Please resend the OTP.");
      return;
    }
    try {
      await confirmationRef.current.confirm(code);
      // On success clear the confirmation so it can't be reused
      confirmationRef.current = null;
    } catch (e: any) {
      const otpErrors: Record<string, string> = {
        "auth/invalid-verification-code": "Wrong OTP. Please check and try again.",
        "auth/code-expired": "OTP expired. Please request a new one.",
        "auth/session-expired": "Session expired. Please resend the OTP.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
      setAuthError(otpErrors[e.code] ?? "OTP verification failed. Please try again.");
      throw e;
    }
  };

  // ── Profile (local, persisted in localStorage) ───────────────────────────────
  const setProfile = (name: string, address: string) => {
    const p = { name, address };
    setProfileState(p);
    saveProfile(p);
    // Also update Firebase displayName if not already set
    if (firebaseUser && !firebaseUser.displayName && name) {
      updateProfile(firebaseUser, { displayName: name }).catch(() => {});
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setProfileState({ name: "", address: "" });
    localStorage.removeItem(PROFILE_KEY);
  };

  // ── Shim: old login(phone) call sites ────────────────────────────────────────
  const login = (_phone: string) => {
    // No-op shim. Real login now handled by sendPhoneOTP / verifyPhoneOTP.
    console.warn("[AuthContext] login() is deprecated. Use sendPhoneOTP/verifyPhoneOTP.");
  };

  const clearAuthError = () => setAuthError(null);

  // ── Derived user object (matches old API shape) ───────────────────────────────
  const user = firebaseUser
    ? {
        phone: firebaseUser.phoneNumber ?? "",
        email: firebaseUser.email ?? "",
        name: profile.name || firebaseUser.displayName || "",
        address: profile.address,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        loading,
        isLoggedIn: !!firebaseUser,
        user,
        loginWithGoogle,
        loginWithEmail,
        sendPhoneOTP,
        verifyPhoneOTP,
        setProfile,
        logout,
        authError,
        clearAuthError,
        login,
      }}
    >
      {/* Invisible reCAPTCHA anchor for Phone Auth */}
      <div id="recaptcha-container" />
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
