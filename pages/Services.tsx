import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Hammer, CheckCircle2, Zap, Droplets, Layers, LayoutGrid } from 'lucide-react';

const Services: React.FC = () => {
  // ... services and steps ...

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      
      {/* Hero Section - Ajustado padding */}
      <section 
        className="relative h-[650px] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2500&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-[#1F4E79]/80"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 md:pt-32">
          <span className="text-[#FFA500] font-['Montserrat'] font-bold tracking-widest uppercase text-base mb-3 block">O que fazemos</span>
          <h1 className="text-5xl md:text-7xl font-['Oswald'] font-bold text-white mb-8">
            Soluções Completas em Construção
          </h1>
          <p className="text-2xl font-['Open_Sans'] text-gray-200 max-w-3xl mx-auto mb-10">
            Especialistas em remodelações integrais: canalização, elétrica, pladur, pintura e muito mais.
          </p>
        </div>
      </section>
      {/* Restante dos serviços ... */}
    </div>
  );
};

export default Services;