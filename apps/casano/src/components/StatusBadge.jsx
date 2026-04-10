import React from 'react'

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: '#FEF3C7', color: '#D97706', dot: '#F59E0B' },
    accepted: { label: 'Accepted', bg: '#DBEAFE', color: '#2563EB', dot: '#3B82F6' },
    preparing: { label: 'Preparing', bg: '#E0E7FF', color: '#4F46E5', dot: '#6366F1' },
    out_for_delivery: { label: 'On the way', bg: '#FEE2E2', color: '#EA580C', dot: '#F97316' },
    delivered: { label: 'Delivered', bg: '#DCFCE7', color: '#16A34A', dot: '#22C55E' },
    cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' },
    rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' },
}

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' }

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full"
            style={{ backgroundColor: config.bg, color: config.color }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.dot }}
            />
            {config.label}
        </span>
    )
}
