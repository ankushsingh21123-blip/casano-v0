import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext({})
const CART_KEY = 'casano_cart'
const VENDOR_KEY = 'casano_cart_vendor'
const CART_EXPIRE_KEY = 'casano_cart_ts'
const CART_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

function loadCart() {
    try {
        const ts = localStorage.getItem(CART_EXPIRE_KEY)
        if (ts && Date.now() - Number(ts) > CART_EXPIRY_MS) {
            // Cart expired
            localStorage.removeItem(CART_KEY)
            localStorage.removeItem(VENDOR_KEY)
            localStorage.removeItem(CART_EXPIRE_KEY)
            return { items: [], vendorId: null }
        }
        const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
        const vendorId = localStorage.getItem(VENDOR_KEY) || null
        return { items, vendorId }
    } catch {
        return { items: [], vendorId: null }
    }
}

function saveCart(items, vendorId) {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    localStorage.setItem(VENDOR_KEY, vendorId || '')
    localStorage.setItem(CART_EXPIRE_KEY, String(Date.now()))
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [vendorId, setVendorId] = useState(null)

    useEffect(() => {
        const { items, vendorId: vid } = loadCart()
        setCartItems(items)
        setVendorId(vid)
    }, [])

    useEffect(() => {
        saveCart(cartItems, vendorId)
    }, [cartItems, vendorId])

    const addToCart = useCallback((product) => {
        // Check if vendor changed
        if (vendorId && product.vendor_id && product.vendor_id !== vendorId) {
            // Reset cart for new vendor — let the caller decide UX
            setCartItems([{ ...product, quantity: 1 }])
            setVendorId(product.vendor_id)
            return 'vendor_changed'
        }

        if (!vendorId && product.vendor_id) setVendorId(product.vendor_id)

        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id)
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
        return 'added'
    }, [vendorId])

    const removeFromCart = useCallback((productId) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === productId)
            if (!existing) return prev
            if (existing.quantity <= 1) {
                const updated = prev.filter(i => i.id !== productId)
                if (updated.length === 0) setVendorId(null)
                return updated
            }
            return prev.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
        })
    }, [])

    const clearCart = useCallback(() => {
        setCartItems([])
        setVendorId(null)
        localStorage.removeItem(CART_KEY)
        localStorage.removeItem(VENDOR_KEY)
        localStorage.removeItem(CART_EXPIRE_KEY)
    }, [])

    return (
        <CartContext.Provider value={{ cartItems, vendorId, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
