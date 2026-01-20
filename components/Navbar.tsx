import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useApp();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Em Andamento', path: '/em-andamento' },
    { name: 'Orçamentos', path: '/orcamento' },
    { name: 'Admin', path: '/admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100 bg-white ${scrolled ? 'shadow-md py-1' : 'py-3 md:py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20"> 
          {/* Logo - Tamanho Proporcional e Destaque */}
          <Link to="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
            {settings?.logo_url ? (
               <img src={settings.logo_url} alt="DNL Logo" className="h-10 md:h-14 w-auto object-contain" />
            ) : (
                <div className="flex flex-col items-start leading-none">
                  <div className="flex items-center">
                    <span className="text-2xl md:text-3xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic">DNL</span>
                    <div className="h-5 w-2 md:h-7 md:w-4 bg-[#FFA500] ml-1 skew-x-[-12deg]"></div>
                  </div>
                  <span className="text-[7px] md:text-[9px] font-['Montserrat'] font-bold tracking-[0.2em] text-[#333333] uppercase">Remodelações</span>
                </div>
            )}
          </Link>

          {/* Menu - Letras menores e elegantes */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-[12px] font-['Montserrat'] font-bold uppercase tracking-wider transition-all ${
                  isActive(link.path) 
                    ? 'text-[#FFA500] bg-gray-50' 
                    : link.name === 'Admin' 
                      ? 'text-gray-400 hover:text-[#1F4E79]' 
                      : 'text-[#333333] hover:text-[#1F4E79]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Menu Mobile Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#333333] hover:text-[#FFA500] transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl animate-fade-in">
          <div className="px-4 py-8 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`block px-6 py-4 text-lg font-bold rounded-2xl ${isActive(link.path) ? 'bg-[#1F4E79] text-white' : 'text-[#333333] hover:bg-gray-50'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;