import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import ConfirmDialog from '../../components/ConfirmDialog'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/user', label: 'Home', icon: '🏠' },
    { to: '/user/search', label: 'Search', icon: '🔍' },
    { to: '/user/cart', label: 'Cart', icon: '🛒' },
    { to: '/user/orders', label: 'Orders', icon: '📋' },
    { to: '/user/profile', label: 'Profile', icon: '👤' },
]

export default function UserProfile() {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [showSignOut, setShowSignOut] = useState(false)

    useEffect(() => {
        if (!user) navigate('/user/login')
    }, [user])

    async function handleSignOut() {
        await signOut()
        navigate('/')
    }

    const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Profile header */}
            <div className="bg-white border-b border-gray-100 px-4 pt-8 pb-6 text-center animate-fadeInDown">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: '#1A1A2E' }}>
                    {initials}
                </div>
                <p className="text-base font-bold text-navy">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{profile?.phone || ''}</p>
                {profile?.area && <p className="text-xs text-gray-400">📍 {profile.area}, {profile.city}</p>}
            </div>

            <div className="px-4 py-4 space-y-2">
                {[
                    { label: 'My Orders', to: '/user/orders', icon: '📋' },
                    { label: 'Saved Addresses', to: '#', icon: '📍', disabled: true },
                    { label: 'Help & Support', to: '#', icon: '💬', disabled: true },
                    { label: 'Privacy Policy', to: '#', icon: '🔒', disabled: true },
                ].map(item => (
                    <Link
                        key={item.label}
                        to={item.to}
                        className={`card p-4 flex items-center gap-3 ${item.disabled ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="flex-1 text-sm font-medium text-navy">{item.label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                ))}

                <button onClick={() => setShowSignOut(true)} className="btn btn-danger btn-block mt-4">
                    Sign Out
                </button>

                <p className="text-center text-[10px] text-gray-300 mt-4">CASANO v1.0 · Pilot</p>
            </div>

            <ConfirmDialog open={showSignOut} title="Sign out?" message="You'll need to log in again." confirmLabel="Sign Out" danger onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)} />
            <BottomNav links={NAV} />
        </div>
    )
}
