'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 z-50 flex w-full items-center justify-between px-5 md:px-10 py-4 transition-colors duration-300 ${
          isScrolled ? 'bg-[#141414]' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-[#E50914]">
            SALIDA
          </Link>
          <div className="hidden space-x-4 md:flex">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
            <Link href="/tv-shows" className="text-white hover:text-gray-300">TV Shows</Link>
            <Link href="/movies" className="text-white hover:text-gray-300">Movies</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="hidden md:block text-white hover:text-gray-300">Search</Link>
          <Link href="/my-list" className="hidden md:block text-white hover:text-gray-300">My List</Link>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#141414] p-5">
          <div className="flex justify-end">
            <button className="text-white" onClick={() => setIsMenuOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-8 mt-20">
            <Link href="/" className="text-2xl text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/tv-shows" className="text-2xl text-white" onClick={() => setIsMenuOpen(false)}>TV Shows</Link>
            <Link href="/movies" className="text-2xl text-white" onClick={() => setIsMenuOpen(false)}>Movies</Link>
            <Link href="/search" className="text-2xl text-white" onClick={() => setIsMenuOpen(false)}>Search</Link>
            <Link href="/my-list" className="text-2xl text-white" onClick={() => setIsMenuOpen(false)}>My List</Link>
          </div>
        </div>
      )}
    </>
  );
};
