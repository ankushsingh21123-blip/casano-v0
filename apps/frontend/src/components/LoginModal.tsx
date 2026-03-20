"use client";

import { useEffect, useState, useRef } from "react";
import { X, ArrowLeft, MapPin, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, setProfile } = useAuth();
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("phone");
      setPhoneNumber("");
      setOtp(["", "", "", ""]);
      setTimer(30);
      setName("");
      setAddress("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = () => {
    login(phoneNumber);
    setStep("profile");
  };

  const handleProfileSubmit = () => {
    setProfile(name.trim(), address.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden transition-colors">

        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          {step !== "phone" ? (
            <button
              onClick={() => {
                if (step === "otp") setStep("phone");
                else if (step === "profile") setStep("otp");
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
              {step === "phone" ? "Sign in" : step === "otp" ? "Verify OTP" : "Your profile"}
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 dark:bg-[#333]">
          <div
            className="h-full bg-[#19c74a] transition-all duration-500"
            style={{ width: step === "phone" ? "33%" : step === "otp" ? "66%" : "100%" }}
          />
        </div>

        {/* Body */}
        <div className="p-8">

          {/* Step 1: Phone */}
          {step === "phone" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Log in or Sign up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Enter your mobile number to get started</p>

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
                    onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={() => setStep("otp")}
                disabled={phoneNumber.length !== 10}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  phoneNumber.length === 10
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Enter OTP</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Sent to <span className="font-bold text-gray-800 dark:text-gray-200">+91 {phoneNumber}</span>
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: any) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e: any) => handleKeyDown(i, e)}
                    className="w-14 h-14 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-center text-2xl font-bold focus:border-[#19c74a] focus:ring-2 focus:ring-[#19c74a]/20 outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button
                onClick={handleOtpVerify}
                disabled={otp.some((d) => d === "")}
                className={`w-full py-4 rounded-xl font-bold text-base mb-4 transition-all ${
                  !otp.some((d) => d === "")
                    ? "bg-[#19c74a] hover:bg-[#15a83e] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 cursor-not-allowed"
                }`}
              >
                Verify & Continue
              </button>

              <div className="text-sm font-medium text-center">
                {timer > 0 ? (
                  <span className="text-gray-400">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
                ) : (
                  <button className="text-[#19c74a] hover:underline font-bold" onClick={() => setTimer(30)}>
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Profile Setup */}
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
                    onChange={(e: any) => setName(e.target.value)}
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
                    onChange={(e: any) => setAddress(e.target.value)}
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
