/**
 * AI Recommendations Display Component
 * Shows personalized learning recommendations to users
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { AnimeEducationalReels, Quests, LearningTopics } from '@/entities';
import { generateRecommendations, suggestNextTopic } from '@/lib/ai-recommendations';
import { Sparkles, BookOpen, Zap, Target } from 'lucide-react';

interface AIRecommendationsDisplayProps {
  reels: AnimeEducationalReels[];
  quests: Quests[];
  topics: LearningTopics[];
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  completedTopics?: string[];
  recentActivity?: string[];
  onSelectItem?: (item: any, type: 'reel' | 'quest' | 'topic') => void;
}

export function AIRecommendationsDisplay({
  reels,
  quests,
  topics,
  userLevel = 'beginner',
  completedTopics = [],
  recentActivity = [],
  onSelectItem,
}: AIRecommendationsDisplayProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [nextTopic, setNextTopic] = useState<LearningTopics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendationsData();
  }, [reels, quests, topics, userLevel, completedTopics, recentActivity]);

  function generateRecommendationsData() {
    const userProfile = {
      completedTopics,
      currentLevel: userLevel,
      preferredTopics: topics.slice(0, 3).map(t => t.topicName || '').filter(Boolean),
      learningStyle: 'visual' as const,
      recentActivity,
    };

    const recs = generateRecommendations(userProfile, reels, quests, topics);
    setRecommendations(recs);

    const suggested = suggestNextTopic(userProfile, topics);
    setNextTopic(suggested);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-foreground">
          AI-Powered Recommendations
        </h3>
      </div>

      {/* Next Topic Suggestion */}
      {nextTopic && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary mb-1">
                Recommended Next Topic
              </p>
              <h4 className="font-heading font-bold text-foreground mb-2">
                {nextTopic.topicName}
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                {nextTopic.topicDescription}
              </p>
              <div className="flex gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {nextTopic.totalReels || 0} Reels
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {nextTopic.totalQuizzes || 0} Quizzes
                </span>
              </div>
              <Button
                onClick={() => onSelectItem?.(nextTopic, 'topic')}
                className="mt-3 bg-primary text-black hover:bg-primary/90 text-xs"
              >
                Start Learning
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-300">
            Personalized for You ({recommendations.length} items)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.slice(0, 6).map((rec, index) => (
              <motion.div
                key={`${rec.type}-${rec.item._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-gray-700 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => onSelectItem?.(rec.item, rec.type)}
                >
                  <div className="p-3 space-y-2">
                    {/* Type Badge */}
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                        {rec.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-secondary">
                        {Math.round(rec.score * 100)}% Match
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-heading font-bold text-foreground text-sm line-clamp-2">
                      {rec.item.reelTitle || rec.item.title || rec.item.topicName}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {rec.item.reelDescription || rec.item.description || rec.item.topicDescription}
                    </p>

                    {/* Reason */}
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Sparkles className="w-3 h-3" />
                      {rec.reason}
                    </div>

                    {/* Metadata */}
                    <div className="flex gap-2 text-xs text-gray-500 pt-2 border-t border-gray-700">
                      {rec.item.difficultyLevel && (
                        <span>{rec.item.difficultyLevel}</span>
                      )}
                      {rec.item.difficulty && (
                        <span>{rec.item.difficulty}</span>
                      )}
                      {rec.item.xpReward && (
                        <span className="text-primary font-semibold">
                          +{rec.item.xpReward} XP
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem?.(rec.item, rec.type);
                      }}
                      className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white text-xs h-8"
                    >
                      Start
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-gray-700 p-6 text-center">
          <p className="text-gray-400">
            Complete more activities to get personalized recommendations!
          </p>
        </Card>
      )}
    </div>
  );
}
