import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/layout/Navbar';
import ChatbotWidget from '@/components/features/ChatbotWidget';
import CaptchaProvider from '@/components/providers/CaptchaProvider';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Kamus Bahasa Bali & OCR Aksara Bali - Balinesescript',
  description: 'Kamus Bahasa Bali terlengkap dan Platform OCR Aksara Bali untuk membaca, menerjemahkan, dan mendigitalkan lontar secara otomatis.',
  keywords: 'kamus bahasa bali, aksara bali, ocr aksara bali, baca aksara bali, terjemahan bahasa bali, balinesescript',
  icons: {
    icon: [
      { url: '/img/baliscript_logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/img/baliscript_logo.png' },
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
      <body className={`${spaceGrotesk.variable} ${manrope.variable} font-sans bg-brand-dark-bg-bg text-brand-bright-white min-h-screen flex flex-col`}>
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
