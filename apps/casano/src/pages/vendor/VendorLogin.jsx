import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi } from '../../lib/api'
import OtpLogin from '../../components/OtpLogin'
import toast from 'react-hot-toast'

const CATEGORIES = ['vegetables', 'fruits', 'dairy', 'grocery', 'snacks', 'beverages', 'other']

export default function VendorLogin() {
    const navigate = useNavigate()
    const [step, setStep] = useState('login')
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ shop_name: '', category: 'grocery', area: '', city: '', address: '' })

    async function handleLoginSuccess(user) {
        setUserId(user.id)
        try {
            const { data } = await vendorsApi.getProfile(user.id)
            if (data) navigate('/vendor')
            else setStep('register')
        } catch (error) {
            setStep('register')
        }
    }

    async function register() {
        if (!form.shop_name || !form.area || !form.city) return toast.error('Fill required fields')
        setLoading(true)
        try {
            await vendorsApi.create({ ...form, profile_id: userId })
            navigate('/vendor')
        } catch (error) {
            toast.error('Registration failed')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-[480px] mx-auto" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="text-center mb-8 animate-fadeInUp">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#1A1A2E' }}>
                    <span className="text-xl font-extrabold" style={{ color: '#E07B39' }}>C</span>
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Vendor Portal</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your shop on CASANO</p>
            </div>

            {step === 'login' ? (
                <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    <h2 className="font-semibold text-base mb-5 text-navy">Sign in as Vendor</h2>
                    <OtpLogin onSuccess={handleLoginSuccess} role="vendor" />
                </div>
            ) : (
                <div className="card p-6 space-y-3 animate-fadeInUp">
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><svg width="12" height="12" fill="none" stroke="#16A34A" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                        <div className="flex-1 h-0.5 bg-orange"></div>
                        <div className="w-6 h-6 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center">2</div>
                    </div>
                    <h2 className="font-semibold text-base text-navy">Register your shop</h2>
                    {[
                        { key: 'shop_name', label: 'Shop Name *', placeholder: 'e.g. Fresh Mart' },
                        { key: 'address', label: 'Shop Address', placeholder: 'Full address' },
                        { key: 'area', label: 'Area *', placeholder: 'e.g. Koramangala' },
                        { key: 'city', label: 'City *', placeholder: 'e.g. Bengaluru' },
                    ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="input-label">{label}</label>
                            <input type="text" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="input" />
                        </div>
                    ))}
                    <div>
                        <label className="input-label">Category</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="select">
                            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                        </select>
                    </div>
                    <button onClick={register} disabled={loading} className="btn btn-primary btn-block btn-lg mt-2">
                        {loading ? 'Registering...' : 'Register Shop'}
                    </button>
                </div>
            )}
            <button onClick={() => navigate('/')} className="text-xs text-gray-400 mt-6 mx-auto block">← Back to home</button>
        </div>
    )
}
