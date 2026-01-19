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
      {/* Hero Section */}
      <section 
        className="relative min-h-[900px] flex items-center justify-center bg-cover bg-center bg-fixed pb-32"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop")' }}
      >
        {/* Overlay Azul Profissional (#1F4E79) com opacidade */}
        <div className="absolute inset-0 bg-[#1F4E79]/85"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center pt-24">
          <div className="md:w-3/4 text-left">
            <div className="inline-block px-6 py-3 mb-10 border border-[#FFA500]/30 bg-[#FFA500]/10 rounded-full backdrop-blur-sm">
              <span className="text-[#FFA500] font-['Montserrat'] font-bold tracking-wider uppercase text-lg">Líderes em Renovação</span>
            </div>
            {/* Reduced font size slightly and removed excessive tracking to fix "stretched" look */}
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

      {/* Interactive Benefits Section */}
      {/* Changed -mt-20 to -mt-8 to reduce overlap as requested */}
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

      {/* Process Section - 5 Steps */}
      <section className="py-32 bg-[#1F4E79] text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA500]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div className="max-w-3xl">
              <span className="text-[#FFA500] font-['Montserrat'] font-bold uppercase tracking-widest text-lg mb-4 block">Metodologia</span>
              <h2 className="text-6xl font-['Oswald'] font-bold mb-8">Gestão Eficiente em 5 Etapas</h2>
              <p className="text-gray-200 font-['Open_Sans'] text-2xl leading-relaxed">
                Nosso método comprovado garante organização, limpeza e resultados de excelência em cada projeto.
              </p>
            </div>
            <Link to="/servicos" className="hidden md:flex text-[#FFA500] hover:text-white items-center font-['Montserrat'] font-bold text-xl transition-colors mt-6 md:mt-0 px-8 py-4 border-2 border-[#FFA500]/30 rounded-lg hover:bg-[#FFA500]/10">
              Conheça nossos serviços <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-10 border border-white/10 hover:border-[#FFA500]/50 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="text-8xl font-['Oswald'] font-black text-white">{step.number}</span>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFA500] font-bold mb-8 group-hover:bg-[#FFA500] group-hover:text-[#1F4E79] transition-colors text-2xl">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-['Oswald'] font-bold text-white mb-6 leading-tight min-h-[4rem] flex items-center">
                    {step.title}
                  </h3>
                  <p className="text-lg font-['Open_Sans'] text-gray-300 leading-relaxed group-hover:text-white">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-6xl font-['Oswald'] font-bold text-[#333333] mb-6">Projetos Recentes</h2>
              <div className="w-32 h-2.5 bg-[#FFA500] rounded-full"></div>
            </div>
            <Link to="/portfolio" className="hidden md:flex px-10 py-4 border-2 border-[#1F4E79] text-[#1F4E79] rounded-lg hover:bg-[#1F4E79] hover:text-white transition-all items-center font-['Montserrat'] font-bold text-xl">
               Ver Portfólio Completo <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProjects.map((project) => (
              <div key={project.id} className="group relative overflow-hidden rounded-xl shadow-2xl bg-white h-[550px]">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E79]/95 via-[#1F4E79]/50 to-transparent flex flex-col justify-end p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[#FFA500] text-lg font-['Montserrat'] font-bold uppercase tracking-widest mb-4">{project.type}</span>
                  <h3 className="text-white text-4xl font-['Oswald'] font-bold mb-4">{project.title}</h3>
                  <p className="text-gray-200 text-lg font-['Open_Sans'] line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-20 md:hidden">
             <Link to="/portfolio" className="inline-flex text-[#1F4E79] font-['Montserrat'] font-bold hover:text-[#FFA500] items-center justify-center border-b-2 border-[#1F4E79] pb-2 text-2xl">
                Ver todos os projetos <ArrowRight className="ml-3 h-6 w-6" />
             </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-['Oswald'] font-bold text-[#333333] mb-8">Confiança dos Clientes</h2>
            <p className="text-[#333333] font-['Open_Sans'] max-w-4xl mx-auto text-2xl">A satisfação dos nossos clientes é o nosso maior cartão de visita.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {approvedReviews.length > 0 ? (
              approvedReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#F5F5F5] p-12 rounded-xl hover:shadow-2xl transition-all border border-gray-100 relative group">
                {/* Quote Icon */}
                <div className="absolute top-10 right-12 text-gray-300 pointer-events-none group-hover:text-[#FFA500] transition-colors">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.537 14.239 16.313 13.631 17.257 13.257L18.017 13.017C18.423 12.911 18.729 12.633 18.935 12.183C19.141 11.733 19.165 11.233 19.007 10.683L18.791 9.923C18.633 9.373 18.319 8.923 17.849 8.573C17.379 8.223 16.829 8.048 16.199 8.048C15.357 8.048 14.651 8.352 14.081 8.96C13.511 9.568 13.226 10.274 13.226 11.078L13.226 12.017H10.017V11.078C10.017 9.574 10.531 8.262 11.559 7.142C12.587 6.022 13.913 5.462 15.537 5.462C16.695 5.462 17.727 5.766 18.633 6.374C19.539 6.982 20.219 7.794 20.673 8.81C21.127 9.826 21.289 10.874 21.159 11.954L20.935 12.766C20.669 13.794 20.143 14.778 19.357 15.718C18.571 16.658 17.653 17.364 16.603 17.836C15.553 18.308 14.549 18.544 13.591 18.544H13.226V21H14.017ZM5.017 21L5.017 18C5.017 16.896 5.321 15.923 5.929 15.081C6.537 14.239 7.313 13.631 8.257 13.257L9.017 13.017C9.423 12.911 9.729 12.633 9.935 12.183C10.141 11.733 10.165 11.233 10.007 10.683L9.791 9.923C9.633 9.373 9.319 8.923 8.849 8.573C8.379 8.223 7.829 8.048 7.199 8.048C6.357 8.048 5.651 8.352 5.081 8.96C4.511 9.568 4.226 10.274 4.226 11.078L4.226 12.017H1.017V11.078C1.017 9.574 1.531 8.262 2.559 7.142C3.587 6.022 4.913 5.462 6.537 5.462C7.695 5.462 8.727 5.766 9.633 6.374C10.539 6.982 11.219 7.794 11.673 8.81C12.127 9.826 12.289 10.874 12.159 11.954L11.935 12.766C11.669 13.794 11.143 14.778 10.357 15.718C9.571 16.658 8.653 17.364 7.603 17.836C6.553 18.308 5.549 18.544 4.591 18.544H4.226V21H5.017Z" /></svg>
                </div>
                
                <div className="flex items-center mb-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={28} 
                      className={`${i < review.rating ? 'text-[#FFA500] fill-[#FFA500]' : 'text-gray-300'} mr-1`} 
                    />
                  ))}
                </div>
                <p className="text-[#333333] mb-12 italic relative z-10 leading-relaxed text-xl font-['Open_Sans']">"{review.comment}"</p>
                <div className="flex items-center border-t border-gray-200 pt-8">
                  <div className="h-16 w-16 rounded-full bg-[#1F4E79] text-white flex items-center justify-center font-bold text-2xl overflow-hidden mr-6 shadow-md">
                     {review.avatarUrl ? (
                         <img src={review.avatarUrl} alt={review.clientName} className="h-full w-full object-cover" />
                     ) : (
                         <span>{review.clientName.charAt(0)}</span>
                     )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F4E79] text-xl font-['Oswald']">{review.clientName}</h4>
                    <span className="text-base text-gray-500 font-medium uppercase tracking-wide font-['Montserrat']">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))) : (
              <div className="col-span-1 md:col-span-3 text-center py-16 bg-[#F5F5F5] rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-['Open_Sans'] text-xl">Sem avaliações aprovadas para exibir no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;