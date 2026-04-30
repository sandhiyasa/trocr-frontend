import axios from 'axios';

const OCR_BASE_URL = process.env.NEXT_PUBLIC_OCR_API_URL || 'https://api-ocr.readbali.com';
const SERVICE_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_API_URL || 'https://service.readbali.com';

export const ocrApi = axios.create({
  baseURL: OCR_BASE_URL,
  timeout: 30000, 
});

export const serviceApi = axios.create({
  baseURL: SERVICE_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

serviceApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token'); 
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serviceApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        console.warn('Sesi telah berakhir, silakan login kembali.');
      }
    }
    return Promise.reject(error);
  }
);
