import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Shard {
  id: string;
  name: string;
  emoji: string;
  concept: string;
  mastery: number;
  connections: string[];
  color: string;
  description: string;
}

const shards: Shard[] = [
  {
    id: 'recursion',
    name: 'Recursion Shard',
    emoji: '🔄',
    concept: 'Recursion',
    mastery: 85,
    connections: ['loops', 'functions'],
    color: '#00FFFF',
    description: 'Functions calling themselves to solve problems'
  },
  {
    id: 'loops',
    name: 'Loop Shard',
    emoji: '🔁',
    concept: 'Iteration',
    mastery: 90,
    connections: ['recursion', 'arrays'],
    color: '#FFFF00',
    description: 'Repeating code blocks for efficiency'
  },
  {
    id: 'functions',
    name: 'Function Shard',
    emoji: '⚙️',
    concept: 'Functions',
    mastery: 88,
    connections: ['recursion', 'variables'],
    color: '#00FF00',
    description: 'Reusable blocks of code'
  },
  {
    id: 'arrays',
    name: 'Array Shard',
    emoji: '📦',
    concept: 'Data Structures',
    mastery: 75,
    connections: ['loops', 'variables'],
    color: '#FF00FF',
    description: 'Collections of data elements'
  },
  {
    id: 'variables',
    name: 'Variable Shard',
    emoji: '📝',
    concept: 'Variables',
    mastery: 95,
    connections: ['functions', 'arrays'],
    color: '#FF6B00',
    description: 'Named containers for data'
  },
  {
    id: 'logic',
    name: 'Logic Shard',
    emoji: '⚡',
    concept: 'Boolean Logic',
    mastery: 82,
    connections: ['variables', 'loops'],
    color: '#FF00FF',
    description: 'True/false decision making'
  }
];

export function QuantumLearningShard() {
  const [selectedShard, setSelectedShard] = useState<string | null>(null);
  const [hoveredShard, setHoveredShard] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  const selectedData = shards.find(s => s.id === selectedShard);

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
            QUANTUM <span className="text-primary">LEARNING SHARDS</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Micro-cores of knowledge. Each shard represents a fundamental concept that connects to others.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shard Network */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-md border-2 border-primary/30 rounded-lg p-8 aspect-video"
            >
              {/* Shard Nodes */}
              <div className="relative h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  {/* Connection Lines */}
                  {shards.map((shard, index) => {
                    const angle = (index / shards.length) * Math.PI * 2;
                    const x = 50 + 35 * Math.cos(angle);
                    const y = 50 + 35 * Math.sin(angle);

                    return shard.connections.map((connectedId) => {
                      const connectedShard = shards.find(s => s.id === connectedId);
                      if (!connectedShard) return null;
                      const connectedIndex = shards.indexOf(connectedShard);
                      const connectedAngle = (connectedIndex / shards.length) * Math.PI * 2;
                      const connectedX = 50 + 35 * Math.cos(connectedAngle);
                      const connectedY = 50 + 35 * Math.sin(connectedAngle);

                      return (
                        <motion.line
                          key={`${shard.id}-${connectedId}`}
                          x1={`${x}%`}
                          y1={`${y}%`}
                          x2={`${connectedX}%`}
                          y2={`${connectedY}%`}
                          stroke={shard.color}
                          strokeWidth="2"
                          opacity="0.4"
                          animate={{
                            opacity: [0.2, 0.6, 0.2]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity
                          }}
                        />
                      );
                    });
                  })}
                </svg>

                {/* Shard Crystals */}
                {shards.map((shard, index) => {
                  const angle = (index / shards.length) * Math.PI * 2;
                  const x = 50 + 35 * Math.cos(angle);
                  const y = 50 + 35 * Math.sin(angle);
                  const isSelected = selectedShard === shard.id;
                  const isHovered = hoveredShard === shard.id;

                  return (
                    <motion.button
                      key={shard.id}
                      onMouseEnter={() => setHoveredShard(shard.id)}
                      onMouseLeave={() => setHoveredShard(null)}
                      onClick={() => setSelectedShard(shard.id)}
                      className="absolute group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }}
                    >
                      <motion.div
                        animate={
                          isSelected || isHovered
                            ? { scale: 1.5, rotate: 360 }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        {/* Glow */}
                        <motion.div
                          animate={{
                            boxShadow: [
                              `0 0 20px ${shard.color}40`,
                              `0 0 40px ${shard.color}60`,
                              `0 0 20px ${shard.color}40`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-lg"
                          style={{
                            width: '80px',
                            height: '80px',
                            left: '-40px',
                            top: '-40px'
                          }}
                        ></motion.div>

                        {/* Crystal */}
                        <div
                          className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl border-2 transition-all cursor-pointer transform rotate-45"
                          style={{
                            borderColor: shard.color,
                            backgroundColor: `${shard.color}20`,
                            boxShadow: `0 0 20px ${shard.color}40`
                          }}
                        >
                          <div className="transform -rotate-45">
                            {shard.emoji}
                          </div>
                        </div>

                        {/* Mastery Badge */}
                        <div
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading border-2 bg-background"
                          style={{
                            borderColor: shard.color,
                            color: shard.color
                          }}
                        >
                          {shard.mastery}%
                        </div>
                      </motion.div>
                    </motion.button>
                  );
                })}

                {/* Center Core */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-20 h-20 rounded-lg border-2 border-primary flex items-center justify-center text-4xl"
                  style={{ backgroundColor: '#00FFFF20' }}
                >
                  💎
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Shard Details */}
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
                      <div className="text-6xl mb-3 transform rotate-45">
                        {selectedData.emoji}
                      </div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        {selectedData.name}
                      </h3>
                      <p className="font-paragraph text-light-gray text-sm">
                        {selectedData.description}
                      </p>
                    </div>

                    {/* Mastery Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-light-gray uppercase tracking-widest">
                          Mastery Level
                        </span>
                        <span className="text-sm font-heading" style={{ color: selectedData.color }}>
                          {selectedData.mastery}%
                        </span>
                      </div>
                      <Progress value={selectedData.mastery} className="h-3" />
                    </div>

                    {/* Connected Shards */}
                    <div className="mb-6">
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                        Connected Shards
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedData.connections.map((connId) => {
                          const connShard = shards.find(s => s.id === connId);
                          return connShard ? (
                            <Badge
                              key={connId}
                              style={{
                                backgroundColor: `${connShard.color}20`,
                                color: connShard.color,
                                borderColor: connShard.color
                              }}
                              className="border"
                            >
                              {connShard.emoji} {connShard.concept}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <Button
                      onClick={() => setFocusMode(!focusMode)}
                      className="w-full font-heading uppercase"
                      style={{
                        backgroundColor: selectedData.color,
                        color: '#000000'
                      }}
                    >
                      {focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
                    </Button>
                  </Card>

                  {/* Focus Mode */}
                  <AnimatePresence>
                    {focusMode && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 backdrop-blur-md border-2 border-cyber-yellow rounded-lg p-6"
                      >
                        <h4 className="font-heading text-lg text-cyber-yellow mb-3">
                          Focus Mode Active
                        </h4>
                        <p className="font-paragraph text-light-gray text-sm mb-4">
                          Deep dive into {selectedData.concept}. All distractions removed.
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full border-cyber-yellow text-cyber-yellow">
                            Start Deep Learning
                          </Button>
                          <Button variant="outline" className="w-full border-cyber-yellow text-cyber-yellow">
                            Practice Exercises
                          </Button>
                        </div>
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
                    Click on a shard to explore
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
