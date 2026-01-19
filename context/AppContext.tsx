import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Review, ProjectStatus, ContactForm, BudgetRequest, AppSettings, GalleryItem } from '../types';
import { supabase } from '../services/supabaseClient';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AppContextType {
  projects: Project[];
  reviews: Review[];
  budgetRequests: BudgetRequest[];
  settings: AppSettings | null;
  addProject: (project: Project, imageFile?: File | null, galleryFiles?: File[]) => Promise<void>;
  updateProject: (project: Project, imageFile?: File | null) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'approved'>) => Promise<boolean>;
  toggleReviewApproval: (id: string, currentStatus: boolean) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  createBudgetRequest: (data: ContactForm) => Promise<boolean>;
  deleteBudgetRequest: (id: string) => Promise<void>;
  deleteAllBudgetRequests: () => Promise<void>;
  updateBudgetStatus: (id: string, status: 'pendente' | 'contactado') => Promise<void>;
  updateSettings: (email: string, logoUrl?: string, emailApiKey?: string) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
  sendTestEmail: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      fetchProjects();
      fetchReviews(!!session); 
      fetchSettings();
      if (session) {
        fetchBudgetRequests();
      }
      setIsLoading(false); 
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      fetchProjects();
      fetchReviews(isAuth); 
      if (isAuth) {
        fetchBudgetRequests();
      } else {
        setBudgetRequests([]); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendEmailViaWeb3Forms = async (subject: string, content: string, toEmail?: string): Promise<boolean> => {
    // Busca a chave: primeiro no settings (DB), depois no LocalStorage
    const localKey = localStorage.getItem('dnl_email_api_key');
    const accessKey = settings?.email_api_key || localKey;
    const targetEmail = toEmail || settings?.notification_email;

    if (!accessKey || accessKey.trim() === '') {
      console.warn("Web3Forms Access Key não configurada. E-mail não enviado.");
      return false;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: subject,
          from_name: "DNL Remodelações - Sistema",
          to_email: targetEmail,
          message: content,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Erro ao enviar e-mail via Web3Forms:", error);
      return false;
    }
  };

  const uploadImageToStorage = async (file: File, bucket: string = 'siteDNL'): Promise<string | null> => {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileExt = cleanFileName.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) return null;
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      return null;
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('app_settings').select('*').limit(1).single();
      const localKey = localStorage.getItem('dnl_email_api_key');
      
      if (data) {
        // Mescla dados do DB com chave local caso a coluna do DB esteja vazia
        setSettings({
          ...data,
          email_api_key: data.email_api_key || localKey || ''
        });
      } else if (localKey) {
        // Se não houver nada no DB mas houver localmente
        setSettings({
          id: 'local',
          notification_email: 'contacto@dnlremodelacoes.pt',
          email_api_key: localKey
        });
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const updateSettings = async (email: string, logoUrl?: string, emailApiKey?: string): Promise<boolean> => {
    try {
      // Salva a chave no LocalStorage sempre como garantia (fallback para o erro PGRST204)
      if (emailApiKey) {
        localStorage.setItem('dnl_email_api_key', emailApiKey);
      }

      // Tenta salvar no Supabase as colunas que sabemos que existem
      const baseUpdates: any = { 
        notification_email: email,
        logo_url: logoUrl || (settings?.logo_url || null)
      };

      // Tenta incluir a chave, mas se falhar vamos tratar abaixo
      const fullUpdates = { ...baseUpdates, email_api_key: emailApiKey || (settings?.email_api_key || null) };

      if (settings?.id && settings.id !== 'local') {
        fullUpdates.id = settings.id;
      }

      // 1. Tentativa Completa (Com a coluna de API Key)
      const { data, error } = await supabase
        .from('app_settings')
        .upsert(fullUpdates)
        .select()
        .single();

      if (error) {
        // Se o erro for especificamente sobre a coluna inexistente (PGRST204)
        if (error.code === 'PGRST204' || error.message.includes('email_api_key')) {
          console.warn("Coluna 'email_api_key' ausente no DB. Salvando apenas localmente.");
          
          // 2. Segunda Tentativa: Salvar apenas o que o banco aceita
          const { data: retryData, error: retryError } = await supabase
            .from('app_settings')
            .upsert(baseUpdates)
            .select()
            .single();
            
          if (!retryError && retryData) {
            setSettings({ ...retryData, email_api_key: emailApiKey || '' });
            return true;
          }
          throw retryError;
        }
        throw error;
      }

      if (data) {
        setSettings(data);
      }
      return true;
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      // Se chegamos aqui mas o emailApiKey foi salvo no localStorage, ainda podemos considerar sucesso parcial
      if (emailApiKey) {
        setSettings(prev => prev ? { ...prev, notification_email: email, logo_url: logoUrl || prev.logo_url, email_api_key: emailApiKey } : null);
        return true;
      }
      return false;
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) {
        setProjects(data.map((p: any) => ({
          id: String(p.id),
          title: p.title,
          description: p.description,
          type: p.type,
          status: p.status,
          imageUrl: p.image_url,
          progress: p.progress,
          completionDate: p.completion_date,
          startDate: p.start_date,
          gallery: p.gallery || []
        })));
      }
    } catch (error) {}
  };

  const fetchReviews = async (isAdmin: boolean) => {
    try {
      const { data } = await supabase.from('reviews').select('*').order('date', { ascending: false });
      if (data) {
        setReviews(data.map((r: any) => ({
          id: String(r.id),
          clientName: r.client_name,
          rating: r.rating,
          comment: r.comment,
          avatarUrl: r.avatar_url,
          date: r.date,
          approved: r.approved
        })));
      }
    } catch (error) {}
  };

  const fetchBudgetRequests = async () => {
    try {
      const { data, error } = await supabase.from('budget_requests').select('*').order('created_at', { ascending: false });
      if (data) setBudgetRequests(data.map((r: any) => ({...r, id: String(r.id)})) as BudgetRequest[]);
    } catch (error) {}
  };

  const addProject = async (project: Project, imageFile?: File | null, galleryFiles?: File[]) => {
    try {
      let finalImageUrl = project.imageUrl;
      if (imageFile) {
        const url = await uploadImageToStorage(imageFile);
        if (url) finalImageUrl = url;
      }
      let finalGallery = project.gallery || [];
      if (galleryFiles && galleryFiles.length > 0) {
        for (const file of galleryFiles) {
           const url = await uploadImageToStorage(file);
           if (url) finalGallery.push({ url, caption: '' });
        }
      }
      const { data, error } = await supabase.from('projects').insert([{
        title: project.title,
        description: project.description,
        type: project.type,
        status: project.status,
        image_url: finalImageUrl,
        progress: project.progress,
        completion_date: project.completionDate,
        start_date: project.startDate,
        gallery: finalGallery
      }]).select();
      if (error) throw error;
      if (data) fetchProjects();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const updateProject = async (updatedProject: Project, imageFile?: File | null) => {
    try {
      let finalImageUrl = updatedProject.imageUrl;
      if (imageFile) {
        const url = await uploadImageToStorage(imageFile);
        if (url) finalImageUrl = url;
      }
      const { error } = await supabase.from('projects').update({
        title: updatedProject.title,
        description: updatedProject.description,
        type: updatedProject.type,
        status: updatedProject.status,
        image_url: finalImageUrl,
        progress: updatedProject.progress,
        completion_date: updatedProject.completionDate,
        start_date: updatedProject.startDate,
        gallery: updatedProject.gallery
      }).eq('id', updatedProject.id);
      if (error) throw error;
      fetchProjects();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects(prev => prev.filter(p => p.id !== id));
    else alert(`Erro ao apagar: ${error.message}`);
  };

  const createBudgetRequest = async (formData: ContactForm): Promise<boolean> => {
    try {
      const { error } = await supabase.from('budget_requests').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        description: formData.description,
        status: 'pendente'
      }]);

      if (!error) {
        const emailBody = `
          Novo Pedido de Orçamento Recebido!
          
          Nome: ${formData.name}
          E-mail: ${formData.email}
          Telefone: ${formData.phone}
          Tipo de Obra: ${formData.type}
          
          Descrição:
          ${formData.description}
          
          Acesse o painel administrativo para gerir esta solicitação.
        `;
        
        sendEmailViaWeb3Forms(`Novo Orçamento: ${formData.name}`, emailBody).then(sent => {
          if (!sent) console.warn("Aviso: Notificação por e-mail falhou (verifique a Access Key nas configurações).");
        });
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  
  const deleteBudgetRequest = async (id: string) => {
    try {
      const { error } = await supabase.from('budget_requests').delete().eq('id', id);
      if (error) throw error;
      setBudgetRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Erro ao excluir solicitação.");
    }
  };

  const deleteAllBudgetRequests = async () => {
    try {
      const { error } = await supabase.from('budget_requests').delete().filter('id', 'neq', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      setBudgetRequests([]);
      alert("Todas as solicitações foram removidas.");
    } catch (error) {
      alert("Erro ao processar exclusão em massa.");
    }
  };

  const toggleReviewApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('reviews').update({ approved: !currentStatus }).eq('id', id);
    if (!error) fetchReviews(true);
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateBudgetStatus = async (id: string, status: 'pendente' | 'contactado') => {
    const { error } = await supabase.from('budget_requests').update({ status }).eq('id', id);
    if (!error) setBudgetRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: !!data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const sendTestEmail = async (email: string) => {
    return await sendEmailViaWeb3Forms(
      "Teste de Configuração DNL", 
      "Este é um e-mail de teste para validar sua Web3Forms Access Key configurada no painel administrativo.",
      email
    );
  };

  const addReview = async (review: Omit<Review, 'id' | 'approved'>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('reviews').insert([{
        client_name: review.clientName,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        avatar_url: review.avatarUrl,
        approved: false
      }]);
      return !error;
    } catch (error) {
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      projects, reviews, budgetRequests, settings, addProject, updateProject, deleteProject,
      addReview, toggleReviewApproval, deleteReview, createBudgetRequest,
      deleteBudgetRequest, deleteAllBudgetRequests, updateBudgetStatus, updateSettings,
      uploadImage: uploadImageToStorage, sendTestEmail, isAuthenticated, login, logout, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};