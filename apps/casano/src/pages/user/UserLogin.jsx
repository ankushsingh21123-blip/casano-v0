import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import OtpLogin from '../../components/OtpLogin'
import toast from 'react-hot-toast'

export default function UserLogin() {
    const navigate = useNavigate()
    const [step, setStep] = useState('login')
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ full_name: '', area: '', city: '' })

    async function handleLoginSuccess(user) {
        setUserId(user.id)
        try {
            const data = await authApi.getProfile(user.id)
            if (data?.full_name && data?.area) {
                navigate('/user')
            } else {
                setStep('profile')
            }
        } catch (error) {
            console.error("Error fetching profile", error)
            setStep('profile') // Default to asking for profile if error
        }
    }

    async function saveProfile() {
        if (!form.full_name || !form.area || !form.city) return toast.error('Fill all fields')
        setLoading(true)
        try {
            await authApi.updateProfile(userId, {
                full_name: form.full_name,
                area: form.area,
                city: form.city,
                role: 'user',
            });
            navigate('/user')
        } catch (error) {
            toast.error('Failed to save')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-[480px] mx-auto" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="text-center mb-8 animate-fadeInUp">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#1A1A2E' }}>
                    <span className="text-xl font-extrabold" style={{ color: '#E07B39' }}>C</span>
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Welcome to CASANO</h1>
                <p className="text-sm text-gray-400 mt-1">Shop from your neighbourhood</p>
            </div>

            {step === 'login' ? (
                <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    <h2 className="font-semibold text-base mb-5" style={{ color: '#1A1A2E' }}>Sign in to continue</h2>
                    <OtpLogin onSuccess={handleLoginSuccess} role="user" />
                </div>
            ) : (
                <div className="card p-6 space-y-4 animate-fadeInUp">
                    <div>
                        <h2 className="font-semibold text-base" style={{ color: '#1A1A2E' }}>Complete your profile</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Help us find vendors near you</p>
                    </div>
                    {[
                        { key: 'full_name', label: 'Your Name', placeholder: 'e.g. Rahul Kumar' },
                        { key: 'area', label: 'Your Area', placeholder: 'e.g. Koramangala' },
                        { key: 'city', label: 'City', placeholder: 'e.g. Bengaluru' },
                    ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="input-label">{label}</label>
                            <input
                                type="text"
                                value={form[key]}
                                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className="input"
                            />
                        </div>
                    ))}
                    <button onClick={saveProfile} disabled={loading} className="btn btn-primary btn-block btn-lg">
                        {loading ? 'Saving...' : 'Start Shopping'}
                    </button>
                </div>
            )}

            <button onClick={() => navigate('/')} className="text-xs text-gray-400 mt-6 mx-auto block">
                ← Back to home
            </button>
        </div>
    )
}
