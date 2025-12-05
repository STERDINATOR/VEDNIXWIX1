import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TrainingSession {
  id: string;
  name: string;
  emoji: string;
  duration: number;
  xpGain: number;
  difficulty: string;
  description: string;
}

const trainingSessions: TrainingSession[] = [
  {
    id: 'quick-drill',
    name: 'Quick Drill',
    emoji: '⚡',
    duration: 5,
    xpGain: 100,
    difficulty: 'Easy',
    description: 'Fast-paced fundamental exercises'
  },
  {
    id: 'intensive-training',
    name: 'Intensive Training',
    emoji: '💪',
    duration: 15,
    xpGain: 500,
    difficulty: 'Medium',
    description: 'Deep dive into complex concepts'
  },
  {
    id: 'master-challenge',
    name: 'Master Challenge',
    emoji: '🏆',
    duration: 30,
    xpGain: 1500,
    difficulty: 'Hard',
    description: 'Ultimate test of mastery'
  },
  {
    id: 'legendary-quest',
    name: 'Legendary Quest',
    emoji: '👑',
    duration: 60,
    xpGain: 5000,
    difficulty: 'Extreme',
    description: 'The ultimate learning experience'
  }
];

export function TimeSkipTrainingRoom() {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalXpGained, setTotalXpGained] = useState(0);

  const handleStartTraining = (session: TrainingSession) => {
    setSelectedSession(session);
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompletedSessions(c => c + 1);
          setTotalXpGained(t => t + session.xpGain);
          setIsTraining(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
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
            TIME-SKIP <span className="text-primary">TRAINING ROOM</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Accelerated virtual training. Learn years of knowledge in minutes through time-skip technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Selection */}
            {!isTraining && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingSessions.map((session, index) => (
                  <motion.button
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleStartTraining(session)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-primary/30 rounded-lg p-6 bg-background/40 hover:bg-background/60 transition-all text-left"
                  >
                    <div className="text-5xl mb-3">{session.emoji}</div>
                    <h3 className="font-heading text-lg text-foreground mb-2">
                      {session.name}
                    </h3>
                    <p className="text-sm text-light-gray mb-3">
                      {session.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-primary text-primary">
                        {session.difficulty}
                      </Badge>
                      <span className="text-xs text-light-gray">
                        ⏱️ {session.duration}m
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Training in Progress */}
            {isTraining && selectedSession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Card className="bg-dark-gray border-2 border-cyber-yellow p-8 text-center">
                  {/* Training Animation */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-6"
                  >
                    {selectedSession.emoji}
                  </motion.div>

                  <h3 className="font-heading text-3xl text-foreground mb-2">
                    {selectedSession.name}
                  </h3>
                  <p className="text-lg text-cyber-yellow mb-8 font-heading">
                    TIME-SKIP IN PROGRESS
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-light-gray uppercase tracking-widest">
                        Training Progress
                      </span>
                      <span className="text-sm font-heading text-cyber-yellow">
                        {Math.round(trainingProgress)}%
                      </span>
                    </div>
                    <Progress value={trainingProgress} className="h-4" />
                  </div>

                  {/* Time Remaining */}
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl font-heading text-primary mb-8"
                  >
                    ⏰ {Math.round((100 - trainingProgress) / 10)} seconds remaining
                  </motion.p>

                  {/* Training Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-background/40 rounded p-3">
                      <p className="text-xs text-light-gray mb-1">XP Gain</p>
                      <p className="font-heading text-xl text-primary">
                        +{selectedSession.xpGain}
                      </p>
                    </div>
                    <div className="bg-background/40 rounded p-3">
                      <p className="text-xs text-light-gray mb-1">Duration</p>
                      <p className="font-heading text-xl text-secondary">
                        {selectedSession.duration}m
                      </p>
                    </div>
                    <div className="bg-background/40 rounded p-3">
                      <p className="text-xs text-light-gray mb-1">Difficulty</p>
                      <p className="font-heading text-xl text-cyber-yellow">
                        {selectedSession.difficulty}
                      </p>
                    </div>
                  </div>

                  {/* Particle Effects */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1
                      }}
                      animate={{
                        x: Math.cos((i / 6) * Math.PI * 2) * 100,
                        y: Math.sin((i / 6) * Math.PI * 2) * 100,
                        opacity: 0
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                      className="absolute w-2 h-2 rounded-full bg-cyber-yellow"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-4px',
                        marginTop: '-4px'
                      }}
                    ></motion.div>
                  ))}
                </Card>
              </motion.div>
            )}

            {/* Training Complete */}
            {!isTraining && selectedSession && trainingProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Card className="bg-dark-gray border-2 border-neon-green p-8 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-8xl mb-6"
                  >
                    🎉
                  </motion.div>

                  <h3 className="font-heading text-3xl text-neon-green mb-4">
                    TRAINING COMPLETE!
                  </h3>

                  <div className="bg-background/40 rounded p-6 mb-6 border border-neon-green/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-light-gray mb-2">XP Gained</p>
                        <p className="font-heading text-3xl text-neon-green">
                          +{selectedSession.xpGain}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-light-gray mb-2">Time Saved</p>
                        <p className="font-heading text-3xl text-cyber-yellow">
                          {selectedSession.duration * 10}h
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedSession(null);
                      setTrainingProgress(0);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
                  >
                    Start Another Session
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Training Stats */}
          <div className="space-y-4">
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Training Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Sessions Completed
                  </p>
                  <p className="font-heading text-3xl text-primary">
                    {completedSessions}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Total XP Gained
                  </p>
                  <p className="font-heading text-3xl text-secondary">
                    {totalXpGained.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Time Saved
                  </p>
                  <p className="font-heading text-3xl text-cyber-yellow">
                    {completedSessions * 50}h
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">How It Works</h3>
              <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                <li>✓ Select a training session</li>
                <li>✓ Time-skip technology accelerates learning</li>
                <li>✓ Gain massive XP rewards</li>
                <li>✓ Complete in minutes, not hours</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
