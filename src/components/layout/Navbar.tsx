'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, Menu, X, UserCircle2, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup menu jika pengguna klik di luar area profil
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dropdown dan menu mobile saat rute berganti
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-brand-charcoal/80 border-b border-brand-accent-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 flex-1">
            <Link href="/home" className="flex items-center gap-2 group max-w-[70vw]">
              <img 
                src="/img/baliscript_logo_horizontal.png" 
                alt="Balinesescript Header Logo" 
                className="h-14 md:h-16 w-auto max-w-full object-contain"
              />
            </Link>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/home" className={`font-medium transition-colors ${pathname === '/home' ? 'text-brand-neon-red' : 'text-brand-bright-white hover:text-brand-neon-red'}`}>
              Beranda
            </Link>
            <Link href="/" className={`font-medium transition-colors ${pathname === '/' ? 'text-brand-neon-red' : 'text-brand-bright-white hover:text-brand-neon-red'}`}>
              Kamus
            </Link>
            <Link href="/ocr" className={`font-medium transition-colors ${pathname === '/ocr' ? 'text-brand-neon-red' : 'text-brand-bright-white hover:text-brand-neon-red'}`}>
              Baca Aksara
            </Link>
            <Link href="/kuis" className={`font-medium transition-colors ${pathname === '/kuis' ? 'text-brand-neon-red' : 'text-brand-bright-white hover:text-brand-neon-red'}`}>
              Nulis Aksara Bali
            </Link>
          </div>

          {/* User Desktop / Mobile Toggle */}
          <div className="flex items-center gap-4 flex-shrink-0 z-50">
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 hover:bg-brand-neon-red-grey py-1.5 px-3 rounded-full transition-colors"
                >
                  {user.id === 'anon' ? (
                    <UserCircle2 className="w-8 h-8 text-gray-400" />
                  ) : (
                    <img src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full bg-brand-neon-red-grey object-cover" />
                  )}
                  <span className="text-sm font-semibold text-brand-bright-white">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-brand-charcoal border border-brand-accent-grey rounded-xl shadow-lg py-1 z-50">
                     <button 
                       onClick={() => { logout(); setIsProfileDropdownOpen(false); }} 
                       className="w-full text-left px-4 py-2.5 text-sm text-brand-neon-red hover:bg-brand-neon-red/10 flex items-center gap-2 font-medium transition-colors"
                     >
                       <LogOut className="w-4 h-4" />
                       Keluar
                     </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Hamburger Button (Mobile) */}
            <div className="md:hidden flex items-center relative z-50">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-bright-white hover:text-brand-neon-red focus:outline-none p-2"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark-bg-bg border-b border-brand-accent-grey w-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/home' ? 'text-brand-neon-red bg-brand-neon-red/10' : 'text-brand-bright-white hover:bg-brand-charcoal hover:text-brand-neon-red'}`}>
              Beranda
            </Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/' ? 'text-brand-neon-red bg-brand-neon-red/10' : 'text-brand-bright-white hover:bg-brand-charcoal hover:text-brand-neon-red'}`}>
              Kamus
            </Link>
            <Link href="/ocr" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/ocr' ? 'text-brand-neon-red bg-brand-neon-red/10' : 'text-brand-bright-white hover:bg-brand-charcoal hover:text-brand-neon-red'}`}>
              Baca Aksara
            </Link>
            <Link href="/kuis" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/kuis' ? 'text-brand-neon-red bg-brand-neon-red/10' : 'text-brand-bright-white hover:bg-brand-charcoal hover:text-brand-neon-red'}`}>
              Nulis Aksara Bali
            </Link>

            {isAuthenticated && user && (
              <div className="mt-4 pt-4 border-t border-brand-accent-grey px-3">
                <div className="flex items-center gap-3 mb-4">
                  {user.id === 'anon' ? (
                    <UserCircle2 className="w-10 h-10 text-gray-400" />
                  ) : (
                    <img src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full bg-brand-neon-red-grey object-cover" />
                  )}
                  <div>
                    <div className="font-medium text-brand-bright-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-brand-neon-red hover:bg-brand-neon-red/10 px-3 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
