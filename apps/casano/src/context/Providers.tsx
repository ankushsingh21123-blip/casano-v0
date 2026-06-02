"use client";
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import SplashLoader from '../components/SplashLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  // Show splash only once per browser session
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splash_shown');
    if (!alreadyShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_shown', '1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashLoader />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
