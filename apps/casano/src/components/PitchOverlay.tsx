'use client';

import { useEffect, useState } from 'react';

export default function PitchOverlay() {
    const [isActive, setIsActive] = useState(false);
    const [dbLatency, setDbLatency] = useState(12);
    const [apiLatency, setApiLatency] = useState(45);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+P or Cmd+P
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setIsActive(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        let interval: NodeJS.Timeout;
        if (isActive) {
            // Simulate jitter in networking metrics
            interval = setInterval(() => {
                setDbLatency(10 + Math.floor(Math.random() * 8));
                setApiLatency(40 + Math.floor(Math.random() * 20));
            }, 1000);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* SVG Vectors to simulate node connections */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                {/* Random simulated connections */}
                <path d="M 100 100 Q 300 150 500 300" stroke="url(#beam)" strokeWidth="3" fill="none" strokeDasharray="10 5" className="animate-pulse" />
                <path d="M 800 200 Q 600 400 300 500" stroke="url(#beam)" strokeWidth="2" fill="none" />
                <path d="M 200 600 Q 500 550 700 700" stroke="url(#beam)" strokeWidth="4" fill="none" strokeDasharray="5 5" className="animate-pulse" />
            </svg>

            <div className="absolute inset-0 border-[6px] border-indigo-500/30 rounded-lg pointer-events-none" />

            <div className="absolute top-4 right-4 bg-black/90 backdrop-blur border border-indigo-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] w-72 pointer-events-auto font-mono text-white">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        God Mode
                    </h2>
                    <span className="text-[9px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">Ctrl+P to exit</span>
                </div>

                <div className="space-y-3 gap-2">
                    <div className="bg-neutral-900 border border-neutral-800 p-2 rounded flex justify-between items-center">
                        <span className="text-[10px] text-neutral-500 uppercase">DB Edge Latency</span>
                        <span className="text-xs font-bold text-emerald-400">{dbLatency}ms</span>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-2 rounded flex justify-between items-center">
                        <span className="text-[10px] text-neutral-500 uppercase">Next.js API Latency</span>
                        <span className="text-xs font-bold text-emerald-400">{apiLatency}ms</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800">
                    <h3 className="text-[10px] uppercase text-neutral-500 mb-2 font-bold tracking-wider">Tech Stack Overview</h3>
                    <ul className="text-[10px] text-neutral-300 space-y-1 ml-4 list-disc marker:text-indigo-500">
                        <li><strong>Frontend:</strong> React 19 + TailwindCSS</li>
                        <li><strong>Backend:</strong> Next.js App Router API</li>
                        <li><strong>Database:</strong> PostgreSQL (Neon)</li>
                        <li><strong>Realtime:</strong> SSE Streams</li>
                        <li><strong>AI Parsing:</strong> Mocked Vision API</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
