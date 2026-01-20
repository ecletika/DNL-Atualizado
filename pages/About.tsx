import React from 'react';
import { Target, Eye, Leaf, Users, Shield, Heart, Clock, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';

const About: React.FC = () => {
  const { settings } = useApp();

  const values = [
    { 
      icon: Leaf, 
      t: "Responsabilidade Social e Ambiental", 
      d: "Compromisso com práticas sustentáveis, gestão eficiente de resíduos e impacto positivo na comunidade onde atuamos." 
    },
    { 
      icon: Users, 
      t: "Respeito às Pessoas", 
      d: "Valorizamos cada indivíduo. Tratamos clientes, colaboradores e parceiros com dignidade, empatia e máxima consideração." 
    },
    { 
      icon: Shield, 
      t: "Honestidade", 
      d: "Transparência total em orçamentos, prazos e relações. A confiança é o alecerce de todas as nossas obras." 
    },
    { 
      icon: Heart, 
      t: "Humildade", 
      d: "Reconhecemos que estamos em constante aprendizagem. Ouvimos os nossos clientes para evoluir e melhorar continuamente." 
    },
    { 
      icon: Clock, 
      t: "Disciplina", 
      d: "Rigor no cumprimento de horários, processos de segurança e normas técnicas. A organização é fundamental para o sucesso." 
    },
    { 
      icon: Scale, 
      t: "Ética", 
      d: "Conduta íntegra e profissional em todas as situações. Fazemos o que é certo, garantindo a qualidade e a legalidade." 
    }
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Logo Section - Restaurado com Logo Grande */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FFA500]/10 rounded-[3rem] transform translate-x-4 translate-y-4"></div>
            <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 p-16 flex items-center justify-center min-h-[450px]">
               {settings?.logo_url ? (
                 <img src={settings.logo_url} alt="DNL Logo" className="max-h-72 w-auto object-contain drop-shadow-lg" />
               ) : (
                 <div className="flex flex-col items-center scale-150">
                    <div className="flex items-center">
                      <span className="text-7xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic">DNL</span>
                      <div className="h-14 w-10 bg-[#FFA500] ml-2 skew-x-[-12deg]"></div>
                    </div>
                    <span className="text-[12px] font-['Montserrat'] font-bold tracking-[0.4em] text-[#333333] uppercase mt-3">Remodelações</span>
                 </div>
               )}
            </div>
          </div>
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1F4E79] font-['Oswald']">Nossa História</h1>
            <div className="space-y-6 text-gray-600 font-['Open_Sans'] text-xl leading-relaxed">
              <p>
                A DNL Remodelações nasceu da paixão por transformar ambientes e melhorar a qualidade de vida das pessoas através da arquitetura e construção. Começamos como uma pequena equipe familiar e crescemos baseados na recomendação de nossos clientes satisfeitos.
              </p>
              <div className="bg-gray-50 border-l-8 border-[#FFA500] p-10 rounded-r-3xl italic text-[#1F4E79] font-semibold text-2xl shadow-sm">
                "Hoje, contamos com uma equipe multidisciplinar de arquitetos, engenheiros e mestres de obras, todos comprometidos com a excelência em cada detalhe, desde a demolição até o acabamento final."
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          <div className="bg-white p-14 rounded-[3rem] shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-[#FFA500] shadow-inner">
              <Target size={48} />
            </div>
            <h2 className="text-4xl font-bold mb-6 font-['Oswald'] text-[#1F4E79]">Missão</h2>
            <p className="text-gray-600 leading-relaxed font-['Open_Sans'] text-lg">Entregar soluções de reforma que superem as expectativas, aliando funcionalidade, estética e durabilidade para criar espaços onde as pessoas adorem viver e trabalhar.</p>
          </div>
          <div className="bg-white p-14 rounded-[3rem] shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-[#1F4E79] shadow-inner">
              <Eye size={48} />
            </div>
            <h2 className="text-4xl font-bold mb-6 font-['Oswald'] text-[#1F4E79]">Visão</h2>
            <p className="text-gray-600 leading-relaxed font-['Open_Sans'] text-lg">Ser referência nacional em remodelações residenciais e comerciais, reconhecida pela inovação, qualidade impecável e pela confiança que construímos com cada cliente.</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#1F4E79] mb-6 font-['Oswald']">Nossos Valores</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-['Open_Sans'] text-xl">Os pilares fundamentais que sustentam cada projeto e cada relação que construímos com integridade e profissionalismo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col items-start hover:bg-[#1F4E79] group transition-all duration-300">
              <div className="text-[#FFA500] mb-8 group-hover:text-white transition-colors transform group-hover:scale-110"><v.icon size={48} /></div>
              <h4 className="font-bold text-2xl mb-6 font-['Oswald'] text-[#1F4E79] group-hover:text-[#FFA500] transition-colors">{v.t}</h4>
              <p className="text-gray-500 leading-relaxed font-['Open_Sans'] text-lg group-hover:text-gray-200 transition-colors">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;