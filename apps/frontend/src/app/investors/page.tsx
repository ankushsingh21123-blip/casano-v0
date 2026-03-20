'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestorLanding() {
    const router = useRouter();
    const [aov, setAov] = useState(400);

    const startDemo = () => {
        router.push('/admin/investor');
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-xl font-black tracking-tight">Hyperlocal<span className="text-emerald-400">OS</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                        <a href="#thesis" className="hover:text-white transition-colors">The Thesis</a>
                        <a href="#economics" className="hover:text-white transition-colors">Unit Economics</a>
                        <a href="#tech" className="hover:text-white transition-colors">Tech Stack</a>
                    </div>
                    <button onClick={startDemo} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-200 transition-transform active:scale-95">
                        Access Data Room
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 relative">
                {/* Cyberpunk Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#030712] to-[#030712] -z-10"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Pre-Seed Round Now Open
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
                        Zero Warehouse Rent. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
                            100% Scalable.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-12">
                        We are replacing ₹2 Lakh/month Dark Stores with the idle inventory of 15 million Mom & Pop shops. The result? A <strong>12% higher Contribution Margin</strong> than industry leaders.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button onClick={startDemo} className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-full transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1">
                            Launch Interactive Demo
                            <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
                        </button>
                        <button onClick={() => router.push('/merchant/scanner')} className="px-8 py-4 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-bold text-lg rounded-full transition-all">
                            View Magic Onboarding
                        </button>
                    </div>
                </div>
            </section>

            {/* The Hook: Metrics */}
            <section id="thesis" className="py-24 px-6 border-y border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🏢</div>
                            <p className="text-sm font-mono text-neutral-500 mb-2 uppercase">Competitor CapEx</p>
                            <h3 className="text-4xl font-black text-white mb-4">₹2.5L <span className="text-xl text-neutral-600 font-medium">/mo</span></h3>
                            <p className="text-neutral-400">Fixed rent and warehouse staffing required before a single order is processed.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-900/50 relative overflow-hidden group hover:border-emerald-500/80 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl group-hover:scale-110 transition-transform">🏪</div>
                            <p className="text-sm font-mono text-emerald-500 mb-2 uppercase">HyperlocalOS CapEx</p>
                            <h3 className="text-4xl font-black text-emerald-400 mb-4">₹0 <span className="text-xl text-emerald-700/50 font-medium">/mo</span></h3>
                            <p className="text-neutral-300">We utilize the existing footprint, staff, and electricity of local Kirana stores.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🛵</div>
                            <p className="text-sm font-mono text-neutral-500 mb-2 uppercase">Logistics Advantage</p>
                            <h3 className="text-4xl font-black text-white mb-4">₹15 <span className="text-xl text-neutral-600 font-medium">/trip</span></h3>
                            <p className="text-neutral-400">Leveraging the &apos;Shakti&apos; scheme for an all-female fleet, reducing 3PL costs by 66%.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Widget Hook */}
            <section id="economics" className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Built for Profitability from Day 1.</h2>
                    <p className="text-xl text-neutral-400 mb-16">Play with the slider to see how easily a single neighborhood node turns cash-flow positive.</p>

                    <div className="bg-neutral-900 border border-neutral-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-[100px] rounded-full"></div>

                        <div className="grid md:grid-cols-2 gap-12 items-center text-left">
                            <div>
                                <h3 className="text-2xl font-bold mb-8">Simulate Order Value</h3>
                                <div className="mb-4 flex justify-between">
                                    <span className="text-neutral-400 font-mono">Current AOV</span>
                                    <span className="text-emerald-400 font-black text-xl">₹{aov}</span>
                                </div>
                                <input
                                    type="range"
                                    min="150" max="1500" step="50"
                                    value={aov}
                                    onChange={(e: any) => setAov(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="mt-8 flex gap-4 text-xs font-mono text-neutral-500">
                                    <div className="flex-1 bg-black p-3 rounded-lg border border-neutral-800">
                                        Comm: <span className="text-white ml-2">12%</span>
                                    </div>
                                    <div className="flex-1 bg-black p-3 rounded-lg border border-neutral-800">
                                        Delivery: <span className="text-white ml-2">₹15</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black rounded-3xl p-8 border border-neutral-800 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                                <p className="text-sm font-medium text-neutral-500 mb-2">Contribution Margin / Order</p>
                                <p className="text-6xl font-black text-emerald-400 mb-6">
                                    +₹{((aov * 0.12) - 15).toFixed(0)}
                                </p>
                                <div className="h-px w-full bg-neutral-800 mb-6"></div>
                                <p className="text-sm font-medium text-neutral-500 mb-2">Break-Even Point</p>
                                <p className="text-3xl font-bold text-white">
                                    {Math.ceil(4000 / ((aov * 0.12) - 15))} <span className="text-lg text-neutral-500 font-normal">orders/mo</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
