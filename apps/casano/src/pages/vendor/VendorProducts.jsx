import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi, productsApi } from '../../lib/api'
import BottomNav from '../../components/BottomNav'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'

const NAV = [
    { to: '/vendor', label: 'Dashboard', icon: '📊' },
    { to: '/vendor/products', label: 'Products', icon: '📦' },
    { to: '/vendor/orders', label: 'Orders', icon: '📋' },
    { to: '/vendor/settings', label: 'Settings', icon: '⚙️' },
]

export default function VendorProducts() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [vendorId, setVendorId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!user) { navigate('/vendor/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: v } = await vendorsApi.getProfile(user.id)
            if (!v) { navigate('/vendor/login'); return }
            setVendorId(v.id)
            const { data } = await vendorsApi.getProducts(v.id)
            setProducts(data || [])
            setLoading(false)
        } catch (error) {
            console.error('Failed to load products', error)
            setLoading(false)
        }
    }

    async function toggleAvailable(product) {
        try {
            const { data } = await productsApi.updateAvailability(product.id, !product.is_available)
            setProducts(prev => prev.map(p => p.id === product.id ? data : p))
            toast.success(data.is_available ? 'Product available' : 'Product unavailable')
        } catch (error) {
            toast.error('Failed to update product availability')
        }
    }

    const filtered = search.trim() ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : products

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader
                title="Products"
                subtitle={`${products.length} total`}
                action={<Link to="/vendor/products/new" className="btn btn-primary btn-sm">+ Add</Link>}
            >
                {products.length > 3 && (
                    <div className="mt-3">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input text-sm" />
                    </div>
                )}
            </PageHeader>

            <div className="px-4 py-4 space-y-2">
                {loading ? <ListSkeleton count={4} /> : filtered.length === 0 ? (
                    <EmptyState icon="📦" title={search ? 'No results' : 'No products yet'} description={search ? `Nothing matched "${search}"` : 'Add your first product to start selling'} actionLabel="Add Product" action={() => navigate('/vendor/products/new')} />
                ) : filtered.map((p, i) => (
                    <div key={p.id} className="card p-4 flex gap-3 animate-fadeInUp" style={{ animationDelay: `${i * 40}ms` }}>
                        {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-14 h-14 object-cover shrink-0 rounded-lg" loading="lazy" />
                        ) : (
                            <div className="w-14 h-14 bg-gray-50 shrink-0 flex items-center justify-center rounded-lg">
                                <svg width="20" height="20" fill="none" stroke="#D1D5DB" strokeWidth="1" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-navy truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">₹{p.price}/{p.unit} · Stock: {p.stock_quantity}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <Link to={`/vendor/products/${p.id}/edit`} className="btn btn-outline btn-sm text-[11px] py-1 px-2">Edit</Link>
                            <button onClick={() => toggleAvailable(p)} className="badge text-[10px]" style={{ backgroundColor: p.is_available ? '#DCFCE7' : '#FEE2E2', color: p.is_available ? '#16A34A' : '#DC2626' }}>
                                {p.is_available ? 'Available' : 'Unavailable'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <BottomNav links={NAV} />
        </div>
    )
}
