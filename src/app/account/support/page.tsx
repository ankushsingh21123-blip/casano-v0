"use client";

import { useState } from 'react';
import { Headphones, ChevronDown, ChevronUp, Phone, Mail, MessageSquare } from 'lucide-react';

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'After placing an order, go to My Orders and tap your active order. You will see a live status and estimated delivery time.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders can be cancelled within 2 minutes of placing. After packing begins, cancellation is not available. Contact support for help.',
  },
  {
    q: 'What is the delivery charge?',
    a: 'Delivery is completely free on all orders. A small handling charge of ₹5 applies.',
  },
  {
    q: 'How do I return a product?',
    a: 'Raise a return request from the My Orders section within 24 hours of delivery. Our team will arrange a pickup.',
  },
  {
    q: 'How do I change my delivery address?',
    a: 'You can update your delivery address from the Saved Addresses section in your account, or update it at checkout.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI (GPay, PhonePe, BHIM), credit/debit cards, and net banking. Cash on delivery is not available.',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-4 mb-7 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-[#19c74a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Headphones className="w-5 h-5 text-[#19c74a]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Help & Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">We are here to help you, 24 hours a day</p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <a
          href="tel:+911800001234"
          className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#19c74a] hover:bg-[#19c74a]/5 transition-all group"
        >
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:bg-[#19c74a] transition-colors">
            <Phone className="w-4 h-4 text-[#19c74a] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Call Us</span>
          <span className="text-xs text-gray-400 font-medium">1800-001-2345</span>
        </a>

        <a
          href="mailto:support@casano.in"
          className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <Mail className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Email Us</span>
          <span className="text-xs text-gray-400 font-medium">support@casano.in</span>
        </a>

        <button className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
            <MessageSquare className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Live Chat</span>
          <span className="text-xs text-gray-400 font-medium">Avg. 2 min response</span>
        </button>
      </div>

      {/* FAQs */}
      <h2 className="font-black text-lg text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all hover:border-gray-200 dark:hover:border-gray-700"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
            >
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 pr-4">{faq.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
