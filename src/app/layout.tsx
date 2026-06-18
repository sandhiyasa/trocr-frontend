import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/layout/Navbar';
import ChatbotWidget from '@/components/features/ChatbotWidget';
import CaptchaProvider from '@/components/providers/CaptchaProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Readbali - Portal Digitalisasi Aksara Bali',
  description: 'Platform OCR dan Kamus Aksara Bali terlengkap untuk membaca, menerjemahkan, dan mendigitalkan lontar secara otomatis.',
  keywords: 'kamus bali, aksara bali, ocr aksara bali, baca aksara bali',
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
