import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F4E79] text-white pt-12 pb-6 border-t border-[#1F4E79]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-['Oswald'] font-bold text-white mb-4">DNL Remodelações</h3>
            <p className="text-sm font-['Open_Sans'] leading-relaxed mb-4 text-gray-200">
              Transformamos espaços com excelência e dedicação. Sua visão, nossa construção.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/dnl.remodelacoes/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFA500] transition-colors"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/profile.php?id=100083075745178" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFA500] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-[#FFA500] transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-['Oswald'] font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-2 font-['Open_Sans'] text-gray-200">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-[#FFA500]" />
                <span>+351 933 318 169</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-[#FFA500]" />
                <span>contacto@dnlremodelacoes.pt</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-[#FFA500]" />
                <span>Lisboa, Portugal</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-['Oswald'] font-bold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2 font-['Open_Sans']">
              <li><Link to="/portfolio" className="text-gray-200 hover:text-[#FFA500] transition-colors">Portfólio</Link></li>
              <li><Link to="/orcamento" className="text-gray-200 hover:text-[#FFA500] transition-colors">Pedir Orçamento</Link></li>
              <li><Link to="/sobre" className="text-gray-200 hover:text-[#FFA500] transition-colors">Sobre Nós</Link></li>
              <li><Link to="/admin" className="text-gray-200 hover:text-[#FFA500] transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 text-center text-xs font-['Open_Sans'] text-gray-300">
          <p>&copy; {new Date().getFullYear()} DNL Remodelações. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;