import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus, ProjectType, GalleryItem } from '../types';
import { Trash2, Edit, Plus, Star, LogOut, Check, Info, Upload, Image as ImageIcon, AlertCircle, Settings, Save, Loader2, MessageSquare, ShieldAlert, FolderKanban, FileText, Eye, EyeOff } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, login, logout, projects, addProject, updateProject, deleteProject, reviews, toggleReviewApproval, deleteReview, budgetRequests, deleteBudgetRequest, deleteAllBudgetRequests, updateBudgetStatus, settings, updateSettings, uploadImage, sendTestEmail, isLoading } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Tabs Navigation
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'requests' | 'settings'>('projects');
  
  // Settings State
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

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  
  // States for File Uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    type: ProjectType.RESIDENTIAL,
    status: ProjectStatus.IN_PROGRESS,
    imageUrl: '',
    progress: 0,
    startDate: '',
    completionDate: '',
    gallery: []
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      try {
        const base64 = await convertFileToBase64(file);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      } catch (error) {
        console.error("Error previewing image", error);
      }
      e.target.value = '';
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        try {
           const url = await uploadImage(file);
           if (url) {
              setLogoUrl(url);
           } else {
              alert("Erro ao fazer upload do logo.");
           }
        } catch (error) {
           console.error("Upload logo error", error);
        }
        e.target.value = '';
     }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setGalleryFiles(prev => [...prev, ...files]);
      try {
        const promises = files.map(file => convertFileToBase64(file));
        const base64Results = await Promise.all(promises);
        const newItems: GalleryItem[] = base64Results.map(base64 => ({
          url: base64,
          caption: ''
        }));
        setFormData(prev => ({ 
          ...prev, 
          gallery: [...(prev.gallery || []), ...newItems] 
        }));
      } catch (error) {
        console.error("Error previewing gallery images", error);
      }
      e.target.value = '';
    }
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery[index] = { ...newGallery[index], caption };
      return { ...prev, gallery: newGallery };
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  const translateError = (error: string) => {
    if (error.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (error.includes('Email not confirmed')) return 'E-mail não confirmado. Verifique sua caixa de entrada.';
    return `Erro: ${error}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage('');
    const result = await login(email, password);
    if (!result.success && result.error) {
      setErrorMessage(translateError(result.error));
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const success = await updateSettings(notificationEmail, logoUrl, emailApiKey);
    if (success) {
      alert("Configurações atualizadas com sucesso!");
    } else {
      alert("Erro ao atualizar configurações.");
    }
    setIsSavingSettings(false);
  };

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    const success = await sendTestEmail(notificationEmail);
    if (success) {
      alert(`Email de teste enviado com sucesso para ${notificationEmail}. Verifique a caixa de entrada (incluindo spam).`);
    } else {
      alert("Erro ao enviar email de teste. Verifique se a Access Key está correta.");
    }
    setIsSendingTest(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProject(true);

    const projectData = {
      id: isEditing && editId ? editId : undefined,
      ...formData,
    } as Project;
    
    if (isEditing) {
      await updateProject(projectData, mainImageFile);
    } else {
      await addProject(projectData, mainImageFile, galleryFiles);
    }
    
    resetForm();
    setIsSubmittingProject(false);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setMainImageFile(null);
    setGalleryFiles([]);
    setFormData({
      title: '',
      description: '',
      type: ProjectType.RESIDENTIAL,
      status: ProjectStatus.IN_PROGRESS,
      imageUrl: '',
      progress: 0,
      startDate: '',
      completionDate: '',
      gallery: []
    });
  };

  const startEdit = (project: Project) => {
    setIsEditing(true);
    setEditId(project.id);
    setFormData(project);
    setMainImageFile(null); 
    setGalleryFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProjectDirectly = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Deseja excluir esta obra permanentemente?")) {
      try {
          await deleteProject(id);
      } catch (error) {
          console.error("Erro ao deletar projeto:", error);
      }
    }
  };

  const confirmAndDeleteRequest = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Deseja excluir esta solicitação permanentemente do banco de dados?")) {
        await deleteBudgetRequest(id);
    }
  };

  const handleClearAllRequests = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("ATENÇÃO: Deseja excluir TODAS as solicitações registradas no banco de dados? Esta ação não pode ser desfeita.")) {
      await deleteAllBudgetRequests();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-[#1F4E79] animate-spin mb-4" />
          <p className="text-gray-500 font-medium font-['Montserrat']">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 pt-28">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6">
             {settings?.logo_url ? (
               <img src={settings.logo_url} alt="Logo" className="h-20 object-contain" />
             ) : (
                <div className="flex flex-col items-start leading-none">
                    <div className="flex items-center">
                    <span className="text-4xl font-['Montserrat'] font-extrabold tracking-tighter text-[#1F4E79] italic">DNL</span>
                    <div className="h-8 w-5 bg-[#FFA500] ml-1 skew-x-[-12deg] transform translate-y-[-2px]"></div>
                    </div>
                    <span className="text-xs font-['Montserrat'] font-bold tracking-[0.2em] text-[#1F4E79] uppercase mt-0.5 ml-0.5">Remodelações</span>
                </div>
             )}
          </div>
          <h2 className="text-2xl font-['Oswald'] font-bold text-center mb-2 text-[#333333]">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-['Montserrat'] font-medium text-gray-700">E-mail</label>
              <input 
                type="email" 
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-[#333333] bg-white focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-['Montserrat'] font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-[#333333] bg-white focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {errorMessage && (
              <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" /> <p>{errorMessage}</p>
              </div>
            )}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-[#1F4E79] text-white py-3 rounded-lg hover:bg-[#153a5b] transition-colors font-['Montserrat'] font-semibold disabled:opacity-70 flex justify-center items-center">
              {isLoggingIn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Entrando...</> : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row font-['Open_Sans'] pt-28 lg:pt-32">
      
      <aside className="w-full md:w-72 bg-[#1F4E79] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-white/10">
             {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Admin Logo" className="h-12 object-contain mb-2" />
             ) : (
                <div className="flex items-center mb-2">
                    <span className="text-3xl font-['Montserrat'] font-extrabold text-white italic">DNL</span>
                </div>
             )}
             <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">Painel Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
             onClick={() => setActiveTab('projects')} 
             className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'projects' ? 'bg-[#FFA500] text-[#1F4E79] font-bold shadow-lg' : 'hover:bg-white/10 text-gray-200'}`}
          >
             <FolderKanban className="mr-3" size={20} /> Gerir Projetos
          </button>
          <button 
             onClick={() => setActiveTab('requests')} 
             className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'requests' ? 'bg-[#FFA500] text-[#1F4E79] font-bold shadow-lg' : 'hover:bg-white/10 text-gray-200'}`}
          >
             <FileText className="mr-3" size={20} /> Solicitações
             {budgetRequests.filter(r => r.status === 'pendente').length > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{budgetRequests.filter(r => r.status === 'pendente').length}</span>}
          </button>
          <button 
             onClick={() => setActiveTab('reviews')} 
             className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'reviews' ? 'bg-[#FFA500] text-[#1F4E79] font-bold shadow-lg' : 'hover:bg-white/10 text-gray-200'}`}
          >
             <Star className="mr-3" size={20} /> Avaliações
             {pendingReviews.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingReviews.length}</span>}
          </button>
          <button 
             onClick={() => setActiveTab('settings')} 
             className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-[#FFA500] text-[#1F4E79] font-bold shadow-lg' : 'hover:bg-white/10 text-gray-200'}`}
          >
             <Settings className="mr-3" size={20} /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
           <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors">
              <LogOut className="mr-3" size={20} /> Sair
           </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
               <h2 className="text-2xl font-['Oswald'] font-bold mb-6 text-[#333333] flex items-center">
                  {isEditing ? <Edit className="mr-2 text-[#FFA500]" /> : <Plus className="mr-2 text-[#FFA500]" />}
                  {isEditing ? 'Editar Projeto' : 'Adicionar Nova Obra'}
               </h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                       <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Capa</label>
                       <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative overflow-hidden bg-gray-50">
                         {formData.imageUrl ? (
                            <>
                               <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                               <button type="button" onClick={() => { setFormData(p => ({...p, imageUrl: ''})); setMainImageFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md z-10"><Trash2 size={14} /></button>
                            </>
                         ) : (
                            <div className="p-4">
                              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-xs text-gray-500">Clique para carregar</p>
                            </div>
                         )}
                         <input type="file" accept="image/*" onChange={handleMainImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={!!formData.imageUrl} />
                       </div>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Título da Obra</label>
                          <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-[#1F4E79]" placeholder="Ex: Remodelação Apartamento Centro" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none">
                             {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none">
                             {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full border rounded-lg p-3 outline-none focus:border-[#1F4E79]" placeholder="Descreva os detalhes da obra..." />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                       <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Previsão/Fim</label>
                       <input type="date" name="completionDate" value={formData.completionDate || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Progresso ({formData.progress}%)</label>
                       <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleInputChange} className="w-full accent-[#FFA500] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" />
                    </div>
                 </div>
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-3">Galeria de Fotos</label>
                     <div className="flex gap-4 overflow-x-auto pb-4">
                        <div className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer relative">
                           <Plus className="h-8 w-8 text-gray-400 mb-1" />
                           <input type="file" accept="image/*" multiple onChange={handleGalleryImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        {formData.gallery?.map((item, idx) => (
                           <div key={idx} className="flex-shrink-0 w-48 relative group">
                              <img src={item.url} alt="Gallery" className="w-full h-32 object-cover rounded-lg border" />
                              <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm"><Trash2 size={12} /></button>
                              <input type="text" placeholder="Legenda..." value={item.caption} onChange={(e) => updateGalleryCaption(idx, e.target.value)} className="w-full text-xs border rounded p-1 mt-1 outline-none" />
                           </div>
                        ))}
                     </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    {isEditing && <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors">Cancelar</button>}
                    <button type="submit" disabled={isSubmittingProject} className="px-8 py-3 bg-[#FFA500] text-white rounded-lg hover:bg-[#e59400] font-bold shadow-md flex items-center">
                       {isSubmittingProject ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                       {isSubmittingProject ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Obra')}
                    </button>
                 </div>
               </form>
            </div>
            <div>
               <h3 className="text-xl font-['Oswald'] font-bold text-[#333333] mb-4 flex items-center border-b pb-2">
                  <FolderKanban className="mr-2 text-[#1F4E79]" /> Obras Registradas
               </h3>
               <div className="space-y-4">
                  {projects.length === 0 ? (
                      <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                          <p className="text-gray-500">Nenhuma obra cadastrada ainda.</p>
                      </div>
                  ) : (
                      projects.map(project => (
                        <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-6 border border-gray-100 hover:shadow-md transition-shadow">
                           <img src={project.imageUrl} alt={project.title} className="w-full md:w-32 h-32 object-cover rounded-lg bg-gray-200" />
                           <div className="flex-1 w-full">
                              <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                                 <h3 className="font-['Oswald'] font-bold text-xl text-[#333333]">{project.title}</h3>
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${project.status === ProjectStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{project.status}</span>
                              </div>
                              <p className="text-sm text-gray-500 font-semibold mb-1">{project.type}</p>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                                 <div className="bg-[#1F4E79] h-1.5 rounded-full" style={{width: `${project.progress}%`}}></div>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => startEdit(project)} className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
                                 <Edit size={16} className="mr-2" /> Editar
                              </button>
                              <button onClick={(e) => deleteProjectDirectly(project.id, e)} className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                 <Trash2 size={16} className="mr-2" /> Excluir
                              </button>
                           </div>
                        </div>
                      ))
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-['Oswald'] font-bold text-amber-800 mb-4 flex items-center">
                <ShieldAlert className="mr-2" /> Aprovação Pendente ({pendingReviews.length})
              </h2>
              {pendingReviews.length === 0 ? (
                <p className="text-amber-700/60 italic">Nenhuma avaliação aguardando aprovação.</p>
              ) : (
                <div className="space-y-4">
                  {pendingReviews.map(review => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border border-amber-100 flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">{review.clientName}</span>
                            <div className="flex text-[#FFA500]">
                               {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />)}
                            </div>
                         </div>
                         <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => toggleReviewApproval(review.id, false)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center">
                            <Check size={16} className="mr-1" /> Aprovar
                         </button>
                         <button onClick={() => deleteReview(review.id)} className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg font-bold text-sm flex items-center">
                            <Trash2 size={16} className="mr-1" /> Rejeitar
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
               <h2 className="text-xl font-['Oswald'] font-bold text-[#333333] mb-4 flex items-center">
                <MessageSquare className="mr-2" /> Histórico de Avaliações
              </h2>
              <div className="space-y-4">
                {approvedReviews.map(review => (
                   <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 flex justify-between items-start">
                      <div>
                         <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.clientName}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Publicado</span>
                         </div>
                         <p className="text-gray-600 text-sm">"{review.comment}"</p>
                      </div>
                      <button onClick={() => deleteReview(review.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-5xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-['Oswald'] font-bold flex items-center"><FileText className="mr-2" /> Solicitações de Orçamento</h2>
                {budgetRequests.length > 0 && (
                  <button onClick={handleClearAllRequests} className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold border border-red-200 shadow-sm">
                    <Trash2 size={16} className="mr-2" /> Limpar Todas
                  </button>
                )}
             </div>
             {budgetRequests.length === 0 ? <p className="text-gray-500">Nenhuma solicitação pendente.</p> : (
               <div className="overflow-x-auto rounded-lg border border-gray-200">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Obra</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                         <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {budgetRequests.map(req => (
                         <tr key={req.id} className={`hover:bg-gray-50 ${req.status === 'pendente' ? 'bg-amber-50/30' : ''}`}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                           <td className="px-6 py-4">
                             <div className="text-sm font-bold text-gray-900">{req.name}</div>
                             <div className="text-xs text-gray-500">{req.email}</div>
                             <div className="text-xs text-gray-500 font-semibold">{req.phone}</div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="text-sm font-bold text-[#1F4E79]">{req.type}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-3 py-1 text-xs font-bold rounded-full ${req.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                               {req.status === 'pendente' ? 'Pendente' : 'Contactado'}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                             <div className="flex justify-end items-center gap-3">
                               {req.status === 'pendente' && <button onClick={() => updateBudgetStatus(req.id, 'contactado')} className="text-green-600 hover:text-green-800 font-bold"><Check size={18} /></button>}
                               <button onClick={(e) => confirmAndDeleteRequest(req.id, e)} className="text-red-500 p-2"><Trash2 size={20} /></button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
               </div>
             )}
           </div>
        )}

        {activeTab === 'settings' && (
           <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-200">
              <h2 className="text-xl font-['Oswald'] font-bold mb-6 flex items-center"><Settings className="mr-2" /> Configurações Gerais</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-[#F5F5F5] p-4 rounded-lg border border-gray-200">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Logotipo do Site</label>
                   <div className="flex items-center gap-4">
                      {logoUrl ? (
                         <div className="h-20 w-20 bg-white border rounded flex items-center justify-center p-2">
                            <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                         </div>
                      ) : (
                         <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">Sem Logo</div>
                      )}
                      <div className="flex-1">
                         <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200" />
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">E-mail para Notificações</label>
                   <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2 outline-none" required placeholder="exemplo@dnlremodelacoes.pt" />
                   <p className="text-xs text-gray-400 mt-1">Este e-mail receberá os avisos de novos orçamentos.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                   <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-[#1F4E79]">Web3Forms Access Key</label>
                      <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="text-[#1F4E79] hover:text-[#FFA500]">
                         {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                   <input 
                     type={showApiKey ? "text" : "password"} 
                     value={emailApiKey} 
                     onChange={(e) => setEmailApiKey(e.target.value)} 
                     className="w-full border rounded-lg px-4 py-2 outline-none bg-white text-sm" 
                     placeholder="Cole aqui sua chave de acesso"
                   />
                   <p className="text-[10px] text-gray-500 mt-2 font-['Open_Sans']">
                      Obtenha sua chave gratuita em <a href="https://web3forms.com/" target="_blank" className="text-blue-600 underline">web3forms.com</a> para habilitar o envio de e-mails.
                   </p>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button type="submit" disabled={isSavingSettings} className="flex-1 bg-[#1F4E79] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#153a5b] transition-colors flex justify-center items-center">
                    {isSavingSettings ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2" size={18} />}
                    Salvar Alterações
                  </button>
                  <button type="button" onClick={handleTestEmail} disabled={isSendingTest || !emailApiKey} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex justify-center items-center">
                    {isSendingTest ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Testar E-mail"}
                  </button>
                </div>
              </form>
           </div>
        )}
      </main>
    </div>
  );
};

export default Admin;