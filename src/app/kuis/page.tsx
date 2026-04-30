import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function KuisPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10" />

      <div className="text-center space-y-6 max-w-lg z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-amber-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-200">
          <Construction className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Segera Hadir!</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Fitur Kuis Aksara Bali sedang dalam tahap perancangan materi. Kami menyiapkan edukasi interaktif yang menyenangkan khusus untuk Anda.
        </p>
        <div className="pt-4">
          <Link href="/">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
