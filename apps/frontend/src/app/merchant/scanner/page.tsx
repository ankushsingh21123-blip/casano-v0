'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MagicScanner() {
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [parsedItems, setParsedItems] = useState<any[]>([]);
    const [step, setStep] = useState(1);

    const simulateScan = async () => {
        setScanning(true);
        // Call our mock API
        const res = await fetch('/api/vision/parse', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
            setParsedItems(data.items);
            setStep(2);
        }
        setScanning(false);
    };

    const calculateProfit = (mrp: number, cp: number) => {
        const margin = ((mrp - cp) / mrp) * 100;
        return margin.toFixed(1);
    };

    const pushLive = () => {
        alert('Items bulk uploaded and pushed LIVE to the Hyperlocal App!');
        router.push('/merchant');
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-rose-600 tracking-tight">Magic Onboarding ⚡</h1>
                <p className="text-neutral-500 text-sm mt-1">Point, Shoot, and Sell. Zero manual data entry.</p>
            </header>

            {step === 1 && (
                <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 mt-12 text-center">

                    <div className="w-32 h-32 mx-auto bg-neutral-100 rounded-full flex flex-col items-center justify-center border-4 border-dashed border-rose-200 mb-6 relative overflow-hidden">
                        {scanning && <div className="absolute top-0 left-0 w-full h-2 bg-emerald-400 animate-bounce"></div>}
                        <span className="text-4xl">{scanning ? '🔍' : '📸'}</span>
                    </div>

                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                        {scanning ? 'Extracting Data...' : 'Snap Wholesale Invoice'}
                    </h2>
                    <p className="text-sm text-neutral-500 mb-8">
                        {scanning ? 'Our Computer Vision model is reading line items and cross-referencing global MRP databases.' : 'Upload a photo of your recent distributor invoice or store shelf.'}
                    </p>

                    <button
                        onClick={simulateScan}
                        disabled={scanning}
                        className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                    >
                        {scanning ? 'SCANNING...' : 'TAKE PHOTO'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-emerald-800">✅ 4 Items Extracted Successfully</h3>
                            <p className="text-emerald-600 text-xs">Review recognized SKUs before publishing to your storefront.</p>
                        </div>
                        <button onClick={pushLive} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg text-sm shadow-md transition-colors">
                            BULK PUBLISH LIVE
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-widest">
                                    <th className="p-4">SKU / Product Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-center">Qty Detected</th>
                                    <th className="p-4 text-right">Unit Cost</th>
                                    <th className="p-4 text-right">MRP (Selling)</th>
                                    <th className="p-4 text-right">Margin</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {parsedItems.map((item, idx) => (
                                    <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                                        <td className="p-4 font-bold text-neutral-800">
                                            {item.name}
                                            <div className="text-[10px] text-emerald-600 font-mono mt-1">AI Match: {item.confidence * 100}%</div>
                                        </td>
                                        <td className="p-4 text-neutral-600 text-xs">{item.category}</td>
                                        <td className="p-4 text-center font-mono font-bold">{item.qty}</td>
                                        <td className="p-4 text-right text-neutral-500">₹{item.cost_price}</td>
                                        <td className="p-4 text-right font-bold text-rose-600">₹{item.mrp}</td>
                                        <td className="p-4 text-right">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                                {calculateProfit(item.mrp, item.cost_price)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-xs text-neutral-400 mt-6 flex items-center justify-center gap-1 font-mono">
                        Powered by Hybrid OCR + Universal Catalog DB
                    </p>
                </div>
            )}
        </div>
    );
}
