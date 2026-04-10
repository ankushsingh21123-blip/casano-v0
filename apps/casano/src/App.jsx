import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

// User portal
import UserLogin from './pages/user/UserLogin'
import UserHome from './pages/user/UserHome'
import UserSearch from './pages/user/UserSearch'
import VendorDetail from './pages/user/VendorDetail'
import CartPage from './pages/user/CartPage'
import UserOrders from './pages/user/UserOrders'
import UserProfile from './pages/user/UserProfile'

// Vendor portal
import VendorLogin from './pages/vendor/VendorLogin'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorProducts from './pages/vendor/VendorProducts'
import VendorProductForm from './pages/vendor/VendorProductForm'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorSettings from './pages/vendor/VendorSettings'

// Wholesale portal
import WholesaleLogin from './pages/wholesale/WholesaleLogin'
import WholesaleDashboard from './pages/wholesale/WholesaleDashboard'
import WholesaleProducts from './pages/wholesale/WholesaleProducts'
import WholesaleInquiries from './pages/wholesale/WholesaleInquiries'
import WholesaleProfile from './pages/wholesale/WholesaleProfile'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* User portal */}
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user" element={<UserHome />} />
            <Route path="/user/search" element={<UserSearch />} />
            <Route path="/user/vendor/:id" element={<VendorDetail />} />
            <Route path="/user/cart" element={<CartPage />} />
            <Route path="/user/orders" element={<UserOrders />} />
            <Route path="/user/profile" element={<UserProfile />} />

            {/* Vendor portal */}
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/products/new" element={<VendorProductForm />} />
            <Route path="/vendor/products/:id/edit" element={<VendorProductForm />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />

            {/* Wholesale portal */}
            <Route path="/wholesale/login" element={<WholesaleLogin />} />
            <Route path="/wholesale" element={<WholesaleDashboard />} />
            <Route path="/wholesale/products" element={<WholesaleProducts />} />
            <Route path="/wholesale/inquiries" element={<WholesaleInquiries />} />
            <Route path="/wholesale/profile" element={<WholesaleProfile />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}
