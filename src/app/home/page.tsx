import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-brand-lontar text-gray-800 font-sans antialiased overflow-x-hidden">
      {/* Hero Section */}
      <section id="beranda" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[linear-gradient(to_bottom,rgba(26,24,20,0.9),rgba(26,24,20,0.95)),url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
                <span className="text-brand-gold font-medium tracking-widest uppercase text-sm mb-4 block">Melestarikan Warisan Melalui AI</span>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
                    Menghidupkan Kembali <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
                        Aksara Nusantara
                    </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed">
                    Sistem <i>Optical Character Recognition</i> (OCR) pertama yang didesain khusus untuk membaca, menerjemahkan, dan mendigitalkan Lontar serta teks Aksara Bali dengan akurasi tinggi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#fitur" className="bg-brand-gold text-brand-dark px-8 py-4 rounded-sm font-semibold text-lg hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(200,155,60,0.3)]">
                        Jelajahi Fitur
                    </a>
                    <a href="#coba" className="border border-brand-gold text-brand-gold px-8 py-4 rounded-sm font-semibold text-lg hover:bg-brand-gold/10 transition-all">
                        Coba Demo AI
                    </a>
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-brand-lontar to-transparent"></div>
      </section>

      {/* Fitur Utama Section */}
      <section id="fitur" className="py-20 bg-brand-lontar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Platform Linguistik Terpadu</h2>
                <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
                <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
                    Tiga pilar utama kami dalam melestarikan dan menjembatani kekayaan bahasa serta Aksara Bali ke era digital.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Fitur 1: Kamus Bali */}
                <Link href="/" className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group block">
                    <div className="w-16 h-16 bg-brand-lontar rounded-lg flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark font-serif">Kamus Bali Digital</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Eksplorasi ribuan lema bahasa Bali dengan mesin pencari yang cepat. Dirancang sebagai referensi utama untuk pelajar, peneliti, dan masyarakat umum dalam memahami kosakata dan makna.
                    </p>
                </Link>

                {/* Fitur 2: Transliterasi */}
                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-16 h-16 bg-brand-lontar rounded-lg flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark font-serif">Transliterasi & Terjemahan</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Konversi teks Latin ke Aksara Bali atau sebaliknya secara instan sesuai <i>pasang aksara</i> (aturan penulisan). Dilengkapi terjemahan pintar ke dalam Bahasa Indonesia dan Bahasa Inggris.
                    </p>
                </div>

                {/* Fitur 3: TrOCR */}
                <Link href="/ocr" className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden block">
                    <div className="absolute top-0 right-0 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">CORE AI</div>
                    <div className="w-16 h-16 bg-brand-lontar rounded-lg flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark font-serif">Visual OCR (TrOCR)</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Pindai foto kamus, lontar kuno, atau papan jalan. AI berbasis arsitektur <i>Transformer OCR</i> kami akan mengekstraksi Aksara Bali dari gambar menjadi teks digital dengan akurasi tinggi.
                    </p>
                </Link>
            </div>
        </div>
      </section>

      {/* Teknologi Section */}
      <section id="teknologi" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Ditenagai oleh Arsitektur AI Modern</h2>
                <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
                <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
                    Menggabungkan ketajaman pengolahan citra klasik dengan kecerdasan <i>Transformer-based OCR (TrOCR)</i> untuk hasil transliterasi yang akurat.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-dark hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 bg-brand-dark text-brand-gold rounded-full flex items-center justify-center text-2xl font-bold font-serif mb-6 shadow-md">1</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark">Pindai & Unggah</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Unggah foto halaman kamus, lontar, atau papan nama jalan. Sistem kami dirancang untuk menerima berbagai kondisi pencahayaan.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-gold hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_40px_rgba(200,155,60,0.15)]">
                    <div className="w-14 h-14 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center text-2xl font-bold font-serif mb-6 shadow-md">2</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark">Pre-processing Otsu</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Algoritma secara otomatis menghilangkan <i>noise</i>, bayangan, dan tekstur kertas, mengubah gambar menjadi hitam-putih pekat yang sempurna untuk AI.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-accent hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 bg-brand-accent text-white rounded-full flex items-center justify-center text-2xl font-bold font-serif mb-6 shadow-md">3</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark">Ekstraksi TrOCR</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Model Deep Learning mutakhir membaca morfologi aksara dan menerjemahkannya ke dalam teks Latin (Romanisasi) dalam hitungan detik.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="coba" className="py-20 bg-brand-stone text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Uji Coba Langsung.</h2>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        Sistem aplikasi cerdas kami (*saat ini dalam tahap pengembangan model*) akan memungkinkan siapa saja untuk membaca Aksara Bali semudah mengambil foto.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-200">Akurasi tinggi pada dokumen lama (Kamus/Lontar)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-200">Kemampuan membaca berbagai variasi tulisan tangan</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-200">Ekspor hasil ke format digital yang dapat diedit</span>
                        </li>
                    </ul>
                    <Link href="/ocr" className="inline-block border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark font-bold px-6 py-3 rounded-sm transition-all">
                        Menuju Web Aplikasi TrOCR &rarr;
                    </Link>
                </div>

                {/* App UI Mockup */}
                <div className="lg:w-1/2 w-full">
                    <div className="bg-brand-dark p-6 rounded-xl shadow-2xl border border-gray-800 relative overflow-hidden">
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-900/50">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-400 text-sm">Seret foto aksara ke sini atau <span className="text-brand-gold cursor-pointer">Cari File</span></p>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Hasil Transliterasi AI</span>
                                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">Akurasi: 98%</span>
                                </div>
                                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                                    <div className="flex items-center gap-4 mb-4 border-b border-gray-800 pb-4">
                                        <div className="bg-white p-2 rounded w-24 h-12 flex items-center justify-center italic text-black font-serif opacity-90"></div>
                                        <div className="text-gray-500 text-sm animate-pulse">&rarr;</div>
                                        <div className="text-brand-gold text-lg font-medium tracking-wide">Pancasila</div>
                                    </div>
                                    <p className="text-gray-300 text-sm italic">"Teks berhasil dibaca dan diproses menggunakan metode Otsu Thresholding dan arsitektur TrOCR."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark font-serif font-bold text-sm">R</div>
                        <span className="font-serif font-bold text-xl text-white">Read<span className="text-brand-gold">Bali</span></span>
                    </div>
                    <p className="text-sm">Mendigitalkan warisan lontar dan aksara Bali untuk generasi mendatang.</p>
                </div>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-brand-gold transition-colors">Tentang Kami</Link>
                    <a href="https://label.readbali.com" target="_blank" className="hover:text-brand-gold transition-colors">Portal Anotator</a>
                    <Link href="#" className="hover:text-brand-gold transition-colors">Kontak</Link>
                </div>
            </div>
            <div className="mt-8 text-center text-xs border-t border-gray-800 pt-8">
                &copy; 2026 ReadBali Project. Hak Cipta Dilindungi Undang-Undang.
            </div>
        </div>
      </footer>
    </div>
  );
}
