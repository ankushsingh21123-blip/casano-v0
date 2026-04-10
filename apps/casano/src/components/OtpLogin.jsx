import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function OtpLogin({ onSuccess, role }) {
    const [step, setStep] = useState('phone') // phone | otp
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const inputRefs = useRef([])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    function formatPhoneDisplay(p) {
        const digits = p.replace(/\D/g, '')
        if (digits.length <= 5) return digits
        return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`
    }

    async function sendOtp() {
        const digits = phone.replace(/\D/g, '')
        if (digits.length !== 10) return toast.error('Enter a valid 10-digit mobile number')
        setLoading(true)
        const fullPhone = '+91' + digits
        const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone })
        setLoading(false)
        if (error) {
            toast.error(error.message || 'Failed to send OTP')
            return
        }
        toast.success('OTP sent!')
        setStep('otp')
        setCountdown(30)
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }

    function handleOtpChange(index, value) {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6)
            const newOtp = [...otp]
            for (let i = 0; i < digits.length && i + index < 6; i++) {
                newOtp[i + index] = digits[i]
            }
            setOtp(newOtp)
            const nextIdx = Math.min(index + digits.length, 5)
            inputRefs.current[nextIdx]?.focus()
            return
        }
        if (!/^\d?$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    function handleOtpKeyDown(index, e) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    async function verifyOtp() {
        const code = otp.join('')
        if (code.length !== 6) return toast.error('Enter the full 6-digit OTP')
        setLoading(true)
        const digits = phone.replace(/\D/g, '')
        const fullPhone = '+91' + digits
        const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: code, type: 'sms' })
        setLoading(false)
        if (error) {
            toast.error(error.message || 'Invalid OTP')
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
            return
        }
        if (data?.user) {
            // Ensure profile exists
            const { data: profile } = await supabase.from('profiles').select('id').eq('id', data.user.id).single()
            if (!profile) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    phone: fullPhone,
                    role: role || 'user',
                })
            }
            onSuccess(data.user)
        }
    }

    async function resendOtp() {
        if (countdown > 0) return
        setLoading(true)
        const digits = phone.replace(/\D/g, '')
        const fullPhone = '+91' + digits
        const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone })
        setLoading(false)
        if (error) return toast.error('Failed to resend')
        toast.success('OTP resent!')
        setCountdown(30)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
    }

    if (step === 'phone') {
        return (
            <div className="space-y-4 animate-fadeIn">
                <div>
                    <label className="input-label">Mobile Number</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200">+91</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="98765 43210"
                            className="input flex-1"
                            maxLength={10}
                            autoFocus
                        />
                    </div>
                </div>
                <button
                    onClick={sendOtp}
                    disabled={loading || phone.replace(/\D/g, '').length !== 10}
                    className="btn btn-primary btn-block btn-lg"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" /><path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
                            Sending...
                        </span>
                    ) : 'Send OTP'}
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-2">
                <p className="text-sm text-gray-500">OTP sent to</p>
                <p className="text-sm font-semibold text-navy">+91 {formatPhoneDisplay(phone)}</p>
                <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']) }} className="text-xs text-orange mt-1">
                    Change number
                </button>
            </div>
            
            <div>
                <label className="input-label text-center block">Enter 6-digit OTP</label>
                <div className="flex justify-center gap-2 mt-2">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => inputRefs.current[i] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition-all"
                            style={{ color: '#1A1A2E' }}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={verifyOtp}
                disabled={loading || otp.join('').length !== 6}
                className="btn btn-primary btn-block btn-lg"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" /><path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
                        Verifying...
                    </span>
                ) : 'Verify & Login'}
            </button>

            <div className="text-center">
                {countdown > 0 ? (
                    <p className="text-xs text-gray-400">Resend OTP in <span className="font-semibold text-navy">{countdown}s</span></p>
                ) : (
                    <button onClick={resendOtp} className="text-xs font-medium text-orange">
                        Resend OTP
                    </button>
                )}
            </div>
        </div>
    )
}
