import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import {
  Heart,
  Share2,
  Bookmark,
  RotateCcw,
  MessageCircle,
  Eye,
  Zap,
  Copy,
  Check,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface ReelCardEnhancedProps {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  duration: number;
  coverImage: string;
  topicIcon: string;
  topicColor: string;
  description?: string;
  viewCount?: number;
  likeCount?: number;
  saveCount?: number;
  onPlay?: () => void;
  onMentorAccess?: () => void;
  onExplainDifferently?: () => void;
}

export function ReelCardEnhanced({
  id,
  title,
  topic,
  difficulty,
  duration,
  coverImage,
  topicIcon,
  topicColor,
  description,
  viewCount = 0,
  likeCount = 0,
  saveCount = 0,
  onPlay,
  onMentorAccess,
  onExplainDifferently
}: ReelCardEnhancedProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likeCount);
  const [currentSaves, setCurrentSaves] = useState(saveCount);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30';
      case 'Medium': return 'text-neon-green bg-neon-green/10 border-neon-green/30';
      case 'Hard': return 'text-primary bg-primary/10 border-primary/30';
      case 'Epic': return 'text-secondary bg-secondary/10 border-secondary/30';
      default: return 'text-light-gray bg-light-gray/10 border-light-gray/30';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setCurrentSaves(isSaved ? currentSaves - 1 : currentSaves + 1);
  };

  const handleShare = (platform: string) => {
    const shareText = `Check out this amazing reel: ${title} - Learn ${topic}!`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`, '_blank');
    }
    
    setShowShareMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="bg-dark-gray border-primary/20 overflow-hidden hover:border-primary/50 transition-all duration-300 group">
        {/* Cover Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          {/* Anime-style background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${topicColor} opacity-40`}></div>
          
          {/* Cover Image */}
          <Image
            src={coverImage}
            alt={title}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-transparent to-transparent"></div>

          {/* Topic Icon Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-3 left-3 text-4xl filter drop-shadow-lg"
          >
            {topicIcon}
          </motion.div>

          {/* Duration Badge */}
          <Badge className="absolute bottom-3 right-3 bg-black/60 text-foreground border-0">
            ⏱️ {formatDuration(duration)}
          </Badge>

          {/* Difficulty Badge */}
          <Badge className={`absolute bottom-3 left-3 border ${getDifficultyColor()}`}>
            {difficulty}
          </Badge>

          {/* Play Button Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlay}
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-primary/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-0 h-0 border-l-8 border-l-primary-foreground border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm font-paragraph text-light-gray mt-1">{topic}</p>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs font-paragraph text-light-gray line-clamp-2">
              {description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-light-gray pt-2 border-t border-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{currentLikes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="h-3 w-3" />
                <span>{currentSaves.toLocaleString()}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs border-primary/20 text-primary">
              <Zap className="h-2 w-2 mr-1" />
              +{Math.floor(duration / 60)} XP
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {/* Like Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleLike}
                variant="outline"
                size="sm"
                className={`w-full border transition-all duration-300 ${
                  isLiked
                    ? 'bg-secondary/20 border-secondary/50 text-secondary'
                    : 'border-primary/20 text-light-gray hover:text-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-secondary' : ''}`} />
                <span className="text-xs font-heading">Like</span>
              </Button>
            </motion.div>

            {/* Save Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                className={`w-full border transition-all duration-300 ${
                  isSaved
                    ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
                    : 'border-primary/20 text-light-gray hover:text-foreground'
                }`}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-neon-green' : ''}`} />
                <span className="text-xs font-heading">Save</span>
              </Button>
            </motion.div>

            {/* Share Button */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/20 text-light-gray hover:text-foreground"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="text-xs font-heading">Share</span>
                </Button>
              </motion.div>

              {/* Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-dark-gray border border-primary/20 rounded-lg overflow-hidden z-10 shadow-lg"
                  >
                    <Button
                      onClick={() => handleShare('copy')}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-light-gray hover:text-foreground hover:bg-primary/10 rounded-none"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      <span className="text-xs">Copy Link</span>
                    </Button>
                    <Button
                      onClick={() => handleShare('twitter')}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-light-gray hover:text-foreground hover:bg-primary/10 rounded-none"
                    >
                      <span className="text-xs mr-2">𝕏</span>
                      <span className="text-xs">Share on X</span>
                    </Button>
                    <Button
                      onClick={() => handleShare('facebook')}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-light-gray hover:text-foreground hover:bg-primary/10 rounded-none"
                    >
                      <span className="text-xs mr-2">f</span>
                      <span className="text-xs">Share on Facebook</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share Confirmation */}
              <AnimatePresence>
                {shareMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-heading whitespace-nowrap flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    {shareMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Replay Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onPlay}
                variant="outline"
                size="sm"
                className="w-full border-primary/20 text-light-gray hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                <span className="text-xs font-heading">Replay</span>
              </Button>
            </motion.div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
            {/* Explain Differently */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onExplainDifferently}
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:bg-primary/10 border border-primary/20"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                <span className="text-xs font-heading">Explain</span>
              </Button>
            </motion.div>

            {/* Mentor Access */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onMentorAccess}
                variant="ghost"
                size="sm"
                className="w-full text-secondary hover:bg-secondary/10 border border-secondary/20"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                <span className="text-xs font-heading">Mentor</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
