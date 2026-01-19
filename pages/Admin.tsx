import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus, ProjectType, GalleryItem } from '../types';
import { Trash2, Edit, Plus, Star, LogOut, Check, Info, Upload, Image as ImageIcon, AlertCircle, Settings, Save, Loader2, MessageSquare, ShieldAlert, FolderKanban, FileText, Eye, EyeOff, Lock, X } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, login, logout, projects, addProject, updateProject, deleteProject, reviews, toggleReviewApproval, deleteReview, budgetRequests, deleteBudgetRequest, deleteAllBudgetRequests, updateBudgetStatus, settings, updateSettings, uploadImage, sendTestEmail, isLoading } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'requests' | 'settings'>('projects');
  
  const [notificationEmail, setNotificationEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    if (settings) {
      setNotificationEmail(settings.notification_email || '');
      setLogoUrl(settings.logo_url || '');
      setEmailApiKey(settings.email_api_key || '');
    }
  }, [settings]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', description: '', type: ProjectType.RESIDENTIAL, status: ProjectStatus.IN_PROGRESS, imageUrl: '', progress: 0, startDate: '', completionDate: '', gallery: []
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage('');
    const result = await login(email, password);
    if (!result.success) setErrorMessage("Acesso negado.");
    setIsLoggingIn(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    await updateSettings(notificationEmail, logoUrl, emailApiKey);
    alert("Configurações salvas!");
    setIsSavingSettings(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProject(true);
    if (isEditing && editId) {
      await updateProject({ ...formData, id: editId } as Project, mainImageFile);
    } else {
      await addProject(formData as Project, mainImageFile, galleryFiles);
    }
    resetForm();
    setIsSubmittingProject(false);
  };

  const resetForm = () => {
    setIsEditing(false); setEditId(null); setMainImageFile(null); setGalleryFiles([]);
    setFormData({ title: '', description: '', type: ProjectType.RESIDENTIAL, status: ProjectStatus.IN_PROGRESS, imageUrl: '', progress: 0, startDate: '', completionDate: '', gallery: [] });
  };

  if (isLoading) return <div className="p-20 text-center">Carregando...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 pt-28">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-['Oswald'] font-bold text-center mb-6">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-mail" className="w-full px-4 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full px-4 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button type="submit" className="w-full bg-[#1F4E79] text-white py-3 rounded font-bold">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row pt-28">
      <aside className="w-full md:w-64 bg-[#1F4E79] text-white p-6">
        <div className="mb-8 border-b border-white/10 pb-4">
            <h2 className="font-['Oswald'] text-xl font-bold text-[#FFA500]">Painel DNL</h2>
        </div>
        <nav className="space-y-1">
          <button onClick={() => setActiveTab('projects')} className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'projects' ? 'bg-[#FFA500] text-white' : 'hover:bg-white/10'}`}><FolderKanban size={18}/> Projetos</button>
          <button onClick={() => setActiveTab('requests')} className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'requests' ? 'bg-[#FFA500] text-white' : 'hover:bg-white/10'}`}><FileText size={18}/> Orçamentos {budgetRequests.filter(r => r.status === 'pendente').length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{budgetRequests.filter(r => r.status === 'pendente').length}</span>}</button>
          <button onClick={() => setActiveTab('reviews')} className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'reviews' ? 'bg-[#FFA500] text-white' : 'hover:bg-white/10'}`}><MessageSquare size={18}/> Avaliações {pendingReviews.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{pendingReviews.length}</span>}</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-[#FFA500] text-white' : 'hover:bg-white/10'}`}><Settings size={18}/> Definições</button>
          <button onClick={logout} className="w-full text-left p-3 text-red-300 mt-10 flex items-center gap-3"><LogOut size={18}/> Sair</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'projects' && (
          <div className="space-y-8">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Projeto" : "Novo Projeto"}</h2>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Título" className="border p-2 rounded" required />
                  <select name="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as ProjectType})} className="border p-2 rounded">
                    {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Descrição" className="border p-2 rounded md:col-span-2" rows={3} required />
                  <div className="flex items-center gap-3 border p-2 rounded">
                    <label className="text-xs font-bold">Progresso {formData.progress}%</label>
                    <input type="range" value={formData.progress} onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})} className="flex-1" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#1F4E79] text-white px-6 py-2 rounded font-bold">Salvar Obra</button>
                    {isEditing && <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded">Cancelar</button>}
                  </div>
               </form>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                    <img src={p.imageUrl} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm truncate">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 mb-2">{p.type} • {p.status}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(true); setEditId(p.id); setFormData(p); }} className="text-[#1F4E79]"><Edit size={16}/></button>
                        <button onClick={() => deleteProject(p.id)} className="text-red-500"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold">Solicitações de Orçamento</h2>
                <button onClick={deleteAllBudgetRequests} className="text-xs text-red-500 hover:underline">Limpar Histórico</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                <tr><th className="p-4">Cliente</th><th className="p-4">Tipo</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {budgetRequests.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-4"><div className="font-bold">{r.name}</div><div className="text-xs text-gray-400">{r.phone} | {r.email}</div></td>
                    <td className="p-4">{r.type}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{r.status}</span></td>
                    <td className="p-4 flex gap-2">
                      {r.status === 'pendente' && <button onClick={() => updateBudgetStatus(r.id, 'contactado')} className="p-2 bg-green-50 text-green-600 rounded-lg"><Check size={16}/></button>}
                      <button onClick={() => deleteBudgetRequest(r.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Aguardando Aprovação <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingReviews.length}</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReviews.map(r => (
                  <div key={r.id} className="bg-amber-50 border border-amber-200 p-6 rounded-xl relative group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-[#1F4E79]">{r.clientName}</h4>
                        <div className="flex text-amber-500"><Star size={14} fill="currentColor"/> {r.rating}</div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => toggleReviewApproval(r.id, false)} className="p-2 bg-white text-green-600 rounded-full shadow-sm hover:bg-green-600 hover:text-white transition-all" title="Aprovar"><Check size={18}/></button>
                         <button onClick={() => deleteReview(r.id)} className="p-2 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all" title="Eliminar"><X size={18}/></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 italic font-['Open_Sans'] leading-relaxed">"{r.comment}"</p>
                    <span className="text-[10px] text-gray-400 block mt-4 uppercase font-bold tracking-wider">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                ))}
                {pendingReviews.length === 0 && <p className="text-gray-400 italic text-sm">Nenhum comentário pendente.</p>}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Aprovados (Públicos)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedReviews.map(r => (
                  <div key={r.id} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-[#1F4E79]">{r.clientName}</h4>
                        <div className="flex text-amber-500"><Star size={14} fill="currentColor"/> {r.rating}</div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => toggleReviewApproval(r.id, true)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-[#1F4E79] hover:text-white transition-all" title="Remover do Site"><EyeOff size={16}/></button>
                         <button onClick={() => deleteReview(r.id)} className="p-2 bg-gray-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all" title="Eliminar Permanente"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-['Open_Sans'] line-clamp-3">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto">
            <h2 className="font-bold mb-6 flex items-center gap-2"><Settings className="text-[#FFA500]"/> Definições do Sistema</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">E-mail de Notificação</label>
                  <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} className="w-full border p-3 rounded-lg bg-gray-50" required />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Web3Forms API Key</label>
                  <div className="relative">
                    <input type={showApiKey ? "text" : "password"} value={emailApiKey} onChange={(e) => setEmailApiKey(e.target.value)} className="w-full border p-3 rounded-lg bg-gray-50" required />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-3.5 text-gray-400">{showApiKey ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
               </div>
               <button type="submit" className="w-full bg-[#1F4E79] text-white py-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                 <Save size={20}/> Guardar Definições
               </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;