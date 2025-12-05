import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Portal {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  mode: string;
  difficulty: string;
  rewards: string;
  active: boolean;
}

const portals: Portal[] = [
  {
    id: 'standard',
    name: 'Standard Universe',
    emoji: '🌍',
    description: 'The original learning experience with balanced difficulty',
    color: '#00FFFF',
    mode: 'Standard',
    difficulty: 'Medium',
    rewards: 'Normal XP',
    active: true
  },
  {
    id: 'hardcore',
    name: 'Hardcore Universe',
    emoji: '💀',
    description: 'Extreme challenges with permadeath mechanics',
    color: '#FF0000',
    mode: 'Hardcore',
    difficulty: 'Extreme',
    rewards: '2x XP',
    active: true
  },
  {
    id: 'speedrun',
    name: 'Speedrun Universe',
    emoji: '⚡',
    description: 'Race against time with rapid-fire questions',
    color: '#FFFF00',
    mode: 'Speedrun',
    difficulty: 'Hard',
    rewards: '1.5x XP',
    active: true
  },
  {
    id: 'sandbox',
    name: 'Sandbox Universe',
    emoji: '🏗️',
    description: 'Create your own learning path with unlimited freedom',
    color: '#FF00FF',
    mode: 'Sandbox',
    difficulty: 'Custom',
    rewards: 'Variable',
    active: true
  },
  {
    id: 'coop',
    name: 'Co-op Universe',
    emoji: '👥',
    description: 'Team up with friends for collaborative learning',
    color: '#00FF00',
    mode: 'Co-op',
    difficulty: 'Medium',
    rewards: 'Shared XP',
    active: false
  },
  {
    id: 'story',
    name: 'Story Universe',
    emoji: '📖',
    description: 'Immersive narrative-driven learning experience',
    color: '#FF6B00',
    mode: 'Story',
    difficulty: 'Easy',
    rewards: 'Story XP',
    active: true
  }
];

export function MultiversePortal() {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [enteredPortal, setEnteredPortal] = useState<string | null>(null);

  const selectedData = portals.find(p => p.id === selectedPortal);

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
            MULTIVERSE <span className="text-primary">PORTAL</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Access alternate lesson modes and universes. Each portal offers unique challenges and rewards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portal Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {portals.map((portal, index) => {
                const isSelected = selectedPortal === portal.id;
                const isHovered = hoveredPortal === portal.id;
                const isEntered = enteredPortal === portal.id;

                return (
                  <motion.div
                    key={portal.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredPortal(portal.id)}
                    onMouseLeave={() => setHoveredPortal(null)}
                    onClick={() => setSelectedPortal(portal.id)}
                    className={`cursor-pointer transition-all ${!portal.active ? 'opacity-60' : ''}`}
                  >
                    <Card
                      className={`border-2 p-6 transition-all relative overflow-hidden h-full ${
                        isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                      }`}
                      style={{
                        borderColor: isSelected || isHovered ? portal.color : '#333333'
                      }}
                    >
                      {/* Portal Glow Effect */}
                      <motion.div
                        animate={isHovered ? { scale: 1.5, opacity: 0.3 } : { scale: 1, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 rounded-lg"
                        style={{ backgroundColor: portal.color }}
                      ></motion.div>

                      <div className="relative z-10">
                        {/* Portal Emoji */}
                        <motion.div
                          animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-6xl mb-4"
                        >
                          {portal.emoji}
                        </motion.div>

                        {/* Portal Info */}
                        <h3 className="font-heading text-2xl text-foreground mb-2">
                          {portal.name}
                        </h3>
                        <p className="font-paragraph text-light-gray text-sm mb-4">
                          {portal.description}
                        </p>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-4">
                          {portal.active ? (
                            <Badge
                              style={{
                                backgroundColor: `${portal.color}20`,
                                color: portal.color,
                                borderColor: portal.color
                              }}
                              className="border"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              style={{
                                backgroundColor: '#FF450020',
                                color: '#FF4500',
                                borderColor: '#FF4500'
                              }}
                              className="border"
                            >
                              Coming Soon
                            </Badge>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-background/40 rounded p-2">
                            <p className="text-light-gray mb-1">Mode</p>
                            <p className="font-heading" style={{ color: portal.color }}>
                              {portal.mode}
                            </p>
                          </div>
                          <div className="bg-background/40 rounded p-2">
                            <p className="text-light-gray mb-1">Difficulty</p>
                            <p className="font-heading" style={{ color: portal.color }}>
                              {portal.difficulty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Portal Details */}
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
                    {/* Portal Visualization */}
                    <div className="relative mb-6 h-40 rounded-lg overflow-hidden border-2" style={{ borderColor: selectedData.color }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 flex items-center justify-center text-8xl"
                        style={{ backgroundColor: `${selectedData.color}10` }}
                      >
                        {selectedData.emoji}
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>

                    <h3 className="font-heading text-2xl text-foreground mb-2">
                      {selectedData.name}
                    </h3>
                    <p className="font-paragraph text-light-gray text-sm mb-6">
                      {selectedData.description}
                    </p>

                    {/* Portal Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="bg-background/40 rounded p-3">
                        <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                          Mode Type
                        </p>
                        <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                          {selectedData.mode}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/40 rounded p-3">
                          <p className="text-xs text-light-gray mb-1">Difficulty</p>
                          <p className="font-heading" style={{ color: selectedData.color }}>
                            {selectedData.difficulty}
                          </p>
                        </div>
                        <div className="bg-background/40 rounded p-3">
                          <p className="text-xs text-light-gray mb-1">Rewards</p>
                          <p className="font-heading" style={{ color: selectedData.color }}>
                            {selectedData.rewards}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {selectedData.active ? (
                      <Button
                        onClick={() => setEnteredPortal(selectedData.id)}
                        className="w-full font-heading uppercase"
                        style={{
                          backgroundColor: selectedData.color,
                          color: '#000000'
                        }}
                      >
                        Enter Portal
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full font-heading uppercase opacity-50"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </Card>

                  {/* Portal Entered Animation */}
                  <AnimatePresence>
                    {enteredPortal === selectedData.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 backdrop-blur-md border-2 border-neon-green rounded-lg p-6 text-center"
                        style={{ borderColor: selectedData.color }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-6xl mb-4"
                        >
                          ✨
                        </motion.div>
                        <h4 className="font-heading text-xl text-foreground mb-2">
                          Portal Activated!
                        </h4>
                        <p className="font-paragraph text-light-gray text-sm mb-4">
                          You are entering the {selectedData.name}
                        </p>
                        <motion.div
                          animate={{ width: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-1 rounded-full"
                          style={{ backgroundColor: selectedData.color }}
                        ></motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-background/40 border border-primary/20 rounded-lg p-6 text-center h-full flex items-center justify-center"
                >
                  <p className="font-paragraph text-light-gray">
                    Select a portal to explore
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
