'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, BookOpen, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/features/AuthPrompt';

interface KamusData {
  id: number;
  kata: string;
  indo: string;
  ket: string;
  english: string;
  aksara_bali?: string;
}

// Komponen Modal Detail
const WordDetailModal = ({ item, onClose, onSelectRelated }: { item: KamusData, onClose: () => void, onSelectRelated: (word: KamusData) => void }) => {
  const [relatedWords, setRelatedWords] = useState<KamusData[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRelated = async () => {
      setIsLoadingRelated(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_API_URL}/guest/kataTerkait?q=${encodeURIComponent(item.kata)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setRelatedWords(data);
        }
      } catch (error) {
        console.error("Gagal mengambil kata terkait:", error);
      } finally {
        if (isMounted) setIsLoadingRelated(false);
      }
    };
    fetchRelated();

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      isMounted = false;
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Detail Kamus</span>
        </div>

        {item.aksara_bali && (
          <div className="font-bali text-5xl md:text-6xl text-[#ea580c] mb-4 leading-tight">
            {item.aksara_bali}
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
          {item.kata}
        </h2>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
            <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bahasa Indonesia</p>
            <p className="text-lg md:text-xl text-slate-800">{item.indo || '-'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/50 p-4 md:p-5 rounded-2xl border border-amber-100/50">
              <p className="text-xs md:text-sm font-semibold text-[#ea580c] uppercase tracking-wider mb-2">English</p>
              <p className="text-base md:text-lg text-slate-800">{item.english || '-'}</p>
            </div>
            <div className="bg-emerald-50/50 p-4 md:p-5 rounded-2xl border border-emerald-100/50">
              <p className="text-xs md:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">Keterangan / Konteks</p>
              <p className="text-base md:text-lg text-slate-800">{item.ket || '-'}</p>
            </div>
          </div>

          {/* Kata Terkait Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-4">
               <Sparkles className="w-5 h-5 text-amber-600" />
               <h3 className="font-bold text-slate-800 text-lg">Kata Terkait</h3>
             </div>
             {isLoadingRelated ? (
               <div className="flex items-center justify-center py-4">
                 <Loader2 className="w-6 h-6 text-amber-700 animate-spin" />
               </div>
             ) : relatedWords.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {relatedWords.map((related) => (
                   <button 
                     key={related.id} 
                     onClick={() => onSelectRelated(related)}
                     className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-sm text-left hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-colors shadow-sm group"
                   >
                     <span className="font-semibold group-hover:text-white transition-colors">{related.kata}</span>
                     {related.indo && <span className="ml-1 text-slate-500 group-hover:text-amber-100 transition-colors">- {related.indo}</span>}
                   </button>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">Tidak ada kata terkait.</p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<KamusData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const [activeLetter, setActiveLetter] = useState('A');
  const [alphabetWords, setAlphabetWords] = useState<KamusData[]>([]);
  const [isLoadingAlphabet, setIsLoadingAlphabet] = useState(false);
  
  // Modal state
  const [modalData, setModalData] = useState<KamusData | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_API_URL}/guest/dataKamus?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Gagal mengambil data kamus:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Fetching for Alphabet
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const fetchAlphabet = async () => {
      setIsLoadingAlphabet(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_API_URL}/guest/dataKamus?q=${activeLetter}`);
        if (res.ok) {
           const data = await res.json();
           if (isMounted) {
             setAlphabetWords(data as KamusData[]);
           }
        }
      } catch(e) {
        console.error("Gagal mengambil data alfabet:", e);
      } finally {
        if (isMounted) setIsLoadingAlphabet(false);
      }
    }
    fetchAlphabet();
    return () => { isMounted = false; };
  }, [activeLetter, isAuthenticated]);

  const handleSelectWord = (word: KamusData) => {
    setShowDropdown(false);
    setQuery(''); 
    setModalData(word);
  };

  const handleSearchSubmit = () => {
    if (query.trim().length >= 3) {
      setShowDropdown(false);
      setAlphabetWords(suggestions);
      setActiveLetter('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 relative overflow-x-hidden py-10">
      {/* Modal Overlay */}
      {modalData && (
        <WordDetailModal 
          item={modalData} 
          onClose={() => setModalData(null)} 
          onSelectRelated={(word) => setModalData(word)}
        />
      )}

      {/* Background Ornamen Cahaya Abstrak */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        
        {/* Header Teks */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Balinese Dictionary</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-500 tracking-tight leading-tight">
            Kamus Bahasa Bali & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
              Eksplorasi Aksara Bali
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Temukan makna, pelajari bentuk tulisan, dan lestarikan warisan budaya melalui portal digitalisasi terlengkap.
          </p>
        </div>

        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[40vh] animate-in fade-in duration-500">
             <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
             <p className="text-slate-500 font-medium animate-pulse tracking-wide">Menyiapkan Kamus...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="pt-4">
            <AuthPrompt 
              title="Autentikasi Diperlukan" 
              description="Silakan login terlebih dahulu" 
            />
          </div>
        ) : (
          <>
            {/* Kotak Pencarian Utama */}
            <div className="relative max-w-2xl mx-auto group pt-4" ref={dropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-4 pt-4 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                ) : (
                  <Search className="h-6 w-6 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length >= 3) setShowDropdown(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
                className="block w-full pl-14 pr-32 py-4 md:py-5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md text-base md:text-lg shadow-lg shadow-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                placeholder="Ketik min. 3 huruf (cth: pura, lontar)..."
              />
              <div className="absolute inset-y-0 right-2 pt-3 md:pt-4 flex items-center">
                <button 
                  onClick={handleSearchSubmit}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm md:text-base"
                >
                  Cari
                </button>
              </div>

              {/* Dropdown Suggestions */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                  <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {suggestions.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleSelectWord(item)}
                        className="px-6 py-4 hover:bg-amber-50/80 cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-lg font-serif mb-1">{item.kata}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">{item.indo}</p>
                        </div>
                        {item.english && (
                          <div className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full w-fit whitespace-nowrap self-start md:self-center">
                            {item.english}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Not Found state */}
              {showDropdown && query.length >= 3 && !isSearching && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 p-6 text-center">
                  <p className="text-slate-500">Tidak ada kata yang cocok dengan "<span className="font-semibold text-slate-700">{query}</span>"</p>
                </div>
              )}
            </div>
            
            {/* Alphabet Chips Section */}
            <div className="mt-12 w-full max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
               {/* Sticky Alphabet Ribbon */}
               <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-2 overflow-x-auto flex gap-2 md:gap-3 pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {ALPHABET.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setActiveLetter(letter)}
                      className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-200 border-2 ${
                        activeLetter === letter 
                          ? 'bg-amber-700 border-amber-700 text-white shadow-lg scale-105' 
                          : 'bg-transparent border-amber-700 text-amber-700 hover:bg-amber-700/10'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
               </div>

               {/* Kata Meta Text */}
               <div className="text-left px-2">
                 <p className="text-sm font-medium text-slate-500">
                   {activeLetter 
                     ? `Menampilkan ${alphabetWords.length} kata berawalan '${activeLetter}'`
                     : `Menampilkan ${alphabetWords.length} hasil pencarian untuk '${query}'`}
                 </p>
               </div>

               {/* Dense Chip Cloud List */}
               <div className="w-full relative min-h-[300px]">
                  {/* Overlay Loader yang muncul halus */}
                  {isLoadingAlphabet && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/40 backdrop-blur-[2px] rounded-3xl animate-in fade-in duration-300">
                       <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100">
                          <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
                       </div>
                    </div>
                  )}
                  
                  {/* Kontainer Utama yang bertransisi halus */}
                  <div className={`transition-all duration-500 ease-out ${isLoadingAlphabet ? 'opacity-40 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
                    {alphabetWords.length === 0 && !isLoadingAlphabet ? (
                      <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                         <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                         <p className="text-slate-500 font-medium text-lg">Tidak ada kata yang ditemukan.</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 md:gap-3 text-left bg-white/60 p-4 md:p-6 rounded-3xl border border-slate-200/60 shadow-sm min-h-[300px] content-start">
                        {alphabetWords.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setModalData(item)}
                            className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-sm md:text-base font-medium cursor-pointer hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-colors shadow-sm"
                          >
                            {item.kata}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
