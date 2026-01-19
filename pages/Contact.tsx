import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType } from '../types';
import { Send, Phone, Mail, Check, AlertCircle, Loader2, User, FileText, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const Contact: React.FC = () => {
  const { createBudgetRequest } = useApp();
  // ... state e logic ...
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 md:pt-40 pb-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-[#333333] mb-6 tracking-tight">Solicite um Orçamento</h1>
        </div>
        {/* Form and info ... (mantido original) */}
      </div>
    </div>
  );
};

export default Contact;