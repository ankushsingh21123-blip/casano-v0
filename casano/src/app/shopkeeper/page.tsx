'use client';

import { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, Clock, CheckCircle, PackageSearch, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Today\'s Orders', value: '38', icon: <Package size={20} />, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Revenue', value: '₹5,420', icon: <TrendingUp size={20} />, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Pending', value: '4', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'Out of Stock', value: '12', icon: <AlertTriangle size={20} />, color: 'text-red-600', bg: 'bg-red-100' }
];

const ORDERS = [
  { id: '#ORD-8821', time: '2 mins ago', items: 3, total: '₹340', status: 'new' },
  { id: '#ORD-8820', time: '5 mins ago', items: 1, total: '₹85', status: 'packing' },
  { id: '#ORD-8819', time: '12 mins ago', items: 6, total: '₹890', status: 'ready' },
  { id: '#ORD-8818', time: '18 mins ago', items: 2, total: '₹120', status: 'picked_up' },
];

export default function ShopkeeperDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <main className="flex-1 overflow-y-auto pb-24 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Partner Hub</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Sri Balaji Kirana</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-[#0c831f] px-3 py-1.5 rounded-full border border-green-200">
            <div className="w-2 h-2 rounded-full bg-[#0c831f] animate-pulse"></div>
            <span className="text-xs font-bold tracking-wide">STORE OPEN</span>
          </div>
        </div>

        {/* TOP TABS */}
        <div className="flex gap-2 overflows-x-auto no-scrollbar">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package size={16} />} label="Live Orders" badge="4" />
          <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<PackageSearch size={16} />} label="Inventory" />
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'inventory' && <div className="text-center font-bold text-gray-400 mt-20">Inventory sync coming soon...</div>}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <NavIcon icon={<LayoutDashboard size={24} />} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavIcon icon={<Package size={24} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <NavIcon icon={<PackageSearch size={24} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        <NavIcon icon={<Settings size={24} />} label="Settings" />
      </div>

    </main>
  );
}

function DashboardTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-start gap-3">
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ALERTS */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 shadow-sm">
        <AlertTriangle className="text-red-500 shrink-0" />
        <div>
          <h4 className="font-bold text-red-900 text-sm">Low Stock Alert</h4>
          <p className="text-xs text-red-700 mt-1">12 items including "Amul Milk 500ml" are out of stock. Update inventory to avoid order cancellations.</p>
        </div>
      </div>
    </motion.div>
  );
}

function OrdersTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {ORDERS.map((order, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative overflow-hidden">
          
          {/* Status Indicator Strip */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            order.status === 'new' ? 'bg-orange-500' : 
            order.status === 'packing' ? 'bg-blue-500' : 
            order.status === 'ready' ? 'bg-[#0c831f]' : 'bg-gray-300'
          }`} />

          <div className="ml-2 flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{order.id}</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{order.time}</span>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-1">{order.items} Items • {order.total}</p>
            </div>
            
            {/* Action Button based on status */}
            {order.status === 'new' && (
              <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-orange-600 transition-colors">
                ACCEPT
              </button>
            )}
            {order.status === 'packing' && (
              <button className="bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-600 transition-colors">
                MARK PACKED
              </button>
            )}
            {order.status === 'ready' && (
              <div className="flex items-center gap-1 text-[#0c831f]">
                <CheckCircle size={16} />
                <span className="text-[10px] font-bold">READY FOR RIDER</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
        active 
          ? 'bg-[#121212] text-white shadow-md' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function NavIcon({ icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-[#0c831f]' : 'text-gray-400 hover:text-gray-600'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}
