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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2 group">
              <div className="bg-amber-600 p-2 rounded-lg group-hover:bg-amber-700 transition-colors">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                Read<span className="text-amber-600">Bali</span>
              </span>
            </Link>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/home" className={`font-medium transition-colors ${pathname === '/home' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
              Beranda
            </Link>
            <Link href="/" className={`font-medium transition-colors ${pathname === '/' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
              Kamus
            </Link>
            <Link href="/ocr" className={`font-medium transition-colors ${pathname === '/ocr' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
              Baca Aksara
            </Link>
            <Link href="/kuis" className={`font-medium transition-colors ${pathname === '/kuis' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
              Kuis Aksara
            </Link>
          </div>

          {/* User Desktop / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 hover:bg-slate-100 py-1.5 px-3 rounded-full transition-colors"
                >
                  {user.id === 'anon' ? (
                    <UserCircle2 className="w-8 h-8 text-slate-400" />
                  ) : (
                    <img src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                  )}
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                     <button 
                       onClick={() => { logout(); setIsProfileDropdownOpen(false); }} 
                       className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                     >
                       <LogOut className="w-4 h-4" />
                       Keluar
                     </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Hamburger Button (Mobile) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-amber-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/home' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}`}>
              Beranda
            </Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}`}>
              Kamus
            </Link>
            <Link href="/ocr" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/ocr' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}`}>
              Baca Aksara
            </Link>
            <Link href="/kuis" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md font-medium ${pathname === '/kuis' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}`}>
              Kuis Aksara
            </Link>

            {isAuthenticated && user && (
              <div className="mt-4 pt-4 border-t border-slate-100 px-3">
                <div className="flex items-center gap-3 mb-4">
                  {user.id === 'anon' ? (
                    <UserCircle2 className="w-10 h-10 text-slate-400" />
                  ) : (
                    <img src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                  )}
                  <div>
                    <div className="font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
