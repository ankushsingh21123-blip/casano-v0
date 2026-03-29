"use client";

import { useEffect, useState, useRef } from "react";
import { X, ArrowLeft, MapPin, User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = "google" | "email" | "phone";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loginWithEmail, sendPhoneOTP, verifyPhoneOTP, setProfile, isLoggedIn, authError, clearAuthError } = useAuth();

  const [step, setStep] = useState<"method" | "email" | "phone" | "otp" | "profile">("method");
  const [activeMethod, setActiveMethod] = useState<AuthMethod>("phone");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  // Profile fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("method");
      setEmail(""); setPassword(""); setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]); setTimer(30);
      setName(""); setAddress("");
      setIsLoading(false); setLocalError(null);
      clearAuthError();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close when Firebase login succeeds (unless we're in profile step)
  useEffect(() => {
    if (isLoggedIn && step !== "profile") {
      onClose();
    }
  }, [isLoggedIn, step, onClose]);

  // OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const error = localError || authError;

  const progressWidth =
    step === "method" ? "20%" : step === "email" || step === "phone" ? "50%" : step === "otp" ? "70%" : "100%";

  // ── OTP input helpers ────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setIsLoading(true);
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithGoogle();
      // onAuthStateChanged will update isLoggedIn → useEffect closes modal
    } catch {}
    setIsLoading(false);
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithEmail(email, password, isNewUser);
    } catch {}
    setIsLoading(false);
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) return;
    setIsLoading(true);
    setLocalError(null);
    clearAuthError();
    try {
      await sendPhoneOTP(`+91${phoneNumber}`);
      setStep("otp");
      setTimer(30);
    } catch {}
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setIsLoading(true);
    setLocalError(null);
    clearAuthError();
    try {
      await verifyPhoneOTP(code);
      setStep("profile");
    } catch {}
    setIsLoading(false);
  };

  const handleProfileSubmit = () => {
    setProfile(name.trim(), address.trim());
    onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          {step !== "method" ? (
            <button
              onClick={() => {
                if (step === "email" || step === "phone") setStep("method");
                else if (step === "otp") setStep("phone");
                else if (step === "profile") setStep("otp");
                setLocalError(null); clearAuthError();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Casano.in</h2>
            <p className="text-[11px] text-gray-400 font-medium">
              {step === "method" ? "Sign in / Sign up"
               : step === "email" ? "Email sign-in"
               : step === "phone" ? "Phone sign-in"
               : step === "otp" ? "Verify OTP"
               : "Your profile"}
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 dark:bg-[#333]">
          <div className="h-full bg-[#19c74a] transition-all duration-500" style={{ width: progressWidth }} />
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ── STEP: choose method ── */}
          {step === "method" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Log in or Sign up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Choose how you'd like to continue</p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 mb-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50"
              >
                {/* Google SVG icon */}
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.8 29.3 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21c11 0 20-8 20-20 0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7 13 19.6C14.8 15.2 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.8 29.3 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 47c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 38.5 26.8 39 24 39c-5.2 0-9.5-3-11.3-7.4l-6.6 5.1C9.7 43 16.3 47 24 47z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.9l6.2 5.2C40.8 36.4 45 31.6 45 26c0-1.3-.1-2.6-.4-6z"/>
                </svg>
                {isLoading ? "Signing in…" : "Continue with Google"}
              </button>

              {/* Phone */}
              <button
                onClick={() => setStep("phone")}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 mb-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all"
              >
                <Phone className="w-5 h-5 text-[#19c74a]" />
                Continue with Phone
              </button>

              {/* Email */}
              <button
                onClick={() => setStep("email")}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all"
              >
                <Mail className="w-5 h-5 text-[#19c74a]" />
                Continue with Email
              </button>
            </div>
          )}

          {/* ── STEP: email ── */}
          {step === "email" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {isNewUser ? "Create account" : "Welcome back"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {isNewUser ? "Sign up with your email address" : "Sign in with your email address"}
              </p>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-3.5 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-3.5 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isNewUser ? "Create a password (min 6 chars)" : "Your password"}
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3.5 bg-gray-50 dark:bg-[#222] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || !email || password.length < 6}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all mb-4 ${
                  !isLoading && email && password.length >= 6
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Please wait…" : isNewUser ? "Create Account" : "Sign In"}
              </button>

              <button
                onClick={() => { setIsNewUser((v) => !v); setLocalError(null); clearAuthError(); }}
                className="w-full text-sm text-center text-gray-500 hover:text-[#19c74a] transition-colors font-medium"
              >
                {isNewUser ? "Already have an account? Sign in" : "New to Casano? Create account"}
              </button>
            </div>
          )}

          {/* ── STEP: phone ── */}
          {step === "phone" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Enter your number</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">We'll send you a 6-digit OTP via SMS</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-4 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length !== 10}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  !isLoading && phoneNumber.length === 10
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Sending OTP…" : "Send OTP"}
              </button>
            </div>
          )}

          {/* ── STEP: otp ── */}
          {step === "otp" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Enter OTP</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Sent to <span className="font-bold text-gray-800 dark:text-gray-200">+91 {phoneNumber}</span>
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold focus:border-[#19c74a] focus:ring-2 focus:ring-[#19c74a]/20 outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.some((d) => d === "")}
                className={`w-full py-4 rounded-xl font-bold text-base mb-4 transition-all ${
                  !isLoading && !otp.some((d) => d === "")
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Verifying…" : "Verify & Continue"}
              </button>

              <div className="text-sm font-medium text-center">
                {timer > 0 ? (
                  <span className="text-gray-400">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
                ) : (
                  <button className="text-[#19c74a] hover:underline font-bold" onClick={handleSendOTP}>
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP: profile ── */}
          {step === "profile" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Complete your profile</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Help us deliver faster with your details</p>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-3.5 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                <div className="flex items-start border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#19c74a] transition-colors">
                  <div className="bg-gray-50 dark:bg-[#222] px-3.5 py-3.5 border-r border-gray-200 dark:border-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / House No, Area, City"
                    rows={3}
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileSubmit}
                disabled={!name.trim()}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  name.trim()
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                Save & Get Started
              </button>

              <button
                onClick={onClose}
                className="w-full mt-3 py-3 text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#222] p-4 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
            {" & "}
            <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
