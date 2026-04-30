import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/layout/Navbar';
import ChatbotWidget from '@/components/features/ChatbotWidget';
import CaptchaProvider from '@/components/providers/CaptchaProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReadBali - Portal Digitalisasi Aksara Bali',
  description: 'Super App untuk Kamus, OCR Lontar, Kuis, dan AI Chatbot Aksara Bali.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <CaptchaProvider>
            <Navbar />
            
            <main className="flex-grow">
              {children}
            </main>

            <ChatbotWidget />
          </CaptchaProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
