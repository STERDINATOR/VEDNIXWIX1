import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Heart, Share, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeReel {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  duration: number;
  thumbnail: string;
  videoSrc: string;
  description: string;
  xp: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
}

interface AnimeReelPlayerProps {
  reel: AnimeReel;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AnimeReelPlayer({ reel, onComplete, onNext, onPrevious }: AnimeReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likes);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / reel.duration) * 100;

  return (
    <div className="relative w-full max-w-md mx-auto bg-dark-gray rounded-2xl overflow-hidden border border-primary/20">
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={reel.thumbnail}
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={reel.videoSrc} type="video/mp4" />
          {/* Fallback for demo - using image */}
          <Image
            src={reel.thumbnail}
            alt={reel.title}
            width={400}
            height={600}
            className="w-full h-full object-cover"
          />
        </video>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Top Info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div>
              <Badge 
                className={`mb-2 ${
                  reel.difficulty === 'Epic' ? 'bg-secondary text-secondary-foreground' :
                  reel.difficulty === 'Hard' ? 'bg-primary text-primary-foreground' :
                  reel.difficulty === 'Medium' ? 'bg-neon-green text-black' :
                  'bg-cyber-yellow text-black'
                }`}
              >
                {reel.difficulty}
              </Badge>
              <h3 className="font-heading font-bold text-white text-lg leading-tight">
                {reel.title}
              </h3>
              <p className="font-paragraph text-light-gray text-sm">
                {reel.subject} • +{reel.xp} XP
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={togglePlay}
                    className="bg-primary/90 text-primary-foreground hover:bg-primary w-16 h-16 rounded-full"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(reel.duration)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={restart}
                  className="text-white hover:text-primary"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={togglePlay}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleLike}
                  className={`text-white hover:text-secondary ${isLiked ? 'text-secondary' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1 text-xs">{likes}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-primary"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-neon-green"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-black/30 hover:bg-black/50 text-white rounded-l flex items-center justify-center transition-colors"
          >
            ‹
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-black/30 hover:bg-black/50 text-white rounded-r flex items-center justify-center transition-colors"
          >
            ›
          </button>
        )}
      </div>

      {/* Description */}
      <div className="p-4">
        <p className="font-paragraph text-light-gray text-sm mb-3">
          {reel.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {reel.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-primary/30 text-primary text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sample data for demo
export const sampleAnimeReels: AnimeReel[] = [
  {
    id: '1',
    title: 'Quantum Physics: The Anime Way',
    subject: 'Physics',
    difficulty: 'Hard',
    duration: 45,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_b58762dfa9f14bfc85a23e2d1ed6f14e~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/quantum-physics-anime.mp4',
    description: 'Dive into the quantum realm with our anime heroes as they explore wave-particle duality!',
    xp: 150,
    likes: 1247,
    isLiked: false,
    tags: ['quantum', 'physics', 'anime', 'science']
  },
  {
    id: '2',
    title: 'JavaScript Jutsu: Array Methods',
    subject: 'Programming',
    difficulty: 'Medium',
    duration: 60,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_fdc74db31b2e419e886d0d837677c45b~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/javascript-jutsu.mp4',
    description: 'Master the ancient art of JavaScript array methods with ninja-level precision!',
    xp: 100,
    likes: 892,
    isLiked: true,
    tags: ['javascript', 'programming', 'arrays', 'coding']
  },
  {
    id: '3',
    title: 'Calculus Chronicles: Derivatives',
    subject: 'Mathematics',
    difficulty: 'Epic',
    duration: 90,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_6a12baa62b9646ca9bf288b2c3fc3f67~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/calculus-chronicles.mp4',
    description: 'Join our mathematical mages as they unlock the secrets of derivatives and rates of change!',
    xp: 200,
    likes: 2156,
    isLiked: false,
    tags: ['calculus', 'mathematics', 'derivatives', 'math']
  },
  {
    id: '4',
    title: 'Chemistry Chaos: Molecular Bonds',
    subject: 'Chemistry',
    difficulty: 'Medium',
    duration: 55,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_0e891d69bf5b411298b43710343965e1~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/chemistry-chaos.mp4',
    description: 'Witness explosive reactions as anime alchemists demonstrate molecular bonding!',
    xp: 120,
    likes: 1456,
    isLiked: false,
    tags: ['chemistry', 'molecules', 'bonds', 'science']
  },
  {
    id: '5',
    title: 'History Heroes: Ancient Civilizations',
    subject: 'History',
    difficulty: 'Easy',
    duration: 40,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_e49d00d625444340bdd5ecbfef5d7c03~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/history-heroes.mp4',
    description: 'Travel through time with anime warriors exploring ancient civilizations!',
    xp: 80,
    likes: 987,
    isLiked: true,
    tags: ['history', 'ancient', 'civilizations', 'time-travel']
  }
];

interface AnimeReelFeedProps {
  reels?: AnimeReel[];
  className?: string;
}

export function AnimeReelFeed({ reels = sampleAnimeReels, className = '' }: AnimeReelFeedProps) {
  const [currentReel, setCurrentReel] = useState(0);

  const nextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleComplete = () => {
    // Auto-advance to next reel after completion
    setTimeout(nextReel, 1000);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center">
        <AnimeReelPlayer
          reel={reels[currentReel]}
          onComplete={handleComplete}
          onNext={nextReel}
          onPrevious={prevReel}
        />
      </div>
      
      {/* Reel Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {reels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReel(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentReel ? 'bg-primary' : 'bg-light-gray/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}