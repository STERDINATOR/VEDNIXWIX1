import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Lock, Play } from 'lucide-react';

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  duration: number;
  xpReward: number;
  difficulty: string;
}

const episodes: Episode[] = [
  {
    id: 'ep1',
    number: 1,
    title: 'The Beginning',
    description: 'Meet your mentor and learn the basics of logic',
    status: 'completed',
    duration: 15,
    xpReward: 100,
    difficulty: 'Beginner'
  },
  {
    id: 'ep2',
    number: 2,
    title: 'First Challenge',
    description: 'Solve your first logic puzzle and prove your worth',
    status: 'completed',
    duration: 20,
    xpReward: 150,
    difficulty: 'Beginner'
  },
  {
    id: 'ep3',
    number: 3,
    title: 'The Awakening',
    description: 'Discover your hidden potential and unlock new abilities',
    status: 'in-progress',
    duration: 25,
    xpReward: 200,
    difficulty: 'Intermediate'
  },
  {
    id: 'ep4',
    number: 4,
    title: 'Boss Battle',
    description: 'Face the Logic Guardian in an epic confrontation',
    status: 'available',
    duration: 30,
    xpReward: 300,
    difficulty: 'Intermediate'
  },
  {
    id: 'ep5',
    number: 5,
    title: 'The Final Test',
    description: 'Master all knowledge and become a Logic Master',
    status: 'locked',
    duration: 35,
    xpReward: 500,
    difficulty: 'Advanced'
  }
];

export function EpisodeProgressionTimeline() {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const selectedData = episodes.find(e => e.id === selectedEpisode);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#00FF00';
      case 'in-progress':
        return '#00FFFF';
      case 'available':
        return '#FFFF00';
      case 'locked':
        return '#FF4500';
      default:
        return '#CCCCCC';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5" />;
      case 'in-progress':
        return <Play className="h-5 w-5" />;
      case 'locked':
        return <Lock className="h-5 w-5" />;
      default:
        return null;
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
            EPISODE <span className="text-primary">PROGRESSION</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Track your journey through each episode. Complete challenges to unlock new content.
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setViewMode('timeline')}
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            className={viewMode === 'timeline' ? 'bg-primary text-primary-foreground' : 'border-primary text-primary'}
          >
            Timeline View
          </Button>
          <Button
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'border-primary text-primary'}
          >
            Grid View
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline/Grid Container */}
          <div className="lg:col-span-2">
            {viewMode === 'timeline' ? (
              // Timeline View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-cyber-yellow"></div>

                {/* Episodes */}
                <div className="space-y-8">
                  {episodes.map((episode, index) => {
                    const statusColor = getStatusColor(episode.status);
                    const isSelected = selectedEpisode === episode.id;

                    return (
                      <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => setSelectedEpisode(episode.id)}
                        className="relative pl-24 cursor-pointer"
                      >
                        {/* Timeline Dot */}
                        <motion.div
                          animate={isSelected ? { scale: 1.3 } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center border-4 bg-background"
                          style={{
                            borderColor: statusColor,
                            boxShadow: isSelected ? `0 0 20px ${statusColor}` : 'none'
                          }}
                        >
                          <div className="text-2xl">{getStatusIcon(episode.status)}</div>
                        </motion.div>

                        {/* Episode Card */}
                        <Card
                          className={`border-2 p-6 transition-all ${
                            isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                          }`}
                          style={{
                            borderColor: isSelected ? statusColor : '#333333'
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-heading text-xl text-foreground">
                                Episode {episode.number}: {episode.title}
                              </h3>
                              <p className="font-paragraph text-light-gray text-sm mt-1">
                                {episode.description}
                              </p>
                            </div>
                            <Badge
                              style={{
                                backgroundColor: `${statusColor}20`,
                                color: statusColor,
                                borderColor: statusColor
                              }}
                              className="border whitespace-nowrap ml-4"
                            >
                              {episode.status.replace('-', ' ')}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="text-light-gray">
                              ⏱️ {episode.duration} min
                            </span>
                            <span style={{ color: statusColor }} className="font-heading">
                              +{episode.xpReward} XP
                            </span>
                            <span className="text-light-gray">
                              {episode.difficulty}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // Grid View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {episodes.map((episode, index) => {
                  const statusColor = getStatusColor(episode.status);
                  const isSelected = selectedEpisode === episode.id;

                  return (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onClick={() => setSelectedEpisode(episode.id)}
                      className="cursor-pointer"
                    >
                      <Card
                        className={`border-2 p-4 text-center transition-all h-full flex flex-col items-center justify-center ${
                          isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                        }`}
                        style={{
                          borderColor: isSelected ? statusColor : '#333333',
                          boxShadow: isSelected ? `0 0 20px ${statusColor}40` : 'none'
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2"
                          style={{
                            borderColor: statusColor,
                            backgroundColor: `${statusColor}20`
                          }}
                        >
                          <span className="font-heading text-lg">{episode.number}</span>
                        </div>
                        <h3 className="font-heading text-sm text-foreground mb-2">
                          {episode.title}
                        </h3>
                        <p className="text-xs text-light-gray mb-3">
                          {episode.duration} min
                        </p>
                        <Badge
                          style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                            borderColor: statusColor
                          }}
                          className="border text-xs"
                        >
                          {episode.status.replace('-', ' ')}
                        </Badge>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Episode Details */}
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
                  <Card
                    className="bg-dark-gray border-2 p-6"
                    style={{ borderColor: getStatusColor(selectedData.status) }}
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">📺</div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        Episode {selectedData.number}
                      </h3>
                      <h4 className="font-heading text-lg text-primary mb-3">
                        {selectedData.title}
                      </h4>
                      <p className="font-paragraph text-light-gray text-sm">
                        {selectedData.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">Duration</p>
                          <p className="font-heading text-lg" style={{ color: getStatusColor(selectedData.status) }}>
                            {selectedData.duration}m
                          </p>
                        </div>
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">XP Reward</p>
                          <p className="font-heading text-lg" style={{ color: getStatusColor(selectedData.status) }}>
                            +{selectedData.xpReward}
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/40 rounded p-3 text-center">
                        <p className="text-xs text-light-gray mb-1">Difficulty</p>
                        <p className="font-heading text-sm" style={{ color: getStatusColor(selectedData.status) }}>
                          {selectedData.difficulty}
                        </p>
                      </div>

                      {selectedData.status === 'in-progress' && (
                        <Button
                          className="w-full font-heading uppercase"
                          style={{
                            backgroundColor: getStatusColor(selectedData.status),
                            color: '#000000'
                          }}
                        >
                          Continue Episode
                        </Button>
                      )}

                      {selectedData.status === 'available' && (
                        <Button
                          className="w-full font-heading uppercase"
                          style={{
                            backgroundColor: getStatusColor(selectedData.status),
                            color: '#000000'
                          }}
                        >
                          Start Episode
                        </Button>
                      )}

                      {selectedData.status === 'completed' && (
                        <Button
                          variant="outline"
                          className="w-full font-heading uppercase"
                          style={{
                            borderColor: getStatusColor(selectedData.status),
                            color: getStatusColor(selectedData.status)
                          }}
                        >
                          Replay Episode
                        </Button>
                      )}

                      {selectedData.status === 'locked' && (
                        <Button
                          disabled
                          className="w-full font-heading uppercase opacity-50"
                        >
                          Locked
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
                    Select an episode to view details
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
