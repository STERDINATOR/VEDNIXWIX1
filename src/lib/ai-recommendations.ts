/**
 * AI Recommendation Engine
 * Generates personalized learning recommendations based on user progress and preferences
 */

import { AnimeEducationalReels, LearningTopics, Quests } from '@/entities';

interface UserLearningProfile {
  completedTopics: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredTopics: string[];
  learningStyle: 'visual' | 'interactive' | 'text-based';
  recentActivity: string[];
}

interface Recommendation {
  type: 'reel' | 'quest' | 'topic';
  item: AnimeEducationalReels | Quests | LearningTopics;
  score: number;
  reason: string;
}

export function generateRecommendations(
  profile: UserLearningProfile,
  reels: AnimeEducationalReels[],
  quests: Quests[],
  topics: LearningTopics[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Recommend reels based on learning style and level
  reels.forEach(reel => {
    if (!profile.recentActivity.includes(reel._id)) {
      let score = 0;
      let reason = '';

      // Match difficulty level
      if (reel.difficultyLevel === 'Beginner' && profile.currentLevel === 'beginner') {
        score += 0.3;
        reason = 'Matches your current level';
      } else if (reel.difficultyLevel === 'Intermediate' && profile.currentLevel === 'intermediate') {
        score += 0.3;
        reason = 'Matches your current level';
      } else if (reel.difficultyLevel === 'Advanced' && profile.currentLevel === 'advanced') {
        score += 0.3;
        reason = 'Matches your current level';
      }

      // Match preferred topics
      if (profile.preferredTopics.includes(reel.topic || '')) {
        score += 0.4;
        reason = 'Related to your favorite topics';
      }

      // Boost for new topics
      if (!profile.completedTopics.includes(reel.topic || '')) {
        score += 0.2;
        reason = 'Explore a new topic';
      }

      if (score > 0) {
        recommendations.push({
          type: 'reel',
          item: reel,
          score,
          reason,
        });
      }
    }
  });

  // Recommend quests based on level progression
  quests.forEach(quest => {
    if (!profile.recentActivity.includes(quest._id)) {
      let score = 0;
      let reason = '';

      if (quest.difficulty === 'Easy' && profile.currentLevel === 'beginner') {
        score += 0.35;
        reason = 'Great for building foundations';
      } else if (quest.difficulty === 'Medium' && profile.currentLevel === 'intermediate') {
        score += 0.35;
        reason = 'Perfect challenge for your level';
      } else if (quest.difficulty === 'Hard' && profile.currentLevel === 'advanced') {
        score += 0.35;
        reason = 'Master advanced concepts';
      }

      // Bonus for XP rewards
      if (quest.xpReward && quest.xpReward > 100) {
        score += 0.15;
        reason = 'High XP reward';
      }

      if (score > 0) {
        recommendations.push({
          type: 'quest',
          item: quest,
          score,
          reason,
        });
      }
    }
  });

  // Sort by score and return top 10
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function suggestNextTopic(
  profile: UserLearningProfile,
  topics: LearningTopics[]
): LearningTopics | null {
  const uncompletedTopics = topics.filter(
    topic => !profile.completedTopics.includes(topic._id)
  );

  if (uncompletedTopics.length === 0) return null;

  // Prefer topics with more content
  return uncompletedTopics.sort((a, b) => {
    const aContent = (a.totalReels || 0) + (a.totalQuizzes || 0);
    const bContent = (b.totalReels || 0) + (b.totalQuizzes || 0);
    return bContent - aContent;
  })[0] || null;
}

export function calculateLearningStreak(recentActivity: string[]): number {
  // Simple streak calculation based on recent activity
  // In a real app, this would check timestamps
  return Math.min(recentActivity.length, 30);
}
