import React from 'react'

export default function Toggle({ checked, onChange, label, size = 'md' }) {
    const w = size === 'sm' ? 'w-9 h-5' : 'w-12 h-6'
    const dot = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
    const translateOn = size === 'sm' ? '16px' : '26px'

    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            {label && <span className="text-sm text-gray-600 flex-1">{label}</span>}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`${w} rounded-full transition-colors duration-200 relative flex-shrink-0`}
                style={{ backgroundColor: checked ? '#E07B39' : '#E5E7EB' }}
            >
                <span
                    className={`${dot} absolute top-0.5 bg-white rounded-full shadow-sm transition-all duration-200`}
                    style={{ left: checked ? translateOn : '2px' }}
                />
            </button>
        </label>
    )
}
