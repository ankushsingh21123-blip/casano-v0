'use client';

import { useState } from 'react';

export default function RiderOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [shaktiValid, setShaktiValid] = useState(false);

    const simulateGovVerification = () => {
        setLoading(true);
        setTimeout(() => {
            setShaktiValid(true);
            setLoading(false);
            setStep(2);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-rose-50 font-sans p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">

                <div className="bg-rose-600 p-6 text-center">
                    <h1 className="text-2xl font-black text-white tracking-widest uppercase">Shakti Fleet</h1>
                    <p className="text-rose-100 text-xs mt-1">Karnataka Women&apos;s Logistics Network</p>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <p className="text-sm text-orange-800 font-bold mb-2">Step 1: Identity & Scheme Eligibility</p>
                                <p className="text-xs text-orange-600">Please upload your Aadhar Card and Karnataka State Domicile proof to verify Shakti Scheme eligibility.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Aadhar Number</label>
                                    <input type="text" placeholder="XXXX XXXX XXXX" className="w-full mt-1 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm" />
                                </div>

                                <div className="border-2 border-dashed border-rose-200 rounded-xl p-4 text-center bg-rose-50/50">
                                    <span className="text-xs font-bold text-rose-500">📸 Upload ID Document</span>
                                </div>
                            </div>

                            <button
                                onClick={simulateGovVerification}
                                disabled={loading}
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 flex justify-center items-center"
                            >
                                {loading ? <span className="animate-pulse">VERIFYING WITH GOV DB...</span> : 'VERIFY IDENTITY'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-green-200">
                                ✓
                            </div>
                            <h2 className="text-xl font-bold text-neutral-800">Welcome to the Fleet!</h2>
                            <p className="text-sm text-neutral-500">Your Shakti Scheme eligibility is verified. You are now authorized to accept local neighborhood deliveries with guaranteed zero-commission structural payouts.</p>

                            <div className="bg-neutral-900 rounded-xl p-5 mt-6 relative overflow-hidden text-left shadow-lg">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                <h3 className="text-white font-bold text-sm mb-2">Live SOS & Safety Link</h3>
                                <p className="text-neutral-400 text-xs mb-4">Your real-time GPS location is actively shared with your assigned Merchant Partner and the Central Dispatch Hub when on-duty.</p>

                                <button
                                    onClick={() => alert('🚨 SOS TRIGGERED! Location dispatched to Central Hub and Merchant immediately!')}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-colors grid place-items-center"
                                >
                                    HOLD FOR SOS
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
