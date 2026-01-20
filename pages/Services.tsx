import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Hammer, Zap, Droplets, Layers, LayoutGrid } from 'lucide-react';

const Services: React.FC = () => {
  const servicesList = [
    { 
      icon: Paintbrush, 
      title: "Pintura e Decoração", 
      desc: "Executamos pinturas de alta precisão em interiores e exteriores. Trabalhamos com as melhores marcas para garantir durabilidade, lavabilidade e um acabamento que transforma completamente a estética do seu ambiente." 
    },
    { 
      icon: Hammer, 
      title: "Remodelação Integral", 
      desc: "Gestão completa de obras de renovação. Coordenamos todas as especialidades, da demolição à limpeza final, garantindo que o seu projeto seja executado sem preocupações e dentro do orçamento." 
    },
    { 
      icon: LayoutGrid, 
      title: "Pladur e Tetos Falsos", 
      desc: "Soluções versáteis para divisórias e tetos. Instalamos sistemas de gesso cartonado com foco em isolamento acústico e térmico, além de sancas de luz personalizadas para iluminação indireta." 
    },
    { 
      icon: Layers, 
      title: "Pavimentos e Revestimentos", 
      desc: "Aplicação profissional de todo o tipo de materiais: cerâmicos, flutuantes, vinílicos ou microcimento. Focamos no nivelamento perfeito para um resultado estético e funcional impecável." 
    },
    { 
      icon: Zap, 
      title: "Eletricidade", 
      desc: "Renovação de quadros elétricos, novas instalações, pontos de rede e sistemas de iluminação LED eficientes. Tudo executado seguindo rigorosamente as normas de segurança em vigor." 
    },
    { 
      icon: Droplets, 
      title: "Canalização", 
      desc: "Substituição de redes de águas e esgotos. Instalamos louças sanitárias, torneiras e resolvemos fugas com rapidez e eficácia, utilizando materiais de alta resistência." 
    }
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F4E79] mb-4 font-['Oswald']">Os Nossos Serviços</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-['Open_Sans'] text-lg">Soluções profissionais e completas para renovar o seu espaço com garantia de qualidade.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((s, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col group">
              <div className="w-16 h-16 bg-gray-50 text-[#1F4E79] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#1F4E79] group-hover:text-white transition-all">
                <s.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-['Oswald'] text-[#1F4E79]">{s.title}</h3>
              <p className="text-gray-500 mb-10 flex-grow leading-relaxed font-['Open_Sans']">{s.desc}</p>
              <Link to="/orcamento" className="inline-flex items-center justify-center gap-3 bg-[#F5F5F5] text-[#1F4E79] px-6 py-4 rounded-xl font-bold hover:bg-[#FFA500] hover:text-white transition-all font-['Montserrat'] shadow-sm">
                Fazer Orçamento <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-[#1F4E79] p-12 md:p-20 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFA500]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-['Oswald']">Dê o primeiro passo para a sua obra de sonho</h2>
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto font-['Open_Sans']">Garantimos a sua satisfação total com o resultado, desde o primeiro traço ao último acabamento impecável.</p>
            <Link to="/orcamento" className="inline-flex items-center gap-4 bg-[#FFA500] text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-white hover:text-[#1F4E79] transition-all shadow-xl font-['Montserrat']">
              Pedir Orçamento Grátis <ArrowRight size={28} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;