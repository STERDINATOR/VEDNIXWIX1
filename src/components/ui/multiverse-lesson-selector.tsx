import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LessonUniverse {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  difficulty: string;
  duration: string;
  features: string[];
  example: string;
}

const lessonUniverses: LessonUniverse[] = [
  {
    id: 'story',
    name: 'Story Universe',
    emoji: '📖',
    description: 'Immersive narrative-driven lessons where you\'re the protagonist',
    color: '#FF6B00',
    difficulty: 'Beginner - Intermediate',
    duration: '15-30 min',
    features: ['Character Development', 'Plot Twists', 'Choices Matter', 'Emotional Connection'],
    example: 'Learn about photosynthesis through the journey of a plant hero'
  },
  {
    id: 'reel',
    name: 'Reel Universe',
    emoji: '🎬',
    description: 'Fast-paced video lessons with anime-style animations',
    color: '#00FFFF',
    difficulty: 'All Levels',
    duration: '5-15 min',
    features: ['Anime Animation', 'Quick Summaries', 'Visual Effects', 'Engaging Narration'],
    example: 'Watch an anime-style breakdown of quantum mechanics'
  },
  {
    id: 'challenge',
    name: 'Challenge Universe',
    emoji: '⚔️',
    description: 'Competitive lessons with boss battles and skill challenges',
    color: '#FF0000',
    difficulty: 'Intermediate - Advanced',
    duration: '20-45 min',
    features: ['Boss Battles', 'Leaderboards', 'Achievements', 'Skill Tests'],
    example: 'Defeat the Math Dragon by solving increasingly difficult equations'
  },
  {
    id: 'speedrun',
    name: 'Speedrun Universe',
    emoji: '⚡',
    description: 'Ultra-fast learning with rapid-fire questions and instant feedback',
    color: '#00FF00',
    difficulty: 'Advanced',
    duration: '3-10 min',
    features: ['Rapid Questions', 'Instant Feedback', 'Time Pressure', 'High Rewards'],
    example: 'Answer 20 questions in 5 minutes for maximum XP'
  }
];

export function MultiverseLessonSelector() {
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [hoveredUniverse, setHoveredUniverse] = useState<string | null>(null);

  const selectedData = lessonUniverses.find(u => u.id === selectedUniverse);

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
            MULTIVERSE <span className="text-primary">LESSON SELECTOR</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Choose your lesson universe. Each universe offers a unique learning experience tailored to your preferences.
          </p>
        </motion.div>

        {/* Universe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lessonUniverses.map((universe, index) => (
            <motion.button
              key={universe.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredUniverse(universe.id)}
              onMouseLeave={() => setHoveredUniverse(null)}
              onClick={() => setSelectedUniverse(universe.id)}
              className={`relative p-6 rounded-lg border-2 transition-all group overflow-hidden h-full ${
                selectedUniverse === universe.id
                  ? `border-[${universe.color}] bg-background/80 backdrop-blur-sm`
                  : hoveredUniverse === universe.id
                  ? `border-[${universe.color}] bg-background/60`
                  : 'border-primary/20 bg-background/40'
              }`}
              style={{
                borderColor: selectedUniverse === universe.id || hoveredUniverse === universe.id ? universe.color : undefined,
                boxShadow: selectedUniverse === universe.id || hoveredUniverse === universe.id ? `0 0 20px ${universe.color}40` : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/5 transition-all duration-300"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <motion.div
                  animate={hoveredUniverse === universe.id ? { scale: 1.2, rotate: 10 } : {}}
                  transition={{ duration: 0.3 }}
                  className="text-5xl mb-3"
                >
                  {universe.emoji}
                </motion.div>

                <h3 className="font-heading text-xl text-foreground mb-2">{universe.name}</h3>
                <p className="font-paragraph text-sm text-light-gray mb-4 flex-grow">{universe.description}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-light-gray">Difficulty:</span>
                    <span style={{ color: universe.color }} className="font-heading">
                      {universe.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">Duration:</span>
                    <span style={{ color: universe.color }} className="font-heading">
                      {universe.duration}
                    </span>
                  </div>
                </div>

                {selectedUniverse === universe.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-3 h-3 rounded-full"
                    style={{ backgroundColor: universe.color }}
                  ></motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Universe Details */}
        <AnimatePresence mode="wait">
          {selectedData && (
            <motion.div
              key={selectedData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-background/60 backdrop-blur-md border-2 rounded-lg p-8 mb-8"
              style={{
                borderColor: selectedData.color,
                boxShadow: `0 0 30px ${selectedData.color}30`
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2">
                  <h3 className="font-heading text-4xl text-foreground mb-4">
                    {selectedData.name}
                  </h3>
                  <p className="font-paragraph text-light-gray text-lg mb-6">
                    {selectedData.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <p className="font-heading text-sm uppercase tracking-widest text-light-gray mb-4">
                      Key Features:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: selectedData.color }}
                          ></div>
                          <span className="font-paragraph text-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Example */}
                  <div className="bg-background/40 border border-primary/20 rounded-lg p-4">
                    <p className="font-heading text-sm uppercase tracking-widest text-light-gray mb-2">
                      Example Lesson:
                    </p>
                    <p className="font-paragraph text-foreground italic">
                      "{selectedData.example}"
                    </p>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col justify-between">
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      {selectedData.emoji}
                    </motion.div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-background/40 border border-primary/20 rounded-lg p-4 text-center">
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-1">Difficulty</p>
                      <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                        {selectedData.difficulty}
                      </p>
                    </div>
                    <div className="bg-background/40 border border-primary/20 rounded-lg p-4 text-center">
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-heading text-lg" style={{ color: selectedData.color }}>
                        {selectedData.duration}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full font-heading uppercase"
                    style={{
                      backgroundColor: selectedData.color,
                      color: '#000000'
                    }}
                  >
                    <span>Enter Universe</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        {!selectedUniverse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-background/40 border border-primary/20 rounded-lg p-8 text-center"
          >
            <p className="font-paragraph text-light-gray text-lg">
              Select a universe above to explore different lesson formats. Each universe offers unique learning mechanics and rewards.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
