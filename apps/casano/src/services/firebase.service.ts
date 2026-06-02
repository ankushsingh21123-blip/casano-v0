import { auth, googleProvider } from "@/lib/firebase";
import { 
  signOut, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier
} from "firebase/auth";

/**
 * Service to handle all Firebase Authentication logic.
 * Demonstrates: Service Pattern, Separation of Concerns.
 */
export const FirebaseService = {
  logout: async () => {
    return signOut(auth);
  },

  loginWithGoogle: async () => {
    return signInWithPopup(auth, googleProvider);
  },

  loginWithEmail: async (email: string, password: string, isNew = false) => {
    if (isNew) {
      return createUserWithEmailAndPassword(auth, email, password);
    } else {
      return signInWithEmailAndPassword(auth, email, password);
    }
  },

  sendPhoneOTP: async (phoneNumber: string, verifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  },

  verifyPhoneOTP: async (confirmationResult: ConfirmationResult, code: string) => {
    return confirmationResult.confirm(code);
  }
};
