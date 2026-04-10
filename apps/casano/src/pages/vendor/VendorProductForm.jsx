import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { vendorsApi, productsApi } from '../../lib/api'
import PageHeader from '../../components/PageHeader'
import Toggle from '../../components/Toggle'
import toast from 'react-hot-toast'

const CATEGORIES = ['vegetables', 'fruits', 'dairy', 'grocery', 'snacks', 'beverages', 'other']

export default function VendorProductForm() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)
    const [vendorId, setVendorId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [form, setForm] = useState({ name: '', category: 'vegetables', price: '', unit: '', stock_quantity: '', description: '', is_available: true })

    useEffect(() => {
        if (!user) { navigate('/vendor/login'); return }
        init()
    }, [user])

    async function init() {
        try {
            const { data: v } = await vendorsApi.getProfile(user.id)
            if (!v) { navigate('/vendor/login'); return }
            setVendorId(v.id)
            if (isEdit) {
                const { data: p } = await productsApi.get(id)
                if (p) {
                    setForm({ name: p.name, category: p.category, price: p.price, unit: p.unit, stock_quantity: p.stock_quantity, description: p.description || '', is_available: p.is_available })
                    if (p.image_url) setImagePreview(p.image_url)
                }
            }
        } catch (error) {
            console.error('Init failed', error)
            toast.error('Failed to load data')
        }
    }

    function handleImage(e) {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    async function save() {
        if (!form.name || !form.price || !form.unit) return toast.error('Fill required fields')
        setLoading(true)
        let image_url = null

        if (imageFile) {
            const ext = imageFile.name.split('.').pop()
            const path = `${vendorId}/${Date.now()}.${ext}`
            const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile)
            if (uploadError) { toast.error('Image upload failed'); setLoading(false); return }
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
            image_url = urlData.publicUrl
        }

        const payload = { ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) || 0, vendor_id: vendorId }
        if (image_url) payload.image_url = image_url

        try {
            if (isEdit) await productsApi.update(id, payload)
            else await productsApi.create(payload)
            toast.success(isEdit ? 'Product updated' : 'Product added')
            navigate('/vendor/products')
        } catch (error) {
            toast.error('Failed to save product')
        }
        setLoading(false)
    }

    return (
        <div className="app-container pb-6" style={{ backgroundColor: '#FAFAF8' }}>
            <PageHeader back title={isEdit ? 'Edit Product' : 'Add Product'} />

            <div className="px-4 py-4 space-y-4">
                {/* Image upload with preview */}
                <div>
                    <label className="input-label">Product Image</label>
                    {imagePreview ? (
                        <div className="relative mb-2">
                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                            <button onClick={() => { setImagePreview(null); setImageFile(null) }} className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow text-xs">✕</button>
                        </div>
                    ) : null}
                    <input type="file" accept="image/*" onChange={handleImage} className="input text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200" />
                </div>

                {[
                    { key: 'name', label: 'Product Name *', placeholder: 'e.g. Fresh Tomatoes' },
                    { key: 'price', label: 'Price (₹) *', placeholder: '0', type: 'number' },
                    { key: 'unit', label: 'Unit *', placeholder: 'e.g. 1kg, 500ml, piece' },
                    { key: 'stock_quantity', label: 'Stock Quantity', placeholder: '0', type: 'number' },
                    { key: 'description', label: 'Description', placeholder: 'Optional description' },
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

                <Toggle checked={form.is_available} onChange={v => setForm(f => ({ ...f, is_available: v }))} label="Available for sale" />

                <button onClick={save} disabled={loading} className="btn btn-primary btn-block btn-lg">
                    {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </div>
    )
}
