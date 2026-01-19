import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType, ProjectStatus } from '../types';

const Portfolio: React.FC = () => {
  const { projects } = useApp();
  const [filter, setFilter] = useState<string>('Todos');

  // Only show completed projects in portfolio
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);
  
  const filteredProjects = filter === 'Todos' 
    ? completedProjects 
    : completedProjects.filter(p => p.type === filter);

  const categories = ['Todos', ...Object.values(ProjectType)];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-4">Nosso Portfólio</h1>
          <p className="text-[#333333] font-['Open_Sans']">Explore alguns dos nossos trabalhos realizados com excelência.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-lg text-sm font-['Montserrat'] font-semibold transition-all ${
                filter === cat
                  ? 'bg-[#1F4E79] text-white shadow-md'
                  : 'bg-white text-[#333333] hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
              <div className="h-64 overflow-hidden relative group">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1F4E79]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white bg-[#FFA500] font-['Montserrat'] font-bold px-4 py-2 rounded-lg shadow-lg">Ver Detalhes</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-['Montserrat'] font-bold text-[#FFA500] uppercase tracking-wide">{project.type}</span>
                  <span className="text-xs text-gray-400 font-['Open_Sans']">{project.completionDate}</span>
                </div>
                <h3 className="text-xl font-['Oswald'] font-bold text-[#333333] mb-3">{project.title}</h3>
                <p className="text-[#333333] text-sm mb-4 flex-1 font-['Open_Sans']">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-['Open_Sans']">
            Nenhum projeto encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;