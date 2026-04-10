import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import OrderTimeline from '../../components/OrderTimeline'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'

const NAV = [
    { to: '/user', label: 'Home', icon: '🏠' },
    { to: '/user/search', label: 'Search', icon: '🔍' },
    { to: '/user/cart', label: 'Cart', icon: '🛒' },
    { to: '/user/orders', label: 'Orders', icon: '📋' },
    { to: '/user/profile', label: 'Profile', icon: '👤' },
]

export default function UserOrders() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        if (!user) { navigate('/user/login'); return }
        loadOrders()

        import('../../lib/api').then(({ socket }) => {
            socket.connect()
            const roomId = `user_${user.id}`
            socket.emit('join', roomId)

            const handleOrderUpdated = (updatedOrder) => {
                setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
            }
            
            socket.on('orderUpdated', handleOrderUpdated)

            return () => {
                socket.off('orderUpdated', handleOrderUpdated)
                socket.emit('leave', roomId)
                // note: not disconnecting here in case other components use it, or disconnect if singleton
            }
        });
    }, [user])

    async function loadOrders() {
        try {
            const { data } = await userApi.getOrders(user.id);
            setOrders(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="My Orders" />

            <div className="px-4 py-4 space-y-3">
                {loading ? <ListSkeleton count={3} /> : orders.length === 0 ? (
                    <EmptyState icon="📋" title="No orders yet" description="Your orders will appear here" actionLabel="Start Shopping" action={() => navigate('/user')} />
                ) : orders.map((order, i) => (
                    <div key={order.id} className="card overflow-hidden animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                        <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-navy">{order.vendors?.shop_name}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={order.status} />
                                    <p className="text-sm font-bold text-navy mt-1">₹{order.total_amount}</p>
                                </div>
                            </div>
                            <OrderTimeline status={order.status} />
                        </button>
                        {expanded === order.id && (
                            <div className="px-4 pb-4 border-t border-gray-50 animate-fadeIn">
                                <p className="text-xs text-gray-400 mt-3 mb-2">📍 {order.delivery_address}</p>
                                {order.order_items?.map(item => (
                                    <div key={item.id} className="flex justify-between text-xs text-gray-500 py-1">
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
