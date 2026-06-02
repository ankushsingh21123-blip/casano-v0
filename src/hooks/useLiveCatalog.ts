"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { io, Socket } from "socket.io-client";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";


export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  category?: string;
  image_url?: string;
  unit?: string;
  is_available: boolean;
  vendor_id?: string;
  description?: string;
  stock_quantity?: number;
  vendors?: { shop_name: string; area: string };
}

interface UseLiveCatalogOptions {
  category?: string;
  vendorId?: string;
  searchQuery?: string;
  enabled?: boolean;
}

export function useLiveCatalog({ category, vendorId, searchQuery, enabled = true }: UseLiveCatalogOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = { current: null as Socket | null };

  const fetchProducts = useCallback(async () => {
    if (!enabled) return;
    setLoading(true); setError(null);
    try {
      let query = supabase.from("products").select("*, vendors(shop_name, area)").eq("is_available", true).order("name");
      if (category) query = query.eq("category", category);
      if (vendorId) query = query.eq("vendor_id", vendorId);
      if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);
      const { data, error: err } = await query;
      if (err) throw err;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, vendorId, searchQuery, enabled]);

  // Initial fetch
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newProd = payload.new as Product;
          if (!newProd.is_available) return;
          if (category && newProd.category !== category) return;
          if (vendorId && newProd.vendor_id !== vendorId) return;
          setProducts(prev => [newProd, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as Product;
          setProducts(prev => {
            const exists = prev.find(p => p.id === updated.id);
            if (!updated.is_available) return prev.filter(p => p.id !== updated.id);
            if (exists) return prev.map(p => p.id === updated.id ? { ...p, ...updated } : p);
            return [updated, ...prev];
          });
        } else if (payload.eventType === "DELETE") {
          setProducts(prev => prev.filter(p => p.id !== (payload.old as Product).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [category, vendorId, enabled]);

  // Socket.io for backend events
  useEffect(() => {
    if (!enabled) return;
    const socket = io(BACKEND, { transports: ["websocket"], reconnectionAttempts: 3 });
    socketRef.current = socket;
    socket.on("product_updated", (data: Product) => {
      setProducts(prev => {
        if (!data.is_available) return prev.filter(p => p.id !== data.id);
        return prev.map(p => p.id === data.id ? { ...p, ...data } : p);
      });
    });
    return () => { socket.disconnect(); };
  }, [enabled]);

  return { products, loading, error, refetch: fetchProducts };
}
