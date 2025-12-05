import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Zap, Heart } from 'lucide-react';

type Emotion = 'happy' | 'focused' | 'stressed' | 'inspired';

interface EmotionState {
  emotion: Emotion;
  emoji: string;
  color: string;
  worldTheme: string;
  description: string;
  effects: string[];
}

const emotionStates: Record<Emotion, EmotionState> = {
  happy: {
    emotion: 'happy',
    emoji: '😊',
    color: '#FFFF00',
    worldTheme: 'Sunny Paradise',
    description: 'The world blooms with golden light and vibrant colors',
    effects: ['2x XP Gain', 'Faster Learning', 'Bonus Rewards']
  },
  focused: {
    emotion: 'focused',
    emoji: '🎯',
    color: '#00FFFF',
    worldTheme: 'Digital Matrix',
    description: 'Reality becomes crystalline and perfectly organized',
    effects: ['Perfect Focus', 'Enhanced Memory', 'Skill Boost']
  },
  stressed: {
    emotion: 'stressed',
    emoji: '😰',
    color: '#FF4500',
    worldTheme: 'Stormy Dimension',
    description: 'The world becomes chaotic but challenges multiply',
    effects: ['3x XP Challenge', 'Rare Drops', 'Boss Encounters']
  },
  inspired: {
    emotion: 'inspired',
    emoji: '✨',
    color: '#FF00FF',
    worldTheme: 'Cosmic Realm',
    description: 'Reality transcends into pure creative energy',
    effects: ['Unlimited Potential', 'New Abilities', 'Legendary Rewards']
  }
};

export function EmotionAdaptiveRealityShift() {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('focused');
  const [emotionHistory, setEmotionHistory] = useState<Emotion[]>(['focused']);

  const emotionState = emotionStates[currentEmotion];

  const handleEmotionChange = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
    setEmotionHistory(prev => [...prev.slice(-4), emotion]);
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
            EMOTION-ADAPTIVE <span className="text-primary">REALITY SHIFT</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your emotional state shapes the learning world around you. Choose your mood to transform reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emotion Selector */}
          <div className="lg:col-span-2 space-y-6">
            {/* World Visualization */}
            <motion.div
              key={currentEmotion}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-80 rounded-lg overflow-hidden border-2 border-primary"
              style={{ borderColor: emotionState.color }}
            >
              {/* Dynamic Background */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${emotionState.color}20, ${emotionState.color}40)`,
                  backgroundSize: '200% 200%'
                }}
              ></motion.div>

              {/* Emotion Emoji */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-9xl"
              >
                {emotionState.emoji}
              </motion.div>

              {/* Particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: 0
                  }}
                  animate={{
                    y: [0, -300],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: emotionState.color }}
                ></motion.div>
              ))}

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-heading text-3xl text-foreground mb-2">
                    {emotionState.worldTheme}
                  </p>
                  <p className="font-paragraph text-light-gray">
                    {emotionState.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Emotion Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(emotionStates) as Emotion[]).map((emotion) => {
                const state = emotionStates[emotion];
                const isActive = currentEmotion === emotion;

                return (
                  <motion.button
                    key={emotion}
                    onClick={() => handleEmotionChange(emotion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-all border-2 rounded-lg p-4 text-center ${
                      isActive
                        ? 'bg-dark-gray'
                        : 'bg-background/40 hover:bg-background/60'
                    }`}
                    style={{
                      borderColor: isActive ? state.color : '#333333',
                      boxShadow: isActive ? `0 0 20px ${state.color}40` : 'none'
                    }}
                  >
                    <div className="text-4xl mb-2">{state.emoji}</div>
                    <p className="font-heading text-sm text-foreground capitalize">
                      {emotion}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Effects Display */}
            <Card className="bg-dark-gray border-2 p-6" style={{ borderColor: emotionState.color }}>
              <h3 className="font-heading text-xl text-foreground mb-4">Active Effects</h3>
              <div className="grid grid-cols-3 gap-4">
                {emotionState.effects.map((effect, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/40 rounded p-3 text-center border border-primary/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl mb-2"
                    >
                      ⚡
                    </motion.div>
                    <p className="font-paragraph text-xs text-light-gray">
                      {effect}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Emotion Stats */}
          <div className="space-y-4">
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Current State</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Emotion
                  </p>
                  <p className="font-heading text-2xl" style={{ color: emotionState.color }}>
                    {emotionState.emoji} {currentEmotion.toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    World Theme
                  </p>
                  <p className="font-paragraph text-foreground">
                    {emotionState.worldTheme}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Emotion History
                  </p>
                  <div className="flex gap-2">
                    {emotionHistory.map((emotion, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded flex items-center justify-center text-sm border border-primary/30"
                        style={{ backgroundColor: emotionStates[emotion].color + '20' }}
                      >
                        {emotionStates[emotion].emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Emotion Tips</h3>
              <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                <li>• Happy: Best for casual learning</li>
                <li>• Focused: Ideal for difficult topics</li>
                <li>• Stressed: Challenge mode unlocked</li>
                <li>• Inspired: Maximum potential</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
