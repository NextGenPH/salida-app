'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAGuard = ({ children }: { children: React.ReactNode }) => {
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
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
    <div className="fixed inset-0 z-[9999] bg-[#141414] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h1 className="text-6xl font-black text-[#E50914] mb-8 tracking-tighter">SALIDA</h1>
        
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Install the App to Start Watching
          </h2>
          <p className="text-gray-400 text-lg">
            Experience premium streaming with our official app. Fast, secure, and better performance.
          </p>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            {isIOS ? (
              <div className="space-y-4 text-left">
                <p className="font-semibold text-white flex items-center gap-2">
                  <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  Tap the share button below
                </p>
                <p className="font-semibold text-white flex items-center gap-2">
                  <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Select "Add to Home Screen"
                </p>
                <div className="pt-4 flex justify-center">
                  <svg className="w-8 h-8 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleInstall}
                  disabled={!deferredPrompt}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 ${
                    deferredPrompt 
                      ? 'bg-[#E50914] text-white shadow-xl shadow-red-600/20' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {deferredPrompt ? 'INSTALL APP NOW' : 'TAP BROWSER MENU TO INSTALL'}
                </button>
                {!deferredPrompt && (
                  <p className="text-xs text-gray-500">
                    If the button is disabled, tap your browser's menu (⋮) and select "Install app" or "Add to Home screen".
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Brave Recommendation */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-4">
              For a <span className="text-white font-bold">Premium Feel</span> & Ad-Free experience, we recommend using:
            </p>
            <a 
              href="https://brave.com/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#ff5e00]/10 hover:bg-[#ff5e00]/20 border border-[#ff5e00]/30 px-6 py-3 rounded-full transition-all group"
            >
              <img 
                src="https://brave.com/static-assets/images/brave-logo-sans-text.svg" 
                alt="Brave" 
                className="w-6 h-6"
              />
              <span className="text-[#ff5e00] font-bold">Brave Browser</span>
              <svg className="w-4 h-4 text-[#ff5e00] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
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
