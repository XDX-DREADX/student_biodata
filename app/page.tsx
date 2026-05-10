'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { submitBiodata, fetchBiodata, Biodata, SCRIPT_URL } from '@/lib/gas';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'form' | 'data'>('form');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [databaseSiswa, setDatabaseSiswa] = useState<Biodata[]>([]);
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (activeTab === 'data') {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setFetchingData(true);
    const data = await fetchBiodata();
    // If local and no URL, we just show what's currently in state.
    if (SCRIPT_URL) {
      setDatabaseSiswa(data);
    }
    setFetchingData(false);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Biodata = {
      namaLengkap: formData.get('namaLengkap') as string,
      nisn: formData.get('nisn') as string,
      jenisKelamin: formData.get('jenisKelamin') as string,
      tanggalLahir: formData.get('tanggalLahir') as string,
    };

    try {
      await submitBiodata(data);
      if (!SCRIPT_URL) {
        setDatabaseSiswa((prev: Biodata[]) => [...prev, data]);
        showNotification('Data disimpan lokal. Segera masukkan SCRIPT_URL di lib/gas.ts!', 'success');
      } else {
        showNotification('Data berhasil dikirim ke Google Sheets!', 'success');
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      showNotification('Gagal mengirim data. Pastikan URL benar dan CORS diizinkan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10 animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
          Biodata Siswa
        </h1>
        <p className="text-muted-foreground text-sm">Lengkapi atau lihat informasi data diri</p>
      </div>

      <div className="flex gap-2 mb-6 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'form' 
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm' 
              : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
          }`}
        >
          Isi Form
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'data' 
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm' 
              : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
          }`}
        >
          Lihat Data
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="animate-fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="namaLengkap" className="text-sm font-medium ml-1">Nama Lengkap</label>
              <input
                type="text"
                id="namaLengkap"
                name="namaLengkap"
                placeholder="Masukkan nama lengkap Anda"
                required
                autoComplete="name"
                className="w-full p-3.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-foreground text-[15px] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="nisn" className="text-sm font-medium ml-1">NISN</label>
              <input
                type="text"
                id="nisn"
                name="nisn"
                placeholder="Masukkan 10 digit NISN"
                required
                pattern="[0-9]{10}"
                title="NISN harus terdiri dari 10 digit angka"
                className="w-full p-3.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-foreground text-[15px] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="jenisKelamin" className="text-sm font-medium ml-1">Jenis Kelamin</label>
              <div className="relative">
                <select
                  id="jenisKelamin"
                  name="jenisKelamin"
                  required
                  defaultValue=""
                  className="w-full p-3.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-foreground text-[15px] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 appearance-none pr-10"
                >
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="Laki-laki" className="bg-background text-foreground">Laki-laki</option>
                  <option value="Perempuan" className="bg-background text-foreground">Perempuan</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tanggalLahir" className="text-sm font-medium ml-1">Tanggal Lahir</label>
              <input
                type="date"
                id="tanggalLahir"
                name="tanggalLahir"
                required
                className="w-full p-3.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-foreground text-[15px] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Simpan Data</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {notification && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium text-center animate-fade-in ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}>
              {notification.message}
            </div>
          )}
        </div>
      )}

      {activeTab === 'data' && (
        <div className="animate-fade-in">
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-sm border-b border-black/10 dark:border-white/10">Nama Lengkap</th>
                  <th className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-sm border-b border-black/10 dark:border-white/10">NISN</th>
                  <th className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-sm border-b border-black/10 dark:border-white/10 whitespace-nowrap">L/P</th>
                  <th className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-sm border-b border-black/10 dark:border-white/10">Tgl Lahir</th>
                </tr>
              </thead>
              <tbody>
                {fetchingData ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Mengambil data...
                      </div>
                    </td>
                  </tr>
                ) : databaseSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">
                      Belum ada data peserta didik yang tersimpan.
                    </td>
                  </tr>
                ) : (
                  databaseSiswa.map((siswa: Biodata, idx: number) => (
                    <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-sm border-b border-black/5 dark:border-white/5 group-last:border-none">{siswa.namaLengkap}</td>
                      <td className="p-4 text-sm border-b border-black/5 dark:border-white/5 group-last:border-none">{siswa.nisn}</td>
                      <td className="p-4 text-sm border-b border-black/5 dark:border-white/5 group-last:border-none">
                        {siswa.jenisKelamin?.charAt(0) || '-'}
                      </td>
                      <td className="p-4 text-sm border-b border-black/5 dark:border-white/5 group-last:border-none whitespace-nowrap">
                        {siswa.tanggalLahir ? new Date(siswa.tanggalLahir).toLocaleDateString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
