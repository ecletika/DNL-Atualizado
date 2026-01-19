import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Send, CheckCircle, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewForm: React.FC = () => {
  const { addReview } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    clientName: '',
    rating: 5,
    comment: ''
  });
  
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.comment) return;

    setIsSubmitting(true);
    setErrorMsg('');
    
    const success = await addReview({
      clientName: formData.clientName,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString(),
      avatarUrl: '' 
    });

    setIsSubmitting(false);
    
    if (success) {
      setSubmitted(true);
      setTimeout(() => navigate('/'), 6000); // Mais tempo para ler a mensagem
    } else {
      setErrorMsg("Erro ao salvar no banco de dados. Verifique o console para detalhes (provável erro de permissão RLS no Supabase).");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center animate-fade-in border border-gray-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-['Oswald'] font-bold text-[#333333] mb-4">Avaliação Recebida!</h2>
          <p className="text-[#333333] font-['Open_Sans'] mb-2">
            Obrigado por compartilhar sua experiência.
          </p>
          <p className="text-[#1F4E79] font-['Montserrat'] font-semibold mb-8 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
            Sua avaliação passará por uma breve aprovação antes de ser publicada em nosso site.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#1F4E79] text-white rounded-lg font-['Montserrat'] font-bold hover:bg-[#FFA500] transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-36 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-[#333333] mb-3">Avalie Nosso Trabalho</h1>
          <p className="text-[#333333] font-['Open_Sans']">
            Sua opinião é fundamental para continuarmos melhorando. Conte-nos como foi sua experiência com a DNL Remodelações.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-[#1F4E79] p-6 text-center">
             <span className="inline-block p-3 bg-white/10 rounded-full mb-2">
                <Star className="text-[#FFA500] h-8 w-8 fill-[#FFA500]" />
             </span>
             <h2 className="text-white font-['Oswald'] font-bold text-xl">Formulário de Satisfação</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start text-sm font-['Open_Sans']">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}
            <div>
              <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Seu Nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] outline-none transition-all font-['Open_Sans']"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Sua Classificação</label>
              <div className="flex justify-center space-x-2 py-4 bg-[#F5F5F5] rounded-lg border border-gray-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || formData.rating)
                          ? 'text-[#FFA500] fill-[#FFA500]'
                          : 'text-gray-300'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-2 font-['Montserrat'] font-medium">
                {formData.rating === 5 ? "Excelente!" : 
                 formData.rating === 4 ? "Muito Bom" : 
                 formData.rating === 3 ? "Bom" : 
                 formData.rating === 2 ? "Razoável" : "Ruim"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-['Montserrat'] font-bold text-[#333333] mb-2">Seu Comentário</label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] outline-none transition-all resize-none font-['Open_Sans']"
                placeholder="Descreva o que achou do serviço, atendimento e resultado final..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1F4E79] text-white font-['Montserrat'] font-bold py-4 rounded-lg hover:bg-[#FFA500] transition-all shadow-lg hover:shadow-[#1F4E79]/20 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? 'Enviando...' : <><Send size={20} className="mr-2" /> Enviar Avaliação</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;