import React from 'react'

export default function Spinner({ size = 'md', text }) {
    const dim = size === 'sm' ? 20 : size === 'lg' ? 40 : 28

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 animate-fadeIn">
            <svg width={dim} height={dim} viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M12 2a10 10 0 019.95 9" stroke="#E07B39" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {text && <p className="text-xs text-gray-400">{text}</p>}
        </div>
    )
}
