import React, { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Bookmark, Play } from 'lucide-react';
import { useProgressStore } from '@/stores/userProgressStore';
import { motion } from 'framer-motion';

interface Reel {
  _id: string;
  reelTitle: string;
  reelDescription: string;
  topic: string;
  difficultyLevel: string;
  videoDuration: number;
  videoUrl: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
}

interface ReelFeedProps {
  topicFilter?: string;
  difficultyFilter?: string;
}

export function ReelFeed({ topicFilter, difficultyFilter }: ReelFeedProps) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const { userProgress, bookmarkReel, removeBookmark } = useProgressStore();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Reel>('animeeducationalreels');
        let filtered = items;

        if (topicFilter) {
          filtered = filtered.filter((reel) => reel.topic === topicFilter);
        }

        if (difficultyFilter) {
          filtered = filtered.filter((reel) => reel.difficultyLevel === difficultyFilter);
        }

        setReels(filtered);
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [topicFilter, difficultyFilter]);

  const handleLike = (reelId: string) => {
    setLikedReels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const handleBookmark = (reelId: string) => {
    if (userProgress?.bookmarkedReels.includes(reelId)) {
      removeBookmark(reelId);
    } else {
      bookmarkReel(reelId);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-dark-gray/30 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reels.map((reel, index) => (
        <motion.div
          key={reel._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-dark-gray/50 border-primary/20 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
            <div className="relative overflow-hidden bg-black h-40">
              <img
                src={reel.thumbnailUrl}
                alt={reel.reelTitle}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-primary fill-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className={getDifficultyColor(reel.difficultyLevel)}>
                  {reel.difficultyLevel}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-heading text-lg text-primary mb-2 line-clamp-2">
                {reel.reelTitle}
              </h3>
              <p className="font-paragraph text-sm text-light-gray mb-3 line-clamp-2">
                {reel.reelDescription}
              </p>

              <div className="flex items-center justify-between mb-3 text-xs text-light-gray">
                <span>{Math.floor(reel.videoDuration / 60)}m {reel.videoDuration % 60}s</span>
                <span>{reel.viewCount} views</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-primary hover:bg-primary/10"
                  onClick={() => handleLike(reel._id)}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      likedReels.has(reel._id) ? 'fill-primary' : ''
                    }`}
                  />
                  {reel.likeCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-primary hover:bg-primary/10"
                  onClick={() => handleBookmark(reel._id)}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      userProgress?.bookmarkedReels.includes(reel._id)
                        ? 'fill-primary'
                        : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
