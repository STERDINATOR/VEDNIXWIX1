import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Lock, X, Volume2, VolumeX, RotateCcw, Pause } from 'lucide-react';

interface TrialReel {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  duration: number;
  coverColor: string;
  accentColor: string;
  icon: string;
  videoUrl?: string;
  description?: string;
  isLocked?: boolean;
}

const trialReels: TrialReel[] = [
  {
    id: 'trial-1',
    title: 'Algebra Fundamentals',
    topic: 'Algebra',
    difficulty: 'Easy',
    duration: 420,
    coverColor: 'from-cyan-500/30 to-blue-500/30',
    accentColor: 'text-cyan-400',
    icon: '📐',
    videoUrl: 'https://www.youtube.com/embed/VLVDHc3kIEo',
    description: 'Learn the fundamentals of algebra with clear explanations and examples.',
  },
  {
    id: 'trial-2',
    title: 'Quadratic Equations',
    topic: 'Algebra',
    difficulty: 'Medium',
    duration: 540,
    coverColor: 'from-purple-500/30 to-pink-500/30',
    accentColor: 'text-purple-400',
    icon: '∑',
    videoUrl: 'https://www.youtube.com/embed/xGi2-nqUaKE',
    description: 'Master quadratic equations and their solutions.',
  },
  {
    id: 'trial-3',
    title: 'Advanced Polynomials',
    topic: 'Algebra',
    difficulty: 'Hard',
    duration: 720,
    coverColor: 'from-red-500/30 to-orange-500/30',
    accentColor: 'text-red-400',
    icon: '⚡',
    videoUrl: 'https://www.youtube.com/embed/Ey86JyFKqVE',
    description: 'Explore advanced polynomial operations and factoring techniques.',
  },
  {
    id: 'trial-4',
    title: 'Geometry Basics',
    topic: 'Geometry',
    difficulty: 'Easy',
    duration: 480,
    coverColor: 'from-green-500/30 to-emerald-500/30',
    accentColor: 'text-green-400',
    icon: '△',
    videoUrl: 'https://www.youtube.com/embed/TJVrDyq-_5s',
    description: 'Introduction to basic geometry concepts and shapes.',
  },
  {
    id: 'trial-5',
    title: 'Trigonometry Intro',
    topic: 'Geometry',
    difficulty: 'Medium',
    duration: 600,
    coverColor: 'from-yellow-500/30 to-amber-500/30',
    accentColor: 'text-yellow-400',
    icon: '∠',
    videoUrl: 'https://www.youtube.com/embed/mhd9FXYdf4s',
    description: 'Get started with trigonometry and trigonometric functions.',
  },
  {
    id: 'trial-6',
    title: 'Circle Theorems',
    topic: 'Geometry',
    difficulty: 'Hard',
    duration: 660,
    coverColor: 'from-indigo-500/30 to-purple-500/30',
    accentColor: 'text-indigo-400',
    icon: '◯',
    videoUrl: 'https://www.youtube.com/embed/Ey86JyFKqVE',
    description: 'Deep dive into circle theorems and properties.',
  },
  {
    id: 'trial-7',
    title: 'Limits & Continuity',
    topic: 'Calculus',
    difficulty: 'Medium',
    duration: 720,
    coverColor: 'from-blue-500/30 to-cyan-500/30',
    accentColor: 'text-blue-400',
    icon: '∞',
    videoUrl: 'https://www.youtube.com/embed/riXcZT2ICjA',
    description: 'Understand limits and continuity in calculus.',
  },
  {
    id: 'trial-8',
    title: 'Derivatives Explained',
    topic: 'Calculus',
    difficulty: 'Hard',
    duration: 840,
    coverColor: 'from-pink-500/30 to-rose-500/30',
    accentColor: 'text-pink-400',
    icon: 'd/dx',
    videoUrl: 'https://www.youtube.com/embed/9vKqVkMQHKk',
    description: 'Master derivatives and their applications.',
  },
  {
    id: 'trial-9',
    title: 'Integrals Mastery',
    topic: 'Calculus',
    difficulty: 'Hard',
    duration: 900,
    coverColor: 'from-violet-500/30 to-purple-500/30',
    accentColor: 'text-violet-400',
    icon: '∫',
    videoUrl: 'https://www.youtube.com/embed/rfG8ge9sSQE',
    description: 'Learn integration techniques and applications.',
  },
  {
    id: 'trial-10',
    title: 'Data Distribution',
    topic: 'Statistics',
    difficulty: 'Easy',
    duration: 480,
    coverColor: 'from-teal-500/30 to-cyan-500/30',
    accentColor: 'text-teal-400',
    icon: '📊',
    videoUrl: 'https://www.youtube.com/embed/bSQl9aNYVqo',
    description: 'Understand data distributions and statistical analysis.',
  },
  {
    id: 'trial-11',
    title: 'Probability Theory',
    topic: 'Statistics',
    difficulty: 'Medium',
    duration: 600,
    coverColor: 'from-orange-500/30 to-yellow-500/30',
    accentColor: 'text-orange-400',
    icon: '🎲',
    videoUrl: 'https://www.youtube.com/embed/uzkc-qNVoOk',
    description: 'Explore probability theory and its applications.',
  },
  {
    id: 'trial-12',
    title: 'Hypothesis Testing',
    topic: 'Statistics',
    difficulty: 'Hard',
    duration: 720,
    coverColor: 'from-red-500/30 to-pink-500/30',
    accentColor: 'text-red-400',
    icon: '✓',
    videoUrl: 'https://www.youtube.com/embed/0oc49DyA3hU',
    description: 'Master hypothesis testing and statistical inference.',
  },
  {
    id: 'trial-13',
    title: 'Kinematics Basics',
    topic: 'Physics',
    difficulty: 'Easy',
    duration: 540,
    coverColor: 'from-cyan-500/30 to-blue-500/30',
    accentColor: 'text-cyan-400',
    icon: '→',
    videoUrl: 'https://www.youtube.com/embed/mLw83m6UZH0',
    description: 'Introduction to kinematics and motion.',
  },
  {
    id: 'trial-14',
    title: 'Forces & Motion',
    topic: 'Physics',
    difficulty: 'Medium',
    duration: 660,
    coverColor: 'from-purple-500/30 to-indigo-500/30',
    accentColor: 'text-purple-400',
    icon: 'F=ma',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7f4',
    description: 'Learn about forces, Newton\'s laws, and motion.',
  },
  {
    id: 'trial-15',
    title: 'Quantum Mechanics',
    topic: 'Physics',
    difficulty: 'Hard',
    duration: 900,
    coverColor: 'from-pink-500/30 to-rose-500/30',
    accentColor: 'text-pink-400',
    icon: '⚛️',
    videoUrl: 'https://www.youtube.com/embed/MzRCDLre1b4',
    description: 'Dive into quantum mechanics and quantum physics.',
  },
];

interface AnimeTrialReelsProps {
  topicFilter?: string;
  difficultyFilter?: string;
}

interface VideoPlayerModalProps {
  reel: TrialReel;
  isOpen: boolean;
  onClose: () => void;
}

function VideoPlayerModal({ reel, isOpen, onClose }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-dark-gray rounded-2xl overflow-hidden border border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`${reel.videoUrl}?autoplay=1`}
                title={reel.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h2 className={`text-2xl font-heading font-bold mb-2 ${reel.accentColor}`}>
                {reel.title}
              </h2>
              <p className="font-paragraph text-light-gray mb-4">
                {reel.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className={`bg-${reel.accentColor.split('-')[1]}-500/20 text-${reel.accentColor.split('-')[1]}-400 border-${reel.accentColor.split('-')[1]}-500/30`}>
                  {reel.topic}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {reel.difficulty}
                </Badge>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AnimeTrialReels({ topicFilter, difficultyFilter }: AnimeTrialReelsProps) {
  const [selectedReel, setSelectedReel] = useState<TrialReel | null>(null);
  
  const filteredReels = trialReels.filter((reel) => {
    const topicMatch = !topicFilter || topicFilter === 'all' || reel.topic === topicFilter;
    const difficultyMatch = !difficultyFilter || difficultyFilter === 'all' || reel.difficulty === difficultyFilter;
    return topicMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReels.map((reel, index) => (
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          whileHover={{ y: -8 }}
        >
          <Card className={`overflow-hidden bg-gradient-to-br ${reel.coverColor} border-primary/30 hover:border-primary/60 transition-all duration-300 group cursor-pointer h-full flex flex-col`}>
            {/* Anime-style Cover */}
            <div className="relative overflow-hidden bg-black/40 h-48 flex items-center justify-center group">
              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse"></div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Anime character/icon area */}
              <div className="relative z-10 text-center">
                <motion.div
                  className={`text-6xl mb-3 ${reel.accentColor}`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {reel.icon}
                </motion.div>
                <motion.div
                  className={`text-2xl font-bold ${reel.accentColor} font-heading`}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {reel.title.split(' ')[0]}
                </motion.div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Play button overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-primary fill-primary" />
                </motion.div>
              </motion.div>

              {/* Lock indicator for locked reels */}
              {reel.isLocked && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-2 border border-red-400/50">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Trial badge */}
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-primary/80 text-black border-primary/50 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Trial
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className={`font-heading text-lg font-bold mb-2 line-clamp-2 ${reel.accentColor}`}>
                {reel.title}
              </h3>

              <div className="flex items-center justify-between mb-3 text-xs text-light-gray">
                <span className="flex items-center gap-1">
                  <span>⏱️</span>
                  {Math.floor(reel.duration / 60)}m {reel.duration % 60}s
                </span>
                <Badge variant="outline" className={getDifficultyColor(reel.difficulty)}>
                  {reel.difficulty}
                </Badge>
              </div>

              <p className="font-paragraph text-xs text-light-gray/80 mb-4 flex-1">
                Master the fundamentals of {reel.topic} with interactive lessons and quizzes.
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                <Button
                  onClick={() => setSelectedReel(reel)}
                  className="flex-1 bg-primary text-black hover:bg-primary/80 font-heading"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              {/* Anime-style bottom accent */}
              <div className={`mt-3 h-1 bg-gradient-to-r ${reel.coverColor} rounded-full opacity-50`}></div>
            </div>
          </Card>
        </motion.div>
      ))}
      
      {/* Video Player Modal */}
      {selectedReel && (
        <VideoPlayerModal
          reel={selectedReel}
          isOpen={!!selectedReel}
          onClose={() => setSelectedReel(null)}
        />
      )}
    </div>
  );
}
