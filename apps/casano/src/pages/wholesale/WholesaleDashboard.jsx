import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { wholesaleApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import StatsCard from '../../components/StatsCard'
import { StatsSkeleton, ListSkeleton } from '../../components/SkeletonLoader'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/wholesale', label: 'Dashboard', icon: '📊' },
    { to: '/wholesale/products', label: 'Products', icon: '📦' },
    { to: '/wholesale/inquiries', label: 'Inquiries', icon: '📩' },
    { to: '/wholesale/profile', label: 'Profile', icon: '👤' },
]

export default function WholesaleDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [wholesaler, setWholesaler] = useState(null)
    const [stats, setStats] = useState({ products: 0, inquiries: 0, pending: 0 })
    const [recentInquiries, setRecentInquiries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/wholesale/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: w } = await wholesaleApi.getProfile(user.id);
            if (!w) { navigate('/wholesale/login'); return }
            setWholesaler(w);

            const { data: d } = await wholesaleApi.getDashboard(w.id);
            const inquiries = d.inquiries || []
            setStats({
                products: d.productsCount || 0,
                inquiries: inquiries.length,
                pending: inquiries.filter(i => i.status === 'pending').length,
            })
            setRecentInquiries(inquiries)
        } catch (error) {
            console.error("Failed to load dashboard", error);
            toast.error("Dashboard load failed");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 animate-fadeInDown">
                <h1 className="text-lg font-bold text-navy">{wholesaler?.business_name || 'Dashboard'}</h1>
                <p className="text-xs text-gray-400">{wholesaler?.area}, {wholesaler?.city}</p>

                {loading ? <StatsSkeleton count={3} /> : (
                    <StatsCard items={[
                        { label: 'Products', value: stats.products, icon: 'products' },
                        { label: 'Inquiries', value: stats.inquiries, icon: 'inquiries' },
                        { label: 'Pending', value: stats.pending, icon: 'orders' },
                    ]} />
                )}
            </div>

            <div className="px-4 py-4 space-y-4">
                <div className="flex gap-3">
                    <Link to="/wholesale/products" className="flex-1 card p-3 text-center">
                        <span className="text-lg">📦</span>
                        <p className="text-[11px] font-medium text-navy mt-1">Products</p>
                    </Link>
                    <Link to="/wholesale/inquiries" className="flex-1 card p-3 text-center relative">
                        <span className="text-lg">📩</span>
                        <p className="text-[11px] font-medium text-navy mt-1">Inquiries</p>
                        {stats.pending > 0 && <span className="absolute top-1 right-1 badge badge--orange text-[9px]">{stats.pending}</span>}
                    </Link>
                </div>

                <div>
                    <h2 className="text-sm font-bold text-navy mb-2">Recent Inquiries</h2>
                    {loading ? <ListSkeleton count={2} /> : recentInquiries.length === 0 ? (
                        <div className="card p-6 text-center"><p className="text-xs text-gray-400">No inquiries yet</p></div>
                    ) : recentInquiries.map((inq, i) => (
                        <div key={inq.id} className="card p-4 mb-2 animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-navy">{inq.vendors?.shop_name}</p>
                                    <p className="text-[11px] text-gray-400">{inq.wholesale_products?.name} · Qty: {inq.quantity_requested}</p>
                                </div>
                                <StatusBadge status={inq.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
