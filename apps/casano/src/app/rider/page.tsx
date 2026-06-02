'use client';

import { useState } from 'react';

export default function RiderApp() {
    const [orderId, setOrderId] = useState('');
    const [otp, setOtp] = useState('');
    const [deliveryOtp, setDeliveryOtp] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    // Handover specific states
    const [isScanning, setIsScanning] = useState(false);
    const [faceMatched, setFaceMatched] = useState(false);

    // Geofence / Delivery specific states
    const [lat, setLat] = useState('12.9716');
    const [lng, setLng] = useState('77.5946');
    const [photo, setPhoto] = useState<File | null>(null);

    const handleScanQR = () => {
        setIsScanning(true);
        setStatus('Scanning QR Code...');
        // Simulate scan success
        setTimeout(() => {
            setIsScanning(false);
            setStatus('✅ QR Scanned. Proceed to Face Match.');
        }, 1500);
    };

    const handleFaceMatch = (success: boolean) => {
        setStatus('Verifying Aadhar Face Match...');
        setTimeout(async () => {
            if (!success) {
                setStatus('❌ Face Match Failed: Identity mismatch!.');
                return;
            }
            setFaceMatched(true);
            setStatus('✅ Face Match Successful. Verifying Handover with Merchant API...');

            const res = await fetch(`/api/orders/${orderId}/verify-handover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qr_data: orderId, // Dummy: scan extracts orderId
                    face_match_success: true
                })
            });
            const data = await res.json();
            if (data.success) {
                setStatus('✅ Handover Verified. Show this OTP to Merchant.');
                setDeliveryOtp(data.otp);
            } else {
                setStatus(`❌ Handover Error: ${data.error}`);
            }
        }, 2000);
    };

    const handleDeliver = async () => {
        setStatus('Verifying Geofence & Delivery...');

        // In demo, we just pass dummy base64 url
        const photoUrl = photo ? URL.createObjectURL(photo) : 'dummy_photo.jpg';

        try {
            const res = await fetch(`/api/orders/${orderId}/deliver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rider_lat: parseFloat(lat),
                    rider_lng: parseFloat(lng),
                    photo_url: photoUrl
                })
            });
            const data = await res.json();
            if (data.success) {
                setStatus('✅ Delivery Successful! Geofence verified.');
            } else {
                setStatus(`❌ Error: ${data.error}`);
            }
        } catch {
            setStatus('❌ Network error during delivery.');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-orange-500">Rider Partner App</h1>
                <p className="text-neutral-400 text-sm">Strict Anti-Scam Logistics</p>
            </header>

            {/* HANDOVER PHASE */}
            {!deliveryOtp && (
                <div className="bg-neutral-800 p-5 rounded-xl shadow-lg space-y-5 mb-8 border border-neutral-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-neutral-700 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider">Phase 1: Pickup Handover</div>
                    <h2 className="text-lg font-bold text-white mb-2 pt-4">Secure Handover</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-400">Target Order ID</label>
                        <input
                            type="text"
                            className="w-full bg-neutral-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
                            placeholder="e.g. ord_123..."
                            value={orderId}
                            onChange={(e: any) => setOrderId(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleScanQR}
                            disabled={!orderId || isScanning}
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-bold py-2 rounded-lg shadow-sm transition-colors text-sm border border-neutral-600 disabled:opacity-50"
                        >
                            {isScanning ? 'Scanning...' : '📷 Scan Merchant QR'}
                        </button>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-neutral-700">
                        <button
                            onClick={() => handleFaceMatch(true)}
                            disabled={!orderId}
                            className="flex-1 bg-blue-900/50 hover:bg-blue-800/80 text-blue-300 font-bold py-2 rounded-lg shadow-sm transition-colors text-xs border border-blue-800 disabled:opacity-50"
                        >
                            👤 Face Match (Pass)
                        </button>
                        <button
                            onClick={() => handleFaceMatch(false)}
                            disabled={!orderId}
                            className="flex-1 bg-red-900/50 hover:bg-red-800/80 text-red-300 font-bold py-2 rounded-lg shadow-sm transition-colors text-xs border border-red-800 disabled:opacity-50"
                        >
                            ❌ Face Match (Fail)
                        </button>
                    </div>
                </div>
            )}

            {/* DELIVERY PHASE */}
            {deliveryOtp && (
                <div className="bg-emerald-950/30 p-5 rounded-xl shadow-lg space-y-5 border border-emerald-900/50 relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 bg-emerald-900 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider text-emerald-300">Phase 2: Final Delivery</div>
                    <h2 className="text-lg font-bold text-white mb-2 pt-4">Delivery Routing</h2>

                    <div className="bg-neutral-900 p-4 rounded-lg text-center border border-neutral-700">
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Show this OTP to Merchant</p>
                        <h3 className="text-3xl font-mono text-emerald-400 font-black tracking-widest">{deliveryOtp}</h3>
                    </div>

                    <div className="pt-4 border-t border-emerald-900">
                        <h3 className="text-sm font-semibold mb-3 text-neutral-300">Geofence Coordinates (Mock)</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs text-neutral-400 mb-1">Latitude</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-sm"
                                    value={lat}
                                    onChange={(e: any) => setLat(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-neutral-400 mb-1">Longitude</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-sm"
                                    value={lng}
                                    onChange={(e: any) => setLng(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-2">Within 50m of Merchant (12.9716, 77.5946) to succeed.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-400">Proof of Delivery (Photo)</label>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                            onChange={(e: any) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setPhoto(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <button
                        onClick={handleDeliver}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-shadow mt-4"
                    >
                        COMPLETE DELIVERY
                    </button>
                </div>
            )}

            {/* STATUS BAR */}
            {status && (
                <div className={`p-4 rounded-lg mt-4 text-center font-bold text-sm ${status.includes('Error') || status.includes('❌') ? 'bg-red-900/40 border border-red-500/30 text-rose-400' : 'bg-green-900/40 border border-green-500/30 text-emerald-400'}`}>
                    {status}
                </div>
            )}
        </div>
    );
}
