'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { QRCodeCanvas } from 'qrcode.react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function MerchantDashboard() {
    const [merchant, setMerchant] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any>(null);
    const [reconciliation, setReconciliation] = useState<any>(null);

    // Z-Pattern Picking State
    const [activePickingOrder, setActivePickingOrder] = useState<any>(null);
    const [pickingItems, setPickingItems] = useState<any[]>([]);

    // Refs & State for Audio Notification
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isRinging, setIsRinging] = useState(false);

    // Poll for near-real-time updates
    useEffect(() => {
        // Initialize looping audio (We use a base64 encoded simple beep to avoid external asset dependencies in the demo)
        const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
        audio.loop = true;
        audioRef.current = audio;

        fetchData();

        // WebSockets SSE Listener
        const source = new EventSource('/api/stream');
        source.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'new_order') {
                    console.log('[SSE] New Order Alert!');
                    // Play loud notification!
                    setIsRinging(true);
                    audioRef.current?.play().catch(e => console.error("Audio block:", e));
                    fetchData();
                }

                if (data.type === 'product_updated') {
                    console.log('[SSE] Real-time merchant update', data);
                    if (data.ghostInventoryTriggered) {
                        alert(`GHOST INVENTORY PREVENTED!\nProduct ${data.product.name} physical stock dropped below app stock. Adjusted automatically.`);
                    }
                    fetchData();
                }
            } catch (e: any) { }
        };

        // Self-Healing Logic Loop: Check every 45 seconds
        const reconInterval = setInterval(() => {
            runReconciliation();
        }, 45000);

        return () => {
            source.close();
            clearInterval(reconInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchant]);

    const runReconciliation = async () => {
        if (!merchant) return;
        try {
            // Ask the backend if any products look suspicious
            const res = await fetch('/api/inventory/reconcile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchant_id: merchant.id })
            });
            const data = await res.json();
            if (data.needs_reconciliation && data.product) {
                setReconciliation(data.product);
            }
        } catch (e: any) { }
    };

    const handleReconResponse = async (stillHaveStock: boolean) => {
        if (!reconciliation || !merchant) return;

        if (!stillHaveStock) {
            // The merchant admits they don't have the stock. Heal the inventory.
            await handleUpdate(reconciliation.id, {
                is_live: false,
                app_reserved_stock: 0,
                safety_buffer: reconciliation.safety_buffer + 5 // Increase buffer
            });
            alert('Self-Healing Activated: Item hidden & safety buffer increased to prevent future ghosts.');
        } else {
            // They have it, just let them be
            alert('Verified physical stock. Store Reliability Score updated.');
        }

        setReconciliation(null);
    };

    const fetchData = async () => {
        const mRes = await fetch('/api/merchants/nearby');
        const mData = await mRes.json();
        if (mData.length > 0) {
            setMerchant(mData[0]);

            const pRes = await fetch(`/api/merchants/${mData[0].id}/products`);
            const pData = await pRes.json();
            setProducts(pData);

            const aRes = await fetch(`/api/merchants/${mData[0].id}/analytics`);
            const aData = await aRes.json();
            setAnalytics(aData);

            const oRes = await fetch(`/api/merchants/${mData[0].id}/orders`);
            const oData = await oRes.json();
            setPendingOrders(oData && oData.length > 0 ? oData : [{ id: 'DEMO-ORD-101' }]);

            const predRes = await fetch(`/api/merchants/${mData[0].id}/predictions`);
            const predData = await predRes.json();
            setPredictions(predData);

            // Initial check
            if (!reconciliation) runReconciliation();
        }
    };

    const handleUpdate = async (productId: string, updates: any) => {
        if (!merchant) return;
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
        await fetch(`/api/merchants/${merchant.id}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    };

    const simulateWalkIn = async (productId: string) => {
        await fetch('/api/webhooks/walk-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });
        // the SSE will trigger a refresh!
    };

    const chartData = {
        labels: analytics?.topMovers?.map((m: any) => m.name.substring(0, 15)) || [],
        datasets: [
            {
                label: 'Walk-in',
                data: analytics?.topMovers?.map((m: any) => m.walkin) || [],
                backgroundColor: 'rgba(249, 115, 22, 0.8)', // orange
            },
            {
                label: 'App',
                data: analytics?.topMovers?.map((m: any) => m.app) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald
            },
        ],
    };

    const acceptOrder = async (orderId: string) => {
        // Stop the ringing
        setIsRinging(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Generate a mock Z-Pattern picking route
        const mockItems = [
            { id: '1', name: "Dove Soap", qty: 3, physicalAisle: "A01", physicalSection: 5, shelfLevel: 2, picked: false },
            { id: '2', name: "Colgate MaxFresh", qty: 1, physicalAisle: "A01", physicalSection: 2, shelfLevel: 1, picked: false },
            { id: '3', name: "Britannia Bread", qty: 1, physicalAisle: "A02", physicalSection: 4, shelfLevel: 1, picked: false },
            { id: '4', name: "Amul Cheese Slices", qty: 1, physicalAisle: "A02", physicalSection: 1, shelfLevel: 2, picked: false },
        ];

        // Z-Pattern Sorting Algorithm (Frontend Mirror of Java Layer)
        const sortedItems = mockItems.sort((a, b) => {
            const aisleCompare = a.physicalAisle.localeCompare(b.physicalAisle);
            if (aisleCompare !== 0) return aisleCompare;

            const aisleNumber = parseInt(a.physicalAisle.replace(/\D/g, '')) || 1;
            const isOddAisle = (aisleNumber % 2 !== 0);

            if (isOddAisle) {
                const sectionCompare = a.physicalSection - b.physicalSection;
                if (sectionCompare !== 0) return sectionCompare;
            } else {
                const sectionCompare = b.physicalSection - a.physicalSection; // Z-Turn (walk backward)
                if (sectionCompare !== 0) return sectionCompare;
            }
            return a.shelfLevel - b.shelfLevel;
        });

        setActivePickingOrder({ id: orderId });
        setPickingItems(sortedItems);

        // Optimistically remove from pending (usually handled by SSE)
        setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const toggleItemPick = (itemId: string) => {
        setPickingItems(prev => prev.map(item => item.id === itemId ? { ...item, picked: !item.picked } : item));
    };

    const confirmPacking = () => {
        alert(`Order ${activePickingOrder?.id} packed efficiently! Ready for Rider Pickup OTP.`);
        setActivePickingOrder(null);
        setPickingItems([]);
    };

    // Wallet State
    const [isSettling, setIsSettling] = useState(false);
    const [settledAmount, setSettledAmount] = useState(0);
    const [isHappyHour, setIsHappyHour] = useState(false);

    const handleSettlement = () => {
        setIsSettling(true);
        setTimeout(() => {
            setSettledAmount(prev => prev + (analytics?.summary.finalProfit || 0));
            // In a real app, this would deduct the pending balance, but for demo effect we'll just show the success state.
            alert('Settlement Initiated. Funds will hit the registered bank account in ~2 hours.');
            setIsSettling(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8 font-sans">

            {/* The Self-Healing Modal */}
            {reconciliation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse"></div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-amber-500">🛡️</span> Quick Check
                        </h3>
                        <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
                            Our data algorithm flagged <strong className="text-white">{reconciliation.name}</strong> as highly volatile right now. Do you still physically have <strong className="text-amber-400">{reconciliation.app_reserved_stock} units</strong> set aside for the App?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => handleReconResponse(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
                                Yes, I have it
                            </button>
                            <button onClick={() => handleReconResponse(false)} className="flex-1 bg-neutral-700 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors">
                                No (Hide Item)
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <header className="mb-6 flex justify-between items-end border-b border-neutral-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Merchant OS</h1>
                    <p className="text-neutral-400 font-medium">{merchant ? merchant.name : 'Loading...'}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <p className="text-xs text-green-500 font-mono tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Sync Active
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                            Volume Driver
                        </span>
                        <button
                            onClick={() => setIsHappyHour(!isHappyHour)}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${isHappyHour
                                ? 'bg-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                }`}
                        >
                            {isHappyHour ? '⚡ Happy Hour ON (-5% Margin)' : 'Happy Hour OFF'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Financial Analytics & Wallet */}
            {analytics && (
                <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-md">
                        <h2 className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">Total Revenue</h2>
                        <p className="text-2xl font-black text-white">₹{analytics.summary.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-md">
                        <h2 className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">Platform Fee (5%)</h2>
                        <p className="text-2xl font-black text-orange-400">₹{analytics.summary.platformCommission.toFixed(2)}</p>
                    </div>

                    {/* The Settlement Wallet Widget */}
                    <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-md col-span-1 md:col-span-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Pending Settlement (Today)</h2>
                            <p className="text-3xl font-black text-emerald-400">
                                ₹{Math.max(0, analytics.summary.finalProfit - settledAmount).toFixed(2)}
                            </p>
                            {settledAmount > 0 && (
                                <p className="text-xs text-neutral-400 mt-1">
                                    <span className="text-emerald-500">✓ Settled:</span> ₹{settledAmount.toFixed(2)}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSettlement}
                            disabled={isSettling || analytics.summary.finalProfit <= settledAmount}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow border ${isSettling
                                ? 'bg-neutral-700 text-neutral-400 border-neutral-600'
                                : analytics.summary.finalProfit <= settledAmount
                                    ? 'bg-neutral-800 text-neutral-500 border-neutral-700 opacity-50 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                }`}
                        >
                            {isSettling ? 'Processing...' : 'Settle to Bank 🏦'}
                        </button>
                    </div>
                </section>
            )}

            {/* Pending Handovers (QR Scanner) */}
            {pendingOrders.length > 0 && (
                <section className={`mb-8 p-6 rounded-2xl border ${isRinging ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.4)] animate-pulse' : 'bg-transparent border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            {isRinging ? '🚨 NEW ORDER ALERT' : 'Pending Handovers 🚴‍♂️'}
                        </h2>
                        {isRinging && <span className="text-rose-400 text-xs font-mono font-bold uppercase tracking-widest bg-rose-950 px-3 py-1 rounded-full">T-120s to Failover</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingOrders.map(order => (
                            <div key={order.id} className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-md flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-lg">
                                        <QRCodeCanvas value={order.id} size={80} level="H" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400 font-bold uppercase mb-1">Order</p>
                                        <p className="text-sm font-mono text-neutral-200 truncate w-32 mb-2" title={order.id}>{order.id}</p>
                                        <span className="bg-orange-950 text-orange-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Awaiting Acceptance
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => acceptOrder(order.id)}
                                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${isRinging ? 'bg-rose-600 hover:bg-rose-500 text-white animate-bounce' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                                >
                                    {isRinging ? 'ACCEPT NOW' : 'Start Picking (Z-Pattern)'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Active Z-Pattern Picking UI */}
            {activePickingOrder && (
                <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold justify-between items-center text-white flex gap-3">
                                <span className="text-indigo-400">⚡</span>
                                Z-Pattern Active Route
                            </h2>
                            <p className="text-sm text-indigo-300 font-mono mt-1">Order ID: {activePickingOrder.id}</p>
                        </div>
                        <div className="text-right">
                            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {pickingItems.filter(i => i.picked).length} / {pickingItems.length} Picked
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-blue-500 before:to-emerald-500">
                        {pickingItems.map((item, index) => (
                            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Icon */}
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-20 ${item.picked ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                                    {item.picked ? <span className="text-white font-bold">✓</span> : <span className="text-white text-sm font-bold">{index + 1}</span>}
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-neutral-800/80 backdrop-blur-sm shadow-md transition-all cursor-pointer"
                                    style={{ borderColor: item.picked ? '#10b981' : '#4f46e5' }}
                                    onClick={() => toggleItemPick(item.id)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-lg ${item.picked ? 'text-neutral-500 line-through' : 'text-white'}`}>{item.name}</h3>
                                        <span className={`text-sm font-black px-2 py-0.5 rounded ${item.picked ? 'bg-neutral-700 text-neutral-400' : 'bg-indigo-900 text-indigo-300'}`}>x{item.qty}</span>
                                    </div>
                                    <div className="flex gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                                        <span className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-amber-500">Aisle {item.physicalAisle}</span>
                                        <span className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-blue-400">Sec {item.physicalSection}</span>
                                        <span className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-rose-400">Lvl {item.shelfLevel}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center pt-6 border-t border-indigo-500/30">
                        <button
                            onClick={confirmPacking}
                            disabled={pickingItems.filter(i => i.picked).length !== pickingItems.length}
                            className={`px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl uppercase tracking-widest ${pickingItems.filter(i => i.picked).length === pickingItems.length
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-900 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                                }`}
                        >
                            Confirm Packing & Print Bill
                        </button>
                    </div>
                </section>
            )}

            {/* Top Movers Chart */}
            <section className="mb-8 bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-xl max-w-4xl">
                <h2 className="text-lg font-bold mb-4">Top Movers (Live)</h2>
                <div className="h-64">
                    <Bar
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            scales: {
                                x: { stacked: true, grid: { color: '#404040' } },
                                y: { stacked: true, grid: { color: '#404040' } }
                            },
                            plugins: { legend: { labels: { color: '#fff' } } }
                        }}
                    />
                </div>
            </section>

            {/* Inventory Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Live Inventory Control</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => {
                        const pred = predictions?.predictions?.find((p: any) => p.id === product.id);

                        const isLowStock = product.app_reserved_stock <= product.safety_buffer;
                        const isAutoRestock = pred?.status === 'High Demand';

                        return (
                            <div
                                key={product.id}
                                className={`p-5 rounded-xl shadow-lg border transition-all ${isLowStock ? 'bg-red-950/30 border-red-500/50' : 'bg-neutral-800 border-neutral-700'
                                    } hover:border-neutral-500`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight mb-1">{product.name}</h3>
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wide bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full">{product.category}</span>
                                            {isAutoRestock && (
                                                <span className="text-[10px] font-bold uppercase tracking-wide bg-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]">High Demand</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Live Toggle */}
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{product.is_live ? 'Live' : 'Hidden'}</span>
                                        <button
                                            onClick={() => handleUpdate(product.id, { is_live: !product.is_live })}
                                            className={`w-14 h-7 rounded-full relative transition-colors duration-300 shadow-inner ${product.is_live ? 'bg-emerald-500' : 'bg-neutral-600'}`}
                                        >
                                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${product.is_live ? 'translate-x-8' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-neutral-900 rounded-lg p-3 border border-neutral-700">
                                        <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Physical Stock</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-black">{product.total_stock}</span>
                                            <button onClick={() => simulateWalkIn(product.id)} className="bg-neutral-700 hover:bg-neutral-600 px-2 py-1 rounded text-xs font-bold transition-colors">Sell 1</button>
                                        </div>
                                    </div>
                                    <div className="bg-neutral-900 rounded-lg p-3 border border-neutral-700 flex flex-col justify-center">
                                        <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1 flex justify-between">
                                            App-Bin
                                            {isLowStock && <span className="text-red-400">⚠️</span>}
                                        </p>
                                        <input
                                            type="number"
                                            value={product.app_reserved_stock}
                                            onChange={(e: any) => handleUpdate(product.id, { app_reserved_stock: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-neutral-800 text-white font-bold text-lg rounded border border-neutral-600 focus:border-emerald-500 focus:outline-none px-2 py-0.5 transition-colors"
                                        />
                                    </div>
                                </div>

                                {isAutoRestock && (
                                    <div className="mt-2 text-center">
                                        <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-md">
                                            ⚡ Restock {pred.recommendedReorder} units from DMart
                                        </button>
                                        <p className="text-[10px] text-rose-400 mt-1">Velocity: {pred.velocityPerDay}/day</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
