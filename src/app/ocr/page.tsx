'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/features/AuthPrompt';

export default function OcrPage() {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [baliText, setBaliText] = useState('');
  const [latinText, setLatinText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translateBalineseToLatin = (unicodeStr: string) => {
      let text = unicodeStr;
      const modifiers: Record<string, string> = {
          'ᬂ': 'ng', 'ᬃ': 'r', 'ᬄ': 'h', '᭄': '',
          'ᬵ': 'a', 'ᬶ': 'i', 'ᬷ': 'i', 'ᬸ': 'u', 'ᬹ': 'u',
          'ᬺ': 're', 'ᬻ': 're', 'ᬼ': 'le', 'ᬽ': 'le',
          'ᬾ': 'e', 'ᬿ': 'ai', 'ᭀ': 'o', 'ᭁ': 'au'
      };
      const consonants: Record<string, string> = {
          'ᬳ': 'ha', 'ᬦ': 'na', 'ᬘ': 'ca', 'ᬭ': 'ra', 'ᬓ': 'ka',
          'ᬤ': 'da', 'ᬢ': 'ta', 'ᬲ': 'sa', 'ᬯ': 'wa', 'ᬮ': 'la',
          'ᬫ': 'ma', 'ᬕ': 'ga', 'ᬩ': 'ba', 'ᬗ': 'nga', 'ᬧ': 'pa',
          'ᬚ': 'ja', 'ᬬ': 'ya', 'ᬜ': 'nya', 'ᬝ': 'ta', 'ᬟ': 'da',
          'ᬡ': 'na', 'ᬠ': 'bha', 'ᬋ': 'ra', 'ᬌ': 'la'
      };
      const vowels: Record<string, string> = {
          'ᬅ': 'a', 'ᬆ': 'aa', 'ᬇ': 'i', 'ᬈ': 'ii', 'ᬉ': 'u',
          'ᬊ': 'uu', 'ᬏ': 'e', 'ᬐ': 'ai', 'ᬑ': 'o', 'ᬒ': 'au'
      };

      let result = '';
      for (let i = 0; i < text.length; i++) {
          let char = text[i];
          let nextChar = text[i + 1];

          if (consonants[char]) {
              let baseSyllable = consonants[char];
              if (nextChar && modifiers[nextChar] !== undefined) {
                  let baseConsonant = baseSyllable.slice(0, -1);
                  result += baseConsonant + modifiers[nextChar];
                  i++;
              } else {
                  result += baseSyllable;
              }
          }
          else if (vowels[char]) {
              result += vowels[char];
          }
          else if (modifiers[char] !== undefined) {
              result += modifiers[char];
          }
          else {
              result += char;
          }
      }
      return result;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsLoading(true);
    setBaliText('');
    setLatinText('');

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://api-ocr.readbali.com/predict", {
          method: 'POST',
          body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.status === "sukses") {
          setBaliText(data.hasil_ocr);
          setLatinText(translateBalineseToLatin(data.hasil_ocr) || "Terjemahan tidak tersedia");
      } else {
          throw new Error("Gagal memproses gambar.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghubungi AI OCR. Silakan coba lagi.");
      resetUI();
    } finally {
      setIsLoading(false);
    }
  };

  const resetUI = () => {
    setFile(null);
    setPreview('');
    setBaliText('');
    setLatinText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 w-full flex-grow">
      {/* Header Info */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Baca Aksara Bali <br className="hidden md:block" />
          dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Satu Ketukan</span>
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
          Unggah foto aksara Bali, biarkan Kecerdasan Buatan kami membacanya dan menerjemahkannya ke huruf Latin seketika.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="pt-4">
          <AuthPrompt 
            title="Akses Fitur Baca Aksara" 
            description="Silakan login dan selesaikan CAPTCHA terlebih dahulu untuk mulai menggunakan AI TrOCR kami." 
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-4 md:p-8">
          
          {/* Dropzone / Upload Area */}
          {!file && !isLoading && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 md:p-10 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300"
            >
              <div className="p-3 md:p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-slate-700 font-bold mb-1 text-center">Klik atau Tarik Gambar ke Sini</p>
              <p className="text-xs md:text-sm text-slate-400 text-center">Mendukung format JPG, PNG (Maks. 5MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-slate-600 font-medium animate-pulse text-center">AI sedang menganalisis guratan aksara...</p>
            </div>
          )}

          {/* Area Hasil Terjemahan */}
          {file && !isLoading && baliText && (
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Kolom Gambar Pratinjau */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Gambar Asli</h3>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 md:h-64 flex items-center justify-center relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview Lontar" className="max-w-full max-h-full object-contain shadow-sm" />
                  </div>
                </div>

                {/* Kolom Teks Hasil */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 md:p-5 border border-amber-100 shadow-sm flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                        <h3 className="text-xs md:text-sm font-bold text-amber-900 uppercase tracking-widest">Aksara Bali</h3>
                      </div>
                    </div>
                    {/* Gunakan class font-bali dari konfigurasi jika font Noto Sans Balinese sudah dimuat */}
                    <p className="text-2xl md:text-4xl text-slate-800 font-bali leading-loose overflow-x-auto pb-2">{baliText}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                      <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-widest">Bacaan Latin</h3>
                    </div>
                    <p className="text-lg md:text-2xl font-semibold text-slate-700 leading-relaxed capitalize break-words">{latinText}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={resetUI}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:text-amber-600 transition-colors shadow-sm active:scale-95 text-sm md:text-base"
                >
                  <RefreshCw className="w-4 h-4" />
                  Unggah Gambar Lain
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
