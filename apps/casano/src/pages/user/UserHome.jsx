import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { vendorsApi, productsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton, VendorCardSkeleton } from '../../components/SkeletonLoader'
import FilterChips from '../../components/FilterChips'

const NAV = [
    { to: '/user', label: 'Home', icon: '🏠' },
    { to: '/user/search', label: 'Search', icon: '🔍' },
    { to: '/user/cart', label: 'Cart', icon: '🛒' },
    { to: '/user/orders', label: 'Orders', icon: '📋' },
    { to: '/user/profile', label: 'Profile', icon: '👤' },
]

const CATEGORIES = [
    { label: 'All', value: 'all', icon: '🏪' },
    { label: 'Vegetables', value: 'vegetables', icon: '🥬' },
    { label: 'Fruits', value: 'fruits', icon: '🍎' },
    { label: 'Dairy', value: 'dairy', icon: '🥛' },
    { label: 'Grocery', value: 'grocery', icon: '🛍️' },
    { label: 'Snacks', value: 'snacks', icon: '🍿' },
    { label: 'Beverages', value: 'beverages', icon: '🧃' },
]

export default function UserHome() {
    const { user, profile } = useAuth()
    const { cartItems } = useCart()
    const navigate = useNavigate()
    const [vendors, setVendors] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/user/login'); return }
        loadData()
    }, [user])

    async function loadData() {
        try {
            const [vRes, pRes] = await Promise.all([
                vendorsApi.getAllOpen(),
                productsApi.getAvailable()
            ])
            setVendors(vRes.data || [])
            setProducts(pRes.data || [])
        } catch (err) {
            console.error('Failed to load data from backend:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = useMemo(() => {
        if (category === 'all') return products
        return products.filter(p => p.category === category)
    }, [products, category])

    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100 animate-fadeInDown">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-400">Delivering to</p>
                        <p className="text-sm font-semibold text-navy">{profile?.area || 'Your area'}, {profile?.city || ''}</p>
                    </div>
                    <Link to="/user/cart" className="relative p-2">
                        <svg width="22" height="22" fill="none" stroke="#1A1A2E" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounceIn">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Search bar */}
                <Link to="/user/search" className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span className="text-sm text-gray-400">Search products or vendors...</span>
                </Link>
            </div>

            <div className="px-4 py-4 space-y-5">
                {/* Category chips */}
                <div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className={`chip ${category === cat.value ? 'chip--active' : ''}`}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <>
                        <VendorCardSkeleton count={3} />
                        <ListSkeleton count={4} />
                    </>
                ) : (
                    <>
                        {/* Nearby Vendors */}
                        {vendors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-bold text-navy">Nearby Vendors</h2>
                                    <span className="text-[11px] text-gray-400">{vendors.length} open</span>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {vendors.map((v, i) => (
                                        <Link
                                            key={v.id}
                                            to={`/user/vendor/${v.id}`}
                                            className="shrink-0 w-44 card p-4 group animate-fadeInUp"
                                            style={{ animationDelay: `${i * 60}ms` }}
                                        >
                                            <div className="h-1 rounded-t-lg -mx-4 -mt-4 mb-3" style={{ background: 'linear-gradient(90deg, #E07B39, #F5C175)' }} />
                                            <p className="font-semibold text-sm text-navy truncate">{v.shop_name}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">📍 {v.area}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                    ~{v.avg_delivery_minutes || 30} min
                                                </span>
                                                {v.rating && (
                                                    <span className="text-[10px] text-orange font-medium">★ {v.rating}</span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-navy">
                                    {category === 'all' ? 'All Products' : CATEGORIES.find(c => c.value === category)?.label || category}
                                </h2>
                                <span className="text-[11px] text-gray-400">{filteredProducts.length} items</span>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <EmptyState title="No products found" description={`No ${category} products available right now`} />
                            ) : (
                                <div className="grid grid-cols-2 gap-3 stagger">
                                    {filteredProducts.map((p, i) => (
                                        <Link
                                            key={p.id}
                                            to={`/user/vendor/${p.vendor_id}`}
                                            className="card overflow-hidden group animate-fadeInUp"
                                            style={{ animationDelay: `${i * 50}ms` }}
                                        >
                                            {p.image_url ? (
                                                <div className="aspect-square bg-gray-50 overflow-hidden">
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                                                    <svg width="32" height="32" fill="none" stroke="#D1D5DB" strokeWidth="1" viewBox="0 0 24 24">
                                                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <p className="text-xs font-medium text-navy truncate">{p.name}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{p.vendors?.shop_name}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-bold text-navy">₹{p.price}</span>
                                                    <span className="text-[10px] text-gray-400">/{p.unit}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <BottomNav links={NAV} />
        </div>
    )
}
