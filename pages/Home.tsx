import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, X, ClipboardCheck, Clock, ShieldCheck, MessageSquare, Quote } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1F4E79]/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1F4E79]">{icon}</div>
          <h3 className="text-2xl font-bold mb-4 font-['Oswald']">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed font-['Open_Sans']">{content}</p>
          <Link to="/orcamento" className="block w-full py-4 bg-[#1F4E79] text-white font-bold rounded-xl hover:bg-[#FFA500] transition-colors font-['Montserrat']">Pedir Orçamento Agora</Link>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [activeBenefit, setActiveBenefit] = useState<string | null>(null);
  const { reviews } = useApp();

  const benefitsData = {
    qualidade: {
      title: "Qualidade Premium",
      content: "A nossa Qualidade Premium reflete-se na escolha minuciosa de materiais e no rigor técnico da nossa equipa. Garantimos um acabamento superior que valoriza o seu imóvel e perdura no tempo.",
      icon: <Star size={32} />
    },
    prazo: {
      title: "Prazo Garantido",
      content: "O cumprimento de prazos é um compromisso inabalável. Através de um planeamento detalhado e gestão rigorosa, asseguramos que a sua obra é entregue exatamente na data acordada.",
      icon: <Clock size={32} />
    },
    transparencia: {
      title: "Transparência Total",
      content: "Acreditamos em relações baseadas na confiança. Os nossos orçamentos são claros, detalhados e sem custos ocultos, mantendo-o informado em cada fase da obra.",
      icon: <ShieldCheck size={32} />
    }
  };

  const steps = [
    { n: '01', t: 'Briefing / Visita Inicial', d: 'Entendemos as suas necessidades e desejos para o seu novo espaço.' },
    { n: '02', t: 'Proposta Comercial', d: 'Apresentamos um orçamento detalhado e transparente para a sua aprovação.' },
    { n: '03', t: 'Planeamento', d: 'Criamos um projeto personalizado e definimos o cronograma de execução.' },
    { n: '04', t: 'Execução', d: 'A nossa equipa especializada transforma o seu projeto em realidade com rigor.' },
    { n: '05', t: 'Entrega Final', d: 'Garantimos a sua satisfação total com uma entrega limpa e impecável.' }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-14 md:pt-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-[#1F4E79]/75"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-['Oswald'] uppercase tracking-tight">Construímos o seu <span className="text-[#FFA500]">Espaço de Sonho</span></h1>
          <p className="text-xl text-gray-100 mb-10 leading-relaxed font-['Open_Sans']">Especialistas em remodelações integrais. Qualidade garantida, prazos cumpridos e satisfação total.</p>
          <Link to="/orcamento" className="inline-flex items-center gap-3 bg-[#FFA500] text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-[#1F4E79] transition-all shadow-xl font-['Montserrat']">Solicite um Orçamento <ArrowRight /></Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(benefitsData).map(([key, data]) => (
              <button key={key} onClick={() => setActiveBenefit(key)} className="p-10 text-left bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-[#FFA500] hover:bg-white hover:shadow-2xl transition-all group outline-none">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#1F4E79] group-hover:bg-[#1F4E79] group-hover:text-white transition-colors shadow-sm">{data.icon}</div>
                <h3 className="text-2xl font-bold mb-4 font-['Oswald']">{data.title}</h3>
                <p className="text-gray-500 font-['Open_Sans'] mb-4">Saiba como garantimos a excelência no seu projeto através deste pilar fundamental.</p>
                <div className="text-[#FFA500] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Ver Detalhes <ArrowRight size={18} /></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Management Steps Section */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F4E79] mb-6 font-['Oswald']">Gestão Eficiente em 5 Etapas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-['Open_Sans'] text-lg">Nosso método comprovado garante organização, limpeza e resultados de excelência em cada projeto.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-[#1F4E79] text-white rounded-full flex items-center justify-center mb-6 font-bold text-lg font-['Montserrat'] group-hover:bg-[#FFA500] transition-colors">{step.n}</div>
                <h4 className="font-bold text-xl mb-4 text-[#1F4E79] font-['Oswald']">{step.t}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-['Open_Sans']">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white" id="testemunhos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <span className="text-[#FFA500] font-bold uppercase text-xs tracking-widest font-['Montserrat']">Testemunhos</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F4E79] mt-2 font-['Oswald'] uppercase">O que dizem os nossos clientes</h2>
              <p className="text-gray-500 mt-4 max-w-xl font-['Open_Sans']">A satisfação de quem já confiou na DNL é a nossa melhor apresentação.</p>
            </div>
            <Link to="/avaliar" className="bg-[#1F4E79] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#FFA500] transition-all flex items-center gap-2 font-['Montserrat'] shadow-lg hover:-translate-y-1">
              <MessageSquare size={20} /> Deixe a sua avaliação
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.filter(r => r.approved).length > 0 ? (
              reviews.filter(r => r.approved).slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-50 p-10 rounded-[2.5rem] relative group hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-gray-100">
                  <Quote className="absolute top-8 right-8 text-[#1F4E79]/5 group-hover:text-[#FFA500]/10" size={60} />
                  <div className="flex text-[#FFA500] mb-6">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 italic mb-8 font-['Open_Sans'] leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1F4E79] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F4E79] font-['Montserrat']">{review.clientName}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{new Date(review.date).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <MessageSquare size={32} />
                </div>
                <p className="text-gray-400 italic mb-6">Ainda não existem avaliações publicadas. Seja o primeiro a contar a sua experiência!</p>
                <Link to="/avaliar" className="text-[#1F4E79] font-bold hover:text-[#FFA500] underline uppercase text-xs tracking-widest">Avaliar agora</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-[#1F4E79]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 font-['Oswald'] uppercase">Pronto para começar a sua obra?</h2>
          <p className="text-xl text-white/80 mb-12 font-['Open_Sans']">A nossa equipa está pronta para transformar a sua ideia em realidade com rigor e profissionalismo.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
             <Link to="/orcamento" className="bg-[#FFA500] text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-[#1F4E79] transition-all font-['Montserrat'] shadow-xl">Pedir Orçamento Grátis</Link>
             <Link to="/portfolio" className="border-2 border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-[#1F4E79] transition-all font-['Montserrat']">Ver Nosso Portfólio</Link>
          </div>
        </div>
      </section>

      {activeBenefit && (
        <BenefitModal 
          isOpen={!!activeBenefit} 
          onClose={() => setActiveBenefit(null)} 
          title={benefitsData[activeBenefit as keyof typeof benefitsData].title}
          content={benefitsData[activeBenefit as keyof typeof benefitsData].content}
          icon={benefitsData[activeBenefit as keyof typeof benefitsData].icon}
        />
      )}
    </div>
  );
};

export default Home;