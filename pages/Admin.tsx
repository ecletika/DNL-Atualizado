import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus, ProjectType } from '../types';
import { Trash2, Edit, Plus, Star, LogOut, Check, Settings, Save, MessageSquare, FolderKanban, FileText, Eye, EyeOff, Lock, X, Clock, Upload, ImageIcon, Loader2, AlertCircle, Phone, Mail, Video } from 'lucide-react';
import { generateProjectDescription } from '../services/geminiService';

const Admin: React.FC = () => {
  const { isAuthenticated, login, logout, projects, addProject, updateProject, deleteProject, reviews, toggleReviewApproval, deleteReview, budgetRequests, deleteBudgetRequest, deleteAllBudgetRequests, updateBudgetStatus, settings, updateSettings, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'requests' | 'settings'>('projects');
  
  const [notificationEmail, setNotificationEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', description: '', type: ProjectType.RESIDENTIAL, status: ProjectStatus.IN_PROGRESS, imageUrl: '', videoUrl: '', progress: 0
  });

  useEffect(() => {
    if (settings) {
      setNotificationEmail(settings.notification_email || '');
      setLogoUrl(settings.logo_url || '');
      setEmailApiKey(settings.email_api_key || '');
    }
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) setErrorMessage("Acesso negado.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
        alert("Introduza um título primeiro para que a IA possa gerar uma descrição.");
        return;
    }
    setIsGenerating(true);
    try {
        const desc = await generateProjectDescription(formData.title, formData.type as ProjectType);
        setFormData(prev => ({ ...prev, description: desc }));
    } catch (err) {
        console.error("AI Generation failed:", err);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    const success = await updateSettings(notificationEmail, logoUrl, emailApiKey);
    if (success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      if (isEditing && editId) {
        await updateProject({ ...formData, id: editId } as Project, mainImageFile, videoFile);
      } else {
        await addProject(formData as Project, mainImageFile, videoFile, galleryFiles);
      }
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: ProjectType.RESIDENTIAL, status: ProjectStatus.IN_PROGRESS, imageUrl: '', videoUrl: '', progress: 0 });
    setMainImageFile(null);
    setVideoFile(null);
    setGalleryFiles([]);
    setMainImagePreview(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleEditProject = (p: Project) => {
    setIsEditing(true);
    setEditId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      type: p.type,
      status: p.status,
      imageUrl: p.imageUrl,
      videoUrl: p.videoUrl,
      progress: p.progress,
      completionDate: p.completionDate,
      startDate: p.startDate,
      gallery: p.gallery
    });
    setMainImagePreview(p.imageUrl);
    setVideoPreview(p.videoUrl || null);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação permanentemente?')) {
      deleteReview(id);
    }
  };

  if (isLoading) return <div className="p-20 text-center pt-40 font-['Montserrat'] font-bold">A carregar painel...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 pt-32">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-['Oswald'] font-bold text-center mb-2 text-[#1F4E79]">Acesso administrativo</h2>
          <div className="flex justify-center mb-8">
            {settings?.logo_url ? (
               <img src={settings.logo_url} alt="DNL Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
            ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span className="text-4xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic">DNL</span>
                    <div className="h-6 w-4 bg-[#FFA500] ml-1 skew-x-[-12deg]"></div>
                  </div>
                  <span className="text-[9px] font-['Montserrat'] font-bold tracking-[0.2em] text-[#333333] uppercase">Remodelações</span>
                </div>
            )}
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" placeholder="admin@dnl.pt" className="w-full px-5 py-4 border rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-4 border rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {errorMessage && <p className="text-red-500 text-sm font-bold ml-1">{errorMessage}</p>}
            <button type="submit" className="w-full bg-[#1F4E79] text-white py-4 rounded-2xl font-bold hover:bg-[#FFA500] transition-all shadow-lg flex items-center justify-center gap-2">
              <Lock size={18} /> Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-['Oswald'] font-bold text-[#1F4E79] uppercase">Painel de Gestão</h1>
            <p className="text-gray-500">Gestão centralizada da DNL Remodelações.</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-white text-red-500 px-6 py-3 rounded-xl font-bold border border-red-50 hover:bg-red-50 transition-all shadow-sm">
            <LogOut size={20} /> Sair
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('projects')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'projects' ? 'bg-[#1F4E79] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FolderKanban size={18} /> Projetos
          </button>
          <button onClick={() => setActiveTab('requests')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'requests' ? 'bg-[#1F4E79] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FileText size={18} /> Orçamentos {budgetRequests.length > 0 && <span className="ml-1 bg-[#FFA500] text-white text-[10px] px-2 py-0.5 rounded-full">{budgetRequests.length}</span>}
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'reviews' ? 'bg-[#1F4E79] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <MessageSquare size={18} /> Avaliações
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-[#1F4E79] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings size={18} /> Definições
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-['Oswald'] font-bold text-[#1F4E79] mb-6 uppercase flex items-center gap-3">
                  {isEditing ? <Edit className="text-[#FFA500]" /> : <Plus className="text-[#FFA500]" />}
                  {isEditing ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
                </h3>
                <form onSubmit={handleSubmitProject} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Título do Projeto</label>
                      <input type="text" className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tipo de Obra</label>
                      <select className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ProjectType})}>
                        {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição Profissional</label>
                      <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.title} className="text-[10px] font-bold text-[#1F4E79] hover:text-[#FFA500] uppercase tracking-widest flex items-center gap-1 disabled:opacity-50 transition-colors">
                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} fill="currentColor" />} Gerar com IA Gemini
                      </button>
                    </div>
                    <textarea rows={4} className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                      <select className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}>
                        {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Progresso (%)</label>
                      <input type="number" min="0" max="100" className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.progress} onChange={e => setFormData({...formData, progress: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Data de Conclusão</label>
                      <input type="date" className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" value={formData.completionDate || ''} onChange={e => setFormData({...formData, completionDate: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">Imagem Principal</label>
                      <div className="flex items-center gap-4">
                        <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFA500] hover:bg-gray-50 transition-all bg-gray-50 overflow-hidden relative">
                          {mainImagePreview ? <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <><Upload size={24} className="text-gray-300 mb-2" /><span className="text-[8px] font-bold text-gray-400">UPLOAD</span></>}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">Vídeo MP4 (Destaque)</label>
                      <div className="flex items-center gap-4">
                        <div onClick={() => videoInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFA500] hover:bg-gray-50 transition-all bg-gray-50 overflow-hidden relative">
                          {videoPreview ? <video src={videoPreview} className="w-full h-full object-cover" muted /> : <><Video size={24} className="text-gray-300 mb-2" /><span className="text-[8px] font-bold text-gray-400">MP4 VIDEO</span></>}
                        </div>
                        <input type="file" ref={videoInputRef} className="hidden" accept="video/mp4" onChange={handleVideoChange} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={isPublishing} className="flex-1 bg-[#1F4E79] text-white py-4 rounded-2xl font-bold hover:bg-[#FFA500] transition-all shadow-lg flex items-center justify-center gap-2">
                      {isPublishing ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? 'Atualizar Projeto' : 'Publicar Projeto')}
                    </button>
                    {isEditing && <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancelar</button>}
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="text-xl font-['Oswald'] font-bold text-[#1F4E79] uppercase">Projetos Existentes</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {projects.map(p => (
                    <div key={p.id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50 transition-all">
                      {p.videoUrl ? <video src={p.videoUrl} className="w-24 h-24 rounded-2xl object-cover shadow-sm" muted /> : <img src={p.imageUrl} alt={p.title} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />}
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="font-bold text-[#1F4E79]">{p.title}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-400">{p.type}</span>
                          <span className={p.status === ProjectStatus.COMPLETED ? 'text-green-500' : 'text-[#FFA500]'}>{p.status}</span>
                          <span className="text-gray-400">{p.progress}%</span>
                          {p.videoUrl && <span className="text-blue-500 flex items-center gap-1"><Video size={10} /> MP4</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProject(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={18} /></button>
                        <button onClick={() => deleteProject(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
             <div className="space-y-6">
               <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-['Oswald'] font-bold text-[#1F4E79] uppercase">Pedidos de Orçamento</h3>
                  <button onClick={() => { if(window.confirm('Excluir todos os pedidos permanentemente?')) deleteAllBudgetRequests(); }} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">Limpar Histórico</button>
               </div>
               {budgetRequests.length === 0 ? <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100"><p className="text-gray-400 italic">Nenhum pedido recebido até ao momento.</p></div> : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {budgetRequests.map(r => (
                     <div key={r.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group">
                       <div className="flex justify-between items-start mb-6">
                         <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${r.status === 'pendente' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{r.status}</div>
                         <button onClick={() => deleteBudgetRequest(r.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                       </div>
                       <h4 className="text-xl font-bold text-[#1F4E79] mb-1">{r.name}</h4>
                       <p className="text-xs text-[#FFA500] font-bold uppercase tracking-widest mb-6">{r.type}</p>
                       <div className="space-y-3 mb-8">
                         <div className="flex items-center gap-3 text-sm text-gray-500"><Phone size={16} className="text-gray-300" /> {r.phone}</div>
                         <div className="flex items-center gap-3 text-sm text-gray-500"><Mail size={16} className="text-gray-300" /> {r.email}</div>
                         <div className="flex items-center gap-3 text-sm text-gray-500"><Clock size={16} className="text-gray-300" /> {new Date(r.created_at).toLocaleDateString('pt-PT')}</div>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-2xl mb-8"><p className="text-sm text-gray-600 italic">"{r.description}"</p></div>
                       <select value={r.status} onChange={(e) => updateBudgetStatus(r.id, e.target.value as any)} className="w-full p-4 rounded-xl border border-gray-100 font-bold text-xs uppercase tracking-widest outline-none bg-white cursor-pointer hover:border-[#FFA500] transition-all"><option value="pendente">Pendente</option><option value="contactado">Contactado</option></select>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-gray-50/50"><h3 className="text-xl font-['Oswald'] font-bold text-[#1F4E79] uppercase">Moderação de Avaliações</h3></div>
               <div className="divide-y divide-gray-50">
                 {reviews.length === 0 ? <div className="p-20 text-center text-gray-400 italic">Sem avaliações pendentes ou publicadas.</div> : reviews.map(r => (
                   <div key={r.id} className="p-8 flex flex-col md:flex-row gap-8">
                     <div className="w-16 h-16 bg-[#1F4E79] rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">{r.clientName.charAt(0)}</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-[#1F4E79] text-lg">{r.clientName}</h4><div className="flex text-[#FFA500] my-1">{[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div></div><span className="text-[10px] font-bold text-gray-300 uppercase">{r.date}</span></div>
                       <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{r.comment}"</p>
                       <div className="flex gap-3">
                         <button onClick={() => toggleReviewApproval(r.id, r.approved)} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${r.approved ? 'bg-green-50 text-green-600' : 'bg-[#FFA500] text-white'}`}>{r.approved ? <><Check size={14} /> Publicado</> : 'Aprovar'}</button>
                         <button onClick={() => handleDeleteReview(r.id)} className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">Excluir</button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-['Oswald'] font-bold text-[#1F4E79] mb-10 uppercase">Configurações Gerais</h3>
              <div className="max-w-2xl space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email de Notificação</label><input type="email" value={notificationEmail} onChange={e => setNotificationEmail(e.target.value)} className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Link do Logótipo Personalizado</label><input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold" placeholder="https://..." /></div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Web3Forms Access Key</label>
                  <div className="relative">
                    <input type={showApiKey ? "text" : "password"} value={emailApiKey} onChange={e => setEmailApiKey(e.target.value)} className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#FFA500] outline-none transition-all font-semibold pr-12" />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F4E79]">{showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {saveStatus === 'success' && <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl font-bold animate-fade-in"><Check size={20} /> Definições guardadas com sucesso!</div>}
                  {saveStatus === 'error' && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl font-bold animate-fade-in"><AlertCircle size={20} /> Ocorreu um erro ao guardar. Tente novamente.</div>}
                  <button onClick={handleSaveSettings} disabled={saveStatus === 'saving'} className={`bg-[#1F4E79] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#FFA500] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50`}>{saveStatus === 'saving' ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}{saveStatus === 'saving' ? 'A guardar...' : 'Guardar Alterações'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;