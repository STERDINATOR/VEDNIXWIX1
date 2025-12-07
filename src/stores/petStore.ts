import { create } from 'zustand';

export interface PetPersonality {
  name: string;
  type: 'cat' | 'dragon' | 'robot' | 'phoenix' | 'wolf' | 'fox' | 'bunny' | 'panda';
  color: string;
  secondaryColor: string;
  accessories: string[];
  personality: 'playful' | 'wise' | 'energetic' | 'calm' | 'mischievous' | 'loyal' | 'mysterious';
  level: number;
  xp: number;
  xpToNext: number;
  appearance: {
    eyes: 'normal' | 'sparkly' | 'sleepy' | 'determined' | 'mischievous' | 'wise';
    expression: 'happy' | 'content' | 'excited' | 'focused' | 'sleepy' | 'curious';
    pattern: 'solid' | 'stripes' | 'spots' | 'gradient' | 'cyber' | 'holographic';
    size: 'small' | 'medium' | 'large';
  };
  specialAbilities: string[];
  backstory: string;
  favoriteActivity: string;
  image?: string;
}

export interface PetStats {
  happiness: number;
  energy: number;
  health: number;
  intelligence: number;
}

export interface PetNotification {
  id: string;
  type: 'health' | 'motivation' | 'reminder' | 'achievement';
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon?: string;
}

interface PetStore {
  pet: PetPersonality | null;
  stats: PetStats;
  notifications: PetNotification[];
  isVisible: boolean;
  lastNotificationTime: number;
  
  setPet: (pet: PetPersonality) => void;
  updateStats: (stats: Partial<PetStats>) => void;
  addNotification: (notification: Omit<PetNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setVisible: (visible: boolean) => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

const DEFAULT_PET: PetPersonality = {
  name: 'Neko-chan',
  type: 'cat',
  color: '#FF6B9D',
  secondaryColor: '#FFB6C1',
  accessories: ['Cyber Collar', 'Holographic Wings'],
  personality: 'playful',
  level: 15,
  xp: 2450,
  xpToNext: 3000,
  appearance: {
    eyes: 'sparkly',
    expression: 'happy',
    pattern: 'cyber',
    size: 'medium'
  },
  specialAbilities: ['Digital Healing', 'Study Boost'],
  backstory: 'A cybernetic companion created to help students achieve their learning goals.',
  favoriteActivity: 'Playing with holographic butterflies while you study',
  image: 'https://static.wixstatic.com/media/c5b305_64b1f78e7d084df480fb0b1f510cd2f2~mv2.png?originWidth=384&originHeight=384'
};

const DEFAULT_STATS: PetStats = {
  happiness: 85,
  energy: 70,
  health: 90,
  intelligence: 65
};

export const usePetStore = create<PetStore>((set, get) => ({
  pet: DEFAULT_PET,
  stats: DEFAULT_STATS,
  notifications: [],
  isVisible: true,
  lastNotificationTime: 0,

  setPet: (pet: PetPersonality) => {
    set({ pet });
    get().saveToLocalStorage();
  },

  updateStats: (stats: Partial<PetStats>) => {
    set((state) => ({
      stats: { ...state.stats, ...stats }
    }));
  },

  addNotification: (notification: Omit<PetNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: PetNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 20),
      lastNotificationTime: Date.now()
    }));
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setVisible: (visible: boolean) => {
    set({ isVisible: visible });
  },

  loadFromLocalStorage: () => {
    try {
      const savedPet = localStorage.getItem('userPet');
      if (savedPet) {
        set({ pet: JSON.parse(savedPet) });
      }
    } catch (error) {
      console.error('Error loading pet from localStorage:', error);
    }
  },

  saveToLocalStorage: () => {
    try {
      const { pet } = get();
      if (pet) {
        localStorage.setItem('userPet', JSON.stringify(pet));
      }
    } catch (error) {
      console.error('Error saving pet to localStorage:', error);
    }
  }
}));
