import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Send, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewForm: React.FC = () => {
  const { addReview } = useApp();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [clientName, setClientName] = useState('');
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addReview({
      clientName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    if (success) setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md border border-green-100">
          <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
          <h2 className="text-3xl font-bold mb-4">Obrigado!</h2>
          <p className="text-gray-600 mb-8">A sua avaliação foi enviada com sucesso e será publicada após moderação.</p>
          <button onClick={() => navigate('/')} className="bg-[#1F4E79] text-white px-8 py-3 rounded-lg font-bold">Voltar ao Início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 md:pt-40 pb-20 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-['Oswald'] font-bold text-[#1F4E79] mb-2">Avalie o Nosso Trabalho</h1>
        <p className="text-gray-500 mb-8">A sua opinião é muito importante para nós!</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Classificação</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" 
                  onClick={() => setRating(star)} 
                  onMouseEnter={() => setHover(star)} 
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star size={32} fill={(hover || rating) >= star ? "#FFA500" : "none"} stroke={(hover || rating) >= star ? "#FFA500" : "#CBD5E1"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">O seu Nome</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border p-3 rounded-lg bg-gray-50" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">O seu Comentário</label>
            <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} className="w-full border p-3 rounded-lg bg-gray-50" placeholder="Conte-nos como foi a sua experiência..." required />
          </div>
          <button type="submit" className="w-full bg-[#1F4E79] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#FFA500] transition-all shadow-lg">
            <Send size={20} /> Enviar Avaliação
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;