'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, BookOpen } from 'lucide-react';
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

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<KamusData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedWord, setSelectedWord] = useState<KamusData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State untuk fitur Tab dan Kata Terkait
  const [activeTab, setActiveTab] = useState<'hasil' | 'terkait'>('hasil');
  const [relatedWords, setRelatedWords] = useState<KamusData[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [expandedRelatedId, setExpandedRelatedId] = useState<number | null>(null);

  // Tutup dropdown jika pengguna klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efek Debounce untuk memanggil API
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
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectWord = async (word: KamusData) => {
    setSelectedWord(word);
    setShowDropdown(false);
    setQuery(''); // Reset input pencarian
    setActiveTab('hasil');
    
    // Fetch related words
    setIsLoadingRelated(true);
    setRelatedWords([]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_API_URL}/guest/kataTerkait?q=${encodeURIComponent(word.kata)}`);
      if (res.ok) {
        const data = await res.json();
        setRelatedWords(data);
      }
    } catch (error) {
      console.error("Gagal mengambil kata terkait:", error);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim().length >= 3) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden py-10">
      {/* Background Ornamen Cahaya Abstrak */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl w-full text-center space-y-8 z-10">
        
        {/* Header Teks */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Balinese Dictionary</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-500 tracking-tight leading-tight">
            Eksplorasi Kekayaan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
              Aksara & Bahasa Bali
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Temukan makna, pelajari bentuk tulisan, dan lestarikan warisan budaya melalui portal digitalisasi terlengkap.
          </p>
        </div>

        {!isAuthenticated ? (
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
                  if (selectedWord) setSelectedWord(null);
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
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
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
            
            {/* Selected Word Card & Tabs */}
            {selectedWord ? (
              <div className="max-w-2xl mx-auto mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                
                {/* Tabs Header */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-1.5 rounded-2xl flex gap-1 shadow-sm">
                    <button 
                      onClick={() => setActiveTab('hasil')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'hasil' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                      Hasil
                    </button>
                    <button 
                      onClick={() => setActiveTab('terkait')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'terkait' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                      Kata Terkait
                      {isLoadingRelated && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    </button>
                  </div>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110 duration-500" />
                  
                  {activeTab === 'hasil' ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Hasil Kamus</span>
                          </div>
                          {selectedWord.aksara_bali && (
                            <div className="font-bali text-5xl md:text-6xl text-amber-600 mb-2">
                              {selectedWord.aksara_bali}
                            </div>
                          )}
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
                            {selectedWord.kata}
                          </h2>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Bahasa Indonesia</p>
                          <p className="text-lg md:text-xl text-slate-800">{selectedWord.indo || '-'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50">
                            <p className="text-sm font-semibold text-amber-700 mb-1 uppercase tracking-wider">English</p>
                            <p className="text-base text-slate-800">{selectedWord.english || '-'}</p>
                          </div>
                          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50">
                            <p className="text-sm font-semibold text-emerald-700 mb-1 uppercase tracking-wider">Keterangan / Konteks</p>
                            <p className="text-base text-slate-800">{selectedWord.ket || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                       <div className="flex items-center gap-2 mb-6">
                          <Sparkles className="w-5 h-5 text-amber-600" />
                          <h3 className="text-lg font-bold text-slate-800">10 Kata Paling Mirip</h3>
                        </div>
                        {isLoadingRelated ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
                            <p className="text-slate-500 text-sm">Sedang mencari kata terkait...</p>
                          </div>
                        ) : relatedWords.length > 0 ? (
                          <div className="space-y-3">
                            {relatedWords.map((item, idx) => (
                              <div key={item.id} className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden transition-all">
                                <div 
                                  onClick={() => setExpandedRelatedId(expandedRelatedId === item.id ? null : item.id)}
                                  className="group/item flex items-center justify-between p-4 hover:bg-amber-50 cursor-pointer transition-colors"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-slate-400">#{idx + 1}</span>
                                      <h4 className="font-bold text-slate-800 text-lg font-serif group-hover/item:text-amber-700">{item.kata}</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.indo}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    {item.aksara_bali && (
                                       <div className="font-bali text-2xl text-amber-600 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                         {item.aksara_bali}
                                       </div>
                                    )}
                                  </div>
                                </div>
                                
                                {expandedRelatedId === item.id && (
                                  <div className="p-5 border-t border-slate-100 bg-white space-y-4 animate-in slide-in-from-top-2">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                      <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Bahasa Indonesia</p>
                                      <p className="text-base text-slate-800">{item.indo || '-'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                                        <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wider">English</p>
                                        <p className="text-sm text-slate-800">{item.english || '-'}</p>
                                      </div>
                                      <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                                        <p className="text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wider">Keterangan / Konteks</p>
                                        <p className="text-sm text-slate-800">{item.ket || '-'}</p>
                                      </div>
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedRelatedId(null);
                                          handleSelectWord(item);
                                        }}
                                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                      >
                                        Jadikan Pencarian Utama
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-slate-500">Tidak ada kata terkait ditemukan.</p>
                          </div>
                        )}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="pt-6 md:pt-8 animate-in fade-in duration-700">
                <p className="text-sm text-slate-500 mb-4 font-medium">Pencarian Populer:</p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
                  {['Rahajeng', 'Om Swastiastu', 'Lontar', 'Banten', 'Purnama'].map((word) => (
                    <button 
                      key={word} 
                      onClick={() => {
                        setQuery(word);
                        setShowDropdown(true);
                      }}
                      className="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs md:text-sm font-medium hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  );
}
