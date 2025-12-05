import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Region {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  progress: number;
  lessons: number;
  difficulty: string;
  position: { x: number; y: number };
}

const regions: Region[] = [
  {
    id: 'logic',
    name: 'Logic Kingdom',
    emoji: '🧠',
    color: '#FFFF00',
    description: 'Master the art of logical reasoning and algorithms',
    progress: 75,
    lessons: 24,
    difficulty: 'Intermediate',
    position: { x: 20, y: 30 }
  },
  {
    id: 'mecha',
    name: 'Mecha Physics',
    emoji: '🤖',
    color: '#00FFFF',
    description: 'Explore the physics of mechanical systems',
    progress: 60,
    lessons: 18,
    difficulty: 'Advanced',
    position: { x: 70, y: 25 }
  },
  {
    id: 'alchemy',
    name: 'Alchemy Academy',
    emoji: '⚗️',
    color: '#FF00FF',
    description: 'Discover the secrets of chemistry and reactions',
    progress: 45,
    lessons: 15,
    difficulty: 'Beginner',
    position: { x: 30, y: 70 }
  },
  {
    id: 'history',
    name: 'History Portal',
    emoji: '📜',
    color: '#FF6B00',
    description: 'Travel through time and learn from the past',
    progress: 90,
    lessons: 32,
    difficulty: 'Beginner',
    position: { x: 75, y: 70 }
  }
];

export function AnimeWorldMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selectedData = regions.find(r => r.id === selectedRegion);

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
            ANIME <span className="text-primary">WORLD MAP</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Explore different regions of the learning universe. Each region contains unique lessons and challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-md border-2 border-primary/30 rounded-lg p-8 aspect-video"
            >
              {/* Map Background */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Regions */}
              {regions.map((region, index) => (
                <motion.button
                  key={region.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(region.id)}
                  className="absolute group"
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Region Marker */}
                  <motion.div
                    animate={
                      hoveredRegion === region.id || selectedRegion === region.id
                        ? { scale: 1.3, rotate: 360 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Outer Ring */}
                    <div
                      className="absolute inset-0 rounded-full border-2 opacity-50"
                      style={{
                        borderColor: region.color,
                        width: '80px',
                        height: '80px',
                        left: '-40px',
                        top: '-40px'
                      }}
                    ></div>

                    {/* Main Circle */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-4xl border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: region.color,
                        backgroundColor: `${region.color}20`,
                        boxShadow: `0 0 20px ${region.color}40`
                      }}
                    >
                      {region.emoji}
                    </div>

                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        hoveredRegion === region.id
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background/90 border border-primary/30 rounded px-3 py-1 text-sm font-heading pointer-events-none"
                      style={{ color: region.color }}
                    >
                      {region.name}
                    </motion.div>
                  </motion.div>
                </motion.button>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {regions.map((region, index) => {
                  if (index < regions.length - 1) {
                    const nextRegion = regions[index + 1];
                    return (
                      <line
                        key={`line-${index}`}
                        x1={`${region.position.x}%`}
                        y1={`${region.position.y}%`}
                        x2={`${nextRegion.position.x}%`}
                        y2={`${nextRegion.position.y}%`}
                        stroke="#00FFFF"
                        strokeWidth="1"
                        opacity="0.2"
                        strokeDasharray="5,5"
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            </motion.div>
          </div>

          {/* Region Details */}
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
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">{selectedData.emoji}</div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        {selectedData.name}
                      </h3>
                      <p className="font-paragraph text-light-gray text-sm">
                        {selectedData.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-light-gray uppercase tracking-widest">
                            Progress
                          </span>
                          <span className="text-sm font-heading" style={{ color: selectedData.color }}>
                            {selectedData.progress}%
                          </span>
                        </div>
                        <Progress value={selectedData.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">Lessons</p>
                          <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                            {selectedData.lessons}
                          </p>
                        </div>
                        <div className="bg-background/40 rounded p-3 text-center">
                          <p className="text-xs text-light-gray mb-1">Difficulty</p>
                          <p className="font-heading text-sm" style={{ color: selectedData.color }}>
                            {selectedData.difficulty}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full font-heading uppercase"
                      style={{
                        backgroundColor: selectedData.color,
                        color: '#000000'
                      }}
                    >
                      Enter Region
                    </Button>
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
                    Click on a region to explore its details
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
