"use client";

import { useEffect, useState, useRef } from "react";
import { X, ArrowLeft, MapPin, User, Phone, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Firebase refs — loaded lazily to avoid SSR issues
  const confirmationRef = useRef<any>(null);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("phone"); setPhoneNumber(""); setOtp(["","","","","",""]);
      setTimer(30); setName(""); setError("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  /* ─── Exchange Firebase idToken with backend ─── */
  const exchangeToken = async (firebaseUser: any) => {
    const idToken = await firebaseUser.getIdToken(true);
    const res = await fetch(`${BACKEND}/api/auth/firebase-exchange`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) throw new Error("Backend exchange failed");
    await refreshUser();
  };

  /* ─── Send OTP ─── */
  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) return;
    setLoading(true); setError("");
    try {
      const { auth, getRecaptchaVerifier } = await import("@/lib/firebase");
      const { signInWithPhoneNumber } = await import("firebase/auth");
      if (!auth) throw new Error("Firebase not configured");

      if (!recaptchaRef.current) recaptchaRef.current = getRecaptchaVerifier();

      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, recaptchaRef.current);
      confirmationRef.current = confirmation;
      setStep("otp"); setTimer(30);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      // Clear bad recaptcha
      try {
        const { clearRecaptchaVerifier } = await import("@/lib/firebase");
        clearRecaptchaVerifier();
        recaptchaRef.current = null;
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  /* ─── Verify OTP ─── */
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6 || !confirmationRef.current) return;
    setLoading(true); setError("");
    try {
      const result = await confirmationRef.current.confirm(code);
      await exchangeToken(result.user);
      // Check if new user (no name) → show profile step, else close
      if (!result.user.displayName) {
        setStep("profile");
      } else {
        onClose();
      }
    } catch (err: any) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google Sign-In ─── */
  const handleGoogleSignIn = async () => {
    setLoading(true); setError("");
    try {
      const { auth, googleProvider } = await import("@/lib/firebase");
      const { signInWithPopup } = await import("firebase/auth");
      if (!auth || !googleProvider) throw new Error("Firebase not configured");
      const result = await signInWithPopup(auth, googleProvider);
      await exchangeToken(result.user);
      onClose();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Save Profile ─── */
  const handleProfileSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch(`${BACKEND}/api/auth/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name.trim() }),
      });
      await refreshUser();
      onClose();
    } catch {}
    finally { setLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const resendOtp = async () => {
    setOtp(["","","","","",""]); setError("");
    await handleSendOtp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Invisible recaptcha container */}
      <div id="recaptcha-container" />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden">

        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          {step !== "phone" ? (
            <button onClick={() => { if (step === "otp") setStep("phone"); else setStep("otp"); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          ) : <div className="w-9 h-9" />}

          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Casano.in</h2>
            <p className="text-[11px] text-gray-400 font-medium">
              {step === "phone" ? "Sign in" : step === "otp" ? "Verify OTP" : "Your profile"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full">
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-gray-100 dark:bg-[#333]">
          <div className="h-full bg-[#19c74a] transition-all duration-500"
            style={{ width: step === "phone" ? "33%" : step === "otp" ? "66%" : "100%" }} />
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Phone */}
          {step === "phone" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Log in or Sign up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your mobile number to get started</p>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-4 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">+91</span>
                  </div>
                  <input type="tel" maxLength={10} value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number" autoFocus
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400"
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                  />
                </div>
              </div>

              <button onClick={handleSendOtp} disabled={phoneNumber.length !== 10 || loading}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 mb-4 ${
                  phoneNumber.length === 10 && !loading ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md" : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <><Phone className="w-4 h-4" />Continue with OTP</>}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>

              <button onClick={handleGoogleSignIn} disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-base border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-[#222]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Enter OTP</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Sent to <span className="font-bold text-gray-800 dark:text-gray-200">+91 {phoneNumber}</span>
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => { inputRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-12 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold focus:border-[#19c74a] focus:ring-2 focus:ring-[#19c74a]/20 outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button onClick={handleVerifyOtp} disabled={otp.some(d => d === "") || loading}
                className={`w-full py-4 rounded-xl font-bold text-base mb-4 transition-all flex items-center justify-center gap-2 ${
                  !otp.some(d => d === "") && !loading ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md" : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</> : "Verify & Continue"}
              </button>

              <div className="text-sm font-medium text-center">
                {timer > 0
                  ? <span className="text-gray-400">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
                  : <button className="text-[#19c74a] hover:underline font-bold" onClick={resendOtp}>Resend OTP</button>
                }
              </div>
            </div>
          )}

          {/* Step 3: Profile */}
          {step === "profile" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Complete your profile</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Help us deliver faster</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a]">
                  <div className="bg-gray-50 dark:bg-[#222] px-3.5 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name" autoFocus
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400"
                    onKeyDown={e => e.key === "Enter" && handleProfileSubmit()}
                  />
                </div>
              </div>

              <button onClick={handleProfileSubmit} disabled={!name.trim() || loading}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  name.trim() && !loading ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md" : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}>
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Save & Get Started
              </button>
              <button onClick={onClose} className="w-full mt-3 py-3 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors">
                Skip for now
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-[#222] p-4 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-600">Terms</a> &{" "}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
