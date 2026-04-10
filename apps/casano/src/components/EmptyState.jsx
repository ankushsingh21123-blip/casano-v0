import React from 'react'

export default function EmptyState({ icon, title, description, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 animate-fadeInUp">
            {icon && <div className="text-5xl mb-4 opacity-60">{icon}</div>}
            {!icon && (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
            )}
            <p className="font-semibold text-sm text-gray-700 mb-1">{title || 'Nothing here yet'}</p>
            {description && <p className="text-xs text-gray-400 text-center max-w-[240px]">{description}</p>}
            {action && (
                <button onClick={action} className="btn btn-primary btn-sm mt-4">
                    {actionLabel || 'Get started'}
                </button>
            )}
        </div>
    )
}
