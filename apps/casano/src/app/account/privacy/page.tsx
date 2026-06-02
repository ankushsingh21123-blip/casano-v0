"use client";

import { useState } from 'react';
import { ShieldAlert, Trash2, Bell, Eye, Lock, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

const privacySettings = [
  {
    id: 'personalization',
    label: 'Personalized Recommendations',
    description: 'Allow Casano to tailor product suggestions based on your purchase history.',
    defaultOn: true,
  },
  {
    id: 'analytics',
    label: 'Usage Analytics',
    description: 'Share anonymous usage data to help us improve the app experience.',
    defaultOn: true,
  },
  {
    id: 'marketing',
    label: 'Marketing Communications',
    description: 'Receive exclusive deals, offers, and updates via WhatsApp and email.',
    defaultOn: false,
  },
  {
    id: 'location',
    label: 'Precise Location Access',
    description: 'Use exact location to show nearest stores and calculate delivery time.',
    defaultOn: true,
  },
];

const notificationSettings = [
  { id: 'order_updates', label: 'Order Updates', description: 'Get notified about packing, dispatch, and delivery.' },
  { id: 'offers', label: 'Offers & Promotions', description: 'Exclusive deals, flash sales, and discount codes.' },
  { id: 'reminders', label: 'Cart Reminders', description: 'Reminders when you leave items in your cart.' },
];

export default function PrivacyPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries([...privacySettings, ...notificationSettings].map(s => [s.id, (s as any).defaultOn ?? true]))
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggle = (id: string) => setToggles(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Account Privacy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Control how your data is used and shared</p>
        </div>
      </div>

      {/* Privacy Controls */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-gray-400" />
          <h2 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider">Privacy Controls</h2>
        </div>
        <div className="space-y-3">
          {privacySettings.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-2xl gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{s.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{s.description}</p>
              </div>
              <button
                onClick={() => toggle(s.id)}
                className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 relative"
                style={{ background: toggles[s.id] ? '#19c74a' : '#d1d5db' }}
                aria-label={toggles[s.id] ? 'Disable' : 'Enable'}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
                  style={{ left: toggles[s.id] ? '22px' : '2px' }}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Settings */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-gray-400" />
          <h2 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider">Notification Preferences</h2>
        </div>
        <div className="space-y-3">
          {notificationSettings.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-2xl gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{s.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{s.description}</p>
              </div>
              <button
                onClick={() => toggle(s.id)}
                className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 relative"
                style={{ background: toggles[s.id] ? '#19c74a' : '#d1d5db' }}
                aria-label={toggles[s.id] ? 'Disable' : 'Enable'}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
                  style={{ left: toggles[s.id] ? '22px' : '2px' }}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data & Security */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-400" />
          <h2 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider">Data & Security</h2>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-left group">
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Download My Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Export a copy of all data Casano holds about you.</p>
            </div>
            <span className="text-xs font-bold text-[#19c74a] group-hover:underline">Request</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-left group">
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Privacy Policy</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Read how we collect, use, and protect your data.</p>
            </div>
            <span className="text-xs font-bold text-blue-500 group-hover:underline">View →</span>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-black text-red-500 text-sm uppercase tracking-wider">Danger Zone</h2>
        </div>

        {!showDeleteConfirm ? (
          <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Delete My Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        ) : (
          <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-400 dark:border-red-700 rounded-2xl">
            <p className="font-black text-red-600 dark:text-red-400 text-sm mb-1">Are you absolutely sure?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              This will permanently erase your orders, addresses, and all account data. You will be logged out immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">
                Yes, Delete Everything
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
