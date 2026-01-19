import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus, ProjectType, GalleryItem } from '../types';
import { Trash2, Edit, Plus, Star, LogOut, Check, Info, Upload, Image as ImageIcon, AlertCircle, Settings, Save, Loader2, MessageSquare, ShieldAlert, FolderKanban, FileText, Eye, EyeOff, Lock } from 'lucide-react';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage('');
    const result = await login(email, password);
    if (!result.success && result.error) {
      setErrorMessage("Credenciais inválidas ou erro de sistema.");
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
    // updateSettings agora sempre retorna true pois prioriza o LocalStorage
    await updateSettings(notificationEmail, logoUrl, emailApiKey);
    alert("Configurações atualizadas com sucesso no seu navegador!");
    setIsSavingSettings(false);
  };

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    const success = await sendTestEmail(notificationEmail);
    if (success) {
      alert(`Email de teste enviado para ${notificationEmail}. Verifique sua caixa de entrada e SPAM.`);
    } else {
      alert("Falha no envio. Verifique se a sua Access Key está correta.");
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

  if (isLoading) return <div className="p-20 text-center">Carregando...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 pt-28">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-['Oswald'] font-bold text-center mb-6 text-[#333333]">Painel Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-mail" className="w-full px-4 py-2 border rounded-lg outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full px-4 py-2 border rounded-lg outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-[#1F4E79] text-white py-3 rounded-lg font-bold">
              {isLoggingIn ? "Acessando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row pt-28">
      <aside className="w-full md:w-72 bg-[#1F4E79] text-white p-4">
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('projects')} className={`w-full text-left p-3 rounded ${activeTab === 'projects' ? 'bg-[#FFA500]' : ''}`}>Projetos</button>
          <button onClick={() => setActiveTab('requests')} className={`w-full text-left p-3 rounded ${activeTab === 'requests' ? 'bg-[#FFA500]' : ''}`}>Solicitações</button>
          <button onClick={() => setActiveTab('reviews')} className={`w-full text-left p-3 rounded ${activeTab === 'reviews' ? 'bg-[#FFA500]' : ''}`}>Avaliações</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left p-3 rounded ${activeTab === 'settings' ? 'bg-[#FFA500]' : ''}`}>Configurações</button>
          <button onClick={handleLogout} className="w-full text-left p-3 text-red-300">Sair</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'projects' && (
          <div className="space-y-8">
             <div className="bg-white p-6 rounded-lg shadow">
               <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar" : "Nova"} Obra</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Título" className="w-full border p-2 rounded" required />
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Descrição" className="w-full border p-2 rounded" required />
                  <div className="flex gap-4">
                    <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="border p-2 rounded" />
                    <input type="date" name="completionDate" value={formData.completionDate || ''} onChange={handleInputChange} className="border p-2 rounded" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-sm font-bold">Progresso: {formData.progress}%</label>
                     <input type="range" name="progress" value={formData.progress} onChange={handleInputChange} className="flex-1" />
                  </div>
                  <input type="file" onChange={handleMainImageUpload} className="text-sm" />
                  <div className="flex justify-end gap-2">
                    <button type="submit" className="bg-[#1F4E79] text-white px-6 py-2 rounded">Salvar</button>
                  </div>
               </form>
             </div>
             <div className="grid gap-4">
                {projects.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded flex items-center justify-between shadow">
                    <div className="flex items-center gap-4">
                      <img src={p.imageUrl} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-bold">{p.title}</h4>
                        <p className="text-xs text-gray-500">{p.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => startEdit(p)} className="p-2 text-blue-600"><Edit size={18} /></button>
                       <button onClick={() => deleteProject(p.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white p-6 rounded shadow overflow-x-auto">
            <h2 className="font-bold mb-4">Solicitações de Orçamento</h2>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr><th>Cliente</th><th>Contato</th><th>Tipo</th><th>Status</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {budgetRequests.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="p-3 font-bold">{r.name}</td>
                    <td className="p-3">{r.phone}<br/>{r.email}</td>
                    <td className="p-3">{r.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${r.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{r.status}</span>
                    </td>
                    <td className="p-3 flex gap-2">
                       {r.status === 'pendente' && <button onClick={() => updateBudgetStatus(r.id, 'contactado')} className="text-green-600"><Check size={18}/></button>}
                       <button onClick={() => deleteBudgetRequest(r.id)} className="text-red-600"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded shadow max-w-xl mx-auto">
            <h2 className="font-bold mb-6">Configurações do Site</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
               <div>
                  <label className="block text-sm font-bold mb-1">E-mail para Receber Orçamentos</label>
                  <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} className="w-full border p-2 rounded" required />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1">Web3Forms Access Key</label>
                  <div className="relative">
                    <input type={showApiKey ? "text" : "password"} value={emailApiKey} onChange={(e) => setEmailApiKey(e.target.value)} className="w-full border p-2 rounded pr-10" required />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-2">{showApiKey ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
               </div>
               <div className="bg-blue-50 p-4 rounded border border-blue-200 text-xs text-blue-800">
                  <p><strong>Dica:</strong> Se o salvamento no banco de dados falhar, os dados serão guardados localmente no seu navegador.</p>
               </div>
               <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-[#1F4E79] text-white py-3 rounded font-bold">Salvar Agora</button>
                  <button type="button" onClick={handleTestEmail} className="bg-gray-200 py-3 px-6 rounded font-bold">Testar E-mail</button>
               </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;