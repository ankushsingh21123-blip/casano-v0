'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Check if dismissed recently (24h cooldown)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000) return;

    // iOS detection
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    if (isiOS) {
      // Show iOS guide after 8 seconds
      const timer = setTimeout(() => setShowPrompt(true), 8000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after 5 seconds
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          className="fixed bottom-20 left-3 right-3 z-[60] max-w-md mx-auto"
        >
          <div
            className="rounded-2xl p-4 shadow-2xl border backdrop-blur-xl"
            style={{
              background: 'var(--surface-card)',
              borderColor: 'var(--surface-border)',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full transition-colors"
              style={{ background: 'var(--surface-border)' }}
              aria-label="Dismiss install prompt"
            >
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {isIOS && !showIOSGuide ? (
              /* iOS Initial Prompt */
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #C1492E, #a03a22)' }}
                >
                  <Smartphone size={24} color="white" />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-black text-sm mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                    Add Casano to Home Screen
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Install for instant access, faster loading & push notifications
                  </p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(true)}
                  className="raj-btn px-4 py-2.5 text-xs font-black flex-shrink-0 rounded-xl"
                >
                  Install
                </button>
              </div>
            ) : isIOS && showIOSGuide ? (
              /* iOS Step-by-Step Guide */
              <div className="pr-6">
                <h4 className="font-black text-sm mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  How to Install on iPhone
                </h4>
                <div className="space-y-3">
                  {[
                    { step: 1, text: 'Tap the Share button', icon: <Share size={16} /> },
                    { step: 2, text: 'Scroll and tap "Add to Home Screen"', icon: <Download size={16} /> },
                    { step: 3, text: 'Tap "Add" in the top right', icon: <span className="text-xs font-black">Add</span> },
                  ].map(({ step, text, icon }) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
                        style={{ background: 'var(--action-primary)' }}
                      >
                        {step}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Android / Chrome Prompt */
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #C1492E, #a03a22)' }}
                >
                  <Download size={24} color="white" />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-black text-sm mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                    Install Casano App
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Quick orders, offline access & push notifications — zero storage
                  </p>
                </div>
                <button
                  onClick={handleInstall}
                  className="raj-btn px-4 py-2.5 text-xs font-black flex-shrink-0 rounded-xl"
                >
                  Install
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
