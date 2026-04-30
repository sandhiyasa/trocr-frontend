'use client';

import { Search, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/features/AuthPrompt';

export default function Home() {
  const { isAuthenticated } = useAuth();

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
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
              title="Akses Kamus" 
              description="Silakan login dan selesaikan CAPTCHA untuk menggunakan fitur pencarian Kamus." 
            />
          </div>
        ) : (
          <>
            {/* Kotak Pencarian Utama */}
            <div className="relative max-w-2xl mx-auto group pt-4">
              <div className="absolute inset-y-0 left-0 pl-4 pt-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-32 py-4 md:py-5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md text-base md:text-lg shadow-lg shadow-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                placeholder="Ketik kata dalam Bahasa Bali atau Indonesia..."
              />
              <div className="absolute inset-y-0 right-2 pt-3 md:pt-4 flex items-center">
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm md:text-base">
                  Cari
                </button>
              </div>
            </div>
            
            {/* Chip Pencarian Populer */}
            <div className="pt-6 md:pt-8">
              <p className="text-sm text-slate-500 mb-4 font-medium">Pencarian Populer:</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
                {['Rahajeng', 'Om Swastiastu', 'Lontar', 'Banten', 'Purnama'].map((word) => (
                  <button 
                    key={word} 
                    className="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs md:text-sm font-medium hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
