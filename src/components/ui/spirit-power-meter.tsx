import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type SpiritLevel = 'exhausted' | 'low' | 'normal' | 'energized' | 'transcendent';

interface SpiritState {
  level: SpiritLevel;
  emoji: string;
  color: string;
  description: string;
  bonuses: string[];
  activities: string[];
}

const spiritStates: Record<SpiritLevel, SpiritState> = {
  exhausted: {
    level: 'exhausted',
    emoji: '😴',
    color: '#FF4500',
    description: 'Your spirit is depleted. Rest and recover.',
    bonuses: ['-50% XP', '-50% Focus', 'Mistakes Likely'],
    activities: ['Take a Break', 'Meditate', 'Sleep']
  },
  low: {
    level: 'low',
    emoji: '😔',
    color: '#FF6B00',
    description: 'Your spirit is low. Consider resting soon.',
    bonuses: ['-25% XP', '-25% Focus', 'Reduced Rewards'],
    activities: ['Light Exercise', 'Snack Break', 'Stretch']
  },
  normal: {
    level: 'normal',
    emoji: '😊',
    color: '#FFFF00',
    description: 'Your spirit is balanced. Ready to learn.',
    bonuses: ['Normal XP', 'Normal Focus', 'Standard Rewards'],
    activities: ['Study', 'Practice', 'Quiz']
  },
  energized: {
    level: 'energized',
    emoji: '⚡',
    color: '#00FFFF',
    description: 'Your spirit is energized. Maximum potential!',
    bonuses: ['+25% XP', '+25% Focus', 'Bonus Rewards'],
    activities: ['Tackle Hard Topics', 'Challenge Mode', 'Boss Battle']
  },
  transcendent: {
    level: 'transcendent',
    emoji: '✨',
    color: '#FF00FF',
    description: 'Your spirit transcends! Unlimited potential!',
    bonuses: ['+100% XP', '+100% Focus', 'Legendary Rewards'],
    activities: ['Ultimate Challenge', 'Multiverse Mode', 'Ascension']
  }
};

export function SpiritPowerMeter() {
  const [spiritPower, setSpiritPower] = useState(65);
  const [currentLevel, setCurrentLevel] = useState<SpiritLevel>('normal');
  const [sessionTime, setSessionTime] = useState(0);
  const [activities, setActivities] = useState<string[]>([]);

  // Update spirit level based on power
  useEffect(() => {
    if (spiritPower >= 90) {
      setCurrentLevel('transcendent');
    } else if (spiritPower >= 70) {
      setCurrentLevel('energized');
    } else if (spiritPower >= 40) {
      setCurrentLevel('normal');
    } else if (spiritPower >= 20) {
      setCurrentLevel('low');
    } else {
      setCurrentLevel('exhausted');
    }
  }, [spiritPower]);

  const currentState = spiritStates[currentLevel];

  const handleActivity = (activity: string) => {
    setActivities(prev => [...prev, activity]);
    
    // Adjust spirit power based on activity
    if (activity === 'Take a Break' || activity === 'Sleep') {
      setSpiritPower(prev => Math.min(prev + 30, 100));
    } else if (activity === 'Meditate' || activity === 'Light Exercise') {
      setSpiritPower(prev => Math.min(prev + 15, 100));
    } else if (activity === 'Study' || activity === 'Practice') {
      setSpiritPower(prev => Math.max(prev - 10, 0));
    } else if (activity === 'Tackle Hard Topics') {
      setSpiritPower(prev => Math.max(prev - 20, 0));
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
            SPIRIT <span className="text-primary">POWER METER</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your emotional and mental readiness indicator. Manage your spirit to maximize learning potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spirit Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Spirit Meter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 backdrop-blur-md border-2 border-primary rounded-lg p-12 text-center"
            >
              {/* Spirit Aura */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 40px ${currentState.color}40`,
                    `0 0 80px ${currentState.color}60`,
                    `0 0 40px ${currentState.color}40`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-lg"
              ></motion.div>

              {/* Spirit Emoji */}
              <motion.div
                key={currentLevel}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl mb-6 relative z-10"
              >
                {currentState.emoji}
              </motion.div>

              {/* Spirit Level */}
              <h3 className="font-heading text-3xl text-foreground mb-2 relative z-10 capitalize">
                {currentLevel} Spirit
              </h3>
              <p className="text-lg text-light-gray mb-8 relative z-10">
                {currentState.description}
              </p>

              {/* Power Bar */}
              <div className="relative z-10 mb-8">
                <div className="flex justify-between mb-3">
                  <span className="text-xs text-light-gray uppercase tracking-widest">
                    Spirit Power
                  </span>
                  <span className="text-2xl font-heading" style={{ color: currentState.color }}>
                    {spiritPower}%
                  </span>
                </div>
                <div className="h-6 bg-background/60 rounded-full overflow-hidden border-2 border-primary/30">
                  <motion.div
                    initial={false}
                    animate={{ width: `${spiritPower}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${currentState.color}, ${currentState.color}80)`,
                      boxShadow: `0 0 20px ${currentState.color}`
                    }}
                  ></motion.div>
                </div>
              </div>

              {/* Milestone Markers */}
              <div className="flex justify-between text-xs text-light-gray relative z-10">
                <span>Exhausted</span>
                <span>Low</span>
                <span>Normal</span>
                <span>Energized</span>
                <span>Transcendent</span>
              </div>
            </motion.div>

            {/* Active Bonuses */}
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-xl text-foreground mb-4">
                Active Bonuses
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {currentState.bonuses.map((bonus, index) => (
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
                      {bonus.includes('+') ? '⬆️' : bonus.includes('-') ? '⬇️' : '⚖️'}
                    </motion.div>
                    <p className="font-paragraph text-xs text-light-gray">
                      {bonus}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recommended Activities */}
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-xl text-foreground mb-4">
                Recommended Activities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {currentState.activities.map((activity, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleActivity(activity)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-primary/30 rounded-lg p-3 bg-background/40 hover:bg-background/60 transition-all text-center"
                  >
                    <p className="font-heading text-sm text-foreground">
                      {activity}
                    </p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </div>

          {/* Spirit Stats */}
          <div className="space-y-4">
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Spirit Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Current Level
                  </p>
                  <p className="font-heading text-2xl capitalize">
                    {currentState.emoji} {currentLevel}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Power Level
                  </p>
                  <p className="font-heading text-3xl" style={{ color: currentState.color }}>
                    {spiritPower}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Activities Done
                  </p>
                  <p className="font-heading text-2xl text-primary">
                    {activities.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Spirit Levels</h3>
              <div className="space-y-2 text-sm">
                {(Object.keys(spiritStates) as SpiritLevel[]).map((level) => {
                  const state = spiritStates[level];
                  return (
                    <div key={level} className="flex items-center gap-2">
                      <span className="text-xl">{state.emoji}</span>
                      <span className="font-paragraph text-light-gray capitalize">
                        {level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Tips</h3>
              <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                <li>• Rest to recover spirit</li>
                <li>• Study depletes spirit</li>
                <li>• Higher spirit = better learning</li>
                <li>• Balance work and rest</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
