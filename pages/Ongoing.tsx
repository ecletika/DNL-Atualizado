import React from 'react';
import { useApp } from '../context/AppContext';
import { ProjectStatus, Project } from '../types';
import { Calendar, Hammer, Clock, ArrowRight, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ongoing: React.FC = () => {
  const { projects } = useApp();
  const ongoingProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 md:pt-40 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FFA500] font-['Montserrat'] font-bold uppercase text-xs tracking-widest">Transparência Total</span>
          <h1 className="text-4xl md:text-6xl font-['Oswald'] font-bold text-[#1F4E79] mt-2 mb-4 uppercase">Obras em Andamento</h1>
          <p className="text-gray-500 font-['Open_Sans'] max-w-2xl mx-auto text-lg">Acompanhe em tempo real a evolução dos nossos projetos atuais. Garantimos organização, limpeza e cumprimento de prazos.</p>
        </div>

        {ongoingProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongoingProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  {project.videoUrl ? (
                    <video 
                      src={project.videoUrl} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                    />
                  ) : (
                    <img src={project.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80'} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#FFA500] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{project.type}</span>
                    {project.videoUrl && <span className="bg-[#1F4E79] text-white p-1.5 rounded-full shadow-lg"><Video size={12} /></span>}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                       <Clock size={14} className="text-[#FFA500]" />
                       <span className="text-[10px] font-bold text-[#1F4E79] uppercase">{project.progress}% Concluído</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1F4E79] font-['Oswald'] mb-3 uppercase truncate">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-8 line-clamp-3 font-['Open_Sans']">{project.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Evolução da Obra</span>
                      <span className="text-[#FFA500]">{project.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1F4E79] to-[#FFA500] transition-all duration-1000 ease-out rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span className="text-xs font-semibold">Início: {project.startDate || 'Recentemente'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#FFA500]">
                      <Hammer size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Ativa</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"><Hammer size={40} /></div>
            <h3 className="text-2xl font-bold text-gray-400 font-['Oswald'] mb-4">Nenhuma obra em andamento no momento</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 font-['Open_Sans']">Estamos a preparar novos projetos incríveis. Enquanto isso, espreite o nosso portfólio de obras concluídas.</p>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-[#1F4E79] font-bold hover:text-[#FFA500] transition-colors uppercase text-sm tracking-widest">Ver Portfólio Concluído <ArrowRight size={18} /></Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ongoing;