import React from 'react'

export function CardSkeleton({ count = 1 }) {
    return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 space-y-3 animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="flex justify-between items-center">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-7 w-16 rounded-md" />
            </div>
        </div>
    ))
}

export function ListSkeleton({ count = 3 }) {
    return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 flex gap-3 animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="skeleton w-14 h-14 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2 py-1">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
            </div>
            <div className="skeleton h-6 w-16 rounded-md self-center" />
        </div>
    ))
}

export function StatsSkeleton({ count = 2 }) {
    return (
        <div className="flex gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex-1 bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="skeleton h-5 w-12" />
                    <div className="skeleton h-3 w-20" />
                </div>
            ))}
        </div>
    )
}

export function VendorCardSkeleton({ count = 3 }) {
    return (
        <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="shrink-0 w-44 card p-4 space-y-2">
                    <div className="flex justify-between">
                        <div className="skeleton h-3 w-14" />
                        <div className="skeleton h-4 w-10 rounded-full" />
                    </div>
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-2/3" />
                </div>
            ))}
        </div>
    )
}

export function ProductGridSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <CardSkeleton count={count} />
        </div>
    )
}
