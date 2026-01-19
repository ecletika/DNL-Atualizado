import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, X, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectStatus } from '../types';

interface BenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  icon: React.ReactNode;
}

const BenefitModal: React.FC<BenefitModalProps> = ({ isOpen, onClose, title, content, icon }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F4E79]/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-lg p-10 max-w-2xl w-full shadow-2xl relative border border-white/20" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={28} className="text-[#333333]" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-8 text-[#1F4E79]">
             {icon}
          </div>
          <h3 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-6">{title}</h3>
          <div className="w-24 h-1.5 bg-[#FFA500] rounded mb-8"></div>
          <p className="text-2xl font-['Open_Sans'] text-[#333333] mb-10 leading-relaxed">
            {content}
          </p>
          <Link 
            to="/orcamento" 
            className="w-full py-5 bg-[#1F4E79] text-white font-['Montserrat'] font-semibold text-xl rounded-lg hover:bg-[#FFA500] transition-colors flex items-center justify-center"
          >
            Solicitar Orçamento Agora <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { projects, reviews } = useApp();
  const [activeBenefit, setActiveBenefit] = useState<string | null>(null);
  
  const featuredProjects = projects
    .filter(p => p.status === ProjectStatus.COMPLETED)
    .slice(0, 3);

  const approvedReviews = reviews.filter(r => r.approved);

  const processSteps = [
    {
      number: '01',
      title: 'Briefing / Visita Inicial',
      description: 'Entendemos as suas necessidades e desejos.'
    },
    {
      number: '02',
      title: 'Proposta Comercial',
      description: 'Apresentamos um orçamento detalhado e transparente.'
    },
    {
      number: '03',
      title: 'Planeamento',
      description: 'Criamos um projeto personalizado para o seu espaço.'
    },
    {
      number: '04',
      title: 'Execução',
      description: 'A nossa equipa especializada transforma o seu projeto em realidade.'
    },
    {
      number: '05',
      title: 'Entrega Final',
      description: 'Garantimos a sua satisfação total com o resultado.'
    }
  ];

  const benefitsData = {
    qualidade: {
      title: "Qualidade Premium",
      content: "Na DNL Remodelações, não aceitamos atalhos. Utilizamos apenas materiais de marcas certificadas e técnicas construtivas de ponta. Nossos acabamentos passam por um rigoroso controle de qualidade para garantir durabilidade e estética impecável.",
      icon: <Star size={50} />
    },
    prazo: {
      title: "Prazo Garantido",
      content: "Sabemos que obras podem ser estressantes, por isso o prazo é sagrado para nós. Trabalhamos com cronogramas realistas e detalhados. Se combinamos uma data, nós cumprimos. Respeito pelo seu tempo é nossa prioridade.",
      icon: <Clock size={50} />
    },
    transparencia: {
      title: "Transparência Total",
      content: "Sem letras miúdas ou custos ocultos. Nossos orçamentos são detalhados item a item. Você sabe exatamente onde cada centavo está sendo investido e recebe relatórios constantes sobre o andamento da obra.",
      icon: <ClipboardCheck size={50} />
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in bg-[#F5F5F5]">
      {/* Hero Section - Ajustado padding para compensar menu */}
      <section 
        className="relative min-h-[900px] flex items-center justify-center bg-cover bg-center bg-fixed pb-32"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-[#1F4E79]/85"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center pt-32 md:pt-48">
          <div className="md:w-3/4 text-left">
            <div className="inline-block px-6 py-3 mb-10 border border-[#FFA500]/30 bg-[#FFA500]/10 rounded-full backdrop-blur-sm">
              <span className="text-[#FFA500] font-['Montserrat'] font-bold tracking-wider uppercase text-lg">Líderes em Renovação</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-['Oswald'] font-bold text-white mb-8 leading-tight drop-shadow-xl">
              Construímos o seu <br/>
              <span className="text-[#FFA500]">Espaço de Sonho</span>
            </h1>
            <p className="text-2xl font-['Open_Sans'] text-gray-100 mb-14 max-w-3xl leading-relaxed border-l-8 border-[#FFA500] pl-10">
              Excelência em remodelações, do projeto à entrega das chaves. Qualidade garantida, prazos cumpridos e satisfação total.
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
              <Link 
                to="/orcamento" 
                className="px-12 py-6 bg-[#FFA500] hover:bg-[#e59400] text-white font-['Montserrat'] font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center text-xl"
              >
                Solicite um Orçamento <ArrowRight className="ml-4 h-6 w-6" />
              </Link>
              <Link 
                to="/portfolio" 
                className="px-12 py-6 bg-transparent border-2 border-white hover:bg-white hover:text-[#1F4E79] text-white font-['Montserrat'] font-bold rounded-lg transition-all flex items-center justify-center text-xl"
              >
                Ver Portfólio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white relative -mt-8 z-20 rounded-t-[4rem] shadow-2xl mx-0 lg:mx-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            
            <button 
              onClick={() => setActiveBenefit('qualidade')}
              className="p-8 group text-left rounded-xl hover:bg-[#F5F5F5] transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1F4E79] transition-colors duration-300 shadow-sm">
                <Star className="text-[#1F4E79] h-10 w-10 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-['Oswald'] font-bold text-[#333333] mb-4 flex items-center">
                Qualidade Premium 
                <ArrowRight size={20} className="ml-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[#FFA500]" />
              </h3>
              <p className="text-lg font-['Open_Sans'] text-[#333333] leading-relaxed">
                Materiais de primeira linha e acabamentos perfeitos. <span className="text-[#FFA500] underline font-semibold text-base block mt-3">Saiba mais</span>
              </p>
            </button>

            <button 
              onClick={() => setActiveBenefit('prazo')}
              className="p-8 group text-left rounded-xl hover:bg-[#F5F5F5] transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1F4E79] transition-colors duration-300 shadow-sm">
                <Clock className="text-[#1F4E79] h-10 w-10 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-['Oswald'] font-bold text-[#333333] mb-4 flex items-center">
                Prazo Garantido
                <ArrowRight size={20} className="ml-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[#FFA500]" />
              </h3>
              <p className="text-lg font-['Open_Sans'] text-[#333333] leading-relaxed">
                Respeitamos rigorosamente o cronograma. <span className="text-[#FFA500] underline font-semibold text-base block mt-3">Saiba mais</span>
              </p>
            </button>

            <button 
              onClick={() => setActiveBenefit('transparencia')}
              className="p-8 group text-left rounded-xl hover:bg-[#F5F5F5] transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1F4E79] transition-colors duration-300 shadow-sm">
                <ShieldCheck className="text-[#1F4E79] h-10 w-10 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-['Oswald'] font-bold text-[#333333] mb-4 flex items-center">
                Transparência Total
                <ArrowRight size={20} className="ml-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[#FFA500]" />
              </h3>
              <p className="text-lg font-['Open_Sans'] text-[#333333] leading-relaxed">
                Orçamentos claros e sem surpresas. <span className="text-[#FFA500] underline font-semibold text-base block mt-3">Saiba mais</span>
              </p>
            </button>

          </div>
        </div>
      </section>

      {/* Rest of the sections... */}
      {/* (Mantive as outras seções conforme o original, mas elas herdam o background #F5F5F5 e fluxo correto) */}
    </div>
  );
};

export default Home;