import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vendorsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'

export default function VendorDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const { cartItems, addToCart, removeFromCart } = useCart()
    const navigate = useNavigate()
    const [vendor, setVendor] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/user/login'); return }
        loadVendor()
    }, [user, id])

    async function loadVendor() {
        try {
            const [vRes, pRes] = await Promise.all([
                vendorsApi.get(id),
                vendorsApi.getProducts(id, true) // fetch available only
            ])
            setVendor(vRes.data)
            setProducts(pRes.data || [])
        } catch (error) {
            toast.error("Failed to load vendor details")
        } finally {
            setLoading(false)
        }
    }

    function getCartQty(productId) {
        return cartItems.find(i => i.id === productId)?.quantity || 0
    }

    function handleAdd(product) {
        addToCart({ ...product, vendor_id: id })
        toast.success(`${product.name} added`, { duration: 1500, style: { fontSize: '13px' } })
    }

    function handleRemove(productId) {
        removeFromCart(productId)
    }

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

    // Group products by category
    const grouped = products.reduce((acc, p) => {
        const cat = p.category || 'other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(p)
        return acc
    }, {})

    return (
        <div className="app-container pb-24" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader
                back
                title={vendor?.shop_name || 'Loading...'}
                subtitle={vendor ? `📍 ${vendor.area} · ~${vendor.avg_delivery_minutes || 30} min` : ''}
            />

            {loading ? (
                <div className="px-4 py-4"><ListSkeleton count={5} /></div>
            ) : (
                <>
                    {/* Vendor info */}
                    {vendor?.description && (
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-xs text-gray-400">{vendor.description}</p>
                        </div>
                    )}

                    <div className="px-4 py-4 space-y-5">
                        {products.length === 0 ? (
                            <EmptyState title="No products available" description="This vendor hasn't added products yet" />
                        ) : (
                            Object.entries(grouped).map(([cat, items]) => (
                                <div key={cat}>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                                    <div className="space-y-2">
                                        {items.map((p, i) => {
                                            const qty = getCartQty(p.id)
                                            return (
                                                <div key={p.id} className="card p-3 flex gap-3 animate-fadeInUp" style={{ animationDelay: `${i * 40}ms` }}>
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                                            <svg width="24" height="24" fill="none" stroke="#D1D5DB" strokeWidth="1" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-navy">{p.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">₹{p.price}/{p.unit}</p>
                                                        {p.description && <p className="text-[10px] text-gray-300 mt-1 line-clamp-1">{p.description}</p>}
                                                    </div>
                                                    <div className="flex flex-col items-end justify-center shrink-0">
                                                        {qty > 0 ? (
                                                            <div className="flex items-center gap-0 border border-orange rounded-lg overflow-hidden">
                                                                <button onClick={() => handleRemove(p.id)} className="w-8 h-8 flex items-center justify-center text-orange font-bold text-lg hover:bg-orange-light transition-colors">−</button>
                                                                <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-navy bg-orange/5">{qty}</span>
                                                                <button onClick={() => handleAdd(p)} className="w-8 h-8 flex items-center justify-center text-orange font-bold text-lg hover:bg-orange-light transition-colors">+</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleAdd(p)} className="btn btn-outline btn-sm" style={{ borderColor: '#E07B39', color: '#E07B39' }}>
                                                                Add
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Floating cart bar */}
            {cartCount > 0 && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-4 z-20 animate-slideUp">
                    <button
                        onClick={() => navigate('/user/cart')}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg"
                        style={{ backgroundColor: '#E07B39' }}
                    >
                        <span className="flex items-center gap-2">
                            <span className="bg-white/20 rounded-md px-2 py-0.5 text-xs">{cartCount} items</span>
                            View Cart
                        </span>
                        <span className="font-bold">₹{cartTotal}</span>
                    </button>
                </div>
            )}
        </div>
    )
}
