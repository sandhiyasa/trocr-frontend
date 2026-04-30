'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Gunakan user data dari storage jika ada
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else if (token.startsWith('dummy_anon_')) {
          setUser({ id: 'anon', name: 'Pengguna Anonim', email: 'anonim@readbali.com' });
          setIsAuthenticated(true);
      } else if (token.startsWith('dummy_') || token.startsWith('access_')) {
          setUser({ id: '1', name: 'User ReadBali', email: 'user@readbali.com' });
          setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Cek sesi gagal atau token kadaluarsa:', error);
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    const handleAuthChange = () => {
      checkSession();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('authChange', handleAuthChange);
      return () => window.removeEventListener('authChange', handleAuthChange);
    }
  }, []);

  const login = async (token: string, isAnonim = false) => {
    try {
      setIsLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL || 'http://localhost:8000/api';
      
      // Menyiapkan payload statis sementara untuk endpoint /guest/login backend
      // TODO: Sesuaikan dengan payload asli jika sudah ada input form / Google SDK
      const payloadUsername = isAnonim ? 'anonim' : 'user_google';
      const payloadPassword = isAnonim ? 'password' : 'password';
      
      const response = await axios.post(`${apiUrl}/guest/login`, {
          username: payloadUsername,
          password: payloadPassword,
          foto: isAnonim ? '' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
      });
      
      const data = response.data;
      
      // Gunakan prefix dummy_anon_ atau dummy_ agar sinkron dengan checkSession() saat reload
      const dummyToken = isAnonim ? 'dummy_anon_' + (data.id || Date.now()) : 'dummy_' + (data.id || Date.now());
      const dummyUser = { 
        id: String(data.id), 
        name: data.nama, 
        email: payloadUsername 
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', dummyToken);
        localStorage.setItem('user_data', JSON.stringify(dummyUser));
        setUser(dummyUser);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('authChange'));
      }
      
      return dummyUser;
    } catch (error: any) {
      console.error('Gagal login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Gagal terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleAccessToken: string) => {
    try {
      setIsLoading(true);
      
      // 1. Ambil data profil dari Google API
      const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      });
      const googleData = googleRes.data;
      
      // 2. Kirim ke backend (menggunakan /user agar dapat registrasi + login sekaligus)
      const apiUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL || 'http://localhost:8000/api';
      const response = await axios.post(`${apiUrl}/guest/user`, {
          username: googleData.email,
          password: 'google_sso_password', // Password statis untuk backend
          nama: googleData.name,
          email: googleData.email,
          foto: googleData.picture
      });
      
      const data = response.data;
      
      // Simpan di state & localStorage
      const tokenToSave = 'access_' + (data.id || Date.now());
      const userData = { 
        id: String(data.id), 
        name: data.nama || googleData.name, 
        email: googleData.email,
        picture: googleData.picture
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', tokenToSave);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('authChange'));
      }
      
      return userData;
    } catch (error: any) {
      console.error('Gagal login dengan Google:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Gagal terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
    }
  };

  return {
    user,            
    isLoading,       
    isAuthenticated, 
    login,           
    loginWithGoogle,
    logout,          
    checkSession,    
  };
}
