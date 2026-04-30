'use client';

import { useState } from 'react';
import { ShieldCheck, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

interface AuthPromptProps {
  title: string;
  description: string;
}

export default function AuthPrompt({ title, description }: AuthPromptProps) {
  const { login, loginWithGoogle } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsProcessing(true);
    try {
      if (executeRecaptcha) {
        const recaptchaToken = await executeRecaptcha('login_google');
        if (!recaptchaToken) throw new Error("Gagal verifikasi reCAPTCHA");
      }
      await loginWithGoogle(tokenResponse.access_token);
    } catch (e: any) {
      console.error(e);
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: e.message || "Gagal login dengan Google",
        confirmButtonColor: '#059669'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const loginWithGoogleFlow = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setIsProcessing(false);
    }
  });

  const handleLogin = async (isAnonim: boolean) => {
    if (!isAnonim) {
      setIsProcessing(true);
      loginWithGoogleFlow();
      return;
    }

    setIsProcessing(true);
    try {
      if (!executeRecaptcha) {
        Swal.fire({
          icon: 'warning',
          title: 'Harap Tunggu',
          text: 'Sistem Keamanan sedang dimuat.',
          confirmButtonColor: '#f59e0b'
        });
        return;
      }

      // Verifikasi reCAPTCHA v3 (Tak kasat mata)
      const token = await executeRecaptcha('login_anonim');
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Verifikasi Gagal',
          text: 'Gagal memverifikasi keamanan otomatis. Apakah Anda robot?',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

      // Lanjut proses login anonim
      await login("anonim_token", true);
    } catch (e: any) {
      console.error(e);
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: e.message || "Terjadi kesalahan sistem",
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 p-6 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-md mx-auto text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="bg-gradient-to-tr from-amber-100 to-amber-50 p-4 rounded-2xl mb-5 text-amber-600 shadow-sm border border-amber-200/50">
          <ShieldCheck className="w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm md:text-base text-slate-500 mb-8 max-w-[280px] leading-relaxed">{description}</p>

        <div className="w-full space-y-3">
          {/* Tombol Login SSO Google */}
          <button 
            onClick={() => handleLogin(false)}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm md:text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isProcessing ? 'Memuat...' : 'Masuk dengan Google'}
          </button>

          {/* Atau */}
          <div className="flex items-center gap-3 w-full py-1">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-medium text-slate-400">ATAU</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Tombol Login Anonim */}
          <button 
            onClick={() => handleLogin(true)}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-slate-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm md:text-base"
          >
            <UserCircle2 className="w-5 h-5 opacity-80" />
            {isProcessing ? 'Memuat...' : 'Lanjutkan sebagai Anonim'}
          </button>
        </div>
      </div>
      
      {/* reCAPTCHA badge info (Opsional, tapi disarankan Google) */}
      <div className="mt-6 w-full text-center">
        <p className="text-[10px] text-slate-400 leading-tight">
          Situs ini dilindungi oleh reCAPTCHA v3 dan <br /> Kebijakan Privasi serta Persyaratan Layanan Google berlaku.
        </p>
      </div>
    </div>
  );
}
