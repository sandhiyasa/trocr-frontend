'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Loader2, RefreshCw, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/features/AuthPrompt';

interface OcrResponse {
  status: string;
  filename: string;
  jumlah_potongan: number;
  hasil_mentah_ai: string;
  hasil_ocr_akhir: string;
  hasil_latin: string;
  gambar_utuh_yolo: string;
  gambar_potongan: string[];
}

export default function OcrPage() {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const [resultData, setResultData] = useState<OcrResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsLoading(true);
    setUploadStatus('loading');
    setOcrStatus('idle');
    setResultData(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/predict";
      
      const data: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.loaded === event.total) {
            setUploadStatus('success');
            setOcrStatus('loading');
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setOcrStatus('success');
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error("Network error"));
        });

        xhr.open("POST", apiUrl);
        xhr.send(formData);
      });

      if (data.status === "sukses") {
        setResultData(data);
      } else {
        throw new Error("Gagal memproses gambar.");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus('error');
      setOcrStatus('error');
      alert("Terjadi kesalahan saat menghubungi API OCR. Pastikan backend berjalan.");
      resetUI();
    } finally {
      setIsLoading(false);
    }
  };

  const resetUI = () => {
    setFile(null);
    setPreview('');
    setResultData(null);
    setUploadStatus('idle');
    setOcrStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 w-full flex-grow">
      {/* Header Info */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 mb-4 tracking-tight">
          Baca Aksara Bali <br className="hidden md:block" />
          dalam Satu Ketukan
        </h2>
      </div>

      {!isAuthenticated ? (
        <div className="pt-4 max-w-3xl mx-auto">
          <AuthPrompt
            title="Akses Fitur Baca Aksara"
            description="Silakan login terlebih dahulu."
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-4 md:p-8">

          {/* Dropzone / Upload Area */}
          {!file && !isLoading && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 md:p-12 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 max-w-3xl mx-auto"
            >
              <div className="p-4 md:p-5 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-10 h-10 text-amber-500" />
              </div>
              <p className="text-slate-700 font-bold mb-2 text-center text-lg">Klik atau Tarik Gambar ke Sini</p>
              <p className="text-sm text-slate-400 text-center">Mendukung format JPG, PNG (Maks. 5MB)</p>
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
            <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
              <div className="w-full space-y-4">
                {/* Upload Status */}
                <div className="flex items-center gap-4 py-3 px-6 bg-slate-50 rounded-xl border border-slate-100 transition-all">
                  <div className="flex-shrink-0">
                    {uploadStatus === 'loading' ? (
                      <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    ) : uploadStatus === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : uploadStatus === 'error' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-red-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${uploadStatus === 'loading' ? 'text-amber-600' : uploadStatus === 'success' ? 'text-green-600' : uploadStatus === 'error' ? 'text-red-500' : 'text-slate-400'}`}>
                      Mengunggah file gambar...
                    </p>
                  </div>
                </div>

                {/* OCR Status */}
                <div className="flex items-center gap-4 py-3 px-6 bg-slate-50 rounded-xl border border-slate-100 transition-all">
                  <div className="flex-shrink-0">
                    {ocrStatus === 'loading' ? (
                      <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    ) : ocrStatus === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : ocrStatus === 'error' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-red-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${ocrStatus === 'loading' ? 'text-amber-600 animate-pulse' : ocrStatus === 'success' ? 'text-green-600' : ocrStatus === 'error' ? 'text-red-500' : 'text-slate-400'}`}>
                      Sedang memproses gambar..
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Area Hasil Deteksi dan Terjemahan */}
          {file && !isLoading && resultData && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Pesan Testing */}
              <div className="mb-8">
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-3 border border-amber-200 shadow-sm text-sm md:text-base">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Informasi Pemrosesan (Mode Testing)</p>
                    <p className="text-amber-800/90 leading-relaxed">
                      Terditeksi <strong>{resultData.jumlah_potongan} baris aksara</strong>. 
                      Namun, pada mode eksperimen ini aplikasi <strong> HANYA membaca 2 potongan pertama</strong> saja.
                    </p>
                  </div>
                </div>
              </div>

              {/* Baris Utama: Gambar YOLO dan Hasil OCR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                
                {/* Kolom Gambar Utuh YOLO */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Gambar Utuh</h3>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex-1 flex items-center justify-center shadow-inner relative group min-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`data:image/png;base64,${resultData.gambar_utuh_yolo}`} 
                      alt="Deteksi YOLO Full" 
                      className="max-w-full max-h-[500px] object-contain group-hover:scale-[1.02] transition-transform duration-500" 
                    />
                  </div>
                </div>

                {/* Kolom Teks Hasil TrOCR */}
                <div className="flex flex-col gap-6">
                  {/* Aksara Bali */}
                  <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                      <h3 className="text-sm font-bold text-amber-900 uppercase tracking-widest">Hasil TrOCR (Aksara Bali)</h3>
                    </div>
                    <p className="text-3xl md:text-5xl text-slate-800 font-bali leading-loose overflow-x-auto flex-1 min-h-[80px]">
                      {resultData.hasil_ocr_akhir || <span className="text-slate-300 italic text-xl">Tidak ada teks...</span>}
                    </p>
                  </div>

                  {/* Bacaan Latin */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Transliterasi Latin</h3>
                    </div>
                    <p className="text-xl md:text-3xl font-semibold text-slate-700 leading-relaxed break-words flex-1 min-h-[60px] capitalize">
                      {resultData.hasil_latin || <span className="text-slate-300 italic text-xl">Tidak ada teks...</span>}
                    </p>
                  </div>
                </div>

              </div>

              {/* Grid Gambar Potongan (Sliced by YOLO) */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                    Urutan Potongan Baris ({resultData.gambar_potongan.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                  {resultData.gambar_potongan.map((base64Str, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all group aspect-video flex items-center justify-center">
                      {/* Nomor Urut */}
                      <div className="absolute top-2 left-2 w-6 h-6 md:w-7 md:h-7 bg-slate-900/80 backdrop-blur-md text-white text-xs md:text-sm font-bold flex items-center justify-center rounded-full z-10 shadow-sm border border-white/20">
                        {idx + 1}
                      </div>
                      
                      {/* Gambar Potongan */}
                      <div className="w-full h-full p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`data:image/png;base64,${base64Str}`} 
                          alt={`Potongan ${idx + 1}`} 
                          className="max-w-full max-h-full object-contain filter contrast-125" 
                        />
                      </div>

                      {/* Highlight Label untuk 2 potongan pertama */}
                      {idx < 2 && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-amber-500 to-amber-400 text-white text-[10px] md:text-xs font-bold text-center py-1.5 uppercase tracking-wider shadow-lg">
                          Dibaca TrOCR
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Reset */}
              <div className="mt-10 flex justify-center pt-4">
                <button
                  onClick={resetUI}
                  className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:text-amber-600 hover:border-amber-300 hover:shadow-md transition-all active:scale-95 text-base md:text-lg"
                >
                  <RefreshCw className="w-5 h-5" />
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
