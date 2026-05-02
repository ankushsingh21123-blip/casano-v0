"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export type UserProfile = {
  uid: string;
  phone?: string | null;
  email?: string | null;
  full_name?: string | null;
  photo_url?: string | null;
  role: 'customer' | 'vendor' | 'admin';
};

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  deliveryLocation: string;
  setDeliveryLocation: (loc: string) => void;
  // Legacy compatibility
  login: (phone: string) => void;
  setProfile: (name: string, address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocationState] = useState('');

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/api/auth/me`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const { user: profile } = await res.json();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // On app boot — check session cookie
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const logout = async () => {
    try {
      await fetch(`${BACKEND}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    // Also sign out Firebase if available
    try {
      const { auth } = await import('@/lib/firebase');
      if (auth) await auth.signOut();
    } catch {}
    setUser(null);
  };

  const setDeliveryLocation = (loc: string) => setDeliveryLocationState(loc);

  // Legacy shims
  const login = (_phone: string) => {};
  const setProfile = async (name: string, _address: string) => {
    if (user) setUser(prev => prev ? { ...prev, full_name: name } : null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, loading,
      refreshUser, logout,
      deliveryLocation, setDeliveryLocation,
      login, setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
