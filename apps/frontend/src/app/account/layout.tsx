"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, ShoppingBag, MapPin, Pill, Gift, ShieldAlert, LogOut, ChevronRight } from 'lucide-react';

const navItems = [
  { name: 'My Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'My Orders', href: '/account/orders', icon: ShoppingBag },
  { name: 'My Prescriptions', href: '/account/prescriptions', icon: Pill },
  { name: 'E-Gift Cards', href: '/account/gift-cards', icon: Gift },
  { name: 'Account privacy', href: '/account/privacy', icon: ShieldAlert },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#121212] py-8 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-casano-orange transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-gray-200 font-medium">My Account</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          
          {/* Left Sidebar */}
          <aside className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors mb-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">My Account</h2>
              <p className="text-casano-orange font-bold font-mono tracking-tight text-lg">+91 85230 48480</p>
            </div>

            <nav className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <ul className="flex flex-col py-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (pathname === '/account' && item.href === '/account/orders');
                  return (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className={`flex items-center gap-4 px-6 py-4 transition-colors font-medium border-l-[3px] ${
                          isActive 
                            ? 'bg-gray-50 dark:bg-[#252525] border-casano-green text-casano-green' 
                            : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222]'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-casano-green' : 'text-gray-400'}`} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}

                <li className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <button className="w-full flex items-center gap-4 px-6 py-4 transition-colors font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Right Panel Content */}
          <main className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 transition-colors min-h-[500px]">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
