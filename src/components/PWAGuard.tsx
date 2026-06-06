'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Spinner } from './Spinner';

export const PWAGuard = ({ children }: { children: React.ReactNode }) => {
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isBrave, setIsBrave] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW Error:', err));
    }

    const init = async () => {
      try {
        // Detect Brave
        if ((navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function') {
          const isBraveBrowser = await (navigator as any).brave.isBrave();
          setIsBrave(!!isBraveBrowser);
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Check standalone mode
        const isStandaloneMode = 
          window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone || 
          document.referrer.includes('android-app://') ||
          window.location.hostname === 'localhost';
        
        setIsStandalone(isStandaloneMode);
      } catch (error) {
        console.error('Detection error:', error);
        setIsStandalone(false); // Default to gate if check fails
      }
    };

    init();

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
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  // Prevent hydration mismatch and white screen
  if (!isMounted || isStandalone === null) {
    return (
      <div className="fixed inset-0 bg-[#141414] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

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

          {!isBrave && !isIOS ? (
            <div className="space-y-6">
              <div className="text-left space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-[#ff5e00] font-bold text-lg uppercase tracking-wider">Instructions:</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-[#ff5e00]/20 text-[#ff5e00] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                    <span>Download and install <span className="text-white font-bold">Brave Browser</span> using the button below.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#ff5e00]/20 text-[#ff5e00] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                    <span>Open <span className="text-white font-bold">SALIDA</span> inside your new Brave Browser.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#ff5e00]/20 text-[#ff5e00] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                    <span>Follow the in-app prompts to install the premium player.</span>
                  </li>
                </ul>
              </div>
              <a 
                href="https://brave.com/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#ff5e00] text-white py-5 rounded-xl font-black text-xl shadow-xl shadow-[#ff5e00]/20 transition-all transform active:scale-95"
              >
                <img 
                  src="https://brave.com/static-assets/images/brave-logo-sans-text.svg" 
                  alt="Brave" 
                  className="w-7 h-7 brightness-0 invert"
                />
                GET BRAVE BROWSER
              </a>
            </div>
          ) : (
            <div className={`space-y-6`}>
              <div className="text-left space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-[#E50914] font-bold text-lg uppercase tracking-wider">How to Install:</h3>
                {isIOS ? (
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex gap-3 items-center">
                      <span className="bg-[#E50914]/20 text-[#E50914] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                      <span>Tap the <span className="text-white font-bold">Share button</span> (square with arrow) at the bottom.</span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <span className="bg-[#E50914]/20 text-[#E50914] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                      <span>Scroll down and select <span className="text-white font-bold">"Add to Home Screen"</span>.</span>
                    </li>
                    <li className="flex gap-3 items-center text-blue-400 font-medium">
                      <span className="bg-blue-500/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </span>
                      <span>Look for the icon in your browser toolbar.</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex gap-3 items-center">
                      <span className="bg-[#E50914]/20 text-[#E50914] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                      <span>Tap the <span className="text-white font-bold">"INSTALL APP NOW"</span> button below.</span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <span className="bg-[#E50914]/20 text-[#E50914] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                      <span>If the button is disabled, tap the <span className="text-white font-bold text-lg">⊞</span> or <span className="text-white font-bold">Install</span> icon in your address bar.</span>
                    </li>
                  </ul>
                )}
              </div>
              
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  disabled={!deferredPrompt}
                  className={`w-full py-5 rounded-xl font-black text-xl transition-all transform active:scale-95 ${
                    deferredPrompt 
                      ? 'bg-[#E50914] text-white shadow-xl shadow-red-600/20' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {deferredPrompt ? 'INSTALL APP NOW' : 'WAITING FOR BROWSER...'}
                </button>
              )}
            </div>
          )}

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
