import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface LearningMode {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  benefits: string[];
}

const learningModes: LearningMode[] = [
  {
    id: 'visual',
    name: 'Visual',
    emoji: '👁️',
    description: 'Learn through images, diagrams, and visual representations',
    color: '#00FFFF',
    benefits: ['Infographics', 'Mind Maps', 'Animations', 'Charts']
  },
  {
    id: 'logical',
    name: 'Logical',
    emoji: '🧠',
    description: 'Step-by-step reasoning and structured problem solving',
    color: '#FFFF00',
    benefits: ['Algorithms', 'Proofs', 'Sequences', 'Logic Puzzles']
  },
  {
    id: 'emotional',
    name: 'Emotional',
    emoji: '❤️',
    description: 'Connect through stories and emotional narratives',
    color: '#FF00FF',
    benefits: ['Stories', 'Case Studies', 'Real Examples', 'Narratives']
  },
  {
    id: 'story',
    name: 'Story',
    emoji: '📖',
    description: 'Immersive narrative-driven learning experiences',
    color: '#FF6B00',
    benefits: ['Quests', 'Adventures', 'Characters', 'Plot Twists']
  },
  {
    id: 'fastmode',
    name: 'Fast Mode',
    emoji: '⚡',
    description: 'Rapid-fire learning with quick summaries and drills',
    color: '#00FF00',
    benefits: ['Quick Review', 'Flashcards', 'Speed Drills', 'Summaries']
  }
];

export function CognitiveResonanceEngine() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [confirmedMode, setConfirmedMode] = useState<string | null>(null);

  const handleSelectMode = (modeId: string) => {
    setSelectedMode(modeId);
  };

  const handleConfirmMode = () => {
    if (selectedMode) {
      setConfirmedMode(selectedMode);
      setTimeout(() => {
        setSelectedMode(null);
      }, 1500);
    }
  };

  const selectedModeData = learningModes.find(m => m.id === selectedMode);
  const confirmedModeData = learningModes.find(m => m.id === confirmedMode);

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
            COGNITIVE <span className="text-primary">RESONANCE ENGINE</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Choose your preferred learning resonance. Your brain learns best when it resonates with the right frequency.
          </p>
        </motion.div>

        {/* Mode Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {learningModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => handleSelectMode(mode.id)}
              className={`relative p-6 rounded-lg border-2 transition-all group overflow-hidden ${
                selectedMode === mode.id
                  ? `border-[${mode.color}] bg-background/80 backdrop-blur-sm`
                  : confirmedMode === mode.id
                  ? `border-[${mode.color}] bg-background/60 backdrop-blur-sm`
                  : 'border-primary/20 bg-background/40 hover:border-primary/50'
              }`}
              style={{
                borderColor: selectedMode === mode.id || confirmedMode === mode.id ? mode.color : undefined,
                boxShadow: selectedMode === mode.id || confirmedMode === mode.id ? `0 0 20px ${mode.color}40` : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/5 transition-all duration-300"></div>
              <div className="relative z-10">
                <motion.div
                  animate={selectedMode === mode.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-3"
                >
                  {mode.emoji}
                </motion.div>
                <h3 className="font-heading text-lg text-foreground mb-2">{mode.name}</h3>
                <p className="font-paragraph text-xs text-light-gray leading-tight">{mode.description}</p>
                
                {confirmedMode === mode.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-neon-green rounded-full p-1"
                  >
                    <Check className="h-4 w-4 text-dark-gray" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mode Details */}
        {selectedModeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-background/60 backdrop-blur-md border-2 rounded-lg p-8 mb-8"
            style={{
              borderColor: selectedModeData.color,
              boxShadow: `0 0 30px ${selectedModeData.color}30`
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="font-heading text-3xl text-foreground mb-4">
                  {selectedModeData.name} Mode
                </h3>
                <p className="font-paragraph text-light-gray text-lg mb-6">
                  {selectedModeData.description}
                </p>
                <div>
                  <p className="font-heading text-sm uppercase tracking-widest text-light-gray mb-3">
                    What You'll Experience:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedModeData.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: selectedModeData.color }}
                        ></div>
                        <span className="font-paragraph text-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  {selectedModeData.emoji}
                </motion.div>
                <Button
                  onClick={handleConfirmMode}
                  className="w-full font-heading uppercase"
                  style={{
                    backgroundColor: selectedModeData.color,
                    color: '#000000'
                  }}
                >
                  Select This Mode
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirmed Mode Display */}
        {confirmedMode && !selectedMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background/60 backdrop-blur-md border-2 border-neon-green rounded-lg p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4 inline-block"
            >
              ✨
            </motion.div>
            <h3 className="font-heading text-3xl text-neon-green mb-2">
              {confirmedModeData?.name} Mode Activated!
            </h3>
            <p className="font-paragraph text-light-gray mb-6">
              Your learning experience is now optimized for {confirmedModeData?.name.toLowerCase()} resonance.
            </p>
            <motion.div
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"
            ></motion.div>
          </motion.div>
        )}

        {/* Info Section */}
        {!selectedMode && !confirmedMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-background/40 border border-primary/20 rounded-lg p-8 text-center"
          >
            <p className="font-paragraph text-light-gray text-lg">
              Select a learning mode above to customize your educational experience. Each mode is designed to maximize your learning potential.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
