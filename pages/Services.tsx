import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Hammer, CheckCircle2, Zap, Droplets, Layers, LayoutGrid } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: "Demolição e Construção",
      description: "Serviço completo de demolição controlada, remoção de entulho e reconstrução estrutural. Preparamos o seu espaço para a nova fase com segurança e rapidez.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop",
      icon: <Hammer size={28} />,
      features: ["Demolição de Paredes", "Abertura de Roços", "Remoção de Entulho", "Alvenaria Geral"]
    },
    {
      title: "Canalização (Quente e Fria)",
      description: "Instalação e reparação de redes de águas e esgotos. Substituição total de tubagens antigas por materiais modernos (multicamada/PEX) garantindo durabilidade.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2532&auto=format&fit=crop",
      icon: <Droplets size={28} />,
      features: ["Rede Água Quente/Fria", "Esgotos Domésticos", "Instalação de Louças", "Deteção de Fugas"]
    },
    {
      title: "Elétrica e Iluminação",
      description: "Projetos elétricos completos, desde a substituição de quadros até a instalação de focos LED e sistemas de iluminação modernos e eficientes.",
      image: "https://images.unsplash.com/photo-1565689157292-e3a2455985bc?q=80&w=2670&auto=format&fit=crop",
      icon: <Zap size={28} />,
      features: ["Quadros Elétricos", "Tomadas e Interruptores", "Iluminação LED", "Certificação"]
    },
    {
      title: "Estuque e Pladur",
      description: "Acabamentos perfeitos em paredes e tetos. Criação de divisórias, tetos falsos com sancas de luz e isolamento acústico/térmico com placas de gesso cartonado.",
      image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2574&auto=format&fit=crop",
      icon: <Layers size={28} />,
      features: ["Tetos Falsos", "Divisórias em Pladur", "Estucagem de Paredes", "Sancas de Luz"]
    },
    {
      title: "Pavimentos e Revestimentos",
      description: "Aplicação de todo o tipo de pavimentos: flutuante, vinílico, cerâmico e ladrilhos. Nivelamento de base e acabamentos de rodapés impecáveis.",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2574&auto=format&fit=crop",
      icon: <LayoutGrid size={28} />,
      features: ["Piso Flutuante", "Ladrilhos e Mosaicos", "Revestimento de WC", "Microcimento"]
    },
    {
      title: "Pintura e Acabamentos",
      description: "O toque final que transforma a obra. Pinturas interiores e exteriores com tratamento prévio de fissuras e humidades, garantindo cores vivas e duradouras.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2531&auto=format&fit=crop",
      icon: <Paintbrush size={28} />,
      features: ["Pintura Interior", "Lacagem de Portas", "Envernizamento", "Tratamento Anti-Fungos"]
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Visita e Orçamento',
      description: 'Avaliamos o local e as suas necessidades específicas.'
    },
    {
      number: '02',
      title: 'Planeamento',
      description: 'Definimos materiais, prazos e cronograma da obra.'
    },
    {
      number: '03',
      title: 'Demolição e Preparação',
      description: 'Início dos trabalhos com proteção da área envolvente.'
    },
    {
      number: '04',
      title: 'Instalações Técnicas',
      description: 'Execução de canalização, elétrica e reconstrução.'
    },
    {
      number: '05',
      title: 'Acabamentos Finais',
      description: 'Pintura, pavimentos e limpeza final para entrega.'
    }
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2500&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-[#1F4E79]/80"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="text-[#FFA500] font-['Montserrat'] font-bold tracking-widest uppercase text-base mb-3 block">O que fazemos</span>
          <h1 className="text-5xl md:text-7xl font-['Oswald'] font-bold text-white mb-8">
            Soluções Completas em Construção
          </h1>
          <p className="text-2xl font-['Open_Sans'] text-gray-200 max-w-3xl mx-auto mb-10">
            Especialistas em remodelações integrais: canalização, elétrica, pladur, pintura e muito mais.
          </p>
          <div className="w-32 h-1.5 bg-[#FFA500] mx-auto"></div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-8">Excelência Técnica & Acabamentos Premium</h2>
          <p className="text-xl font-['Open_Sans'] text-[#333333] leading-relaxed mb-10">
            A <strong>DNL Remodelações</strong> oferece um leque completo de serviços para renovar a sua casa ou escritório. Não precisa de contratar várias empresas: nós tratamos de tudo, desde a demolição inicial até à última demão de tinta, garantindo coordenação total e responsabilidade única.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-['Oswald'] font-bold text-[#333333] mb-4">Nossos Serviços</h2>
            <div className="w-20 h-1.5 bg-[#FFA500] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-gray-100">
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E79]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-5 right-5 bg-[#FFA500] p-4 rounded-xl text-white shadow-lg transform rotate-3 group-hover:rotate-0 transition-all">
                    {service.icon}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-3xl font-['Oswald'] font-bold text-[#333333] mb-4 group-hover:text-[#1F4E79] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#333333] font-['Open_Sans'] mb-8 text-base leading-relaxed flex-1">
                    {service.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="mb-8 space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-base text-gray-500 font-['Open_Sans']">
                        <CheckCircle2 size={18} className="text-[#FFA500] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to="/orcamento" 
                    className="mt-auto inline-flex items-center justify-center w-full py-4 bg-[#F5F5F5] hover:bg-[#1F4E79] text-[#1F4E79] hover:text-white rounded-lg transition-colors font-['Montserrat'] font-bold text-base"
                  >
                    Pedir Orçamento <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Matches Home Page */}
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

      {/* CTA Section */}
      <section className="py-32 bg-[#1F4E79] text-center relative overflow-hidden border-t border-white/10">
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-['Oswald'] font-bold text-white mb-8 leading-tight">
            Pronto para transformar o seu espaço?
          </h2>
          <p className="text-gray-200 mb-12 text-2xl font-['Open_Sans'] max-w-3xl mx-auto">
            Fale conosco hoje mesmo. Oferecemos visita técnica e orçamento gratuito para o seu projeto de remodelação.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/orcamento" 
              className="inline-flex items-center justify-center px-10 py-5 bg-[#FFA500] text-white font-['Montserrat'] font-bold rounded-lg hover:bg-[#e59400] transition-all transform hover:scale-105 shadow-xl text-xl"
            >
              Pedir Orçamento Grátis <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link 
              to="/portfolio" 
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border border-gray-400 text-white font-['Montserrat'] font-bold rounded-lg hover:bg-white/10 transition-all text-xl"
            >
              Ver Projetos Realizados
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Services;