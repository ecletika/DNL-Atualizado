import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectType } from '../types';
import { Send, Phone, Mail, Check, Loader2, MapPin, User, ShieldCheck, Clock, Image as ImageIcon, Upload, X } from 'lucide-react';

const Contact: React.FC = () => {
  const { createBudgetRequest } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    type: ProjectType.RESIDENTIAL, 
    description: '' 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await createBudgetRequest({
      ...formData,
      attachments: files
    });

    if (success) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', type: ProjectType.RESIDENTIAL, description: '' });
      setFiles([]);
    } else {
      alert("Ocorreu um erro ao enviar o pedido. Por favor, tente novamente.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 md:pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1F4E79] mb-4 font-['Oswald'] uppercase tracking-tight">Solicite um Orçamento</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-['Open_Sans'] text-lg">Dê o primeiro passo para transformar o seu espaço com a DNL Remodelações.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contactos - LADO ESQUERDO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1F4E79] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFA500] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Responsável</p>
                    <h3 className="text-xl font-bold font-['Oswald']">Danilo Cirino</h3>
                  </div>
                </div>

                <div className="space-y-6">
                  <a href="tel:+351933318169" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#FFA500] transition-colors">
                      <Phone size={20} />
                    </div>
                    <span className="font-bold text-lg">+351 933 318 169</span>
                  </a>

                  <a href="mailto:contacto@dnlremodelacoes.pt" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#FFA500] transition-colors">
                      <Mail size={20} />
                    </div>
                    <span className="font-bold text-sm md:text-base break-all">contacto@dnlremodelacoes.pt</span>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <span className="font-bold">Lisboa, Portugal</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                   <div className="flex items-center gap-3 text-[#FFA500] mb-2">
                     <Clock size={18} />
                     <span className="font-bold text-sm">Horário de Atendimento</span>
                   </div>
                   <p className="text-sm text-white/80">Segunda a Sexta: 08:00 - 19:00</p>
                   <p className="text-sm text-white/80">Sábado: 09:00 - 13:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-4 shadow-sm">
               <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                 <ShieldCheck size={28} />
               </div>
               <div>
                 <p className="font-bold text-[#1F4E79]">Orçamento Grátis</p>
                 <p className="text-xs text-gray-500">Sem compromisso e com visita técnica.</p>
               </div>
            </div>
          </div>

          {/* Formulário - LADO DIREITO */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100">
            {isSuccess ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                   <Check size={64} />
                </div>
                <h2 className="text-4xl font-bold mb-4 font-['Oswald'] text-[#1F4E79]">Pedido Recebido!</h2>
                <p className="text-xl text-gray-600 font-['Open_Sans'] mb-10">Obrigado pelo seu interesse. O Danilo Cirino entrará em contacto muito em breve.</p>
                <button onClick={() => setIsSuccess(false)} className="bg-[#1F4E79] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#FFA500] transition-all">Enviar outro pedido</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">O seu Nome</label>
                    <input type="text" placeholder="João Silva" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Telemóvel</label>
                    <input type="tel" placeholder="912 345 678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Email</label>
                  <input type="email" placeholder="exemplo@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Tipo de Remodelação</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold appearance-none cursor-pointer">
                      {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Campo de Upload de Ficheiros */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Anexar Fotos (Opcional)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 p-5 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#FFA500] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-500">
                          {files.length === 0 ? 'Selecionar imagens' : `${files.length} selecionadas`}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        multiple 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Ficheiros Selecionados */}
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="bg-white border px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold text-[#1F4E79]">
                        <ImageIcon size={12} />
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Detalhes da Obra</label>
                  <textarea rows={4} placeholder="Descreva brevemente o que pretende fazer..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" required />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#1F4E79] text-white py-6 rounded-2xl font-bold shadow-xl hover:bg-[#FFA500] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 text-xl font-['Montserrat']">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                  {isSubmitting ? 'A enviar...' : 'Solicitar Orçamento Grátis'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;