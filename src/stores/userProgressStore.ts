import { create } from 'zustand';

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  maxLevelXP: number;
  completedReels: string[];
  completedQuizzes: string[];
  bookmarkedReels: string[];
  weakTopics: string[];
  dailyStreak: number;
  lastActivityDate: string;
  achievements: string[];
}

interface ProgressStore {
  userProgress: UserProgress | null;
  setUserProgress: (progress: UserProgress) => void;
  addXP: (amount: number) => void;
  completeReel: (reelId: string) => void;
  completeQuiz: (quizId: string) => void;
  bookmarkReel: (reelId: string) => void;
  removeBookmark: (reelId: string) => void;
  addWeakTopic: (topicId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
}

export const useProgressStore = create<ProgressStore>((set) => ({
  userProgress: null,

  setUserProgress: (progress) => set({ userProgress: progress }),

  addXP: (amount) =>
    set((state) => {
      if (!state.userProgress) return state;

      const newXP = state.userProgress.currentLevelXP + amount;
      const maxXP = state.userProgress.maxLevelXP;

      if (newXP >= maxXP) {
        return {
          userProgress: {
            ...state.userProgress,
            totalXP: state.userProgress.totalXP + amount,
            level: state.userProgress.level + 1,
            currentLevelXP: newXP - maxXP,
            maxLevelXP: Math.floor(maxXP * 1.1),
          },
        };
      }

      return {
        userProgress: {
          ...state.userProgress,
          totalXP: state.userProgress.totalXP + amount,
          currentLevelXP: newXP,
        },
      };
    }),

  completeReel: (reelId) =>
    set((state) => {
      if (!state.userProgress) return state;
      if (state.userProgress.completedReels.includes(reelId)) return state;

      return {
        userProgress: {
          ...state.userProgress,
          completedReels: [...state.userProgress.completedReels, reelId],
        },
      };
    }),

  completeQuiz: (quizId) =>
    set((state) => {
      if (!state.userProgress) return state;
      if (state.userProgress.completedQuizzes.includes(quizId)) return state;

      return {
        userProgress: {
          ...state.userProgress,
          completedQuizzes: [...state.userProgress.completedQuizzes, quizId],
        },
      };
    }),

  bookmarkReel: (reelId) =>
    set((state) => {
      if (!state.userProgress) return state;
      if (state.userProgress.bookmarkedReels.includes(reelId)) return state;

      return {
        userProgress: {
          ...state.userProgress,
          bookmarkedReels: [...state.userProgress.bookmarkedReels, reelId],
        },
      };
    }),

  removeBookmark: (reelId) =>
    set((state) => {
      if (!state.userProgress) return state;

      return {
        userProgress: {
          ...state.userProgress,
          bookmarkedReels: state.userProgress.bookmarkedReels.filter(
            (id) => id !== reelId
          ),
        },
      };
    }),

  addWeakTopic: (topicId) =>
    set((state) => {
      if (!state.userProgress) return state;
      if (state.userProgress.weakTopics.includes(topicId)) return state;

      return {
        userProgress: {
          ...state.userProgress,
          weakTopics: [...state.userProgress.weakTopics, topicId],
        },
      };
    }),

  unlockAchievement: (achievementId) =>
    set((state) => {
      if (!state.userProgress) return state;
      if (state.userProgress.achievements.includes(achievementId)) return state;

      return {
        userProgress: {
          ...state.userProgress,
          achievements: [...state.userProgress.achievements, achievementId],
        },
      };
    }),

  updateStreak: () =>
    set((state) => {
      if (!state.userProgress) return state;

      const today = new Date().toDateString();
      const lastActivity = new Date(state.userProgress.lastActivityDate).toDateString();

      const newStreak = today === lastActivity ? state.userProgress.dailyStreak : state.userProgress.dailyStreak + 1;

      return {
        userProgress: {
          ...state.userProgress,
          dailyStreak: newStreak,
          lastActivityDate: new Date().toISOString(),
        },
      };
    }),
}));
