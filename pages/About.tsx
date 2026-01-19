import React from 'react';
import { Users, Target, Eye, Leaf, Heart, Shield, Scale, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const About: React.FC = () => {
  const { settings } = useApp();

  const values = [
    { 
      icon: Leaf, 
      title: "Responsabilidade Social e Ambiental", 
      description: "Compromisso com práticas sustentáveis, gestão de resíduos e impacto positivo na comunidade onde atuamos." 
    },
    { 
      icon: Users, 
      title: "Respeito às Pessoas", 
      description: "Valorizamos cada indivíduo. Tratamos clientes, colaboradores e parceiros com dignidade, empatia e consideração." 
    },
    { 
      icon: Shield, 
      title: "Honestidade", 
      description: "Transparência total em orçamentos, prazos e relações. A confiança é a base de todas as nossas obras." 
    },
    { 
      icon: Heart, 
      title: "Humildade", 
      description: "Reconhecemos que estamos sempre aprendendo. Ouvimos nossos clientes para evoluir continuamente." 
    },
    { 
      icon: Clock, 
      title: "Disciplina", 
      description: "Rigor no cumprimento de horários, processos de segurança e normas técnicas. Organização é fundamental." 
    },
    { 
      icon: Scale, 
      title: "Ética", 
      description: "Conduta íntegra e profissional. Fazemos o que é certo, garantindo a qualidade e a legalidade dos serviços." 
    }
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-32 md:pt-40 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-4">Sobre a DNL Remodelações</h1>
          <p className="text-lg font-['Open_Sans'] text-[#333333] max-w-2xl mx-auto">
            Há mais de 10 anos construindo confiança e renovando espaços com dedicação e profissionalismo.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FFA500] rounded-lg transform translate-x-3 translate-y-3 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
            <div className="relative bg-white rounded-lg shadow-xl z-10 w-full h-[400px] flex items-center justify-center overflow-hidden border border-gray-200 p-8">
               <div className="flex flex-col items-center justify-center w-full h-full bg-white">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="DNL Logo" className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="transform scale-150">
                       <div className="flex items-center">
                          <span className="text-8xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic">
                             DNL
                          </span>
                          <div className="h-16 w-10 bg-[#FFA500] ml-2 skew-x-[-12deg] transform translate-y-[-4px]"></div>
                       </div>
                       <div className="w-full text-center border-t-4 border-[#1F4E79] mt-2 pt-2">
                           <span className="text-xl font-['Montserrat'] font-bold tracking-[0.3em] text-[#1F4E79] uppercase">
                             Remodelações
                           </span>
                       </div>
                    </div>
                  )}
                  <p className="mt-12 text-gray-400 text-xs text-center italic font-['Open_Sans']">Desde 2013 transformando espaços</p>
               </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-6 flex items-center">
              Nossa História
              <div className="h-1.5 w-16 bg-[#FFA500] ml-4 rounded-full"></div>
            </h2>
            <p className="text-[#333333] font-['Open_Sans'] mb-6 leading-relaxed text-xl font-light">
              A <strong>DNL Remodelações</strong> nasceu da paixão por transformar ambientes e melhorar a qualidade de vida das pessoas através da arquitetura e construção. Começamos como uma pequena equipe familiar e crescemos baseados na recomendação de nossos clientes satisfeitos.
            </p>
            <p className="text-[#333333] font-['Open_Sans'] leading-relaxed text-lg border-l-4 border-[#1F4E79] pl-6 italic">
              "Hoje, contamos com uma equipe multidisciplinar de arquitetos, engenheiros e mestres de obras, todos comprometidos com a excelência em cada detalhe."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;