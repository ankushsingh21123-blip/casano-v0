import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi } from '../../lib/api'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import ConfirmDialog from '../../components/ConfirmDialog'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/vendor', label: 'Dashboard', icon: '📊' },
    { to: '/vendor/products', label: 'Products', icon: '📦' },
    { to: '/vendor/orders', label: 'Orders', icon: '📋' },
    { to: '/vendor/settings', label: 'Settings', icon: '⚙️' },
]

export default function VendorSettings() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [vendor, setVendor] = useState(null)
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [showSignOut, setShowSignOut] = useState(false)

    useEffect(() => {
        if (!user) { navigate('/vendor/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: v } = await vendorsApi.getProfile(user.id)
            if (!v) { navigate('/vendor/login'); return }
            setVendor(v)
            setForm({ shop_name: v.shop_name, description: v.description || '', address: v.address || '', area: v.area || '', delivery_radius_km: v.delivery_radius_km, avg_delivery_minutes: v.avg_delivery_minutes })
        } catch (error) {
            toast.error('Failed to load profile')
            navigate('/vendor/login')
        }
    }

    async function save() {
        setLoading(true)
        try {
            await vendorsApi.updateProfile(vendor.id, {
                ...form, 
                delivery_radius_km: Number(form.delivery_radius_km), 
                avg_delivery_minutes: Number(form.avg_delivery_minutes)
            })
            toast.success('Settings saved')
        } catch (error) {
            toast.error('Failed to save')
        }
        setLoading(false)
    }

    async function handleSignOut() { await signOut(); navigate('/') }

    if (!vendor) return null

    const FIELDS = [
        { heading: 'Shop Information', fields: [
            { key: 'shop_name', label: 'Shop Name' },
            { key: 'description', label: 'Description' },
            { key: 'address', label: 'Address' },
            { key: 'area', label: 'Area' },
        ]},
        { heading: 'Delivery Settings', fields: [
            { key: 'delivery_radius_km', label: 'Delivery Radius (km)', type: 'number' },
            { key: 'avg_delivery_minutes', label: 'Avg Delivery Time (min)', type: 'number' },
        ]},
    ]

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="Shop Settings" />

            <div className="px-4 py-4 space-y-4">
                {FIELDS.map(section => (
                    <div key={section.heading} className="card p-5 space-y-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{section.heading}</p>
                        {section.fields.map(({ key, label, type = 'text' }) => (
                            <div key={key}>
                                <label className="input-label">{label}</label>
                                <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input" />
                            </div>
                        ))}
                    </div>
                ))}

                <button onClick={save} disabled={loading} className="btn btn-primary btn-block btn-lg">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button onClick={() => setShowSignOut(true)} className="btn btn-danger btn-block">Sign Out</button>
            </div>

            <ConfirmDialog open={showSignOut} title="Sign out?" message="You'll need to log in again." confirmLabel="Sign Out" danger onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)} />
            <BottomNav links={NAV} />
        </div>
    )
}
