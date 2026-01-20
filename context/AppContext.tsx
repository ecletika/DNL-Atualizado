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
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      await fetchProjects();
      await fetchReviews(!!session); 
      await fetchSettings();
      if (session) await fetchBudgetRequests();
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
    const accessKey = settings?.email_api_key || localStorage.getItem('dnl_email_api_key');
    if (!accessKey) return false;
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: subject,
          from_name: "DNL Remodelações",
          email: clientEmail || "contacto@dnlremodelacoes.pt",
          message: content,
        }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      return false;
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `budget-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
      const { error: uploadError } = await supabase.storage.from('siteDNL').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('siteDNL').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro no upload:", error);
      return null;
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('notification_email, logo_url, email_api_key').limit(1).maybeSingle();
      
      setSettings({
        id: 'settings',
        notification_email: data?.notification_email || localStorage.getItem('dnl_notif_email') || 'contacto@dnlremodelacoes.pt',
        logo_url: data?.logo_url || localStorage.getItem('dnl_logo_url') || '',
        email_api_key: data?.email_api_key || localStorage.getItem('dnl_email_api_key') || ''
      });
    } catch (error) {
      console.error("Erro ao carregar definições:", error);
    }
  };

  const updateSettings = async (email: string, logoUrl?: string, emailApiKey?: string): Promise<boolean> => {
    // Atualizar LocalStorage por redundância
    localStorage.setItem('dnl_notif_email', email);
    if (logoUrl) localStorage.setItem('dnl_logo_url', logoUrl);
    if (emailApiKey) localStorage.setItem('dnl_email_api_key', emailApiKey);

    // Atualizar Estado Local
    setSettings({
      id: 'settings',
      notification_email: email,
      logo_url: logoUrl || settings?.logo_url || '',
      email_api_key: emailApiKey || settings?.email_api_key || ''
    });

    try {
      // Persistir no Banco de Dados
      const { error } = await supabase.from('app_settings').upsert({ 
        id: 1, // Assumindo uma única linha de configurações com ID 1
        notification_email: email, 
        logo_url: logoUrl || (settings?.logo_url || null),
        email_api_key: emailApiKey || (settings?.email_api_key || null)
      });
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Erro ao persistir definições:", e);
      return false;
    }
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
    const query = supabase.from('reviews').select('*').order('date', { ascending: false });
    if (!isAdmin) query.eq('approved', true);
    const { data } = await query;
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
      if (!error) {
        const body = `NOVA AVALIAÇÃO RECEBIDA\n\nCliente: ${review.clientName}\nClassificação: ${review.rating} estrelas\nComentário: ${review.comment}\n\nAceda ao painel admin para aprovar.`;
        await sendEmailViaWeb3Forms(`Novo Comentário: ${review.clientName}`, body);
        fetchReviews(isAuthenticated);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const toggleReviewApproval = async (id: string, currentStatus: boolean) => {
    await supabase.from('reviews').update({ approved: !currentStatus }).eq('id', id);
    fetchReviews(true);
  };

  const deleteReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews(true);
  };

  const fetchBudgetRequests = async () => {
    const { data } = await supabase.from('budget_requests').select('*').order('created_at', { ascending: false });
    if (data) setBudgetRequests(data.map((r: any) => ({...r, id: String(r.id)})) as BudgetRequest[]);
  };

  const createBudgetRequest = async (formData: ContactForm): Promise<boolean> => {
    try {
      let attachmentLinks = "";
      if (formData.attachments && formData.attachments.length > 0) {
        const uploadPromises = formData.attachments.map(file => uploadImageToStorage(file));
        const urls = await Promise.all(uploadPromises);
        const validUrls = urls.filter(url => url !== null);
        if (validUrls.length > 0) {
          attachmentLinks = "\n\nFOTOS ANEXADAS:\n" + validUrls.join("\n");
        }
      }

      const { error } = await supabase.from('budget_requests').insert([{
        name: formData.name, email: formData.email, phone: formData.phone,
        type: formData.type, description: formData.description, status: 'pendente'
      }]);

      if (!error) {
        const body = `NOVO PEDIDO DE ORÇAMENTO\n\nCliente: ${formData.name}\nTelemóvel: ${formData.phone}\nE-mail: ${formData.email}\nObra: ${formData.type}\n\nMensagem:\n${formData.description}${attachmentLinks}`;
        await sendEmailViaWeb3Forms(`Novo Orçamento: ${formData.name}`, body, formData.email);
        
        if (isAuthenticated) await fetchBudgetRequests();
        return true;
      }
      return false;
    } catch (e) { 
      console.error("Erro ao criar pedido de orçamento:", e);
      return false; 
    }
  };

  const addProject = async (project: Project, imageFile?: File | null, galleryFiles?: File[]) => {
    try {
      let url = project.imageUrl;
      if (imageFile) {
        const uploaded = await uploadImageToStorage(imageFile);
        if (uploaded) url = uploaded;
      }
      let gallery: GalleryItem[] = [];
      if (galleryFiles && galleryFiles.length > 0) {
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
      await fetchProjects();
    } catch (e) {
      console.error("Erro ao adicionar projeto:", e);
    }
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
      await fetchProjects();
    } catch (e) {
      console.error("Erro ao atualizar projeto:", e);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { success: !error, error: error?.message };
  };

  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <AppContext.Provider value={{
      projects, reviews, budgetRequests, settings, addProject, updateProject, 
      deleteProject: async (id) => { await supabase.from('projects').delete().eq('id', id); fetchProjects(); },
      addReview, toggleReviewApproval, deleteReview, createBudgetRequest,
      deleteBudgetRequest: async (id) => { await supabase.from('budget_requests').delete().eq('id', id); fetchBudgetRequests(); },
      deleteAllBudgetRequests: async () => { await supabase.from('budget_requests').delete().neq('id', '000'); fetchBudgetRequests(); },
      updateBudgetStatus: async (id, status) => { await supabase.from('budget_requests').update({ status }).eq('id', id); fetchBudgetRequests(); },
      updateSettings, uploadImage: uploadImageToStorage, sendTestEmail: async (e) => await sendEmailViaWeb3Forms("Teste", "Funcionando!", e),
      isAuthenticated, login, logout, isLoading
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