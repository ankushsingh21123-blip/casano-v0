import React from 'react'

const STATUS_STEPS = [
    { key: 'pending', label: 'Placed' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'On the way' },
    { key: 'delivered', label: 'Delivered' },
]

export default function OrderTimeline({ status }) {
    const cancelled = status === 'cancelled'
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === status)

    if (cancelled) {
        return (
            <div className="flex items-center gap-2 py-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <p className="text-xs font-medium text-red-500">Order Cancelled</p>
            </div>
        )
    }

    return (
        <div className="py-3">
            <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentIdx
                    const isCurrent = i === currentIdx
                    return (
                        <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center" style={{ minWidth: 8 }}>
                                <div
                                    className={`rounded-full transition-all duration-300 ${isCurrent ? 'w-3 h-3' : 'w-2 h-2'}`}
                                    style={{
                                        backgroundColor: done ? '#E07B39' : '#E5E7EB',
                                        boxShadow: isCurrent ? '0 0 0 3px rgba(224, 123, 57, 0.2)' : 'none',
                                    }}
                                />
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                                <div
                                    className="flex-1 h-0.5 rounded-full transition-colors duration-300"
                                    style={{ backgroundColor: i < currentIdx ? '#E07B39' : '#E5E7EB' }}
                                />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
            <div className="flex justify-between mt-1.5">
                {STATUS_STEPS.map((step, i) => (
                    <span
                        key={step.key}
                        className="text-center"
                        style={{
                            fontSize: '9px',
                            color: i <= currentIdx ? '#E07B39' : '#9CA3AF',
                            fontWeight: i === currentIdx ? 600 : 400,
                            width: `${100 / STATUS_STEPS.length}%`,
                        }}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    )
}
