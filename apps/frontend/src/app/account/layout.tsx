"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, ShoppingBag, MapPin, Headphones, ShieldAlert, LogOut, ChevronRight, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

const navItems = [
  { name: 'My Orders', href: '/account/orders', icon: ShoppingBag },
  { name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Help & Support', href: '/account/support', icon: Headphones },
  { name: 'Account Privacy', href: '/account/privacy', icon: ShieldAlert },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AuthGuard>
    <div className="min-h-[calc(100vh-68px)] bg-gray-50 dark:bg-[#0f0f0f] py-8 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center text-sm text-gray-400 mb-6 gap-2">
          <Link href="/" className="hover:text-[#19c74a] transition-colors flex items-center gap-1.5 font-medium">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 dark:text-gray-200 font-semibold">My Account</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-5 lg:gap-7">

          {/* Left Sidebar */}
          <aside className="w-full md:w-[280px] flex-shrink-0 space-y-4">
            {/* User Card */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#fd7e14] to-[#e8650f] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0">
                  {isLoggedIn && user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-gray-900 dark:text-white text-base leading-tight truncate">
                    {isLoggedIn ? (user?.name || 'User') : 'Guest'}
                  </h2>
                  {isLoggedIn && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">+91 {user?.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <ul className="flex flex-col py-1.5">
                {navItems.map((item: any) => {
                  const isActive = pathname === item.href || (pathname === '/account' && item.href === '/account/orders');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors font-medium text-sm border-l-[3px] ${
                          isActive
                            ? 'bg-[#19c74a]/5 dark:bg-[#19c74a]/10 border-[#19c74a] text-[#19c74a]'
                            : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#19c74a]' : 'text-gray-400'}`} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}

                <li className="mt-1.5 border-t border-gray-100 dark:border-gray-800 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3.5 px-5 py-3.5 transition-colors font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 min-h-[500px] transition-colors">
            {children}
          </main>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
