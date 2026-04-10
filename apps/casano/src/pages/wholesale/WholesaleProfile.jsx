import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wholesaleApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import ConfirmDialog from '../../components/ConfirmDialog'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/wholesale', label: 'Dashboard', icon: '📊' },
    { to: '/wholesale/products', label: 'Products', icon: '📦' },
    { to: '/wholesale/inquiries', label: 'Inquiries', icon: '📩' },
    { to: '/wholesale/profile', label: 'Profile', icon: '👤' },
]
const CATEGORIES = ['produce', 'grocery', 'dairy', 'fmcg', 'other']

export default function WholesaleProfile() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [wholesaler, setWholesaler] = useState(null)
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [showSignOut, setShowSignOut] = useState(false)

    useEffect(() => {
        if (!user) { navigate('/wholesale/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: w } = await wholesaleApi.getProfile(user.id);
            if (!w) { navigate('/wholesale/login'); return }
            setWholesaler(w)
            setForm({ business_name: w.business_name, category: w.category, min_order_value: w.min_order_value, area: w.area, city: w.city })
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    }

    async function save() {
        setLoading(true)
        try {
            await wholesaleApi.updateProfile(wholesaler.id, { ...form, min_order_value: Number(form.min_order_value) });
            toast.success('Profile updated');
        } catch (error) {
            toast.error('Failed to save');
        } finally {
            setLoading(false)
        }
    }

    async function handleSignOut() { await signOut(); navigate('/') }
    if (!wholesaler) return null

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="Business Profile" />

            <div className="px-4 py-4 space-y-4">
                <div className="card p-5 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Business Details</p>
                    {[
                        { key: 'business_name', label: 'Business Name' },
                        { key: 'min_order_value', label: 'Min Order Value (₹)', type: 'number' },
                        { key: 'area', label: 'Area' },
                        { key: 'city', label: 'City' },
                    ].map(({ key, label, type = 'text' }) => (
                        <div key={key}>
                            <label className="input-label">{label}</label>
                            <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input" />
                        </div>
                    ))}
                    <div>
                        <label className="input-label">Category</label>
                        <select value={form.category || 'grocery'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="select">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button onClick={save} disabled={loading} className="btn btn-primary btn-block">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <button onClick={() => setShowSignOut(true)} className="btn btn-danger btn-block">Sign Out</button>
            </div>

            <ConfirmDialog open={showSignOut} title="Sign out?" message="You'll need to log in again." confirmLabel="Sign Out" danger onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)} />
            <BottomNav links={NAV} />
        </div>
    )
}
