"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export type OrderStatus = "PLACED" | "ACCEPTED" | "PACKING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED" | "PAID";

export interface DriverLocation {
  lat: number;
  lng: number;
  heading?: number;
  eta?: number;
  timestamp: number;
}

interface UseOrderTrackingResult {
  status: OrderStatus | null;
  driverLocation: DriverLocation | null;
  isConnected: boolean;
}

export function useOrderTracking(orderId: string | null): UseOrderTrackingResult {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const socket = io(BACKEND, { transports: ["websocket"], reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join", `order_${orderId}`);
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("order_status", (data: { status: OrderStatus; orderId: string }) => {
      if (data.orderId === orderId) setStatus(data.status);
    });

    socket.on("orderUpdated", (data: { id: string; status: OrderStatus }) => {
      if (data.id === orderId) setStatus(data.status);
    });

    socket.on("driver_location", (loc: DriverLocation) => {
      setDriverLocation(loc);
    });

    socket.on("orderPaid", (data: { orderId: string }) => {
      if (data.orderId === orderId) setStatus("PAID");
    });

    return () => {
      socket.emit("leave", `order_${orderId}`);
      socket.disconnect();
    };
  }, [orderId]);

  return { status, driverLocation, isConnected };
}
