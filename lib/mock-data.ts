export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: string;
  progress: number;
  price: number;
  isFree: boolean;
  modules: Module[];
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Avançado: Hooks e Performance",
    description: "Aprenda técnicas avançadas de React, incluindo hooks customizados, otimização de performance e padrões modernos.",
    instructor: "João Silva",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "12h 30min",
    progress: 65,
    price: 299,
    isFree: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    modules: [
      {
        id: "m1",
        title: "Introdução ao React Avançado",
        lessons: [
          { id: "l1", title: "Visão Geral", duration: "15min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", completed: true },
          { id: "l2", title: "Configuração do Ambiente", duration: "20min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", completed: true },
        ],
      },
      {
        id: "m2",
        title: "Hooks Customizados",
        lessons: [
          { id: "l3", title: "Criando seu Primeiro Hook", duration: "25min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", completed: false },
          { id: "l4", title: "Hooks Avançados", duration: "30min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", completed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "TypeScript do Zero ao Avançado",
    description: "Domine TypeScript desde o básico até conceitos avançados como generics, utility types e decorators.",
    instructor: "Maria Santos",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    duration: "15h 45min",
    progress: 30,
    price: 349,
    isFree: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    modules: [
      {
        id: "m3",
        title: "Fundamentos",
        lessons: [
          { id: "l5", title: "Tipos Básicos", duration: "20min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", completed: true },
          { id: "l6", title: "Interfaces e Types", duration: "25min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", completed: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Next.js 14: App Router e Server Components",
    description: "Aprenda a construir aplicações modernas com Next.js 14, incluindo App Router, Server Components e Server Actions.",
    instructor: "Carlos Oliveira",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop",
    duration: "18h 20min",
    progress: 0,
    price: 399,
    isFree: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    modules: [],
  },
  {
    id: "4",
    title: "UI/UX Design: Fundamentos",
    description: "Curso gratuito sobre os fundamentos de UI/UX Design, incluindo princípios de design, tipografia e cores.",
    instructor: "Ana Costa",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    duration: "8h 15min",
    progress: 0,
    price: 0,
    isFree: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    modules: [],
  },
  {
    id: "5",
    title: "Node.js e Express: API RESTful",
    description: "Construa APIs RESTful robustas com Node.js e Express, incluindo autenticação, validação e testes.",
    instructor: "Pedro Alves",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    duration: "14h 10min",
    progress: 0,
    price: 279,
    isFree: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    modules: [],
  },
  {
    id: "6",
    title: "TailwindCSS: Design System Moderno",
    description: "Aprenda a criar interfaces modernas e responsivas com TailwindCSS, incluindo componentes reutilizáveis.",
    instructor: "Julia Ferreira",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "10h 5min",
    progress: 0,
    price: 199,
    isFree: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    modules: [],
  },
];

