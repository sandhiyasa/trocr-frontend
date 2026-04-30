'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login } = useAuth();
  
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = async (isAnonim: boolean) => {
    setIsProcessing(true);
    try {
      if (!executeRecaptcha) {
        alert("Sistem Keamanan sedang dimuat, mohon tunggu sebentar.");
        return;
      }

      // Verifikasi otomatis reCAPTCHA v3
      const token = await executeRecaptcha('login');
      
      if (!token) {
        alert("Gagal memverifikasi keamanan otomatis. Silakan coba lagi.");
        return;
      }

      if (isAnonim) {
        await login("anonim_token", true);
      } else {
        const mockGoogleToken = "dummy_google_token_" + Date.now();
        await login(mockGoogleToken, false);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal login: " + String(e));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Jendela Obrolan (Tampil jika isOpen = true) */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header Bli Bot */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Bli Bot</h3>
                <p className="text-xs text-emerald-100 opacity-90">Asisten Aksara Bali AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Konten */}
          <div className="h-[24rem] bg-slate-50 flex flex-col p-4 relative">
            
            {!isAuthenticated ? (
              // --- TAMPILAN JIKA BELUM LOGIN ---
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2.5">
                <div className="bg-emerald-100 p-3 rounded-full mb-1 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Autentikasi Diperlukan</h4>
                <p className="text-xs text-slate-500 mb-2 px-1">
                  Pilih cara masuk yang Anda inginkan (Dilindungi oleh Google reCAPTCHA v3).
                </p>

                {/* Tombol Login SSO Google */}
                <button 
                  onClick={() => handleLogin(false)}
                  disabled={isProcessing}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-3 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isProcessing ? 'Memuat...' : 'Masuk dengan Google'}
                </button>

                <div className="flex items-center gap-2 w-full py-1">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-medium text-slate-400">ATAU</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <button 
                  onClick={() => handleLogin(true)}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-3 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <UserCircle className="w-4 h-4 opacity-80" />
                  {isProcessing ? 'Memuat...' : 'Lanjutkan sebagai Anonim'}
                </button>

              </div>
            ) : (
              // --- TAMPILAN CHAT JIKA SUDAH LOGIN ---
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  
                  {/* Bubble Chat AI */}
                  <div className="flex items-start gap-2">
                    <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 shadow-sm leading-relaxed">
                      Rahajeng! Ada yang bisa Bli bantu tentang bahasa atau budaya Bali hari ini?
                    </div>
                  </div>

                  {/* Bubble Chat User Dummy */}
                  <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="bg-slate-200 p-2 rounded-full flex-shrink-0 mt-1">
                      <UserCircle className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-sm leading-relaxed">
                      Apa itu lontar?
                    </div>
                  </div>
                  
                </div>

                {/* Input Teks */}
                <div className="relative pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Tanya Bli Bot..."
                    className="w-full bg-white border border-slate-300 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                  />
                  <button className="absolute right-2 top-[calc(50%+4px)] -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-colors active:scale-95">
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Tombol Mengambang (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1'} text-white p-4 rounded-full shadow-[0_10px_25px_rgba(5,150,105,0.4)] transition-all duration-300`}
      >
        {isOpen ? <X className="w-6 h-6 -rotate-90 transition-transform" /> : <MessageSquare className="w-7 h-7" />}
      </button>
    </div>
  );
}
