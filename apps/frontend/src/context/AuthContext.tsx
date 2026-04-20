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
  updateProfile,
} from "firebase/auth";
import { auth, getRecaptchaVerifier, clearRecaptchaVerifier, isFirebaseReady } from "@/lib/firebase";
import { FirebaseService } from "@/services/firebase.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ─── Profile Type ────────────────────────────────────────────────────────────
type LocalProfile = {
  name: string;
  address: string;
};

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  user: { phone: string; name: string; address: string; email: string } | null;

  // Auth actions
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, isNew?: boolean) => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<void>;
  verifyPhoneOTP: (code: string) => Promise<void>;

  // Profile
  setProfile: (name: string, address: string) => void;
  logout: () => Promise<void>;

  // Error state
  authError: string | null;
  clearAuthError: () => void;
  
  // Deprecated shim
  login: (phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Advanced Hook: Persistent Profile Management
  const [profile, setProfileState] = useLocalStorage<LocalProfile>("casano_user_profile", { name: "", address: "" });

  // UseRef: Handle OTP confirmation result between steps
  const confirmationRef = useRef<any>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    if (!isFirebaseReady) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Google ──────────────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseReady) { setAuthError("Auth is not configured."); return; }
    try {
      await FirebaseService.loginWithGoogle();
    } catch (e: any) {
      setAuthError(e.message ?? "Google sign-in failed.");
    }
  };

  // ── Email / Password ────────────────────────────────────────────────────────
  const loginWithEmail = async (email: string, password: string, isNew = false) => {
    setAuthError(null);
    try {
      await FirebaseService.loginWithEmail(email, password, isNew);
    } catch (e: any) {
      const msg: Record<string, string> = {
        "auth/wrong-password": "Incorrect password.",
        "auth/user-not-found": "No account with that email.",
        "auth/email-already-in-use": "Email already in use.",
      };
      setAuthError(msg[e.code] ?? e.message ?? "Authentication failed.");
    }
  };

  // ── Phone OTP ───────────────────────────────────────────────────────────────
  const sendPhoneOTP = async (phoneNumber: string) => {
    setAuthError(null);
    try {
      const verifier = getRecaptchaVerifier();
      await verifier.render();
      const result = await FirebaseService.sendPhoneOTP(phoneNumber, verifier);
      confirmationRef.current = result;
    } catch (e: any) {
      clearRecaptchaVerifier();
      setAuthError(e.message ?? "Failed to send OTP.");
      throw e;
    }
  };

  const verifyPhoneOTP = async (code: string) => {
    setAuthError(null);
    if (!confirmationRef.current) {
      setAuthError("Session expired.");
      return;
    }
    try {
      await FirebaseService.verifyPhoneOTP(confirmationRef.current, code);
      confirmationRef.current = null;
    } catch (e: any) {
      setAuthError("OTP verification failed.");
      throw e;
    }
  };

  // ── Profile ─────────────────────────────────────────────────────────────────
  const setProfile = (name: string, address: string) => {
    setProfileState({ name, address });
    if (firebaseUser && !firebaseUser.displayName && name) {
      updateProfile(firebaseUser, { displayName: name }).catch(() => {});
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    await FirebaseService.logout();
    setProfileState({ name: "", address: "" });
  };

  const login = (_phone: string) => {
    console.warn("[AuthContext] login() is deprecated.");
  };

  const clearAuthError = () => setAuthError(null);

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
      <div id="recaptcha-container" />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
