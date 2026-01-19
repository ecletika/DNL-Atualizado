
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType } from '../types';
import { Send, Phone, Mail, Check, AlertCircle, Loader2, User, FileText, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const Contact: React.FC = () => {
  const { createBudgetRequest } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '',
    description: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Fix: Cast Array.from(e.target.files) to File[] to avoid 'unknown' type error for 'size' property
      const newFiles = Array.from(e.target.files) as File[];
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== newFiles.length) {
        alert("Alguns arquivos eram muito grandes (>5MB) e foram ignorados.");
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
    const phoneRegex = /^[+]?[(]?[0-9]{2,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(formData.phone) || digitsOnly.length < 9) newErrors.phone = 'Insira um número de telefone válido.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Insira um endereço de e-mail válido.';
    if (!formData.type) newErrors.type = 'Por favor, selecione o tipo de obra.';
    if (formData.description.trim().length < 10) newErrors.description = 'Por favor, descreva seu projeto.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const formPayload = { ...formData, attachments: selectedFiles };
      const success = await createBudgetRequest(formPayload);
      setIsSubmitting(false);
      if (success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', type: '', description: '' });
        setSelectedFiles([]);
        setErrors({});
      } else {
        alert("Ocorreu um erro ao enviar seu pedido. Por favor, tente novamente.");
      }
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full pl-10 pr-4 py-3.5 border rounded-lg outline-none transition-all duration-200 text-base shadow-sm font-['Open_Sans']";
    if (errors[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50 text-red-900 placeholder-red-300`;
    }
    return `${baseClass} border-gray-200 focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20 bg-white hover:border-gray-300 text-[#333333] placeholder-gray-400`;
  };

  return (
    // Alterado py-20 para pt-36 pb-20 para compensar o navbar fixo
    <div className="min-h-screen bg-[#F5F5F5] pt-36 pb-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-[#333333] mb-6 tracking-tight">Solicite um Orçamento</h1>
          <p className="text-xl font-['Open_Sans'] text-[#333333] max-w-2xl mx-auto">Conte-nos sobre o seu projeto. É rápido, fácil e sem compromisso.</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Info Side - Azul Escuro (#1F4E79) */}
          <div className="bg-[#1F4E79] text-white p-10 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFA500] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-['Oswald'] font-bold mb-8 text-[#FFA500] border-b border-white/10 pb-4">Contactos Diretos</h3>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-5 group">
                  <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#FFA500] group-hover:text-white transition-colors">
                     <Phone className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-xs font-['Montserrat'] uppercase tracking-widest font-bold mb-1">Telefone</span>
                    <span className="text-[#FFA500] font-['Montserrat'] font-bold text-lg mb-1">Danilo Cirino</span>
                    <span className="text-xl font-['Open_Sans'] font-semibold tracking-wide text-white">+351 933 318 169</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-5 group">
                  <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#FFA500] group-hover:text-white transition-colors">
                     <Mail className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-xs font-['Montserrat'] uppercase tracking-widest font-bold mb-1">E-mail</span>
                    <span className="text-lg text-white break-words font-['Open_Sans'] font-medium">contacto@dnlremodelacoes.pt</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0 relative z-10">
               <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                 <p className="text-sm text-gray-200 font-['Open_Sans'] italic">"A DNL transformou completamente minha casa. Profissionais, pontuais e com um acabamento impecável."</p>
                 <div className="mt-4 flex items-center">
                    <div className="w-8 h-8 bg-[#FFA500] rounded-full flex items-center justify-center text-[#1F4E79] font-bold text-xs">M</div>
                    <span className="ml-3 text-sm font-bold font-['Montserrat'] text-white">Maria Silva, Lisboa</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 lg:p-12 lg:w-3/5 bg-white">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-scale-up">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-3xl font-['Oswald'] font-bold text-[#333333] mb-4">Pedido Enviado!</h3>
                <p className="text-lg text-gray-500 mb-8 max-w-sm font-['Open_Sans']">Recebemos as informações do seu projeto. Nossa equipe analisará tudo e entrará em contato em breve.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-[#F5F5F5] hover:bg-gray-200 text-[#333333] font-['Montserrat'] font-bold rounded-lg transition-colors flex items-center"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Nome Completo</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                       <input
                         type="text"
                         name="name"
                         value={formData.name}
                         onChange={handleChange}
                         className={getInputClass('name')}
                         placeholder="Seu nome"
                         disabled={isSubmitting}
                       />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.name}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Telefone</label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                       <input
                         type="tel"
                         name="phone"
                         value={formData.phone}
                         onChange={handleChange}
                         className={getInputClass('phone')}
                         placeholder="9XX XXX XXX"
                         disabled={isSubmitting}
                       />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">E-mail</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                       <input
                         type="email"
                         name="email"
                         value={formData.email}
                         onChange={handleChange}
                         className={getInputClass('email')}
                         placeholder="seu@email.com"
                         disabled={isSubmitting}
                       />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.email}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Tipo de Obra</label>
                    <div className="relative">
                       <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                       <select
                         name="type"
                         value={formData.type}
                         onChange={handleChange}
                         className={`${getInputClass('type')} appearance-none cursor-pointer`}
                         disabled={isSubmitting}
                       >
                         <option value="">Selecione o tipo...</option>
                         {Object.values(ProjectType).map(t => (
                           <option key={t} value={t}>{t}</option>
                         ))}
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                       </div>
                    </div>
                    {errors.type && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.type}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Descrição do Projeto</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20 bg-white shadow-sm resize-none text-[#333333] placeholder-gray-400 transition-all font-['Open_Sans']"
                    placeholder="Conte-nos detalhes: áreas aproximadas, materiais desejados, prazos..."
                    disabled={isSubmitting}
                  ></textarea>
                   {errors.description && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.description}</p>}
                </div>

                {/* Upload Section */}
                <div>
                   <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Fotos do Local (Opcional)</label>
                   <div 
                      className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 hover:border-[#FFA500]/50 transition-colors cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                   >
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center">
                         <div className="p-3 bg-[#F5F5F5] rounded-full mb-3 group-hover:bg-[#FFA500]/10 transition-colors">
                            <UploadCloud className="h-6 w-6 text-[#1F4E79]" />
                         </div>
                         <p className="text-sm font-medium font-['Montserrat'] text-[#333333]">Clique para carregar fotos</p>
                         <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                      </div>
                   </div>
                   
                   {/* File List */}
                   {selectedFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                         {selectedFiles.map((file, idx) => (
                            <div key={idx} className="relative bg-gray-50 rounded-lg p-2 border border-gray-200 flex items-center">
                               <ImageIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                               <div className="ml-2 overflow-hidden">
                                  <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                               </div>
                               <button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                               >
                                  <X size={12} />
                               </button>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1F4E79] text-white font-['Montserrat'] font-bold py-4 px-8 rounded-lg hover:bg-[#FFA500] transition-all shadow-xl hover:shadow-[#1F4E79]/20 flex items-center justify-center transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando Pedido...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" /> Enviar Solicitação Grátis
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 font-['Open_Sans']">
                       Ao enviar, concorda com o processamento dos seus dados para fins de orçamento.
                    </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
