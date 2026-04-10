import React from 'react'

export default function FilterChips({ options, value, onChange, counts }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {options.map(opt => {
                const label = typeof opt === 'string' ? opt : opt.label
                const val = typeof opt === 'string' ? opt : opt.value
                const active = value === val
                const count = counts?.[val]
                return (
                    <button
                        key={val}
                        onClick={() => onChange(val)}
                        className={`chip ${active ? 'chip--active' : ''}`}
                    >
                        {label}
                        {count != null && count > 0 && (
                            <span
                                className="inline-flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold rounded-full px-1"
                                style={{
                                    background: active ? 'rgba(255,255,255,0.25)' : 'var(--orange)',
                                    color: 'white',
                                }}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
