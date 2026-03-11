"use client";

import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("phone");
      setPhoneNumber("");
      setOtp(["", "", "", ""]);
      setTimer(30);
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
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {step === "otp" ? (
            <button onClick={() => setStep("phone")} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors duration-300">
              <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          ) : (
            <div className="w-9 h-9" /> // Spacer
          )}
          
          <h2 className="text-xl font-black text-casano-orange tracking-tight">Casano.in</h2>
          
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors duration-300">
            <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>
        </div>

        {/* Body Container */}
        <div className="p-8">
          {step === "phone" ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Log in or Sign up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 transition-colors duration-300">Enter your mobile number to get started</p>

              <div className="relative mb-6 text-left">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Mobile Number</label>
                <div className="flex items-center">
                  <div className="bg-gray-50 dark:bg-[#222] border border-gray-300 dark:border-gray-700 border-r-0 rounded-l-xl px-4 py-3.5 flex items-center justify-center transition-colors duration-300">
                    <span className="text-gray-900 dark:text-white font-bold transition-colors duration-300">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\\D/g, ''))}
                    placeholder="Enter 10 digit number"
                    className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-r-xl px-4 py-3.5 text-lg font-medium outline-none focus:border-casano-orange focus:ring-1 focus:ring-casano-orange transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
                    autoFocus
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep("otp")}
                disabled={phoneNumber.length !== 10}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors duration-300 ${
                  phoneNumber.length === 10 
                    ? 'bg-casano-orange hover:bg-casano-orange-dark text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 dark:bg-[#333] text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Verify OTP</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 transition-colors duration-300">
                Sent to <span className="font-bold text-gray-800 dark:text-gray-200">+91 {phoneNumber}</span>
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-14 h-14 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl text-center text-2xl font-bold focus:border-casano-orange focus:ring-2 focus:ring-casano-orange/20 outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button 
                onClick={() => {
                  /* MOCK LOGIN SUCCESS */
                  onClose(); 
                }}
                disabled={otp.some(d => d === "")}
                className={`w-full py-4 rounded-xl font-bold text-lg mb-4 transition-colors duration-300 ${
                  !otp.some(d => d === "")
                    ? 'bg-casano-green hover:bg-[#158233] text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 dark:bg-[#333] text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Verify & Proceed
              </button>

              <div className="text-sm font-medium">
                {timer > 0 ? (
                  <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Resend OTP in 00:{timer.toString().padStart(2, '0')}</span>
                ) : (
                  <button className="text-casano-orange hover:underline font-bold" onClick={() => setTimer(30)}>
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#222] p-4 text-center border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-300">
            By continuing, you agree to our <br/><a href="#" className="underline font-medium hover:text-gray-800 dark:hover:text-white transition-colors">Terms of service</a> & <a href="#" className="underline font-medium hover:text-gray-800 dark:hover:text-white transition-colors">Privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
