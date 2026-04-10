import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { productsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/EmptyState'
import { ListSkeleton } from '../../components/SkeletonLoader'

const NAV = [
    { to: '/user', label: 'Home', icon: '🏠' },
    { to: '/user/search', label: 'Search', icon: '🔍' },
    { to: '/user/cart', label: 'Cart', icon: '🛒' },
    { to: '/user/orders', label: 'Orders', icon: '📋' },
    { to: '/user/profile', label: 'Profile', icon: '👤' },
]

export default function UserSearch() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [recentSearches, setRecentSearches] = useState([])
    const debounceRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (!user) { navigate('/user/login'); return }
        // Load recent searches from localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('casano_recent_searches') || '[]')
            setRecentSearches(stored.slice(0, 5))
        } catch (e) { /* ignore */ }
        setTimeout(() => inputRef.current?.focus(), 200)
    }, [user])

    const doSearch = useCallback(async (q) => {
        const trimmed = q.trim()
        if (!trimmed) { setResults([]); setHasSearched(false); return }
        setSearching(true)
        setHasSearched(true)

        try {
            const { data } = await productsApi.search(trimmed);
            setResults(data || [])
        } catch (error) {
            console.error("Search failed", error)
            setResults([])
        } finally {
            setSearching(false)
        }

        // Save to recent
        const recents = JSON.parse(localStorage.getItem('casano_recent_searches') || '[]')
        const updated = [trimmed, ...recents.filter(r => r !== trimmed)].slice(0, 5)
        localStorage.setItem('casano_recent_searches', JSON.stringify(updated))
        setRecentSearches(updated)
    }, [])

    function handleInput(value) {
        setQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            if (value.trim().length >= 2) doSearch(value)
            else { setResults([]); setHasSearched(false) }
        }, 300)
    }

    function handleRecentClick(q) {
        setQuery(q)
        doSearch(q)
    }

    function clearRecents() {
        localStorage.removeItem('casano_recent_searches')
        setRecentSearches([])
    }

    // Group results by vendor
    const grouped = results.reduce((acc, p) => {
        const name = p.vendors?.shop_name || 'Unknown'
        if (!acc[name]) acc[name] = []
        acc[name].push(p)
        return acc
    }, {})

    return (
        <div className="app-container pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Search header */}
            <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 animate-fadeInDown">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => handleInput(e.target.value)}
                            placeholder="Search products..."
                            className="input pl-9 pr-8"
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setResults([]); setHasSearched(false); inputRef.current?.focus() }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Recent searches */}
                {!hasSearched && recentSearches.length > 0 && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-500">Recent Searches</p>
                            <button onClick={clearRecents} className="text-[10px] text-gray-400">Clear</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map(q => (
                                <button key={q} onClick={() => handleRecentClick(q)} className="chip text-[11px]">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {searching && <ListSkeleton count={3} />}

                {/* Results grouped by vendor */}
                {!searching && hasSearched && results.length === 0 && (
                    <EmptyState title="No results" description={`Nothing found for "${query}". Try a different search term.`} />
                )}

                {!searching && Object.keys(grouped).length > 0 && (
                    <div className="space-y-4 stagger">
                        {Object.entries(grouped).map(([vendorName, products], gi) => (
                            <div key={vendorName} className="animate-fadeInUp" style={{ animationDelay: `${gi * 80}ms` }}>
                                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-orange">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35" />
                                    </svg>
                                    {vendorName}
                                </p>
                                <div className="space-y-2">
                                    {products.map(p => (
                                        <Link
                                            key={p.id}
                                            to={`/user/vendor/${p.vendor_id}`}
                                            className="card p-3 flex gap-3 items-center"
                                        >
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" loading="lazy" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                                    <svg width="20" height="20" fill="none" stroke="#D1D5DB" strokeWidth="1" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-navy truncate">{p.name}</p>
                                                <p className="text-[11px] text-gray-400">{p.vendors?.area}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-navy">₹{p.price}</p>
                                                <p className="text-[10px] text-gray-400">/{p.unit}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav links={NAV} />
        </div>
    )
}
