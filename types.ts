
export enum ProjectType {
  RESIDENTIAL = 'Residencial',
  COMMERCIAL = 'Comercial',
  KITCHEN = 'Cozinha',
  BATHROOM = 'Banheiro',
  EXTERIOR = 'Exterior'
}

export enum ProjectStatus {
  COMPLETED = 'Concluído',
  IN_PROGRESS = 'Em Andamento'
}

export interface GalleryItem {
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  imageUrl: string;
  progress: number; // 0-100
  completionDate?: string;
  startDate?: string;
  gallery?: GalleryItem[];
}

export interface Review {
  id: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  avatarUrl?: string;
  date: string;
  approved: boolean; // Controle de moderação
}

export interface ContactForm {
  name: string;
  phone: string;
  email: string;
  type: string;
  description: string;
  attachments?: File[];
}

export interface BudgetRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  description: string;
  status: 'pendente' | 'contactado';
  created_at: string;
}

export interface AppSettings {
  id: string;
  notification_email: string;
  logo_url?: string;
}
