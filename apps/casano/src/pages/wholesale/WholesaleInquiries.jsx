import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wholesaleApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import FilterChips from '../../components/FilterChips'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/wholesale', label: 'Dashboard', icon: '📊' },
    { to: '/wholesale/products', label: 'Products', icon: '📦' },
    { to: '/wholesale/inquiries', label: 'Inquiries', icon: '📩' },
    { to: '/wholesale/profile', label: 'Profile', icon: '👤' },
]
const FILTERS = ['All', 'Pending', 'Accepted', 'Rejected']

export default function WholesaleInquiries() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [inquiries, setInquiries] = useState([])
    const [filter, setFilter] = useState('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/wholesale/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: w } = await wholesaleApi.getProfile(user.id);
            if (!w) { navigate('/wholesale/login'); return }
            const { data } = await wholesaleApi.getInquiries(w.id);
            setInquiries(data || [])

            import('../../lib/api').then(({ socket }) => {
                socket.connect()
                const roomId = `wholesale_${w.id}`
                socket.emit('join', roomId)

                const handleInquiryUpdated = (updatedInq) => {
                    setInquiries(prev => prev.map(i => i.id === updatedInq.id ? { ...i, ...updatedInq } : i))
                }
                const handleInquiryCreated = (newInq) => {
                    setInquiries(prev => [newInq, ...prev])
                    toast.success('🔔 New inquiry received!')
                }

                socket.on('inquiryUpdated', handleInquiryUpdated)
                socket.on('inquiryCreated', handleInquiryCreated)

                return () => {
                    socket.off('inquiryUpdated', handleInquiryUpdated)
                    socket.off('inquiryCreated', handleInquiryCreated)
                    socket.emit('leave', roomId)
                }
            })
        } catch (error) {
            console.error("Failed to load inquiries", error);
        } finally {
            setLoading(false)
        }
    }

    async function respond(id, status) {
        try {
            await wholesaleApi.updateInquiryStatus(id, status);
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
            toast.success(status === 'accepted' ? 'Accepted' : 'Rejected')
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const filtered = inquiries.filter(i => filter === 'All' || i.status === filter.toLowerCase())
    const counts = {
        All: inquiries.length,
        Pending: inquiries.filter(i => i.status === 'pending').length,
        Accepted: inquiries.filter(i => i.status === 'accepted').length,
        Rejected: inquiries.filter(i => i.status === 'rejected').length,
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="Inquiries" subtitle={`${inquiries.length} total`} />

            <div className="px-4 py-4 space-y-3">
                <FilterChips options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

                {loading ? <ListSkeleton count={3} /> : filtered.length === 0 ? (
                    <EmptyState title="No inquiries found" description={`No ${filter.toLowerCase()} inquiries`} />
                ) : filtered.map((inq, i) => (
                    <div key={inq.id} className="card p-4 animate-fadeInUp" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-sm text-navy">{inq.vendors?.shop_name}</p>
                                <p className="text-xs text-gray-400">{inq.wholesale_products?.name} · Qty: {inq.quantity_requested}</p>
                                <p className="text-[10px] text-gray-300">{new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                            </div>
                            <StatusBadge status={inq.status} />
                        </div>
                        {inq.message && <p className="text-xs text-gray-400 italic mb-3">"{inq.message}"</p>}
                        {inq.status === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => respond(inq.id, 'accepted')} className="btn btn-navy btn-sm flex-1">Accept</button>
                                <button onClick={() => respond(inq.id, 'rejected')} className="btn btn-danger btn-sm flex-1">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
