"use client";

import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// Mock data representing past orders
const mockOrders = [
  {
    id: 'ORD37929818736',
    date: '10 March 2026, 08:42 PM',
    status: 'Delivered',
    total: 399,
    items: [
      { id: 'almonds-500g', name: 'Premium Quality California Almonds (Badam)', price: 399, quantity: 1, size: '500 g', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80' }
    ]
  },
  {
    id: 'ORD37929818735',
    date: '08 March 2026, 02:15 PM',
    status: 'Cancelled',
    total: 1250,
    items: [
      { id: '1', name: 'Camel Artist Water Colors', price: 250, quantity: 1, size: 'Pack of 1', image: 'https://m.media-amazon.com/images/I/71oJ3D0pXIL.jpg' },
      { id: '2', name: 'Classmate Single Line Notebook', price: 50, quantity: 20, size: '1 unit', image: 'https://m.media-amazon.com/images/I/71xSXXG4J9L._AC_UF1000,1000_QL80_.jpg' }
    ]
  }
];

export default function OrdersPage() {
  const { addItem, clearCart } = useCart();
  const router = useRouter();

  const handleReorder = (orderItems: any[]) => {
    // Optionally clear current cart, or just append
    clearCart();
    orderItems.forEach(item => {
      // Re-add each item from past order to global cart state
      // We pass the full required item shape without quantity, then addItem handles it.
      // But because our mock has quantity, we can loop to add it multiple times or refactor addItem.
      // For simplicity, we'll just add it once per quantity loop:
      for(let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          image: item.image
        });
      }
    });

    // Send them to the checkout page automatically
    router.push('/checkout');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View your past purchases and reorder essentials effortlessly</p>
        </div>
      </div>

      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-dashed border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center border border-gray-100 dark:border-gray-800 shrink-0">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">{order.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Paid</span>
                  <span className="font-black text-xl text-gray-900 dark:text-white leading-none">₹{order.total}</span>
                </div>
                
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-bold ${
                  order.status === 'Delivered' 
                    ? 'bg-[#19c74a]/10 text-[#19c74a]' 
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {order.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {order.status}
                </div>
              </div>
            </div>

            {/* Order Items Horizontal Scroll */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Items Purchased</h4>
              <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-[280px] flex items-center gap-3 bg-gray-50 dark:bg-[#222] p-3 rounded-2xl border border-gray-100 dark:border-gray-800 group">
                    <div className="w-14 h-14 bg-white dark:bg-[#333] rounded-xl p-1.5 shrink-0 border border-gray-100 dark:border-gray-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Qty: {item.quantity} • {item.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {order.status === 'Delivered' && (
                <button className="w-full sm:w-auto flex-1 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Rate Order
                </button>
              )}
              
              <button 
                onClick={() => handleReorder(order.items)}
                className="w-full sm:w-auto flex-1 bg-casano-orange hover:bg-casano-orange-dark text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-casano-orange/20"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" /> Buy it again
              </button>
            </div>

          </div>
        ))}

        <div className="text-center py-8">
          <p className="text-gray-400 font-medium text-sm">You have reached the end of your order history.</p>
        </div>
      </div>
    </div>
  );
}
