import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wholesaleApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/wholesale', label: 'Dashboard', icon: '📊' },
    { to: '/wholesale/products', label: 'Products', icon: '📦' },
    { to: '/wholesale/inquiries', label: 'Inquiries', icon: '📩' },
    { to: '/wholesale/profile', label: 'Profile', icon: '👤' },
]
const CATEGORIES = ['produce', 'grocery', 'dairy', 'fmcg', 'other']
const EMPTY_FORM = { name: '', category: 'grocery', price_per_unit: '', unit: '', min_quantity: '', stock_available: '', is_available: true }

export default function WholesaleProducts() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [wholesalerId, setWholesalerId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!user) { navigate('/wholesale/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: w } = await wholesaleApi.getProfile(user.id);
            if (!w) { navigate('/wholesale/login'); return }
            setWholesalerId(w.id)
            const { data } = await wholesaleApi.getProducts(w.id);
            setProducts(data || [])
        } catch (error) {
            console.error("Failed to load wholesale products", error);
        } finally {
            setLoading(false)
        }
    }

    async function save() {
        if (!form.name || !form.price_per_unit || !form.unit) return toast.error('Fill required fields')
        setSaving(true)
        try {
            const payload = { ...form, wholesaler_id: wholesalerId, price_per_unit: Number(form.price_per_unit), min_quantity: Number(form.min_quantity) || 1, stock_available: Number(form.stock_available) || 0 }
            const { data } = await wholesaleApi.createProduct(payload);
            setProducts(prev => [data, ...prev])
            setForm(EMPTY_FORM)
            setShowForm(false)
            toast.success('Product added')
        } catch (error) {
            toast.error('Failed to add product')
        } finally {
            setSaving(false)
        }
    }

    async function toggleAvailable(product) {
        try {
            const { data } = await wholesaleApi.updateProduct(product.id, { is_available: !product.is_available });
            setProducts(prev => prev.map(p => p.id === product.id ? data : p))
        } catch (error) {
            toast.error('Failed to update availability')
        }
    }

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader title="Wholesale Products" subtitle={`${products.length} listed`} action={
                <button onClick={() => setShowForm(!showForm)} className={`btn btn-sm ${showForm ? 'btn-outline' : 'btn-primary'}`}>
                    {showForm ? 'Cancel' : '+ Add'}
                </button>
            } />

            <div className="px-4 py-4 space-y-3">
                {showForm && (
                    <div className="card p-4 space-y-3 animate-fadeInUp">
                        <h3 className="font-semibold text-sm text-navy">New Product</h3>
                        {[
                            { key: 'name', label: 'Product Name *', placeholder: 'e.g. Onions' },
                            { key: 'price_per_unit', label: 'Price per Unit (₹) *', placeholder: '0', type: 'number' },
                            { key: 'unit', label: 'Unit *', placeholder: 'e.g. 1kg, 50kg bag' },
                            { key: 'min_quantity', label: 'Min Quantity', placeholder: '1', type: 'number' },
                            { key: 'stock_available', label: 'Stock Available', placeholder: '0', type: 'number' },
                        ].map(({ key, label, placeholder, type = 'text' }) => (
                            <div key={key}>
                                <label className="input-label">{label}</label>
                                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="input" />
                            </div>
                        ))}
                        <div>
                            <label className="input-label">Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="select">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button onClick={save} disabled={saving} className="btn btn-primary btn-block">
                            {saving ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                )}

                {loading ? <ListSkeleton count={4} /> : products.length === 0 && !showForm ? (
                    <EmptyState icon="📦" title="No products listed yet" actionLabel="Add Product" action={() => setShowForm(true)} />
                ) : products.map((p, i) => (
                    <div key={p.id} className="card p-4 flex gap-3 items-center animate-fadeInUp" style={{ animationDelay: `${i * 40}ms` }}>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-navy">{p.name}</p>
                            <p className="text-xs text-gray-400">₹{p.price_per_unit}/{p.unit} · Min: {p.min_quantity} · Stock: {p.stock_available}</p>
                        </div>
                        <button onClick={() => toggleAvailable(p)} className="badge text-[10px] shrink-0" style={{ backgroundColor: p.is_available ? '#DCFCE7' : '#FEE2E2', color: p.is_available ? '#16A34A' : '#DC2626' }}>
                            {p.is_available ? 'Available' : 'Unavailable'}
                        </button>
                    </div>
                ))}
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
