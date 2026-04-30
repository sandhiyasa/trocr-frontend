'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

interface ChatMessage {
  id: string | number;
  sender: 'user' | 'bot';
  text: string;
  time?: string;
}

const formatTime = (timeString?: string) => {
  if (!timeString) return '';
  // Handle format ISO 8601 maupun Y-m-d H:i:s
  const date = new Date(timeString.replace(' ', 'T'));
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const renderChatText = (text: string) => {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold markdown
    .replace(/\n/g, '<br/>'); // Baris baru
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, loginWithGoogle, user } = useAuth();
  
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isProcessing, setIsProcessing] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && isAuthenticated && user?.id) {
      fetchHistory();
    }
  }, [isOpen, isAuthenticated, user]);

  const fetchHistory = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL || 'http://localhost:8000/api';
      const res = await axios.get(`${apiUrl}/chat/history/${user?.id || 124}`);
      if (res.data.status === 'success') {
        const historyData = res.data.data;
        const reversed = [...historyData].reverse();
        
        const loadedMessages: ChatMessage[] = [];
        reversed.forEach((chat: any) => {
           loadedMessages.push({ id: `user_${chat.id}`, sender: 'user', text: chat.user_message, time: chat.time });
           if (chat.bot_reply) {
             loadedMessages.push({ id: `bot_${chat.id}`, sender: 'bot', text: chat.bot_reply, time: chat.time });
           }
        });
        
        if (loadedMessages.length === 0) {
          loadedMessages.push({
            id: 'welcome',
            sender: 'bot',
            text: 'Rahajeng! Ada yang bisa Bli bantu tentang bahasa atau budaya Bali hari ini?',
            time: new Date().toISOString()
          });
        }
        
        setMessages(loadedMessages);
      }
    } catch (e) {
      console.error("Gagal memuat history", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg = inputText.trim();
    setInputText('');
    
    const currentTime = new Date().toISOString();
    const tempUserId = `temp_${Date.now()}`;
    setMessages(prev => [...prev, { id: tempUserId, sender: 'user', text: userMsg, time: currentTime }]);
    setIsTyping(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL || 'http://localhost:8000/api';
      const res = await axios.post(`${apiUrl}/chat/ask`, {
        message: userMsg,
        user_id: user?.id || 124
      });
      
      if (res.data.status === 'success') {
         setMessages(prev => [...prev, {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: res.data.reply,
            time: res.data.time || new Date().toISOString()
         }]);
      }
    } catch (e: any) {
      console.error("Gagal mengirim pesan", e);
      setMessages(prev => [...prev, {
         id: `error_${Date.now()}`,
         sender: 'bot',
         text: 'Maaf, Bli sedang mengalami gangguan koneksi. Coba lagi nanti ya!',
         time: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsProcessing(true);
    try {
      if (executeRecaptcha) {
        const recaptchaToken = await executeRecaptcha('login_google_chat');
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

      // Verifikasi otomatis reCAPTCHA v3
      const token = await executeRecaptcha('login_anonim_chat');
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Verifikasi Gagal',
          text: 'Gagal memverifikasi keamanan otomatis. Silakan coba lagi.',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Jendela Obrolan (Tampil jika isOpen = true) */}
      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-[440px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header Bli Bot */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-full">
                <img src="/img/chatbot.png" alt="Bli Bot" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Bli Bot</h3>
                <p className="text-xs text-amber-100 opacity-90">Asisten AI Readbali</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Konten */}
          <div className="h-[32rem] bg-slate-50 flex flex-col p-4 relative">
            
            {!isAuthenticated ? (
              // --- TAMPILAN JIKA BELUM LOGIN ---
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2.5">
                <div className="bg-amber-100 p-3 rounded-full mb-1 text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Autentikasi Diperlukan</h4>
               

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
                  {messages.map((msg) => (
                    msg.sender === 'bot' ? (
                      <div key={msg.id} className="flex items-start gap-2">
                        <div className="bg-amber-100 p-1.5 rounded-full flex-shrink-0 mt-1">
                          <img src="/img/chatbot.png" alt="Bot Icon" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-700 shadow-sm leading-relaxed flex flex-col min-w-[60px]">
                          {renderChatText(msg.text)}
                          <span className="text-[10px] text-slate-400 self-start mt-1 leading-none">{formatTime(msg.time)}</span>
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex items-start gap-2 flex-row-reverse">
                        <div className="bg-slate-200 p-0.5 rounded-full flex-shrink-0 mt-1 w-8 h-8 flex justify-center items-center overflow-hidden">
                          {user?.picture ? (
                            <img src={user.picture} alt={user?.name || "User"} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                        <div className="bg-amber-600 text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm shadow-sm leading-relaxed flex flex-col min-w-[60px]">
                          {renderChatText(msg.text)}
                          <span className="text-[10px] text-amber-200 self-end mt-1 leading-none">{formatTime(msg.time)}</span>
                        </div>
                      </div>
                    )
                  ))}

                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-100 p-1.5 rounded-full flex-shrink-0 mt-1">
                        <img src="/img/chatbot.png" alt="Bot Icon" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Teks */}
                <div className="pt-2 mt-1 border-t border-slate-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      placeholder="Tanya Bli Bot..."
                      className="w-full bg-white border border-slate-300 rounded-full pl-4 pr-12 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:bg-slate-50"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-2 px-2 leading-tight">
                    Bli Bot adalah AI dalam tahap penelitian, Jawaban mungkin dapat keliru. Ampura jika ada ketidaktepatan dalam hasil atau tutur bahasa
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Tombol Mengambang (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800 rotate-90' : 'bg-amber-600 hover:bg-amber-700 hover:-translate-y-1'} text-white p-4 rounded-full shadow-[0_10px_25px_rgba(217,119,6,0.4)] transition-all duration-300`}
      >
        {isOpen ? <X className="w-6 h-6 -rotate-90 transition-transform" /> : <MessageSquare className="w-7 h-7" />}
      </button>
    </div>
  );
}
