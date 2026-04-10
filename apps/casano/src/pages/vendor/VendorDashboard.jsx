import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi, ordersApi } from '../../lib/api'
import BottomNav from '../../components/BottomNav'
import StatsCard from '../../components/StatsCard'
import StatusBadge from '../../components/StatusBadge'
import Toggle from '../../components/Toggle'
import { StatsSkeleton, ListSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/vendor', label: 'Dashboard', icon: '📊' },
    { to: '/vendor/products', label: 'Products', icon: '📦' },
    { to: '/vendor/orders', label: 'Orders', icon: '📋' },
    { to: '/vendor/settings', label: 'Settings', icon: '⚙️' },
]

export default function VendorDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [vendor, setVendor] = useState(null)
    const [newOrders, setNewOrders] = useState([])
    const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/vendor/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: v } = await vendorsApi.getProfile(user.id)
            if (!v) { navigate('/vendor/login'); return }
            setVendor(v)

            const [ordersRes, productsRes] = await Promise.all([
                vendorsApi.getOrders(v.id),
                vendorsApi.getProducts(v.id),
            ])

            const allOrders = ordersRes.data || []
            setNewOrders(allOrders.filter(o => o.status === 'pending'))
            setStats({
                orders: allOrders.length,
                revenue: allOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total_amount || 0), 0),
                products: productsRes.data?.length || 0,
            })
            setLoading(false)

            import('../../lib/api').then(({ socket }) => {
                socket.connect()
                const roomId = `vendor_${v.id}`
                socket.emit('join', roomId)

                const handleOrderCreated = (newOrder) => {
                    setNewOrders(prev => [newOrder, ...prev])
                    toast.success('🔔 New order received!')
                    setStats(s => ({ ...s, orders: s.orders + 1 }))
                }

                socket.on('orderCreated', handleOrderCreated)

                return () => {
                    socket.off('orderCreated', handleOrderCreated)
                    socket.emit('leave', roomId)
                }
            })
        } catch (error) {
            console.error('Error fetching dashboard:', error)
            setLoading(false)
        }
    }

    async function updateStatus(orderId, status) {
        try {
            await ordersApi.updateStatus(orderId, status)
            setNewOrders(prev => prev.filter(o => o.id !== orderId))
            toast.success(`Order ${status}`)
        } catch (error) {
            toast.error('Failed to update order status')
        }
    }

    async function toggleOpen(isOpen) {
        try {
            await vendorsApi.updateStatus(vendor.id, isOpen)
            setVendor(v => ({ ...v, is_open: isOpen }))
            toast.success(isOpen ? 'Shop is now open' : 'Shop is now closed')
        } catch (error) {
            toast.error('Failed to update shop status')
        }
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 animate-fadeInDown">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-navy">{vendor?.shop_name || 'Dashboard'}</h1>
                        <p className="text-xs text-gray-400">{vendor?.area || ''}</p>
                    </div>
                    {vendor && <Toggle checked={vendor.is_open} onChange={toggleOpen} size="sm" />}
                </div>

                {loading ? <StatsSkeleton count={3} /> : (
                    <StatsCard items={[
                        { label: 'Total Orders', value: stats.orders, icon: 'orders' },
                        { label: 'Revenue', value: `₹${stats.revenue}`, icon: 'revenue' },
                        { label: 'Products', value: stats.products, icon: 'products' },
                    ]} />
                )}
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Quick actions */}
                <div className="flex gap-3">
                    <Link to="/vendor/products/new" className="flex-1 card p-3 text-center">
                        <span className="text-lg">➕</span>
                        <p className="text-[11px] font-medium text-navy mt-1">Add Product</p>
                    </Link>
                    <Link to="/vendor/orders" className="flex-1 card p-3 text-center">
                        <span className="text-lg">📋</span>
                        <p className="text-[11px] font-medium text-navy mt-1">All Orders</p>
                    </Link>
                </div>

                {/* New Orders */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-navy">New Orders</h2>
                        {newOrders.length > 0 && <span className="badge badge--orange">{newOrders.length}</span>}
                    </div>

                    {loading ? <ListSkeleton count={2} /> : newOrders.length === 0 ? (
                        <div className="card p-6 text-center"><p className="text-xs text-gray-400">No pending orders</p></div>
                    ) : newOrders.map((order, i) => (
                        <div key={order.id} className="card p-4 mb-3 animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-navy">{order.profiles?.full_name || 'Customer'}</p>
                                    <p className="text-[11px] text-gray-400">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p className="text-sm font-bold text-navy">₹{order.total_amount}</p>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">📍 {order.delivery_address}</p>
                            {order.order_items?.map(item => (
                                <p key={item.id} className="text-xs text-gray-500">{item.products?.name} × {item.quantity}</p>
                            ))}
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => updateStatus(order.id, 'accepted')} className="btn btn-navy btn-sm flex-1">Accept</button>
                                <button onClick={() => updateStatus(order.id, 'cancelled')} className="btn btn-danger btn-sm flex-1">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
