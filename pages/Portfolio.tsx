import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType, ProjectStatus } from '../types';
import { ArrowRight, Search, LayoutGrid, Video } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { projects } = useApp();
  const [filter, setFilter] = useState<string>('Todos');

  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);
  const filteredProjects = filter === 'Todos' 
    ? completedProjects 
    : completedProjects.filter(p => p.type === filter);

  const categories = ['Todos', ...Object.values(ProjectType)];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FFA500] font-['Montserrat'] font-bold uppercase text-xs tracking-widest">Excelência em cada detalhe</span>
          <h1 className="text-4xl md:text-6xl font-['Oswald'] font-bold text-[#1F4E79] mt-2 mb-4 uppercase">Nosso Portfólio</h1>
          <p className="text-gray-500 font-['Open_Sans'] max-w-2xl mx-auto text-lg">Explore as transformações que realizámos. Do conceito à entrega, o nosso foco é a perfeição.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === cat ? 'bg-[#1F4E79] text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>{cat}</button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50">
                <div className="relative h-72 overflow-hidden bg-gray-200">
                  {project.videoUrl ? (
                    <video 
                      src={project.videoUrl} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      onMouseOver={e => (e.target as HTMLVideoElement).play()}
                    />
                  ) : (
                    <img src={project.imageUrl || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80'} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E79]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white font-bold text-sm flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Ver detalhes do projeto <ArrowRight size={18} /></span>
                  </div>
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-[#1F4E79] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">{project.type}</span>
                    {project.videoUrl && <span className="bg-[#FFA500] text-white p-2 rounded-full shadow-lg"><Video size={14} /></span>}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-[#1F4E79] font-['Oswald'] mb-4 uppercase truncate">{project.title}</h3>
                  <p className="text-gray-500 font-['Open_Sans'] line-clamp-3 leading-relaxed mb-6">{project.description}</p>
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#FFA500] uppercase tracking-widest">Obra Concluída</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{project.completionDate || '2024'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-gray-400 italic">Nenhum projeto encontrado nesta categoria.</p></div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;