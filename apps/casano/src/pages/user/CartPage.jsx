import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function CartPage() {
    const { user } = useAuth()
    const { cartItems, addToCart, removeFromCart, clearCart, vendorId } = useCart()
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [showClear, setShowClear] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    async function placeOrder() {
        if (!address.trim()) return toast.error('Enter delivery address')
        if (cartItems.length === 0) return toast.error('Cart is empty')
        setLoading(true)

        try {
            const items = cartItems.map(i => ({
                product_id: i.id,
                quantity: i.quantity,
                price_at_order: i.price,
            }))
            
            await ordersApi.create({
                user_id: user.id,
                vendor_id: vendorId,
                total_amount: total,
                delivery_address: address,
                items
            });

            clearCart()
            setOrderPlaced(true)
        } catch (error) {
            toast.error('Order failed')
        } finally {
            setLoading(false)
        }
    }

    if (orderPlaced) {
        return (
            <div className="app-container flex flex-col items-center justify-center min-h-screen px-6" style={{ backgroundColor: '#FAFAF8' }}>
                <div className="text-center animate-bounceIn">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                        <svg width="36" height="36" fill="none" stroke="#16A34A" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-navy mb-1">Order Placed!</h2>
                    <p className="text-sm text-gray-400 mb-6">Your order has been sent to the vendor</p>
                    <button onClick={() => navigate('/user/orders')} className="btn btn-primary btn-lg w-full">View My Orders</button>
                    <button onClick={() => navigate('/user')} className="btn btn-outline btn-lg mt-3 w-full">Continue Shopping</button>
                </div>
            </div>
        )
    }

    return (
        <div className="app-container pb-6" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader back title="Your Cart" subtitle={cartItems.length > 0 ? `${cartItems.length} items` : undefined} />

            {cartItems.length === 0 ? (
                <EmptyState icon="🛒" title="Cart is empty" description="Browse vendors and add products" actionLabel="Browse Vendors" action={() => navigate('/user')} />
            ) : (
                <div className="px-4 py-4 space-y-4">
                    <div className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="card p-3 flex gap-3 items-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                    {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-lg">📦</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-navy truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400">₹{item.price}/{item.unit}</p>
                                </div>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-50">−</button>
                                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-navy">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-50">+</button>
                                </div>
                                <p className="text-sm font-bold text-navy w-14 text-right">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowClear(true)} className="text-xs text-red-400 font-medium">Clear cart</button>
                    <hr className="divider" />
                    <div>
                        <label className="input-label">Delivery Address</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House/flat no., street, landmark..." className="input min-h-[80px] resize-none" rows={3} />
                    </div>
                    <div className="card p-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{total}</span></div>
                        <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span className="text-green-600 text-xs font-medium">Free</span></div>
                        <hr className="divider" />
                        <div className="flex justify-between text-base font-bold text-navy"><span>Total</span><span>₹{total}</span></div>
                    </div>
                    <button onClick={placeOrder} disabled={loading} className="btn btn-primary btn-block btn-lg">
                        {loading ? 'Placing Order...' : `Place Order · ₹${total}`}
                    </button>
                </div>
            )}
            <ConfirmDialog open={showClear} title="Clear cart?" message="All items will be removed." confirmLabel="Clear" danger onConfirm={() => { clearCart(); setShowClear(false) }} onCancel={() => setShowClear(false)} />
        </div>
    )
}
