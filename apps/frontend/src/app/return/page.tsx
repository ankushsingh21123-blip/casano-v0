'use client';

import { useState } from 'react';

export default function ReturnPortal() {
    const [orderId, setOrderId] = useState('');
    const [category, setCategory] = useState('Stationery');
    const [reason, setReason] = useState('Damaged');
    const [photo, setPhoto] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [spoofLocation, setSpoofLocation] = useState(false);

    const handleSubmit = async () => {
        setStatus('Analyzing Video/Photo Metadata via AI...');

        const photoUrl = photo ? URL.createObjectURL(photo) : '';

        // Simulated Metadata extraction
        const metadata_lat = spoofLocation ? '28.7041' : '12.9716'; // Spoof: Delhi vs Delivery: Bglr
        const metadata_lng = spoofLocation ? '77.1025' : '77.5946';

        setTimeout(async () => {
            try {
                const res = await fetch('/api/returns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: orderId,
                        reason,
                        product_category: category,
                        photo_url: photoUrl,
                        metadata_lat,
                        metadata_lng
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setStatus('✅ Return Request Accepted! Pending Verification.');
                } else {
                    setStatus(`❌ Rejected: ${data.error}`);
                }
            } catch {
                setStatus('❌ Network error during return process.');
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-rose-50 text-neutral-900 p-6 font-sans">
            <header className="mb-8 text-center pt-8">
                <h1 className="text-2xl font-bold text-rose-600">Strict Return Portal</h1>
                <p className="text-neutral-500 text-sm">Anti-Fraud Validation</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-xl space-y-5 max-w-md mx-auto border border-rose-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg tracking-widest uppercase">
                    Dispute Logic
                </div>

                <h2 className="text-lg font-bold text-neutral-800 pt-3 mb-2 border-b border-rose-100 pb-2">File a Return</h2>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-neutral-700">Order ID</label>
                    <input
                        type="text"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-sm"
                        placeholder="e.g. ord_123..."
                        value={orderId}
                        onChange={(e: any) => setOrderId(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-neutral-700">Product Category</label>
                    <select
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                    >
                        <option value="Stationery">Stationery (2-hr window)</option>
                        <option value="Daily Essentials">Daily Essentials</option>
                        <option value="Marts">Marts / General</option>
                        <option value="Perishable">Perishable (Strict: Damaged only)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-neutral-700">Reason for Return</label>
                    <select
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        value={reason}
                        onChange={(e: any) => setReason(e.target.value)}
                    >
                        <option value="Damaged">Item is Damaged</option>
                        <option value="Wrong Item">Wrong Item Delivered</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-neutral-700">Upload Unboxing Video/Photo (Required)</label>
                    <div className="border-2 border-dashed border-rose-200 rounded-xl p-4 text-center bg-rose-50/50 hover:bg-rose-100/50 transition-colors">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 cursor-pointer"
                            onChange={(e: any) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setPhoto(e.target.files[0]);
                                }
                            }}
                        />
                        <p className="text-[10px] text-neutral-400 mt-2 font-medium">Metadata will be cross-referenced with Rider's Delivery Photo location.</p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-red-600 rounded"
                            checked={spoofLocation}
                            onChange={(e: any) => setSpoofLocation(e.target.checked)}
                        />
                        <span className="text-sm font-bold text-neutral-700 ">Simulate Scam (Spoof Location Data)</span>
                    </label>
                    <p className="text-[10px] text-neutral-500 ml-7 mt-1">If checked, AI extraction will intentionally mimic an Unboxing photo uploaded from &gt;5km away from the actual delivery geofence.</p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] hover:bg-rose-500 transition-all mt-6 active:scale-[0.98]"
                >
                    SUBMIT DISPUTE
                </button>

                {status && (
                    <div className={`p-4 rounded-xl mt-4 text-center font-bold text-sm shadow-inner transition-all ${status.includes('Error') || status.includes('❌') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
