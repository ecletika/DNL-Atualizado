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
  ];

  const isActive = (path: string) => location.pathname === path;

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Style Update: Solid White Background (No Blur/Transparency)
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 bg-white ${
      scrolled 
        ? 'shadow-md py-0' 
        : 'py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24"> 
          <Link to="/" className="flex items-center space-x-3 group relative z-50">
            {settings?.logo_url ? (
               <img src={settings.logo_url} alt="DNL Logo" className="h-16 md:h-20 object-contain" />
            ) : (
                /* Fallback Logo Default adaptado para fundo branco */
                <div className="flex flex-col items-start leading-none scale-110">
                  <div className="flex items-center">
                    <span className="text-4xl md:text-5xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic drop-shadow-sm">
                      DNL
                    </span>
                    {/* Acento Laranja (#FFA500) */}
                    <div className="h-7 w-5 md:h-9 md:w-6 bg-[#FFA500] ml-1 skew-x-[-12deg] transform translate-y-[-2px]"></div>
                  </div>
                  <span className="text-[11px] md:text-sm font-['Montserrat'] font-bold tracking-[0.2em] text-[#333333] uppercase mt-0.5 ml-0.5">
                    Remodelações
                  </span>
                </div>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1 xl:space-x-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 xl:px-5 py-3 rounded-lg text-lg font-['Montserrat'] font-semibold transition-all duration-300 tracking-wide ${
                    isActive(link.path)
                      ? 'text-[#FFA500] bg-[#1F4E79]/5 shadow-sm' // Ativo: Laranja com fundo azul muito claro
                      : 'text-[#333333] hover:text-[#1F4E79] hover:bg-gray-100' // Normal: Preto/Cinza, Hover: Azul
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin" 
                className={`flex items-center px-4 py-3 rounded-lg text-lg font-['Montserrat'] font-semibold transition-all duration-300 ml-4 border border-gray-200 ${
                  isActive('/admin') 
                    ? 'bg-gray-100 text-[#FFA500]' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-[#1F4E79]'
                }`}
              >
                <Lock size={20} className="mr-2" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-lg text-[#333333] hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Solid White */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-fade-in-down">
          <div className="px-4 pt-4 pb-8 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-6 py-5 rounded-lg text-xl font-['Montserrat'] font-semibold ${
                  isActive(link.path)
                    ? 'bg-[#FFA500] text-white shadow-md'
                    : 'text-[#333333] hover:bg-gray-50 hover:text-[#1F4E79]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
               to="/admin"
               onClick={() => setIsOpen(false)}
               className="block px-6 py-5 rounded-lg text-xl font-['Montserrat'] font-semibold text-gray-400 hover:text-[#1F4E79] hover:bg-gray-50 flex items-center mt-6 border-t border-gray-100 pt-6"
            >
              <Lock size={24} className="mr-3" /> Área Administrativa
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;