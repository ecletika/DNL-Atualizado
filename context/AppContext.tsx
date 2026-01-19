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

  // Carrega configurações iniciais (Local + DB)
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      await fetchProjects();
      await fetchReviews(!!session); 
      await fetchSettings();
      
      if (session) {
        await fetchBudgetRequests();
      }
      setIsLoading(false);
    };
    
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      fetchProjects();
      fetchReviews(isAuth); 
      if (isAuth) fetchBudgetRequests();
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendEmailViaWeb3Forms = async (subject: string, content: string, clientEmail?: string): Promise<boolean> => {
    // Busca a chave local ou do DB
    const accessKey = localStorage.getItem('dnl_email_api_key') || settings?.email_api_key;

    if (!accessKey || accessKey.trim() === '') {
      console.error("Web3Forms Access Key não encontrada.");
      return false;
    }

    try {
      // Nota: No plano Free do Web3Forms, o email sempre vai para o endereço cadastrado na chave.
      // O campo 'email' abaixo define o 'Reply-To' para você poder responder ao cliente.
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: subject,
          from_name: "DNL Site",
          email: clientEmail || "contacto@dnlremodelacoes.pt",
          message: content,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Erro ao disparar API de e-mail:", error);
      return false;
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
      const { error: uploadError } = await supabase.storage.from('siteDNL').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('siteDNL').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro no upload de imagem:", error);
      return null;
    }
  };

  const fetchSettings = async () => {
    try {
      // 1. Tenta buscar do Supabase
      const { data } = await supabase.from('app_settings').select('notification_email, logo_url').limit(1).maybeSingle();
      
      // 2. Busca o que está salvo localmente (Fallback)
      const localEmail = localStorage.getItem('dnl_notif_email');
      const localLogo = localStorage.getItem('dnl_logo_url');
      const localKey = localStorage.getItem('dnl_email_api_key');

      setSettings({
        id: 'settings',
        notification_email: data?.notification_email || localEmail || 'contacto@dnlremodelacoes.pt',
        logo_url: data?.logo_url || localLogo || '',
        email_api_key: localKey || ''
      });
    } catch (error) {
      console.warn("Usando apenas configurações locais devido a erro no banco.");
    }
  };

  const updateSettings = async (email: string, logoUrl?: string, emailApiKey?: string): Promise<boolean> => {
    // 1. Salva SEMPRE localmente primeiro (Garante que funcione mesmo com erro de RLS no DB)
    localStorage.setItem('dnl_notif_email', email);
    if (logoUrl) localStorage.setItem('dnl_logo_url', logoUrl);
    if (emailApiKey) localStorage.setItem('dnl_email_api_key', emailApiKey);

    const newSettings = {
      id: 'settings',
      notification_email: email,
      logo_url: logoUrl || settings?.logo_url || '',
      email_api_key: emailApiKey || localStorage.getItem('dnl_email_api_key') || ''
    };

    setSettings(newSettings);

    try {
      // 2. Tenta salvar no Supabase (Apenas colunas que sabemos que existem e ignorando erro de RLS)
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          notification_email: email, 
          logo_url: logoUrl || (settings?.logo_url || null) 
        });

      if (error) {
        console.warn("Aviso: Configurações salvas apenas no seu navegador (Erro RLS no Supabase). Isso é normal se o banco não estiver configurado para escrita pública.");
      }
    } catch (e) {
      // Silencia erros de rede/DB para não travar a experiência do usuário
    }

    return true; // Retornamos true porque salvamos localmente com sucesso
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data.map((p: any) => ({
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
  };

  const fetchReviews = async (isAdmin: boolean) => {
    const { data } = await supabase.from('reviews').select('*').order('date', { ascending: false });
    if (data) setReviews(data.map((r: any) => ({
      id: String(r.id),
      clientName: r.client_name,
      rating: r.rating,
      comment: r.comment,
      avatarUrl: r.avatar_url,
      date: r.date,
      approved: r.approved
    })));
  };

  const fetchBudgetRequests = async () => {
    const { data } = await supabase.from('budget_requests').select('*').order('created_at', { ascending: false });
    if (data) setBudgetRequests(data.map((r: any) => ({...r, id: String(r.id)})) as BudgetRequest[]);
  };

  const addProject = async (project: Project, imageFile?: File | null, galleryFiles?: File[]) => {
    try {
      let url = project.imageUrl;
      if (imageFile) {
        const uploaded = await uploadImageToStorage(imageFile);
        if (uploaded) url = uploaded;
      }
      let gallery = project.gallery || [];
      if (galleryFiles) {
        for (const f of galleryFiles) {
          const up = await uploadImageToStorage(f);
          if (up) gallery.push({ url: up, caption: '' });
        }
      }
      await supabase.from('projects').insert([{
        title: project.title, description: project.description, type: project.type,
        status: project.status, image_url: url, progress: project.progress,
        completion_date: project.completionDate, start_date: project.startDate, gallery
      }]);
      fetchProjects();
    } catch (e) { alert("Erro ao criar projeto."); }
  };

  const updateProject = async (proj: Project, imageFile?: File | null) => {
    try {
      let url = proj.imageUrl;
      if (imageFile) {
        const uploaded = await uploadImageToStorage(imageFile);
        if (uploaded) url = uploaded;
      }
      await supabase.from('projects').update({
        title: proj.title, description: proj.description, type: proj.type,
        status: proj.status, image_url: url, progress: proj.progress,
        completion_date: proj.completionDate, start_date: proj.startDate, gallery: proj.gallery
      }).eq('id', proj.id);
      fetchProjects();
    } catch (e) { alert("Erro ao atualizar projeto."); }
  };

  const createBudgetRequest = async (formData: ContactForm): Promise<boolean> => {
    try {
      const { error } = await supabase.from('budget_requests').insert([{
        name: formData.name, email: formData.email, phone: formData.phone,
        type: formData.type, description: formData.description, status: 'pendente'
      }]);

      if (!error) {
        const body = `NOVO ORÇAMENTO\n\nCliente: ${formData.name}\nTelemóvel: ${formData.phone}\nE-mail: ${formData.email}\nObra: ${formData.type}\n\nMensagem:\n${formData.description}`;
        sendEmailViaWeb3Forms(`Novo Pedido: ${formData.name}`, body, formData.email);
        return true;
      }
      return false;
    } catch (e) { return false; }
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  const updateBudgetStatus = async (id: string, status: 'pendente' | 'contactado') => {
    await supabase.from('budget_requests').update({ status }).eq('id', id);
    fetchBudgetRequests();
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { success: !error, error: error?.message };
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const sendTestEmail = async (email: string) => {
    return await sendEmailViaWeb3Forms("DNL - Teste de Sistema", "Se você recebeu isto, seu sistema de e-mail está funcionando!", email);
  };

  return (
    <AppContext.Provider value={{
      projects, reviews, budgetRequests, settings, addProject, updateProject, deleteProject,
      addReview: async (r) => {
        const { error } = await supabase.from('reviews').insert([{ ...r, client_name: r.clientName, avatar_url: r.avatarUrl, approved: false }]);
        return !error;
      },
      toggleReviewApproval: async (id, s) => { await supabase.from('reviews').update({ approved: !s }).eq('id', id); fetchReviews(true); },
      deleteReview: async (id) => { await supabase.from('reviews').delete().eq('id', id); fetchReviews(true); },
      createBudgetRequest,
      deleteBudgetRequest: async (id) => { await supabase.from('budget_requests').delete().eq('id', id); fetchBudgetRequests(); },
      deleteAllBudgetRequests: async () => { await supabase.from('budget_requests').delete().neq('id', '000'); fetchBudgetRequests(); },
      updateBudgetStatus, updateSettings, uploadImage: uploadImageToStorage, sendTestEmail, isAuthenticated, login, logout, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp error');
  return context;
};
