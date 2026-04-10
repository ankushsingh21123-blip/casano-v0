import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, back, action, children }) {
    const navigate = useNavigate()

    return (
        <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 animate-fadeInDown">
            {back && (
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-sm text-gray-400 mb-2 group"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            )}
            <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-navy truncate">{title}</h1>
                    {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
                </div>
                {action && <div className="shrink-0 ml-3">{action}</div>}
            </div>
            {children}
        </div>
    )
}
