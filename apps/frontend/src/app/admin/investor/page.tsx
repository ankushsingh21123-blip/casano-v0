'use client';

import { useEffect, useState } from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function InvestorDashboard() {
    const [kpis, setKpis] = useState<any>(null);

    // Simulator State
    const [aov, setAov] = useState(400);
    const [deliveryCost, setDeliveryCost] = useState(15); // Default to Shakti
    const [commission, setCommission] = useState(12); // %
    const [marketing, setMarketing] = useState(10); // ₹ per order

    useEffect(() => {
        const fetchKpis = async () => {
            const res = await fetch('/api/admin/kpis');
            const data = await res.json();
            setKpis(data);
        };
        fetchKpis();
    }, []);

    const chartData = {
        labels: ['1 Dark Store', '10 Partner Shops (Us)'],
        datasets: [
            {
                label: 'Monthly Fixed Cost (Rent & Ops) - ₹',
                data: [200000, 0], // 2 Lakhs vs 0
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)', // Red for Dark Store
                    'rgba(16, 185, 129, 0.7)', // Green for Us
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(16, 185, 129)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#e5e7eb' }
            },
            title: {
                display: true,
                text: 'The Ultimate Leverage: CapEx Comparison',
                color: '#f3f4f6',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' }
            }
        }
    };

    // Simulator Logic
    const grossMargin = aov * (commission / 100);
    const contributionMargin = grossMargin - deliveryCost - marketing;
    const fixedCostPerNode = 4000; // Mock minimal server/ops cost per neighborhood
    const breakEvenOrders = contributionMargin > 0 ? Math.ceil(fixedCostPerNode / contributionMargin) : 'Never';

    if (!kpis) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading Oversight Matrix...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 md:p-12">
            <header className="mb-10 text-center md:text-left flex justify-between items-end border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tight">Oversight Matrix</h1>
                    <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest font-bold">Investor Relations Dashboard</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-neutral-600 text-xs font-mono">LIVE // {new Date().toISOString().substring(0, 10)}</p>
                </div>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">AOV</p>
                    <p className="text-3xl font-black text-emerald-400">₹{kpis.aov}</p>
                    <p className="text-[10px] text-neutral-600 mt-2 font-mono">Average Order Value</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-cyan-500"></div>
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">CAC</p>
                    <p className="text-3xl font-black text-cyan-400">₹{kpis.cac}</p>
                    <p className="text-[10px] text-neutral-600 mt-2 font-mono">Customer Acquisition Cost</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Network Sales Split</p>
                    <div className="flex gap-4 items-end mt-1">
                        <div>
                            <p className="text-2xl font-black text-indigo-400">68%</p>
                            <p className="text-[9px] text-neutral-500 font-mono">BlinkIt Native</p>
                        </div>
                        <div className="h-6 w-px bg-neutral-700"></div>
                        <div>
                            <p className="text-2xl font-black text-amber-500">32%</p>
                            <p className="text-[9px] text-neutral-500 font-mono">ONDC Partners</p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">RTO Rate</p>
                    <p className="text-3xl font-black text-rose-400">{kpis.rto_rate}%</p>
                    <p className="text-[10px] text-neutral-600 mt-2 font-mono">Return to Origin</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CapEx vs Dark Store Chart */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
                    <div className="h-80">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-900/50 rounded-xl">
                        <p className="text-emerald-400 text-sm font-bold">The Winning Factor:</p>
                        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                            By leveraging existing Mom & Pop stores as micro-fulfillment centers, our CapEx approaches absolute zero.
                            We scale neighborhood by neighborhood without purchasing land, signing commercial leases, or managing warehouse staffing.
                        </p>
                    </div>
                </div>

                {/* Mock Demand Heatmap */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Demand Heatmap & Forecasting</h2>
                        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Live Radar</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[350px] w-full bg-[#0a0a0a] rounded-xl border border-neutral-800 relative overflow-hidden grid-bg">
                        {/* CSS Grid pattern to mock a map */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950/90 to-[#0a0a0a]"></div>

                        {/* Simulated Merchant Nodes (Active) */}
                        <div className="absolute top-[30%] left-[40%] text-center cursor-help group">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] mx-auto relative z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-500/20 rounded-full bg-emerald-500/5 transition-all group-hover:bg-emerald-500/10"></div>
                            <p className="text-[8px] text-emerald-400 mt-14 font-mono font-bold">NODE 01: HSR</p>
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-neutral-800 p-2 rounded border border-neutral-700 pointer-events-none transition-opacity z-20">
                                <p className="text-[10px] text-white font-bold">Active Stores: 4</p>
                                <p className="text-[9px] text-emerald-400 mt-1">Coverage: Optimal</p>
                            </div>
                        </div>

                        {/* High Demand / Low Coverage Gap (Hot Zone) */}
                        <div className="absolute top-[65%] left-[20%] text-center opacity-90 cursor-help group">
                            <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.9)] mx-auto relative z-10"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-rose-500/40 rounded-full bg-rose-500/10 mix-blend-screen"></div>
                            <p className="text-[8px] text-rose-400 mt-10 font-mono font-bold bg-neutral-900/80 px-1 rounded">HOT ZONE</p>

                            {/* Expansion Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-neutral-800 p-3 rounded-lg border border-rose-500/50 shadow-2xl pointer-events-none transition-opacity z-20 text-left">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-rose-500">⚠️</span>
                                    <p className="text-[10px] text-white font-bold uppercase">Prime Expansion Target</p>
                                </div>
                                <p className="text-[9px] text-neutral-400 mb-1">Koramangala Block 5 (Student Hostels)</p>
                                <ul className="text-[9px] text-rose-300 list-disc pl-3">
                                    <li>450+ Unfulfilled Searches/wk</li>
                                    <li>Top category: Snacks & Stationery</li>
                                    <li>Action: Recruit 1 Kirana</li>
                                </ul>
                            </div>
                        </div>

                        {/* Shakti Rider Telemetry */}
                        <div className="absolute top-[45%] left-[65%] text-center">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mx-auto shadow-[0_0_8px_rgba(244,114,182,0.8)] relative z-10"></div>
                            <p className="text-[8px] text-pink-400 mt-1 font-mono">Shakti-04</p>
                        </div>
                        <div className="absolute top-[25%] left-[35%] text-center">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mx-auto shadow-[0_0_8px_rgba(244,114,182,0.8)] relative z-10"></div>
                            <p className="text-[8px] text-pink-400 mt-1 font-mono">Shakti-12</p>
                        </div>
                        <div className="absolute top-[75%] left-[55%] text-center">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mx-auto shadow-[0_0_8px_rgba(244,114,182,0.8)] relative z-10"></div>
                            <p className="text-[8px] text-pink-400 mt-1 font-mono">Shakti-18</p>
                        </div>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                .grid-bg {
                    background-size: 30px 30px;
                    background-image: 
                      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                }
            `}} />

                    <div className="flex justify-between items-center mt-4">
                        <p className="text-[10px] text-neutral-500 font-mono">Map Projection: Real-time Telemetry</p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] text-neutral-400">Optimal Coverage</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                <span className="text-[9px] text-neutral-400">Demand Gap (Hot)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: Shakti Logistics Cost-Benefit */}
            <div className="mt-8 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <div className="inline-block bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                        Proprietary Advantage
                    </div>
                    <h2 className="text-2xl font-black text-white">The &quot;Shakti&quot; Logistics Engine</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        By tapping into the Karnataka &quot;Shakti&quot; scheme (free local bus travel for women) and building a specialized, safety-first all-female hyperlocal fleet, we bypass the aggressive pricing models of standard 3PL (Third Party Logistics) players like Dunzo or Shadowfax.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <div className="bg-neutral-800 p-4 rounded-xl flex-1 border border-neutral-700">
                            <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Standard 3PL</p>
                            <p className="text-xl font-bold text-neutral-300">₹45 / order</p>
                        </div>
                        <div className="bg-rose-950/30 p-4 rounded-xl flex-1 border border-rose-900/50">
                            <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Shakti Fleet</p>
                            <p className="text-xl font-bold text-rose-300">₹15 / order</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 bg-black p-5 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 flex flex-col items-center justify-center border-2 border-rose-500 mb-3 relative">
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-2xl">👩🏽‍✈️</span>
                    </div>
                    <h3 className="text-white font-bold text-sm">Active Monitoring</h3>
                    <p className="text-[10px] text-neutral-500 mt-1">Live SOS and unified tracking engaged for all 42 active female partners across nodes.</p>
                </div>
            </div>

            {/* NEW: Unit Economics Simulator */}
            <div className="mt-8 bg-neutral-900 border border-neutral-800 p-6 md:p-10 rounded-2xl shadow-xl">
                <div className="text-center md:text-left mb-8 border-b border-neutral-800 pb-4">
                    <h2 className="text-2xl font-black text-white">Unit Economics Sandbox</h2>
                    <p className="text-sm text-neutral-400 mt-1">Adjust the levers below to see how our Hyperlocal model accelerates Break-Even velocity.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-neutral-300 uppercase">Average Order Value (AOV)</label>
                                <span className="text-emerald-400 font-bold">₹{aov}</span>
                            </div>
                            <input type="range" min="100" max="1500" step="50" value={aov} onChange={(e: any) => setAov(Number(e.target.value))} className="w-full accent-emerald-500" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-neutral-300 uppercase">Delivery Cost (3PL vs Shakti)</label>
                                <span className="text-rose-400 font-bold">₹{deliveryCost}</span>
                            </div>
                            <input type="range" min="10" max="60" step="5" value={deliveryCost} onChange={(e: any) => setDeliveryCost(Number(e.target.value))} className="w-full accent-rose-500" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-neutral-300 uppercase">Merchant Commission %</label>
                                <span className="text-cyan-400 font-bold">{commission}%</span>
                            </div>
                            <input type="range" min="5" max="25" step="1" value={commission} onChange={(e: any) => setCommission(Number(e.target.value))} className="w-full accent-cyan-500" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-neutral-300 uppercase">Marketing (CAC Allocation)</label>
                                <span className="text-indigo-400 font-bold">₹{marketing}</span>
                            </div>
                            <input type="range" min="0" max="50" step="5" value={marketing} onChange={(e: any) => setMarketing(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                    </div>

                    <div className="flex-1 bg-black p-8 rounded-2xl border border-neutral-800 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

                        <div className="text-center relative z-10">
                            <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-2">Contribution Margin / Order</p>
                            <p className={`text-5xl font-black ${contributionMargin > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                {contributionMargin > 0 ? '+' : ''}₹{contributionMargin.toFixed(2)}
                            </p>

                            <div className="mt-8 pt-8 border-t border-neutral-800">
                                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Neighborhood Break-Even Volume</p>
                                <p className="text-4xl font-black text-white">{breakEvenOrders}</p>
                                <p className="text-[10px] text-neutral-600 font-mono mt-2">Orders/Month required to cover fixed ops cost (₹4k/Node)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
