"use client";

import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-[600px] mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Success Icon & Header */}
        <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 flex flex-col items-center flex-1 w-full">
            <div className="w-24 h-24 bg-casano-green-light rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-14 h-14 text-casano-green" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Order Placed Successfully!</h1>
            <p className="text-gray-500 font-medium mb-10 text-center">Sit tight, your items will be with you shortly.</p>

            {/* Tracking Card */}
            <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                    <div className="h-full bg-casano-orange rounded-r-full" style={{ width: '25%' }}></div>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                    <div className="w-12 h-12 bg-casano-orange-light rounded-2xl flex items-center justify-center text-casano-orange">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Arriving in 15 minutes</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Preparing your order...</p>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-50">Order Summary</h3>
                
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-start text-sm">
                        <div>
                           <p className="font-semibold text-gray-800">Camel Artist Water Colors</p>
                           <p className="text-gray-500">Qty: 1</p>
                        </div>
                        <span className="font-bold text-gray-800">₹250</span>
                    </div>
                    <div className="flex justify-between items-start text-sm">
                        <div>
                           <p className="font-semibold text-gray-800">Classmate Notebook</p>
                           <p className="text-gray-500">Qty: 3</p>
                        </div>
                        <span className="font-bold text-gray-800">₹150</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                    <span className="font-bold text-gray-600 text-sm">Total Paid</span>
                    <span className="font-black text-xl text-gray-900">₹400</span>
                </div>
            </div>

            {/* Action */}
            <Link href="/" className="w-full block">
                <button className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg">
                    Back to Home
                </button>
            </Link>
        </div>

      </main>
    </div>
  );
}
