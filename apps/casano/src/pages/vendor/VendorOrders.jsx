import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi } from '../../lib/api'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import FilterChips from '../../components/FilterChips'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'

const NAV = [
    { to: '/vendor', label: 'Dashboard', icon: '📊' },
    { to: '/vendor/products', label: 'Products', icon: '📦' },
    { to: '/vendor/orders', label: 'Orders', icon: '📋' },
    { to: '/vendor/settings', label: 'Settings', icon: '⚙️' },
]
const FILTERS = ['All', 'Pending', 'Active', 'Completed', 'Cancelled']

export default function VendorOrders() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('All')
    const [expanded, setExpanded] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/vendor/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: v } = await vendorsApi.getProfile(user.id)
            if (!v) { navigate('/vendor/login'); return }
            
            const { data } = await vendorsApi.getOrders(v.id)
            setOrders(data || [])
            setLoading(false)
        } catch (error) {
            console.error('Failed to load orders', error)
            setLoading(false)
        }
    }

    const filtered = orders.filter(o => {
        if (filter === 'All') return true
        if (filter === 'Pending') return o.status === 'pending'
        if (filter === 'Active') return ['accepted', 'preparing', 'out_for_delivery'].includes(o.status)
        if (filter === 'Completed') return o.status === 'delivered'
        if (filter === 'Cancelled') return o.status === 'cancelled'
        return true
    })

    const counts = {
        All: orders.length,
        Pending: orders.filter(o => o.status === 'pending').length,
        Active: orders.filter(o => ['accepted', 'preparing', 'out_for_delivery'].includes(o.status)).length,
        Completed: orders.filter(o => o.status === 'delivered').length,
        Cancelled: orders.filter(o => o.status === 'cancelled').length,
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="Order History" subtitle={`${orders.length} total`} />

            <div className="px-4 py-4 space-y-3">
                <FilterChips options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

                {loading ? <ListSkeleton count={3} /> : filtered.length === 0 ? (
                    <EmptyState title="No orders found" description={`No ${filter.toLowerCase()} orders`} />
                ) : filtered.map((order, i) => (
                    <div key={order.id} className="card overflow-hidden animate-fadeInUp" style={{ animationDelay: `${i * 50}ms` }}>
                        <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-navy">{order.profiles?.full_name || 'Customer'}</p>
                                    <p className="text-[11px] text-gray-400">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={order.status} />
                                    <p className="text-sm font-bold text-navy mt-1">₹{order.total_amount}</p>
                                </div>
                            </div>
                        </button>
                        {expanded === order.id && (
                            <div className="px-4 pb-4 border-t border-gray-50 animate-fadeIn">
                                <p className="text-xs text-gray-400 mt-3 mb-1">📍 {order.delivery_address}</p>
                                {order.order_items?.map(item => (
                                    <div key={item.id} className="flex justify-between text-xs text-gray-500 py-0.5">
                                        <span>{item.products?.name} × {item.quantity}</span>
                                        <span>₹{item.price_at_order * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
