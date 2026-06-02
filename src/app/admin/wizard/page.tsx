'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeployWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [pincode, setPincode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [kiranas, setKiranas] = useState<any[]>([]);

    const handleScan = () => {
        if (!pincode || pincode.length < 6) return alert('Enter a valid 6-digit PIN');

        setIsScanning(true);
        setTimeout(() => {
            // Mock Google Places API Response
            setKiranas([
                { name: 'Sri Balaji Provision Store', distance: '120m', predictedVol: '85 orders/day' },
                { name: 'New Fresh Supermarket', distance: '400m', predictedVol: '120 orders/day' },
                { name: 'Ganesh General Store', distance: '750m', predictedVol: '45 orders/day' },
                { name: 'A-Z Daily Needs', distance: '900m', predictedVol: '110 orders/day' },
                { name: 'Mataji Kirana', distance: '1.2km', predictedVol: '90 orders/day' },
            ]);
            setIsScanning(false);
            setStep(2);
        }, 2000);
    };

    const handleDeploy = () => {
        setStep(3);
        setTimeout(() => {
            setStep(4);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Map Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                <div className="bg-neutral-950 p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h1 className="text-xl font-black text-emerald-500 tracking-tighter uppercase flex items-center gap-2">
                        <span className="text-2xl">⚡</span> Auto-Scale Node Deployer
                    </h1>
                    <span className="text-xs text-neutral-500 font-bold tracking-widest uppercase">Admin Wizard v2.1</span>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-2">Target a New Neighborhood</h2>
                            <p className="text-neutral-400 mb-8 text-sm">Enter a Pin Code to scan the local Grid for high-volume Kirana partners via Google Places API integration.</p>

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="e.g. 560102"
                                    value={pincode}
                                    onChange={(e: any) => setPincode(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 bg-black border border-neutral-700 rounded-xl px-6 py-4 text-2xl font-bold tracking-widest text-center focus:border-emerald-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${isScanning ? 'bg-neutral-800 text-neutral-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}
                            >
                                {isScanning ? '🛰️ Scanning Grid...' : 'Initiate Radar Scan'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl font-bold mb-2 text-emerald-400 flex items-center gap-2">
                                <span>Radar Complete</span>
                                <span className="text-sm bg-emerald-950 text-emerald-500 px-2 py-1 rounded">Pin {pincode}</span>
                            </h2>
                            <p className="text-neutral-400 mb-6 text-sm">Found 5 optimal anchor stores within a 1.5km radius. Estimated neighborhood break-even: <strong className="text-white">Day 14</strong>.</p>

                            <div className="space-y-3 mb-8">
                                {kiranas.map((k, i) => (
                                    <div key={i} className="flex justify-between items-center bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
                                        <div>
                                            <p className="font-bold text-white text-sm">{k.name}</p>
                                            <p className="text-xs text-emerald-500">Distance: {k.distance}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Est. Volume</p>
                                            <p className="font-mono text-indigo-400 font-bold">{k.predictedVol}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleDeploy}
                                className="w-full py-4 rounded-xl font-bold text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all"
                            >
                                Generate Ghost Profiles & Execute
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center h-[300px] animate-in fade-in duration-300">
                            <div className="w-16 h-16 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                            <h2 className="text-xl font-bold text-indigo-400 mb-2">Deploying Node...</h2>
                            <p className="text-xs text-neutral-500 font-mono text-center">
                                &gt; Scraping Google Places Metadata<br />
                                &gt; Allocating Server Resources<br />
                                &gt; Generating WhatsApp Onboarding links
                            </p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center h-[300px] animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                <span className="text-4xl text-emerald-500">✓</span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">Node Online</h2>
                            <p className="text-neutral-400 text-sm text-center mb-8 max-w-sm">
                                5 Merchant Profiles generated. Automated onboarding messages dispatched via WhatsApp.
                            </p>

                            <button
                                onClick={() => router.push('/admin/investor')}
                                className="bg-white hover:bg-neutral-200 text-black font-bold py-3 px-8 rounded-full transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
