import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectStatus, Project } from '../types';
import { Calendar, Hammer, Camera, X, Star, ImageIcon, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ongoing: React.FC = () => {
  const { projects } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const ongoingProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);

  // Reset slide when project changes
  useEffect(() => {
    if (selectedProject) {
      setCurrentSlide(0);
    }
  }, [selectedProject]);

  // Combine main image and gallery into slides
  const getSlides = () => {
    if (!selectedProject) return [];
    
    const slides = [
      { 
        url: selectedProject.imageUrl, 
        caption: 'Estado Atual (Capa)', 
        type: 'Principal' 
      }
    ];

    if (selectedProject.gallery && selectedProject.gallery.length > 0) {
      selectedProject.gallery.forEach(item => {
        slides.push({
          url: item.url,
          caption: item.caption || '',
          type: 'Galeria'
        });
      });
    }
    return slides;
  };

  const slides = getSlides();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Handle Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setSelectedProject(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, currentSlide]); // Dependências atualizadas

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-36 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FFA500] font-['Montserrat'] font-bold uppercase text-xs tracking-wider">Acompanhamento</span>
          <h1 className="text-4xl font-['Oswald'] font-bold text-[#333333] mt-2 mb-4">Obras em Andamento</h1>
          <p className="text-[#333333] font-['Open_Sans'] max-w-2xl mx-auto">
            Transparência total. Acompanhe a evolução das nossas transformações atuais e veja como trabalhamos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {ongoingProjects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col md:flex-row h-full">
              
              {/* Área da Imagem Clicável */}
              <div 
                className="md:w-2/5 h-72 md:h-auto relative group cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => setSelectedProject(project)}
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Escuro no Hover */}
                <div className="absolute inset-0 bg-[#1F4E79]/0 group-hover:bg-[#1F4E79]/40 transition-all duration-300"></div>

                {/* Botão Central */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-sm text-[#1F4E79] px-6 py-3 rounded-lg font-['Montserrat'] font-bold text-sm flex items-center shadow-2xl border border-white/20">
                      <Camera className="mr-2 h-5 w-5 text-[#FFA500]" /> Ver Galeria
                    </div>
                </div>

                {/* Tag de Status */}
                <div className="absolute top-4 left-4 bg-[#FFA500] text-white text-xs font-['Montserrat'] font-bold px-3 py-1 rounded-lg shadow-md z-10 uppercase tracking-wide">
                  Em Andamento
                </div>

                {/* Botão Fixo */}
                <div className="absolute bottom-4 right-4 z-10">
                   <button 
                     className="bg-[#1F4E79]/80 hover:bg-[#1F4E79] text-white p-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex items-center gap-2 px-3 transition-transform hover:scale-105 active:scale-95"
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedProject(project);
                     }}
                   >
                     <ImageIcon size={16} className="text-[#FFA500]" />
                     <span className="text-xs font-['Montserrat'] font-bold">
                        {project.gallery && project.gallery.length > 0 ? `${project.gallery.length + 1} Fotos` : '1 Foto'}
                     </span>
                   </button>
                </div>
              </div>

              <div className="p-8 md:w-3/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-['Oswald'] font-bold text-[#333333] mb-3 hover:text-[#FFA500] transition-colors cursor-pointer" onClick={() => setSelectedProject(project)}>
                    {project.title}
                  </h3>
                  <p className="text-[#333333] font-['Open_Sans'] text-sm mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="space-y-3 mb-8 bg-[#F5F5F5] p-4 rounded-lg border border-gray-200">
                    {project.startDate && (
                      <div className="flex items-center text-gray-600 text-sm font-['Open_Sans']">
                        <Calendar size={16} className="mr-3 text-gray-400" />
                        <span>Início: <strong className="text-[#333333]">{new Date(project.startDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 text-sm font-['Open_Sans']">
                      <Calendar size={16} className="mr-3 text-[#FFA500]" />
                      <span>Previsão: <strong className="text-[#333333]">{project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'A definir'}</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-['Montserrat'] font-bold text-[#333333] flex items-center">
                      <Hammer size={16} className="mr-2 text-gray-400" /> Etapa Atual
                    </span>
                    <span className="text-sm font-black text-[#1F4E79] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-[#FFA500] h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ongoingProjects.length === 0 && (
          <div className="text-center py-24 bg-white rounded-lg border border-dashed border-gray-300 mb-20">
             <Hammer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold font-['Oswald'] text-gray-500">Nenhuma obra em andamento registrada no momento.</h3>
            <p className="text-gray-400 mt-2 font-['Open_Sans']">Visite nosso portfólio para ver obras concluídas.</p>
          </div>
        )}

        {/* Avaliação CTA */}
        <div className="bg-[#1F4E79] rounded-lg p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#FFA500] rounded-full opacity-10 blur-3xl"></div>
            
            <div className="relative z-10 mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-['Oswald'] font-bold text-white mb-2">Já é nosso cliente?</h3>
                <p className="text-gray-200 max-w-lg font-['Open_Sans']">
                    Sua opinião é muito importante para nós. Se você tem uma obra em andamento ou concluída, deixe sua avaliação sobre o nosso trabalho.
                </p>
            </div>
            
            <Link 
                to="/avaliar" 
                className="relative z-10 bg-[#FFA500] hover:bg-[#e59400] text-white font-['Montserrat'] font-bold px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center whitespace-nowrap"
            >
                <Star className="mr-2 h-5 w-5" /> Deixe sua Avaliação
            </Link>
        </div>

        {/* Gallery Modal Carousel */}
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1F4E79]/90 backdrop-blur-md transition-all animate-fade-in" onClick={() => setSelectedProject(null)}>
            <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl animate-scale-up overflow-hidden flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
              
              {/* Header Modal */}
              <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white z-20">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                       <span className="bg-[#FFA500]/10 text-[#FFA500] text-xs font-['Montserrat'] font-bold px-2 py-1 rounded uppercase tracking-wide">
                          {selectedProject.type}
                       </span>
                       <span className="text-gray-400 text-sm">|</span>
                       <span className="text-gray-500 text-sm font-['Open_Sans']">{selectedProject.status}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-['Oswald'] font-bold text-[#333333]">{selectedProject.title}</h2>
                </div>
                <button 
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-sm"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={24} className="text-[#333333]" />
                </button>
              </div>
              
              {/* Carousel Container */}
              <div 
                className="relative flex-1 bg-black flex items-center justify-center overflow-hidden group select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                 {/* Image */}
                 <div className="w-full h-[50vh] md:h-[60vh] relative">
                    <img 
                      src={slides[currentSlide].url} 
                      alt={`Slide ${currentSlide}`} 
                      className="w-full h-full object-contain"
                    />
                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-white">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="bg-[#FFA500] text-[#1F4E79] text-[10px] font-bold px-2 py-0.5 rounded font-['Montserrat'] uppercase">
                              {slides[currentSlide].type}
                           </span>
                           <span className="text-xs text-gray-300 font-['Open_Sans']">
                              {currentSlide + 1} de {slides.length}
                           </span>
                        </div>
                        <p className="font-['Open_Sans'] text-lg font-medium">
                           {slides[currentSlide].caption || selectedProject.title}
                        </p>
                    </div>
                 </div>

                 {/* Controls (Arrows) - Hide if only 1 slide */}
                 {slides.length > 1 && (
                   <>
                     <button 
                       onClick={prevSlide}
                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                     >
                       <ChevronLeft size={32} />
                     </button>
                     <button 
                       onClick={nextSlide}
                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                     >
                       <ChevronRight size={32} />
                     </button>
                   </>
                 )}
              </div>

              {/* Thumbnails / Indicators */}
              <div className="bg-[#F5F5F5] p-4 flex justify-center items-center gap-2 border-t border-gray-200 overflow-x-auto">
                 {slides.map((_, idx) => (
                   <button 
                     key={idx}
                     onClick={() => goToSlide(idx)}
                     className={`transition-all duration-300 ${
                        currentSlide === idx 
                          ? 'text-[#1F4E79] transform scale-125' 
                          : 'text-gray-300 hover:text-gray-400'
                     }`}
                   >
                     <Circle size={10} fill="currentColor" />
                   </button>
                 ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ongoing;