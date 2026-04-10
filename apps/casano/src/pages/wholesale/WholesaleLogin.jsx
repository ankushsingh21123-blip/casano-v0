import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wholesaleApi, authApi } from '../../lib/api'
import OtpLogin from '../../components/OtpLogin'
import toast from 'react-hot-toast'

const CATEGORIES = ['produce', 'grocery', 'dairy', 'fmcg', 'other']

export default function WholesaleLogin() {
    const navigate = useNavigate()
    const [step, setStep] = useState('login')
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ business_name: '', category: 'grocery', min_order_value: '', area: '', city: '' })

    async function handleLoginSuccess(user) {
        setUserId(user.id)
        try {
            const { data } = await wholesaleApi.getProfile(user.id);
            if (data) navigate('/wholesale')
            else setStep('register')
        } catch (error) {
            setStep('register')
        }
    }

    async function register() {
        if (!form.business_name || !form.area || !form.city) return toast.error('Fill all required fields')
        setLoading(true)
        try {
            await wholesaleApi.createProfile({ ...form, profile_id: userId, min_order_value: Number(form.min_order_value) || 0 });
            await authApi.updateProfile(userId, { role: 'wholesaler', area: form.area, city: form.city });
            navigate('/wholesale')
        } catch (error) {
            toast.error('Registration failed')
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
                <h1 className="text-2xl font-bold text-navy">Wholesaler Portal</h1>
                <p className="text-sm text-gray-400 mt-1">Supply products to local vendors</p>
            </div>

            {step === 'login' ? (
                <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    <h2 className="font-semibold text-base mb-5 text-navy">Sign in as Wholesaler</h2>
                    <OtpLogin onSuccess={handleLoginSuccess} role="wholesaler" />
                </div>
            ) : (
                <div className="card p-6 space-y-3 animate-fadeInUp">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><svg width="12" height="12" fill="none" stroke="#16A34A" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                        <div className="flex-1 h-0.5 bg-orange"></div>
                        <div className="w-6 h-6 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center">2</div>
                    </div>
                    <h2 className="font-semibold text-base text-navy">Register your business</h2>
                    {[
                        { key: 'business_name', label: 'Business Name *', placeholder: 'e.g. Sharma Wholesale' },
                        { key: 'min_order_value', label: 'Min Order Value (₹)', placeholder: '500', type: 'number' },
                        { key: 'area', label: 'Area *', placeholder: 'e.g. Yeshwanthpur' },
                        { key: 'city', label: 'City *', placeholder: 'e.g. Bengaluru' },
                    ].map(({ key, label, placeholder, type = 'text' }) => (
                        <div key={key}>
                            <label className="input-label">{label}</label>
                            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="input" />
                        </div>
                    ))}
                    <div>
                        <label className="input-label">Category *</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="select">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button onClick={register} disabled={loading} className="btn btn-primary btn-block btn-lg mt-2">
                        {loading ? 'Registering...' : 'Register Business'}
                    </button>
                </div>
            )}
            <button onClick={() => navigate('/')} className="text-xs text-gray-400 mt-6 mx-auto block">← Back to home</button>
        </div>
    )
}
