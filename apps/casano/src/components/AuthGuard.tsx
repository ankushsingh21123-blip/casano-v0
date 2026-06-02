"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps any client page/layout that requires the user to be authenticated.
 * While loading Firebase auth state → shows a spinner.
 * If not logged in → shows the LoginModal inline; on close without login → go home.
 * If logged in → renders children.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setShowModal(true);
    }
  }, [loading, isLoggedIn]);

  const handleModalClose = () => {
    setShowModal(false);
    if (!isLoggedIn) {
      router.push("/");
    }
  };

  // While Firebase resolves auth state, show a neutral spinner
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#19c74a] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in → show login modal (children are not rendered)
  if (!isLoggedIn) {
    return (
      <LoginModal isOpen={showModal} onClose={handleModalClose} />
    );
  }

  // Logged in → render the page normally
  return <>{children}</>;
}
