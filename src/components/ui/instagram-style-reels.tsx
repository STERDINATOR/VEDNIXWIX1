import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import {
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  MoreVertical,
  Play,
  Volume2,
  VolumeX,
  X,
  Eye,
  Zap,
  Copy,
  Check
} from 'lucide-react';

interface InstagramReel {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  duration: number;
  coverImage: string;
  topicIcon: string;
  description: string;
  videoUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  saveCount?: number;
  xpReward?: number;
}

interface InstagramStyleReelsProps {
  reels: InstagramReel[];
  onPlayReel?: (reelId: string) => void;
  onMentorAccess?: (reelId: string) => void;
}

export function InstagramStyleReels({
  reels,
  onPlayReel,
  onMentorAccess
}: InstagramStyleReelsProps) {
  const [selectedReel, setSelectedReel] = useState<InstagramReel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<string>>(new Set());
  const [shareMessage, setShareMessage] = useState('');
  const [currentLikes, setCurrentLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    reels.forEach(reel => {
      initialLikes[reel.id] = reel.likeCount || 0;
    });
    setCurrentLikes(initialLikes);
  }, [reels]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30';
      case 'Medium': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'Hard': return 'bg-primary/20 text-primary border-primary/30';
      case 'Epic': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-light-gray/20 text-light-gray border-light-gray/30';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = (reelId: string) => {
    if (likedReels.has(reelId)) {
      likedReels.delete(reelId);
      setCurrentLikes(prev => ({
        ...prev,
        [reelId]: (prev[reelId] || 0) - 1
      }));
    } else {
      likedReels.add(reelId);
      setCurrentLikes(prev => ({
        ...prev,
        [reelId]: (prev[reelId] || 0) + 1
      }));
    }
    setLikedReels(new Set(likedReels));
  };

  const handleSave = (reelId: string) => {
    if (savedReels.has(reelId)) {
      savedReels.delete(reelId);
    } else {
      savedReels.add(reelId);
    }
    setSavedReels(new Set(savedReels));
  };

  const handleShare = (reel: InstagramReel) => {
    const shareText = `Check out this amazing reel: ${reel.title} - Learn ${reel.topic}! 🎓`;
    navigator.clipboard.writeText(shareText);
    setShareMessage('Copied to clipboard!');
    setTimeout(() => setShareMessage(''), 2000);
  };

  return (
    <div className="w-full bg-background">
      {/* Main Reels Grid - Instagram Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6 max-w-[120rem] mx-auto">
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedReel(reel)}
            className="cursor-pointer group"
          >
            <Card className="bg-dark-gray border-primary/20 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
              {/* Cover Image Container */}
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {/* Anime-style background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-cyber-yellow/10"></div>

                {/* Cover Image */}
                <Image
                  src={reel.coverImage}
                  alt={reel.title}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/30 to-transparent"></div>

                {/* Topic Icon Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-3 left-3 text-4xl filter drop-shadow-lg"
                >
                  {reel.topicIcon}
                </motion.div>

                {/* Duration Badge */}
                <Badge className="absolute bottom-3 right-3 bg-black/70 text-foreground border-0 font-heading">
                  ⏱️ {formatDuration(reel.duration)}
                </Badge>

                {/* Difficulty Badge */}
                <Badge className={`absolute bottom-3 left-3 border font-heading ${getDifficultyColor(reel.difficulty)}`}>
                  {reel.difficulty}
                </Badge>

                {/* Play Button Overlay */}
                <AnimatePresence>
                  {!selectedReel && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-primary/50 hover:shadow-2xl transition-all duration-300"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                {/* Title and Topic */}
                <div>
                  <h3 className="font-heading font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {reel.title}
                  </h3>
                  <p className="text-sm font-paragraph text-light-gray mt-1">{reel.topic}</p>
                </div>

                {/* Description */}
                <p className="text-xs font-paragraph text-light-gray line-clamp-2 my-3">
                  {reel.description}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-light-gray py-3 border-t border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Eye className="h-3 w-3" />
                      <span>{(reel.viewCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Heart className="h-3 w-3" />
                      <span>{(currentLikes[reel.id] || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <MessageCircle className="h-3 w-3" />
                      <span>{(reel.commentCount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
                    <Zap className="h-2 w-2 mr-1" />
                    +{reel.xpReward || Math.floor(reel.duration / 60)} XP
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(reel.id);
                      }}
                      variant="outline"
                      size="sm"
                      className={`w-full border transition-all duration-300 ${
                        likedReels.has(reel.id)
                          ? 'bg-secondary/20 border-secondary/50 text-secondary'
                          : 'border-primary/20 text-light-gray hover:text-foreground'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${likedReels.has(reel.id) ? 'fill-secondary' : ''}`} />
                      <span className="text-xs font-heading">Like</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(reel.id);
                      }}
                      variant="outline"
                      size="sm"
                      className={`w-full border transition-all duration-300 ${
                        savedReels.has(reel.id)
                          ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
                          : 'border-primary/20 text-light-gray hover:text-foreground'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 mr-1 ${savedReels.has(reel.id) ? 'fill-neon-green' : ''}`} />
                      <span className="text-xs font-heading">Save</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(reel);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 text-light-gray hover:text-foreground"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      <span className="text-xs font-heading">Share</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMentorAccess?.(reel.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-secondary/20 text-secondary hover:bg-secondary/10"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs font-heading">Mentor</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Reel Viewer Modal */}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl h-[90vh] flex flex-col bg-dark-gray border border-primary/20 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-dark-gray/50">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedReel.topicIcon}</div>
                  <div>
                    <h2 className="font-heading font-bold text-foreground">{selectedReel.title}</h2>
                    <p className="text-xs text-light-gray">{selectedReel.topic}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReel(null)}
                  className="text-light-gray hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Video/Cover Area */}
              <div className="flex-1 relative bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedReel.coverImage}
                  alt={selectedReel.title}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-transparent to-transparent flex flex-col justify-between p-6">
                  {/* Top Controls */}
                  <div className="flex items-center justify-between">
                    <Badge className={`border font-heading ${getDifficultyColor(selectedReel.difficulty)}`}>
                      {selectedReel.difficulty}
                    </Badge>
                    <Badge className="bg-black/70 text-foreground border-0 font-heading">
                      ⏱️ {formatDuration(selectedReel.duration)}
                    </Badge>
                  </div>

                  {/* Bottom Controls */}
                  <div className="space-y-4">
                    {/* Play/Pause and Mute */}
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-primary/50 hover:shadow-2xl transition-all duration-300"
                      >
                        {isPlaying ? (
                          <div className="w-0 h-0 border-l-4 border-l-primary-foreground border-t-3 border-t-transparent border-b-3 border-b-transparent ml-1"></div>
                        ) : (
                          <Play className="h-6 w-6 fill-current" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 rounded-full bg-black/50 text-foreground hover:bg-black/70 transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </motion.button>
                    </div>

                    {/* Description and Stats */}
                    <div className="bg-black/70 rounded-lg p-4 space-y-3">
                      <p className="font-paragraph text-foreground text-sm">{selectedReel.description}</p>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-heading font-bold text-primary">
                            {(selectedReel.viewCount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-light-gray">Views</p>
                        </div>
                        <div>
                          <p className="text-2xl font-heading font-bold text-secondary">
                            {(currentLikes[selectedReel.id] || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-light-gray">Likes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-heading font-bold text-neon-green">
                            +{selectedReel.xpReward || Math.floor(selectedReel.duration / 60)}
                          </p>
                          <p className="text-xs text-light-gray">XP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="p-4 border-t border-primary/20 bg-dark-gray/50 space-y-3">
                {/* Main Actions */}
                <div className="grid grid-cols-4 gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleLike(selectedReel.id)}
                      className={`w-full transition-all duration-300 ${
                        likedReels.has(selectedReel.id)
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${likedReels.has(selectedReel.id) ? 'fill-current' : ''}`} />
                      Like
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleSave(selectedReel.id)}
                      className={`w-full transition-all duration-300 ${
                        savedReels.has(selectedReel.id)
                          ? 'bg-neon-green text-black'
                          : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${savedReels.has(selectedReel.id) ? 'fill-current' : ''}`} />
                      Save
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleShare(selectedReel)}
                      className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => {
                        onMentorAccess?.(selectedReel.id);
                        setSelectedReel(null);
                      }}
                      className="w-full bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mentor
                    </Button>
                  </motion.div>
                </div>

                {/* Share Confirmation */}
                <AnimatePresence>
                  {shareMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-heading flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {shareMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
