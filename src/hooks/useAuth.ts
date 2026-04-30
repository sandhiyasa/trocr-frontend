'use client';

import { useState, useEffect } from 'react';

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
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Simulasi validasi token untuk rangka skeleton
      if (token.startsWith('dummy_anon_')) {
          setUser({ id: 'anon', name: 'Pengguna Anonim', email: 'anonim@readbali.com' });
          setIsAuthenticated(true);
      } else if (token.startsWith('dummy_')) {
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
      
      // Simulasi pertukaran token
      const dummyToken = isAnonim ? 'dummy_anon_' + Date.now() : 'dummy_access_' + token;
      const dummyUser = isAnonim 
        ? { id: 'anon', name: 'Pengguna Anonim', email: 'anonim@readbali.com' }
        : { id: '1', name: 'User ReadBali', email: 'user@readbali.com' };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', dummyToken);
        setUser(dummyUser);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('authChange'));
      }
      
      return dummyUser;
    } catch (error) {
      console.error('Gagal login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
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
    logout,          
    checkSession,    
  };
}
