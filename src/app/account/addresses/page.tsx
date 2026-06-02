"use client";

import { useState } from 'react';
import { Plus, MapPin, MoreVertical, Building2, Home } from 'lucide-react';
import LocationModal from '../../../components/LocationModal';
import { useAuth } from '../../../context/AuthContext';

const mockAddresses = [
  {
    id: '1',
    type: 'Home',
    icon: Home,
    name: 'Ankush Singh',
    phone: '+91 85230 48480',
    address: 'Macdonalds Electronic City Phase 1, Electronic City, Bengaluru, Karnataka 560100',
    isDefault: true
  },
  {
    id: '2',
    type: 'Work',
    icon: Building2,
    name: 'Ankush Singh',
    phone: '+91 85230 48480',
    address: 'Scaler School of Technology, HSR Layout Sector 2, Bengaluru, Karnataka 560102',
    isDefault: false
  }
];

export default function AddressesPage() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { user } = useAuth(); // Could use to pre-fill phone

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved delivery locations</p>
        </div>
        
        <button 
          onClick={() => setIsLocationOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-[#19c74a] hover:bg-[#15a83e] text-white px-5 py-2.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md shadow-[#19c74a]/20"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {mockAddresses.map((addr) => (
          <div key={addr.id} className="bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-[#19c74a]/50 hover:shadow-md transition-all group">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <addr.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">{addr.type}</span>
                {addr.isDefault && (
                  <span className="ml-2 bg-[#19c74a]/10 text-[#19c74a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-[15px]">{addr.name}</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{addr.address}</p>
              <p className="text-[13px] text-gray-900 dark:text-gray-300 font-bold mt-2 pt-1">{addr.phone}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button className="text-sm font-bold text-casano-orange hover:text-casano-orange-dark hover:underline transition-colors uppercase tracking-wider">Edit</button>
              <button className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline transition-colors uppercase tracking-wider">Delete</button>
            </div>
            
          </div>
        ))}

        {/* Mobile sticky add button */}
        <button 
          onClick={() => setIsLocationOpen(true)}
          className="sm:hidden fixed bottom-6 left-4 right-4 z-50 flex items-center justify-center gap-2 bg-[#19c74a] text-white p-4 rounded-xl font-bold shadow-lg shadow-[#19c74a]/30"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> Add New Address
        </button>
      </div>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </div>
  );
}
