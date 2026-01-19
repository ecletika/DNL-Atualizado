import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Review, ProjectStatus, ContactForm, BudgetRequest, AppSettings, GalleryItem } from '../types';
import { supabase } from '../services/supabaseClient';

// Chave de Acesso Web3Forms
const WEB3FORMS_ACCESS_KEY = 'f25537fd-c9fc-4583-af3b-1899643fbbf8';

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
  updateSettings: (email: string, logoUrl?: string) => Promise<boolean>;
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
      const { data, error } = await supabase.from('app_settings').select('*').single();
      if (data) setSettings(data);
      else if (!error || error.code === 'PGRST116') {
        const { data: newData } = await supabase.from('app_settings').insert([{ notification_email: 'mauricio.junior@ecletika.com' }]).select().single();
        if (newData) setSettings(newData);
      }
    } catch (error) {}
  };

  const updateSettings = async (email: string, logoUrl?: string): Promise<boolean> => {
    try {
      const updates: any = { notification_email: email };
      if (logoUrl !== undefined) updates.logo_url = logoUrl;
      const { error } = await supabase.from('app_settings').update(updates).eq('id', settings?.id);
      if (error) throw error;
      setSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
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
      return !error;
    } catch (error) {
      return false;
    }
  };
  
  const deleteBudgetRequest = async (id: string) => {
    try {
      const { error } = await supabase.from('budget_requests').delete().eq('id', id);
      if (error) {
         console.error("Erro deleteBudgetRequest:", error);
         alert(`Não foi possível apagar esta solicitação: ${error.message}. Certifique-se de que tem permissões de DELETE na tabela budget_requests.`);
         return;
      }
      setBudgetRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Erro ao processar exclusão.");
    }
  };

  const deleteAllBudgetRequests = async () => {
    try {
      // Deleta todos os registros onde o ID não é nulo. 
      // Se não funcionar, verifique se a tabela budget_requests permite exclusão no Supabase Dashboard (RLS Policies).
      const { error } = await supabase.from('budget_requests').delete().filter('id', 'neq', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error("Erro crítico ao limpar solicitações:", error);
        alert(`Erro do banco de dados ao limpar: ${error.message}. Verifique as políticas de RLS no Supabase.`);
        return;
      }
      
      setBudgetRequests([]);
      alert("Todas as solicitações foram removidas com sucesso.");
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
    return true; 
  };

  return (
    <AppContext.Provider value={{
      projects, reviews, budgetRequests, settings, addProject, updateProject, deleteProject,
      addReview: async () => true, toggleReviewApproval, deleteReview, createBudgetRequest,
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