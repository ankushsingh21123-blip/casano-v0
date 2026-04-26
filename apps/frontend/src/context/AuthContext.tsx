"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  phone: string;
  name: string;
  address: string;
} | null;

interface AuthContextType {
  user: User;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  setProfile: (name: string, address: string) => void;
  logout: () => void;
  deliveryLocation: string;
  setDeliveryLocation: (loc: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [deliveryLocation, setDeliveryLocationState] = useState<string>('');

  const login = (phone: string) => setUser({ phone, name: '', address: '' });

  const setProfile = (name: string, address: string) => {
    setUser(prev => prev ? { ...prev, name, address } : null);
  };

  const setDeliveryLocation = (loc: string) => {
      setDeliveryLocationState(loc);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, setProfile, logout, deliveryLocation, setDeliveryLocation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
