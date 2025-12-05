import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Route {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: string;
  duration: number;
  xpReward: number;
  color: string;
  steps: string[];
}

const routes: Route[] = [
  {
    id: 'fast-track',
    name: 'Fast Track Route',
    emoji: '⚡',
    description: 'Quick path to mastery, skip advanced topics',
    difficulty: 'Easy',
    duration: 10,
    xpReward: 500,
    color: '#FFFF00',
    steps: ['Basics', 'Practice', 'Quiz', 'Certificate']
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Route',
    emoji: '🌊',
    description: 'Comprehensive learning with all details',
    difficulty: 'Hard',
    duration: 30,
    xpReward: 2000,
    color: '#00FFFF',
    steps: ['Fundamentals', 'Theory', 'Advanced', 'Projects', 'Mastery']
  },
  {
    id: 'project-based',
    name: 'Project-Based Route',
    emoji: '🏗️',
    description: 'Learn by building real-world projects',
    difficulty: 'Medium',
    duration: 20,
    xpReward: 1500,
    color: '#00FF00',
    steps: ['Concept', 'Project Setup', 'Build', 'Deploy', 'Review']
  },
  {
    id: 'gamified',
    name: 'Gamified Route',
    emoji: '🎮',
    description: 'Learn through challenges and battles',
    difficulty: 'Medium',
    duration: 15,
    xpReward: 1200,
    color: '#FF00FF',
    steps: ['Tutorial', 'Easy Challenges', 'Medium Challenges', 'Boss Battle', 'Victory']
  }
];

export function MultiverseLearningRoutes() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [routeProgress, setRouteProgress] = useState<Record<string, number>>({});

  const selectedData = routes.find(r => r.id === selectedRoute);

  const handleStartRoute = (routeId: string) => {
    setActiveRoute(routeId);
    setRouteProgress(prev => ({ ...prev, [routeId]: 0 }));
  };

  const handleProgressRoute = (routeId: string) => {
    setRouteProgress(prev => ({
      ...prev,
      [routeId]: Math.min((prev[routeId] || 0) + 25, 100)
    }));
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
            MULTIVERSE <span className="text-primary">LEARNING ROUTES</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Choose your own learning path. Different routes for different learning styles and goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route, index) => {
                const isSelected = selectedRoute === route.id;
                const isActive = activeRoute === route.id;
                const progress = routeProgress[route.id] || 0;

                return (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedRoute(route.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-all border-2 rounded-lg p-6 text-left ${
                      isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                    }`}
                    style={{
                      borderColor: isSelected ? route.color : '#333333',
                      boxShadow: isSelected ? `0 0 20px ${route.color}40` : 'none'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{route.emoji}</div>
                      {isActive && (
                        <Badge style={{ backgroundColor: route.color, color: '#000000' }}>
                          Active
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-heading text-lg text-foreground mb-2">
                      {route.name}
                    </h3>
                    <p className="text-sm text-light-gray mb-3">
                      {route.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-light-gray">
                        ⏱️ {route.duration}m
                      </span>
                      <Badge variant="outline" className="border-primary text-primary">
                        {route.difficulty}
                      </Badge>
                    </div>

                    {isActive && (
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-light-gray">Progress</span>
                          <span className="text-xs font-heading" style={{ color: route.color }}>
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <span className="text-xs text-light-gray">
                      +{route.xpReward} XP
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Route Details */}
            {activeRoute && selectedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Card className="bg-dark-gray border-2 border-cyber-yellow p-6">
                  <h3 className="font-heading text-2xl text-foreground mb-6">
                    {selectedData.name} - In Progress
                  </h3>

                  {/* Step Progress */}
                  <div className="mb-6">
                    <p className="text-xs text-light-gray uppercase tracking-widest mb-4">
                      Learning Steps
                    </p>
                    <div className="space-y-3">
                      {selectedData.steps.map((step, index) => {
                        const stepProgress = (routeProgress[activeRoute] || 0) / selectedData.steps.length;
                        const isCompleted = index < stepProgress;
                        const isCurrent = index === Math.floor(stepProgress);

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded border-2 ${
                              isCompleted
                                ? 'bg-neon-green/10 border-neon-green'
                                : isCurrent
                                ? 'bg-cyber-yellow/10 border-cyber-yellow'
                                : 'bg-background/40 border-primary/20'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-sm ${
                                isCompleted
                                  ? 'bg-neon-green text-background'
                                  : isCurrent
                                  ? 'bg-cyber-yellow text-background'
                                  : 'bg-background/60 text-light-gray'
                              }`}
                            >
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <span className="font-paragraph text-foreground flex-1">
                              {step}
                            </span>
                            {isCurrent && (
                              <Badge style={{ backgroundColor: selectedData.color, color: '#000000' }}>
                                Current
                              </Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-light-gray uppercase tracking-widest">
                        Route Progress
                      </span>
                      <span className="text-sm font-heading text-cyber-yellow">
                        {routeProgress[activeRoute] || 0}%
                      </span>
                    </div>
                    <Progress value={routeProgress[activeRoute] || 0} className="h-4" />
                  </div>

                  <Button
                    onClick={() => handleProgressRoute(activeRoute)}
                    disabled={(routeProgress[activeRoute] || 0) >= 100}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase disabled:opacity-50"
                  >
                    {(routeProgress[activeRoute] || 0) >= 100 ? 'Route Completed!' : 'Progress to Next Step'}
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Route Details */}
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
                      <div className="text-6xl mb-3">{selectedData.emoji}</div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        {selectedData.name}
                      </h3>
                      <p className="font-paragraph text-light-gray text-sm">
                        {selectedData.description}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-background/40 rounded p-3">
                        <p className="text-xs text-light-gray mb-1">Duration</p>
                        <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                          {selectedData.duration} minutes
                        </p>
                      </div>
                      <div className="bg-background/40 rounded p-3">
                        <p className="text-xs text-light-gray mb-1">XP Reward</p>
                        <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                          +{selectedData.xpReward}
                        </p>
                      </div>
                      <div className="bg-background/40 rounded p-3">
                        <p className="text-xs text-light-gray mb-1">Difficulty</p>
                        <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                          {selectedData.difficulty}
                        </p>
                      </div>
                    </div>

                    {activeRoute !== selectedData.id ? (
                      <Button
                        onClick={() => handleStartRoute(selectedData.id)}
                        className="w-full font-heading uppercase"
                        style={{
                          backgroundColor: selectedData.color,
                          color: '#000000'
                        }}
                      >
                        Start Route
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setActiveRoute(null)}
                        variant="outline"
                        className="w-full border-primary text-primary"
                      >
                        Pause Route
                      </Button>
                    )}
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
                    Select a route to begin
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
