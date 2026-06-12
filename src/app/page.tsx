// app/page.tsx
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#f8f1e7]">
      
      {/* =========================================
          LEFT SIDE: Banner (62%)
          ========================================= */}
      <div className="hidden lg:flex lg:w-[62%] relative bg-[#7b1d2f]">
        
        {/* Yahan apni pasand ki school/campus photo daal sakte hain */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000" 
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply"
        />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full bg-gradient-to-r from-black/50 to-transparent">
          <h1 className="text-5xl font-extrabold mb-4 text-[#ffe8d1]">
            Empowering Education.
          </h1>
          <p className="text-xl max-w-2xl text-gray-200">
            A comprehensive School Management System designed to streamline administration, connect parents, and empower teachers.
          </p>
        </div>
      </div>

      {/* =========================================
          RIGHT SIDE: Auth Form (38%)
          ========================================= */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[38%] p-4 sm:p-8 z-20 overflow-y-auto">
        <AuthForm />
      </div>
      
    </main>
  );
}