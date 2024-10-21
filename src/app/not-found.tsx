"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-100 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg w-full">
        <h2 className="text-8xl font-extrabold text-blue-600 mb-4">404</h2>
        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="#8B5CF6" />
            <circle cx="70" cy="80" r="20" fill="white" />
            <circle cx="130" cy="80" r="20" fill="white" />
            <path d="M 70 120 Q 100 150 130 120" stroke="white" strokeWidth="8" fill="none" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-bold text-white">{dots}</p>
          </div>
        </div>
        <p className="text-xl text-gray-600 mb-6">Oops! The page you are looking for has gone on an adventure.</p>
        <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-300 text-lg font-semibold">
          <ArrowLeft className="mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}