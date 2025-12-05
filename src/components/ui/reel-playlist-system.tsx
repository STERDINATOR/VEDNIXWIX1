import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Plus, Trash2, Share2, Lock } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  reelCount: number;
  duration: number;
  difficulty: string;
  progress: number;
  isWeakTopics: boolean;
  createdBy: string;
  reels: string[];
}

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Algebra Fundamentals',
    description: 'Master the basics of algebra',
    emoji: '📐',
    color: '#00FFFF',
    reelCount: 8,
    duration: 24,
    difficulty: 'Easy',
    progress: 75,
    isWeakTopics: false,
    createdBy: 'Teacher Sarah',
    reels: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8']
  },
  {
    id: '2',
    name: 'Your Weak Topics',
    description: 'AI-generated playlist for topics you struggle with',
    emoji: '⚠️',
    color: '#FF4500',
    reelCount: 5,
    duration: 15,
    difficulty: 'Medium',
    progress: 40,
    isWeakTopics: true,
    createdBy: 'AI System',
    reels: ['r9', 'r10', 'r11', 'r12', 'r13']
  },
  {
    id: '3',
    name: 'Calculus Deep Dive',
    description: 'Advanced calculus concepts and applications',
    emoji: '📈',
    color: '#FF00FF',
    reelCount: 12,
    duration: 36,
    difficulty: 'Hard',
    progress: 25,
    isWeakTopics: false,
    createdBy: 'Teacher Mike',
    reels: ['r14', 'r15', 'r16', 'r17', 'r18', 'r19', 'r20', 'r21', 'r22', 'r23', 'r24', 'r25']
  },
  {
    id: '4',
    name: 'Statistics Essentials',
    description: 'Probability and statistics fundamentals',
    emoji: '📊',
    color: '#00FF00',
    reelCount: 6,
    duration: 18,
    difficulty: 'Medium',
    progress: 60,
    isWeakTopics: false,
    createdBy: 'Teacher Lisa',
    reels: ['r26', 'r27', 'r28', 'r29', 'r30', 'r31']
  }
];

export function ReelPlaylistSystem() {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handlePlayPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter(p => p.id !== playlistId));
  };

  return (
    <div className="w-full py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-heading text-3xl text-foreground mb-2">
          Reel Playlists
        </h3>
        <p className="text-light-gray">
          Curated learning paths and AI-generated weak topic playlists
        </p>
      </motion.div>

      {/* Create Playlist Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Playlist
        </Button>
      </motion.div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className="bg-dark-gray border-2 overflow-hidden hover:border-primary/60 transition-all group"
                style={{ borderColor: playlist.color + '40' }}
              >
                {/* Playlist Header */}
                <div
                  className="h-32 flex items-center justify-center text-5xl relative overflow-hidden"
                  style={{ backgroundColor: playlist.color + '20' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {playlist.emoji}
                  </motion.div>

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
                  >
                    <Button
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  {/* Weak Topics Badge */}
                  {playlist.isWeakTopics && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <Badge className="bg-destructive text-destructive-foreground">
                        AI Generated
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Playlist Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-1">
                      {playlist.name}
                    </h4>
                    <p className="text-xs text-light-gray">
                      {playlist.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      {playlist.reelCount} reels
                    </Badge>
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      {playlist.duration}m
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-xs"
                      style={{ color: playlist.color }}
                    >
                      {playlist.difficulty}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-light-gray">Progress</span>
                      <span className="text-xs font-heading text-primary">
                        {playlist.progress}%
                      </span>
                    </div>
                    <Progress value={playlist.progress} className="h-2" />
                  </div>

                  {/* Creator */}
                  <p className="text-xs text-light-gray">
                    By <span className="font-heading text-foreground">{playlist.createdBy}</span>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-primary/20">
                    <Button
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                    >
                      <Play className="w-3 h-3 mr-1 fill-current" />
                      Play
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-background/40 text-light-gray hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected Playlist Details */}
      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedPlaylist.emoji}</div>
                  <div>
                    <h4 className="font-heading text-2xl text-foreground">
                      {selectedPlaylist.name}
                    </h4>
                    <p className="text-light-gray">
                      {selectedPlaylist.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedPlaylist(null)}
                  variant="outline"
                  className="border-primary/30 text-primary"
                >
                  Close
                </Button>
              </div>

              {/* Playlist Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-background/40 rounded p-3 text-center">
                  <p className="text-xs text-light-gray mb-1">Reels</p>
                  <p className="font-heading text-2xl text-primary">
                    {selectedPlaylist.reelCount}
                  </p>
                </div>
                <div className="bg-background/40 rounded p-3 text-center">
                  <p className="text-xs text-light-gray mb-1">Duration</p>
                  <p className="font-heading text-2xl text-secondary">
                    {selectedPlaylist.duration}m
                  </p>
                </div>
                <div className="bg-background/40 rounded p-3 text-center">
                  <p className="text-xs text-light-gray mb-1">Progress</p>
                  <p className="font-heading text-2xl text-cyber-yellow">
                    {selectedPlaylist.progress}%
                  </p>
                </div>
                <div className="bg-background/40 rounded p-3 text-center">
                  <p className="text-xs text-light-gray mb-1">Difficulty</p>
                  <p className="font-heading text-2xl" style={{ color: selectedPlaylist.color }}>
                    {selectedPlaylist.difficulty}
                  </p>
                </div>
              </div>

              {/* Play Button */}
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase py-6 text-lg">
                <Play className="w-6 h-6 mr-2 fill-current" />
                Start Watching Playlist
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
