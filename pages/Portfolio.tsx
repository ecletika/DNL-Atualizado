import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType, ProjectStatus } from '../types';

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-4">Nosso Portfólio</h1>
          <p className="text-[#333333] font-['Open_Sans']">Explore alguns dos nossos trabalhos realizados com excelência.</p>
        </div>

        {/* Filters and Grid... (Mantido original) */}
      </div>
    </div>
  );
};

export default Portfolio;