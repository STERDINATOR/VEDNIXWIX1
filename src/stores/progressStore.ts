import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface QuestProgress {
  [key: number]: number;
}

export interface ProgressData {
  questProgress: QuestProgress;
  weeklyProgress: number;
  todayXP: number;
  dailyStreak: number;
  petInteractionCount: number;
  lastUpdated: number;
  userId?: string;
}

export interface ProgressStore {
  // State
  progressData: ProgressData;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: number;
  syncError: string | null;

  // Actions
  setProgressData: (data: ProgressData) => void;
  updateQuestProgress: (questId: number, progress: number) => void;
  updateWeeklyProgress: (amount: number) => void;
  updateTodayXP: (amount: number) => void;
  incrementDailyStreak: () => void;
  incrementPetInteraction: () => void;
  resetDailyStats: () => void;
  
  // Sync actions
  syncProgress: () => Promise<void>;
  startAutoSync: (intervalMs?: number) => void;
  stopAutoSync: () => void;
  
  // Utility
  getProgressPercentage: () => number;
  getTotalXP: () => number;
}

const DEFAULT_PROGRESS: ProgressData = {
  questProgress: { 1: 75, 2: 30, 3: 90 },
  weeklyProgress: 1250,
  todayXP: 450,
  dailyStreak: 15,
  petInteractionCount: 0,
  lastUpdated: Date.now(),
};

let autoSyncInterval: NodeJS.Timeout | null = null;

export const useProgressStore = create<ProgressStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    progressData: DEFAULT_PROGRESS,
    isLoading: false,
    isSyncing: false,
    lastSyncTime: 0,
    syncError: null,

    // Basic setters
    setProgressData: (data: ProgressData) => {
      set({
        progressData: {
          ...data,
          lastUpdated: Date.now(),
        },
      });
      // Persist to localStorage
      localStorage.setItem('dashboardProgress', JSON.stringify(data));
    },

    // Quest progress update
    updateQuestProgress: (questId: number, progress: number) => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.questProgress[questId] = Math.min(100, progress);
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Weekly progress update
    updateWeeklyProgress: (amount: number) => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.weeklyProgress += amount;
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Today's XP update
    updateTodayXP: (amount: number) => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.todayXP += amount;
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Daily streak increment
    incrementDailyStreak: () => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.dailyStreak += 1;
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Pet interaction increment
    incrementPetInteraction: () => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.petInteractionCount += 1;
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Reset daily stats (called at midnight)
    resetDailyStats: () => {
      set((state) => {
        const newProgress = { ...state.progressData };
        newProgress.todayXP = 0;
        newProgress.lastUpdated = Date.now();
        localStorage.setItem('dashboardProgress', JSON.stringify(newProgress));
        return { progressData: newProgress };
      });
    },

    // Sync progress with backend/server
    syncProgress: async () => {
      const state = get();
      set({ isSyncing: true, syncError: null });

      try {
        // Simulate API call - replace with actual backend endpoint
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state.progressData),
        }).catch(() => {
          // If API doesn't exist, just use localStorage
          return null;
        });

        if (response && response.ok) {
          const serverData = await response.json();
          set({
            progressData: serverData,
            lastSyncTime: Date.now(),
            isSyncing: false,
          });
        } else {
          // Fallback: use local data
          set({
            lastSyncTime: Date.now(),
            isSyncing: false,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        set({
          syncError: errorMessage,
          isSyncing: false,
        });
      }
    },

    // Start auto-sync at specified interval
    startAutoSync: (intervalMs = 30000) => {
      // Clear existing interval if any
      if (autoSyncInterval) {
        clearInterval(autoSyncInterval);
      }

      // Sync immediately
      get().syncProgress();

      // Then sync at regular intervals
      autoSyncInterval = setInterval(() => {
        get().syncProgress();
      }, intervalMs);
    },

    // Stop auto-sync
    stopAutoSync: () => {
      if (autoSyncInterval) {
        clearInterval(autoSyncInterval);
        autoSyncInterval = null;
      }
    },

    // Utility: get progress percentage
    getProgressPercentage: () => {
      const state = get();
      return (state.progressData.weeklyProgress / 2000) * 100;
    },

    // Utility: get total XP
    getTotalXP: () => {
      const state = get();
      return state.progressData.todayXP + state.progressData.weeklyProgress;
    },
  }))
);

// Initialize store from localStorage on app load
export const initializeProgressStore = () => {
  try {
    const savedProgress = localStorage.getItem('dashboardProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      useProgressStore.setState({
        progressData: {
          ...DEFAULT_PROGRESS,
          ...progress,
          lastUpdated: Date.now(),
        },
      });
    }
  } catch (error) {
    console.error('Error initializing progress store:', error);
  }
};

// Cleanup on app unload
export const cleanupProgressStore = () => {
  useProgressStore.getState().stopAutoSync();
};
