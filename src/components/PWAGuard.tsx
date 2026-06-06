'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAGuard = ({ children }: { children: React.ReactNode }) => {
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered: ', registration);
          },
          (registrationError) => {
            console.log('SW registration failed: ', registrationError);
          }
        );
      });
    }

    // Detect Brave
    const detectBrave = async () => {
      const isBraveBrowser = !!(navigator as any).brave && await (navigator as any).brave.isBrave();
      setIsBrave(isBraveBrowser);
    };
    detectBrave();

    // Check if running in standalone mode
    const checkStandalone = () => {
      const isDev = window.location.hostname === 'localhost';
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes('android-app://');
      
      setIsStandalone(isDev || isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    };
    detectIOS();

    // Listen for beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        // standalone mode check will likely trigger on reload/re-entry
      }
      setDeferredPrompt(null);
    }
  };

  // While checking, show nothing or a loader
  if (isStandalone === null) return null;

  // If already installed, render the app
  if (isStandalone) return <>{children}</>;

  // Landing page for forcing installation
  return (
    <div className="fixed inset-0 z-[9999] bg-[#141414] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full py-10"
      >
        <h1 className="text-6xl font-black text-[#E50914] mb-8 tracking-tighter">SALIDA</h1>
        
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {isBrave ? 'Ready to Install SALIDA?' : 'Unlock the Premium Experience'}
          </h2>
          <p className="text-gray-400 text-lg">
            {isBrave 
              ? 'You are using Brave! Install the app now for the best ad-free streaming experience.' 
              : 'For a Premium Feel & Ad-Free experience, we strongly recommend using Brave Browser.'}
          </p>

          {!isBrave && !isIOS && (
            <div className="space-y-4">
              <a 
                href="https://brave.com/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#ff5e00] text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-[#ff5e00]/20 transition-all transform active:scale-95"
              >
                <img 
                  src="https://brave.com/static-assets/images/brave-logo-sans-text.svg" 
                  alt="Brave" 
                  className="w-6 h-6 brightness-0 invert"
                />
                GET BRAVE BROWSER
              </a>
              <p className="text-gray-500 text-xs">
                Open this site in Brave to enable the premium app installation.
              </p>
            </div>
          )}

          <div className={`bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm ${!isBrave && !isIOS ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            {isIOS ? (
              <div className="space-y-4 text-left">
                <p className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="bg-white/10 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                  Tap the share button below
                </p>
                <p className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="bg-white/10 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                  Select "Add to Home Screen"
                </p>
                <div className="pt-2 flex justify-center">
                  <svg className="w-6 h-6 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleInstall}
                  disabled={!deferredPrompt}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 ${
                    deferredPrompt 
                      ? 'bg-[#E50914] text-white shadow-xl shadow-red-600/20' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {deferredPrompt ? 'INSTALL APP NOW' : 'BROWSER READY...'}
                </button>
                {isBrave && !deferredPrompt && (
                  <p className="text-xs text-gray-400">
                    Brave users: If the button is disabled, tap the <span className="font-bold text-white">Install icon</span> in your address bar or menu.
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm italic">
            Once installed, open SALIDA from your home screen.
          </p>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E50914] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E50914] rounded-full blur-[120px]" />
      </div>
    </div>
  );
};
