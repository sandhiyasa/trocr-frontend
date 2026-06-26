"use client";

import React, { useState, useRef, useEffect, PointerEvent } from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function NulisAksaraBaliPage() {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ambil data kamus dari baliscript-adm API saat komponen dimuat
  useEffect(() => {
    const fetchKamus = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL || "http://localhost:8000/api";
        const response = await fetch(`${baseUrl}/guest/dataKamus?random=true&max_length=6`);
        const data = await response.json();
        
        // Pastikan aksara_bali valid dan panjang kata maksimal 6 karakter (pengamanan ganda di frontend)
        const validData = data.filter((item: any) => 
          item.aksara_bali && 
          item.aksara_bali.trim() !== "" &&
          item.kata &&
          item.kata.length <= 6
        );
        
        // Acak urutan soal dan ambil 10 sampel
        const shuffled = validData.sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuizData(shuffled);
      } catch (error) {
        console.error("Gagal mengambil data dari API", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKamus();
  }, []);

  const currentQuestion = quizData[currentQuestionIndex];

  // Helper untuk mendapatkan koordinat pointer yang akurat relatif terhadap canvas
  const getCoordinates = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#ea580c"; // Warna oranye (amber-600) untuk menyesuaikan tema
    ctx.lineWidth = 6;          
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setScore(null); 
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Latihan Selesai! Selamat!");
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Bersihkan canvas setiap kali soal diubah
  useEffect(() => {
    clearCanvas();
  }, [currentQuestionIndex]);

  // ALGORITMA KOMPARASI PIKSEL (FRONTEND VALIDATION)
  const cekHasil = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentQuestion) return;

    const width = canvas.width;
    const height = canvas.height;

    const userCtx = canvas.getContext("2d");
    if (!userCtx) return;

    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    const fontSize = 120;
    offCtx.font = `${fontSize}px "Noto Sans Balinese", sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillStyle = "#000000"; 
    
    // Tulis AKSARA BALI tepat di tengah off-screen canvas
    offCtx.fillText(currentQuestion.aksara_bali, width / 2, height / 2);

    const userImageData = userCtx.getImageData(0, 0, width, height).data;
    const refImageData = offCtx.getImageData(0, 0, width, height).data;

    let hitCount = 0;
    let missCount = 0;
    let totalRefPixels = 0;

    for (let i = 0; i < refImageData.length; i += 4) {
      const refAlpha = refImageData[i + 3];
      const userAlpha = userImageData[i + 3];

      const isRefSolid = refAlpha > 128;  
      const isUserSolid = userAlpha > 128; 

      if (isRefSolid) {
        totalRefPixels++;
        if (isUserSolid) {
          hitCount++;
        }
      } else {
        if (isUserSolid) {
          missCount++;
        }
      }
    }

    if (totalRefPixels === 0) {
      setScore(0);
      return;
    }

    const hitRatio = hitCount / totalRefPixels;
    const penaltyRatio = missCount / totalRefPixels;
    const rawScore = (hitRatio - (penaltyRatio * 0.5)) * 100;
    
    const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));
    setScore(finalScore);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
           <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
           <p className="text-slate-500 font-medium animate-pulse tracking-wide">Menyiapkan Latihan Nulis Aksara Bali...</p>
        </div>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10" />
        <div className="text-red-500 font-semibold text-lg bg-white/80 p-8 rounded-3xl shadow-sm border border-red-100">
          Gagal memuat atau tidak ada data Aksara Bali.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 relative overflow-x-hidden py-10">
      {/* Background Ornamen Cahaya Abstrak */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Teks & SEO Content */}
      <div className="max-w-4xl w-full text-center space-y-6 z-10 mb-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-2 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Interaktif & Edukatif</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-500 tracking-tight leading-tight">
          Belajar <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
            Nulis Aksara Bali
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Platform interaktif <strong className="font-semibold text-amber-700">Nulis Aksara Bali</strong> untuk melatih kemampuan menulis Anda dengan panduan garis dan evaluasi skor presisi secara langsung!
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="bg-amber-50 border-b border-amber-100 p-4 text-center">
          <p className="text-amber-800 font-medium">Latihan {currentQuestionIndex + 1} dari {quizData.length}</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          
          <div className="mb-8 text-center bg-amber-50/50 px-8 py-4 rounded-2xl border border-amber-100/50">
            <h2 className="text-lg font-medium text-amber-800/80 mb-1">Tuliskan aksara untuk:</h2>
            <p className="text-3xl font-extrabold text-slate-900 capitalize tracking-wide">
              "{currentQuestion?.kata || currentQuestion?.indo}"
            </p>
          </div>

          <div className="mb-6 flex flex-col items-center">
            <div 
              ref={containerRef}
              className="relative w-[600px] max-w-full aspect-[2/1] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner touch-none"
              style={{ maxHeight: "300px" }}
            >
              {/* Layer Bawah: Menampilkan aksara_bali sebagai referensi */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bg-slate-50/50">
                <span 
                  className="text-slate-300 opacity-30 font-balinese drop-shadow-sm" 
                  style={{ fontSize: "120px", lineHeight: 1 }}
                >
                  {currentQuestion?.aksara_bali}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerOut={stopDrawing}
                onPointerCancel={stopDrawing}
              />
            </div>
            <p className="text-sm text-slate-500 font-medium mt-3 flex items-center gap-2">
              <span>Gunakan jari atau mouse untuk Nulis Aksara Bali di atas kanvas.</span>
            </p>
          </div>

          <div className="flex flex-col items-center w-full gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={clearCanvas}
                className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all shadow-sm active:scale-95"
              >
                Hapus
              </button>
              <button 
                onClick={cekHasil}
                className="px-8 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Cek Hasil
              </button>
            </div>

            {score !== null && (
              <div className={`mt-6 p-6 w-full max-w-sm rounded-2xl text-center shadow-sm border transition-all animate-in fade-in zoom-in-95 duration-300 ${
                score > 80 ? 'bg-emerald-50 border-emerald-200' : 
                score > 50 ? 'bg-amber-50 border-amber-200' : 
                'bg-rose-50 border-rose-200'
              }`}>
                <p className={`font-semibold mb-1 ${
                  score > 80 ? 'text-emerald-700/80' : 
                  score > 50 ? 'text-amber-700/80' : 
                  'text-rose-700/80'
                }`}>Skor Kecocokan:</p>
                <div className={`text-6xl font-black ${
                  score > 80 ? 'text-emerald-600' : 
                  score > 50 ? 'text-amber-600' : 
                  'text-rose-600'
                }`}>
                  {score}%
                </div>
                {score > 80 ? (
                  <p className="text-emerald-700 font-bold mt-3">Luar biasa! Sangat rapi! 🌟</p>
                ) : score > 50 ? (
                  <p className="text-amber-700 font-bold mt-3">Lumayan, yuk coba lebih rapi! 👍</p>
                ) : (
                  <p className="text-rose-700 font-bold mt-3">Terlalu banyak coretan di luar garis. 😅</p>
                )}
              </div>
            )}
            
            <div className="flex w-full justify-between mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                  currentQuestionIndex === 0 
                  ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                  : 'text-amber-600 hover:bg-amber-50 active:scale-95'
                }`}
              >
                &larr; Sebelumnya
              </button>
              <button 
                onClick={nextQuestion}
                disabled={currentQuestionIndex === quizData.length - 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                  currentQuestionIndex === quizData.length - 1 
                  ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                  : 'text-amber-600 hover:bg-amber-50 active:scale-95'
                }`}
              >
                Selanjutnya &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
