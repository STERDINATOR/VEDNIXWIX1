import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Download, BookmarkPlus, Zap, TrendingUp } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  concept: string;
  difficulty: string;
  duration: number;
  emoji: string;
  color: string;
  engagement: number;
  views: number;
  liked: boolean;
  saved: boolean;
  mood: 'happy' | 'focused' | 'stressed' | 'inspired';
}

const mockReels: Reel[] = [
  {
    id: '1',
    title: 'Quadratic Equations Explained',
    concept: 'Algebra',
    difficulty: 'Medium',
    duration: 3,
    emoji: '📐',
    color: '#00FFFF',
    engagement: 92,
    views: 1250,
    liked: false,
    saved: false,
    mood: 'focused'
  },
  {
    id: '2',
    title: 'Pythagorean Theorem Visualization',
    concept: 'Geometry',
    difficulty: 'Easy',
    duration: 2,
    emoji: '🔺',
    color: '#FFFF00',
    engagement: 88,
    views: 980,
    liked: false,
    saved: false,
    mood: 'happy'
  },
  {
    id: '3',
    title: 'Calculus Derivatives Deep Dive',
    concept: 'Calculus',
    difficulty: 'Hard',
    duration: 5,
    emoji: '📈',
    color: '#FF00FF',
    engagement: 85,
    views: 750,
    liked: false,
    saved: false,
    mood: 'inspired'
  },
  {
    id: '4',
    title: 'Statistics Probability Basics',
    concept: 'Statistics',
    difficulty: 'Medium',
    duration: 3,
    emoji: '📊',
    color: '#00FF00',
    engagement: 80,
    views: 650,
    liked: false,
    saved: false,
    mood: 'focused'
  }
];

export function PersonalizedReelFeed() {
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [currentMood, setCurrentMood] = useState<'happy' | 'focused' | 'stressed' | 'inspired'>('focused');
  const [sortBy, setSortBy] = useState<'engagement' | 'recent' | 'trending'>('engagement');

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'focused', emoji: '🎯', label: 'Focused' },
    { id: 'stressed', emoji: '😰', label: 'Stressed' },
    { id: 'inspired', emoji: '✨', label: 'Inspired' }
  ];

  const handleLike = (reelId: string) => {
    setReels(reels.map(r => r.id === reelId ? { ...r, liked: !r.liked } : r));
  };

  const handleSave = (reelId: string) => {
    setReels(reels.map(r => r.id === reelId ? { ...r, saved: !r.saved } : r));
  };

  const filteredReels = reels
    .filter(r => r.mood === currentMood)
    .sort((a, b) => {
      if (sortBy === 'engagement') return b.engagement - a.engagement;
      if (sortBy === 'trending') return b.views - a.views;
      return 0;
    });

  return (
    <div className="w-full py-12 space-y-8">
      {/* Mood Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="font-heading text-2xl text-foreground">How are you feeling?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setCurrentMood(mood.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentMood === mood.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-background/40 border-primary/20 hover:border-primary/40'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <p className="font-heading text-sm text-foreground">{mood.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex gap-3 flex-wrap"
      >
        {[
          { id: 'engagement', label: 'Most Engaging', icon: '⚡' },
          { id: 'recent', label: 'Most Recent', icon: '🆕' },
          { id: 'trending', label: 'Trending', icon: '📈' }
        ].map((option) => (
          <Button
            key={option.id}
            onClick={() => setSortBy(option.id as any)}
            className={`${
              sortBy === option.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-dark-gray border border-primary/20 text-light-gray hover:text-foreground'
            }`}
          >
            {option.icon} {option.label}
          </Button>
        ))}
      </motion.div>

      {/* Reel Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className="bg-dark-gray border-2 overflow-hidden hover:border-primary/60 transition-all cursor-pointer group"
                style={{ borderColor: reel.color + '40' }}
              >
                {/* Reel Preview */}
                <div
                  className="h-40 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{ backgroundColor: reel.color + '20' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {reel.emoji}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  >
                    <Button className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center">
                      ▶
                    </Button>
                  </motion.div>
                </div>

                {/* Reel Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-1">
                      {reel.title}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                        {reel.concept}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-xs"
                        style={{ color: reel.color }}
                      >
                        {reel.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center justify-between text-xs text-light-gray">
                    <span>⏱️ {reel.duration}m</span>
                    <span>👁️ {reel.views.toLocaleString()}</span>
                    <span style={{ color: reel.color }}>⚡ {reel.engagement}%</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-primary/20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(reel.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-all ${
                        reel.liked
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-background/40 text-light-gray hover:text-foreground'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={reel.liked ? 'currentColor' : 'none'} />
                      <span className="text-xs">Like</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSave(reel.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-all ${
                        reel.saved
                          ? 'bg-primary/20 text-primary'
                          : 'bg-background/40 text-light-gray hover:text-foreground'
                      }`}
                    >
                      <BookmarkPlus className="w-4 h-4" fill={reel.saved ? 'currentColor' : 'none'} />
                      <span className="text-xs">Save</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-background/40 text-light-gray hover:text-foreground transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">Share</span>
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
