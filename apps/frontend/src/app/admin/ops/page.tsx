'use client';

import { useEffect, useState } from 'react';

export default function AdminControlRoom() {
    const [liveStoreCount, setLiveStoreCount] = useState(0);
    const [activeRiders, setActiveRiders] = useState(42); // Mock baseline
    const [systemLoad, setSystemLoad] = useState(24); // % Load
    const [surgeActive, setSurgeActive] = useState(false);
    const [failovers, setFailovers] = useState(0);

    // Initial Fetch & Fake Telemetry Loop
    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                const res = await fetch('/api/merchants/nearby');
                const data = await res.json();
                setLiveStoreCount(data.length); // Realistic: we're only querying nearby local nodes
            } catch (e: any) { }
        };

        fetchSystemStatus();

        // Simulate fluctuating network load
        const interval = setInterval(() => {
            setSystemLoad(prev => {
                const fluctuation = Math.floor(Math.random() * 5) - 2;
                return Math.max(10, Math.min(95, prev + fluctuation));
            });

            // Occasionally simulate a missed order failover event
            if (Math.random() > 0.85) {
                setFailovers(prev => prev + 1);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const toggleSurge = () => {
        setSurgeActive(!surgeActive);
        if (!surgeActive) {
            alert("SURGE PRICING ENGAGED. Node-wide delivery fees increased by +₹15 to manage demand.");
        } else {
            alert("Surge Pricing Disabled. Reverting to standard Shakti fleet rates.");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-red-500 uppercase tracking-tighter">Command Center</h1>
                    <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">Node 01: HSR Layout Operations</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-xs text-emerald-500 tracking-widest uppercase">Telemetry Online</span>
                    </div>
                </div>
            </header>

            {/* Core Metrics Array */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Active Stores</p>
                    <p className="text-4xl font-bold text-white">{liveStoreCount}</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-pink-500"></div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Shakti Riders On-Grid</p>
                    <p className="text-4xl font-bold text-white">{activeRiders}</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-cyan-500"></div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Order Failovers (Today)</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold text-white">{failovers}</p>
                        <p className="text-[10px] text-cyan-500">Auto-routed to neighbors</p>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-1 h-full transition-colors ${systemLoad > 80 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Network Stress</p>
                    <p className={`text-4xl font-bold ${systemLoad > 80 ? 'text-red-500' : 'text-emerald-500'}`}>{systemLoad}%</p>
                </div>
            </div>

            {/* Tactical Controls & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 lg:col-span-1 border-t-4 border-t-red-500 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Tactical Overrides
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-bold text-white">Dynamic Surge Pricing</p>
                                    <p className="text-[10px] text-neutral-500 mt-1">Engage when network stress exceeds 85% to throttle demand.</p>
                                </div>
                                <button
                                    onClick={toggleSurge}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${surgeActive ? 'bg-red-600' : 'bg-neutral-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${surgeActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                            {surgeActive && <p className="text-xs text-red-500 font-bold mt-2 animate-pulse">&gt; SURGE ACTIVE (+₹15)</p>}
                            <div className="mt-4 bg-black p-3 rounded border border-neutral-800 font-serif text-center overflow-x-auto">
                                <span className="text-neutral-400 text-xs italic">Live Pricing Algotihm:</span>
                                <div className="text-emerald-400 mt-2 whitespace-nowrap">
                                    <span className="text-white">Fee</span><sub>total</sub> =
                                    ( <span className="text-rose-400">Base</span> +
                                    ( <span className="text-blue-400">Dist</span> &times; <span className="text-yellow-400">Rate</span> ) )
                                    &times; <span className="text-purple-400">Surge</span><sub>multiplier</sub>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                            <h3 className="text-sm font-bold text-white mb-2 text-rose-500">EMERGENCY: Halt Orders</h3>
                            <p className="text-[10px] text-neutral-500 mb-4">Immediately block all new inbound orders for Node 01. Existing orders will complete.</p>
                            <button onClick={() => alert("KILLED SWITCH ENGAGED. Node offline.")} className="w-full bg-rose-600/20 hover:bg-rose-600/40 text-rose-500 border border-rose-600/50 font-bold py-3 text-xs tracking-widest uppercase rounded">
                                Initiate Kill Switch
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Terminal Log */}
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 lg:col-span-2 flex flex-col">
                    <h2 className="text-lg font-bold text-neutral-400 mb-4 flex items-center gap-2">
                        <span className="text-emerald-500">&gt;_</span> Syslog Filter: Core Events
                    </h2>

                    <div className="flex-1 overflow-hidden relative">
                        {/* Terminal Gradient overlay */}
                        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

                        <div className="h-[300px] overflow-y-auto space-y-2 text-xs font-mono pr-2 custom-scrollbar">
                            <div className="text-neutral-500">[{new Date(Date.now() - 600000).toISOString()}] SYSTEM_STARTUP: Initializing Hyperlocal Socket Server... OK</div>
                            <div className="text-emerald-500">[{new Date(Date.now() - 500000).toISOString()}] NODE_01_ONLINE: Connect to ONDC Gateway established.</div>
                            <div className="text-pink-400">[{new Date(Date.now() - 400000).toISOString()}] SHAKTI_FLEET_SYNC: 42 verified riders connected to location ping system.</div>
                            <div className="text-neutral-500">[{new Date(Date.now() - 300000).toISOString()}] MERCH_SCANNER: Parsed invoice 0x48f for &quot;Sri Venkateshwara Stores&quot;. 15 SKUs matched.</div>
                            <div className="text-emerald-400">[{new Date(Date.now() - 150000).toISOString()}] NEW_ORDER: App (ONDC) request for 2x Amul Butter. Routing to nearest node...</div>
                            <div className="text-amber-500">[{new Date(Date.now() - 50000).toISOString()}] GHOST_INVENTORY_DETECTED: Target Merchant stock anomaly. Triggering Self-Healing modal via SSE...</div>
                            {failovers > 0 && (
                                <div className="text-cyan-400 border-l-[3px] border-cyan-500 pl-2 ml-1">[{new Date().toISOString()}] FAILOVER_ROUTING: Store T/O 120s. Routing order #7899X to secondary perimeter store.</div>
                            )}
                            <div className="text-emerald-500 animate-pulse mt-4">_</div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0a0a0a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
            `}} />
        </div>
    );
}
