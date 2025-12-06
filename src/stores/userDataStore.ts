import { create } from 'zustand';
import { BaseCrudService } from '@/integrations';

export interface UserData {
  _id: string;
  userId: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  maxLevelXP: number;
  dailyStreak: number;
  lastActivityDate: string;
  completedReels: string[];
  completedQuizzes: string[];
  completedQuests: string[];
  bookmarkedReels: string[];
  weakTopics: string[];
  achievements: string[];
  inventory: Record<string, number>;
  guildId?: string;
  battleStats: {
    wins: number;
    losses: number;
    totalBattles: number;
  };
  habitTracker: {
    studyDays: number;
    lastStudyDate: string;
    currentStreak: number;
  };
  petStats: {
    happiness: number;
    hunger: number;
    energy: number;
    level: number;
  };
}

interface UserDataStore {
  userData: UserData | null;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: number;
  
  // Actions
  setUserData: (data: UserData) => void;
  loadUserData: (userId: string) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  completeReel: (reelId: string) => Promise<void>;
  completeQuiz: (quizId: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  bookmarkReel: (reelId: string) => Promise<void>;
  addWeakTopic: (topicId: string) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updateDailyStreak: () => Promise<void>;
  addToInventory: (itemId: string, quantity: number) => Promise<void>;
  recordBattleResult: (won: boolean) => Promise<void>;
  updatePetStats: (stats: Partial<UserData['petStats']>) => Promise<void>;
  syncToDatabase: () => Promise<void>;
  startAutoSync: (intervalMs?: number) => void;
  stopAutoSync: () => void;
}

let autoSyncInterval: NodeJS.Timeout | null = null;

const DEFAULT_USER_DATA: Omit<UserData, '_id' | 'userId'> = {
  totalXP: 0,
  level: 1,
  currentLevelXP: 0,
  maxLevelXP: 100,
  dailyStreak: 0,
  lastActivityDate: new Date().toISOString(),
  completedReels: [],
  completedQuizzes: [],
  completedQuests: [],
  bookmarkedReels: [],
  weakTopics: [],
  achievements: [],
  inventory: {},
  battleStats: {
    wins: 0,
    losses: 0,
    totalBattles: 0,
  },
  habitTracker: {
    studyDays: 0,
    lastStudyDate: new Date().toISOString(),
    currentStreak: 0,
  },
  petStats: {
    happiness: 100,
    hunger: 0,
    energy: 100,
    level: 1,
  },
};

export const useUserDataStore = create<UserDataStore>((set, get) => ({
  userData: null,
  isLoading: false,
  isSyncing: false,
  lastSyncTime: 0,

  setUserData: (data) => {
    set({ userData: data });
    localStorage.setItem('userData', JSON.stringify(data));
  },

  loadUserData: async (userId) => {
    set({ isLoading: true });
    try {
      // Try to load from localStorage first
      const cached = localStorage.getItem('userData');
      if (cached) {
        const data = JSON.parse(cached);
        set({ userData: data, isLoading: false });
        return;
      }

      // If no cached data, create default user data
      const newUserData: UserData = {
        _id: `user-${userId}-${Date.now()}`,
        userId: userId,
        ...DEFAULT_USER_DATA,
      };
      
      set({ userData: newUserData, isLoading: false });
      get().setUserData(newUserData);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Create default data on error
      const newUserData: UserData = {
        _id: `user-${userId}-${Date.now()}`,
        userId: userId,
        ...DEFAULT_USER_DATA,
      };
      set({ userData: newUserData, isLoading: false });
    }
  },

  addXP: async (amount) => {
    set((state) => {
      if (!state.userData) return state;

      const newXP = state.userData.currentLevelXP + amount;
      const maxXP = state.userData.maxLevelXP;

      if (newXP >= maxXP) {
        const newData = {
          ...state.userData,
          totalXP: state.userData.totalXP + amount,
          level: state.userData.level + 1,
          currentLevelXP: newXP - maxXP,
          maxLevelXP: Math.floor(maxXP * 1.1),
        };
        get().setUserData(newData);
        return { userData: newData };
      }

      const newData = {
        ...state.userData,
        totalXP: state.userData.totalXP + amount,
        currentLevelXP: newXP,
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  completeReel: async (reelId) => {
    set((state) => {
      if (!state.userData || state.userData.completedReels.includes(reelId)) return state;

      const newData = {
        ...state.userData,
        completedReels: [...state.userData.completedReels, reelId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  completeQuiz: async (quizId) => {
    set((state) => {
      if (!state.userData || state.userData.completedQuizzes.includes(quizId)) return state;

      const newData = {
        ...state.userData,
        completedQuizzes: [...state.userData.completedQuizzes, quizId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  completeQuest: async (questId) => {
    set((state) => {
      if (!state.userData || state.userData.completedQuests.includes(questId)) return state;

      const newData = {
        ...state.userData,
        completedQuests: [...state.userData.completedQuests, questId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  bookmarkReel: async (reelId) => {
    set((state) => {
      if (!state.userData || state.userData.bookmarkedReels.includes(reelId)) return state;

      const newData = {
        ...state.userData,
        bookmarkedReels: [...state.userData.bookmarkedReels, reelId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  addWeakTopic: async (topicId) => {
    set((state) => {
      if (!state.userData || state.userData.weakTopics.includes(topicId)) return state;

      const newData = {
        ...state.userData,
        weakTopics: [...state.userData.weakTopics, topicId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  unlockAchievement: async (achievementId) => {
    set((state) => {
      if (!state.userData || state.userData.achievements.includes(achievementId)) return state;

      const newData = {
        ...state.userData,
        achievements: [...state.userData.achievements, achievementId],
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  updateDailyStreak: async () => {
    set((state) => {
      if (!state.userData) return state;

      const today = new Date().toDateString();
      const lastActivity = new Date(state.userData.lastActivityDate).toDateString();

      const newStreak = today === lastActivity ? state.userData.dailyStreak : state.userData.dailyStreak + 1;

      const newData = {
        ...state.userData,
        dailyStreak: newStreak,
        lastActivityDate: new Date().toISOString(),
        habitTracker: {
          ...state.userData.habitTracker,
          currentStreak: newStreak,
          lastStudyDate: new Date().toISOString(),
          studyDays: state.userData.habitTracker.studyDays + 1,
        },
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  addToInventory: async (itemId, quantity) => {
    set((state) => {
      if (!state.userData) return state;

      const newData = {
        ...state.userData,
        inventory: {
          ...state.userData.inventory,
          [itemId]: (state.userData.inventory[itemId] || 0) + quantity,
        },
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  recordBattleResult: async (won) => {
    set((state) => {
      if (!state.userData) return state;

      const newData = {
        ...state.userData,
        battleStats: {
          ...state.userData.battleStats,
          totalBattles: state.userData.battleStats.totalBattles + 1,
          wins: won ? state.userData.battleStats.wins + 1 : state.userData.battleStats.wins,
          losses: !won ? state.userData.battleStats.losses + 1 : state.userData.battleStats.losses,
        },
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  updatePetStats: async (stats) => {
    set((state) => {
      if (!state.userData) return state;

      const newData = {
        ...state.userData,
        petStats: {
          ...state.userData.petStats,
          ...stats,
        },
      };
      get().setUserData(newData);
      return { userData: newData };
    });

    await get().syncToDatabase();
  },

  syncToDatabase: async () => {
    const state = get();
    if (!state.userData) return;

    set({ isSyncing: true });

    try {
      // For now, just persist to localStorage
      // In production, this would sync to Wix database
      localStorage.setItem('userData', JSON.stringify(state.userData));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      set({ lastSyncTime: Date.now(), isSyncing: false });
    } catch (error) {
      console.error('Error syncing to database:', error);
      set({ isSyncing: false });
      // Don't throw - allow app to continue with localStorage
    }
  },

  startAutoSync: (intervalMs = 30000) => {
    if (autoSyncInterval) clearInterval(autoSyncInterval);

    get().syncToDatabase();

    autoSyncInterval = setInterval(() => {
      get().syncToDatabase();
    }, intervalMs);
  },

  stopAutoSync: () => {
    if (autoSyncInterval) {
      clearInterval(autoSyncInterval);
      autoSyncInterval = null;
    }
  },
}));
