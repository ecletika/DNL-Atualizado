import { Project, ProjectStatus, ProjectType, Review } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Renovação Apartamento Centro',
    description: 'Reforma completa de apartamento de 120m², incluindo demolição de paredes, novo piso e iluminação moderna.',
    type: ProjectType.RESIDENTIAL,
    status: ProjectStatus.COMPLETED,
    imageUrl: 'https://picsum.photos/id/10/800/600',
    progress: 100,
    completionDate: '2023-11-15',
    gallery: []
  },
  {
    id: '2',
    title: 'Cozinha Gourmet Moderna',
    description: 'Instalação de ilha central em mármore, armários planejados e eletrodomésticos embutidos.',
    type: ProjectType.KITCHEN,
    status: ProjectStatus.COMPLETED,
    imageUrl: 'https://picsum.photos/id/48/800/600',
    progress: 100,
    completionDate: '2024-01-20',
    gallery: []
  },
  {
    id: '3',
    title: 'Escritório Advocacia Silva',
    description: 'Remodelação de espaço comercial para escritório de advocacia com salas de reunião acústicas.',
    type: ProjectType.COMMERCIAL,
    status: ProjectStatus.IN_PROGRESS,
    imageUrl: 'https://picsum.photos/id/3/800/600',
    progress: 65,
    completionDate: '2024-05-30',
    gallery: [
      { url: 'https://picsum.photos/id/180/800/600', caption: 'Instalação do piso flutuante' },
      { url: 'https://picsum.photos/id/20/800/600', caption: 'Pintura das salas de reunião' },
      { url: 'https://picsum.photos/id/60/800/600', caption: 'Área de recepção em acabamento' }
    ]
  },
  {
    id: '4',
    title: 'Reforma Banheiro Luxo',
    description: 'Substituição de revestimentos, instalação de banheira de hidromassagem e metais dourados.',
    type: ProjectType.BATHROOM,
    status: ProjectStatus.IN_PROGRESS,
    imageUrl: 'https://picsum.photos/id/58/800/600',
    progress: 30,
    completionDate: '2024-06-15',
    gallery: [
      { url: 'https://picsum.photos/id/28/800/600', caption: 'Demolição dos revestimentos antigos' },
      { url: 'https://picsum.photos/id/38/800/600', caption: 'Impermeabilização do box' }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    clientName: 'Ana Pereira',
    rating: 5,
    comment: 'Serviço impecável! A equipe da DNL foi pontual, limpa e entregou a obra antes do prazo. Recomendo muito.',
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    date: '2024-01-25',
    approved: true
  },
  {
    id: '2',
    clientName: 'Carlos Mendes',
    rating: 5,
    comment: 'Transformaram minha cozinha completamente. O acabamento é de primeira qualidade.',
    avatarUrl: 'https://picsum.photos/id/91/100/100',
    date: '2024-02-10',
    approved: true
  },
  {
    id: '3',
    clientName: 'Mariana Costa',
    rating: 4,
    comment: 'Muito profissionais. Tivemos um pequeno atraso na entrega do material, mas a equipe compensou trabalhando no sábado.',
    date: '2023-12-05',
    approved: true
  }
];