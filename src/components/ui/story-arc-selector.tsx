import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Lock } from 'lucide-react';

interface StoryArc {
  id: string;
  title: string;
  emoji: string;
  description: string;
  episodes: number;
  currentEpisode: number;
  status: 'locked' | 'in-progress' | 'completed';
  color: string;
  theme: string;
}

const storyArcs: StoryArc[] = [
  {
    id: 'arc1',
    title: 'The Awakening',
    emoji: '🌅',
    description: 'Your journey begins as you discover your hidden potential',
    episodes: 5,
    currentEpisode: 3,
    status: 'in-progress',
    color: '#00FFFF',
    theme: 'Logic Kingdom'
  },
  {
    id: 'arc2',
    title: 'Mecha Rising',
    emoji: '🤖',
    description: 'Build and master mechanical systems to save the world',
    episodes: 6,
    currentEpisode: 0,
    status: 'locked',
    color: '#FF00FF',
    theme: 'Mecha Physics'
  },
  {
    id: 'arc3',
    title: 'Alchemical Secrets',
    emoji: '⚗️',
    description: 'Unlock the ancient mysteries of elemental transformation',
    episodes: 4,
    currentEpisode: 0,
    status: 'locked',
    color: '#FFFF00',
    theme: 'Alchemy Academy'
  },
  {
    id: 'arc4',
    title: 'Temporal Paradox',
    emoji: '⏰',
    description: 'Navigate through time to prevent a catastrophic future',
    episodes: 7,
    currentEpisode: 5,
    status: 'completed',
    color: '#FF6B00',
    theme: 'History Portal'
  }
];

export function StoryArcSelector() {
  const [selectedArc, setSelectedArc] = useState<string | null>(null);
  const [expandedArc, setExpandedArc] = useState<string | null>(null);

  const selectedData = storyArcs.find(a => a.id === selectedArc);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: '#00FF00' };
      case 'in-progress':
        return { label: 'In Progress', color: '#00FFFF' };
      case 'locked':
        return { label: 'Locked', color: '#FF4500' };
      default:
        return { label: 'Unknown', color: '#CCCCCC' };
    }
  };

  return (
    <div className="w-full py-24 md:py-40 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-6xl md:text-7xl text-foreground mb-4">
            STORY ARC <span className="text-primary">SELECTOR</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Choose your story arc and embark on epic narrative-driven learning adventures
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Arcs List */}
          <div className="lg:col-span-2 space-y-4">
            {storyArcs.map((arc, index) => {
              const statusBadge = getStatusBadge(arc.status);
              const isSelected = selectedArc === arc.id;
              const isExpanded = expandedArc === arc.id;

              return (
                <motion.div
                  key={arc.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => {
                    if (arc.status !== 'locked') {
                      setSelectedArc(arc.id);
                      setExpandedArc(isExpanded ? null : arc.id);
                    }
                  }}
                  className={`cursor-pointer transition-all ${arc.status === 'locked' ? 'opacity-60' : ''}`}
                >
                  <Card
                    className={`border-2 p-6 transition-all ${
                      isSelected
                        ? 'bg-dark-gray'
                        : 'bg-background/40 hover:bg-background/60'
                    }`}
                    style={{
                      borderColor: isSelected ? arc.color : '#333333'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-5xl">{arc.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading text-2xl text-foreground">
                              {arc.title}
                            </h3>
                            {arc.status === 'locked' && (
                              <Lock className="h-5 w-5 text-light-gray" />
                            )}
                          </div>
                          <p className="font-paragraph text-light-gray text-sm mb-2">
                            {arc.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge
                              style={{
                                backgroundColor: `${statusBadge.color}20`,
                                color: statusBadge.color,
                                borderColor: statusBadge.color
                              }}
                              className="border"
                            >
                              {statusBadge.label}
                            </Badge>
                            <span className="text-xs text-light-gray">
                              {arc.currentEpisode} / {arc.episodes} Episodes
                            </span>
                          </div>
                        </div>
                      </div>

                      {arc.status !== 'locked' && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Play className="h-6 w-6 text-primary" />
                        </motion.div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {arc.status !== 'locked' && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-light-gray">Progress</span>
                          <span className="text-xs font-heading" style={{ color: arc.color }}>
                            {Math.round((arc.currentEpisode / arc.episodes) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{
                              width: `${(arc.currentEpisode / arc.episodes) * 100}%`
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: arc.color }}
                          ></motion.div>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && arc.status !== 'locked' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-background/40 border-l-2 border-r-2 border-b-2 p-6 space-y-4"
                          style={{ borderColor: arc.color }}>
                          <div>
                            <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                              Episodes
                            </p>
                            <div className="grid grid-cols-5 gap-2">
                              {Array.from({ length: arc.episodes }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.05 }}
                                  className={`aspect-square rounded flex items-center justify-center font-heading text-sm border-2 ${
                                    i < arc.currentEpisode
                                      ? 'bg-background/60'
                                      : i === arc.currentEpisode
                                      ? 'bg-background/40'
                                      : 'bg-background/20 opacity-50'
                                  }`}
                                  style={{
                                    borderColor: i < arc.currentEpisode ? arc.color : '#333333'
                                  }}
                                >
                                  {i < arc.currentEpisode ? '✓' : i + 1}
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {arc.status === 'in-progress' && (
                            <Button
                              className="w-full font-heading uppercase"
                              style={{
                                backgroundColor: arc.color,
                                color: '#000000'
                              }}
                            >
                              Continue Episode {arc.currentEpisode + 1}
                            </Button>
                          )}

                          {arc.status === 'completed' && (
                            <Button
                              variant="outline"
                              className="w-full font-heading uppercase"
                              style={{
                                borderColor: arc.color,
                                color: arc.color
                              }}
                            >
                              Replay Story Arc
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Arc Summary */}
          <div>
            <AnimatePresence mode="wait">
              {selectedData ? (
                <motion.div
                  key={selectedData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="bg-dark-gray border-2 p-6" style={{ borderColor: selectedData.color }}>
                    <div className="text-center mb-6">
                      <div className="text-7xl mb-4">{selectedData.emoji}</div>
                      <h3 className="font-heading text-3xl text-foreground mb-2">
                        {selectedData.title}
                      </h3>
                      <p className="text-xs text-light-gray uppercase tracking-widest">
                        {selectedData.theme}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-background/40 rounded p-4">
                        <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                          Story Summary
                        </p>
                        <p className="font-paragraph text-foreground text-sm">
                          {selectedData.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">Total Episodes</p>
                          <p className="font-heading text-2xl" style={{ color: selectedData.color }}>
                            {selectedData.episodes}
                          </p>
                        </div>
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">Current</p>
                          <p className="font-heading text-2xl" style={{ color: selectedData.color }}>
                            {selectedData.currentEpisode}
                          </p>
                        </div>
                      </div>

                      {selectedData.status === 'in-progress' && (
                        <Button
                          className="w-full font-heading uppercase"
                          style={{
                            backgroundColor: selectedData.color,
                            color: '#000000'
                          }}
                        >
                          Continue Story
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-background/40 border border-primary/20 rounded-lg p-6 text-center h-full flex items-center justify-center"
                >
                  <p className="font-paragraph text-light-gray">
                    Select a story arc to view details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
