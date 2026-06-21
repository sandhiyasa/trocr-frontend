import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/layout/Navbar';
import ChatbotWidget from '@/components/features/ChatbotWidget';
import CaptchaProvider from '@/components/providers/CaptchaProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kamus Bahasa Bali & OCR Aksara Bali - Readbali',
  description: 'Kamus Bahasa Bali terlengkap dan Platform OCR Aksara Bali untuk membaca, menerjemahkan, dan mendigitalkan lontar secara otomatis.',
  keywords: 'kamus bahasa bali, aksara bali, ocr aksara bali, baca aksara bali, terjemahan bahasa bali',
  icons: {
    icon: [
      { url: '/img/readbaliicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/img/readbaliicon.png' },
    ],
  },
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
