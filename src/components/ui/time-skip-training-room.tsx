import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Clock } from 'lucide-react';

interface TrainingSession {
  duration: number;
  label: string;
  xpReward: number;
}

const trainingSessions: TrainingSession[] = [
  { duration: 30, label: '30 Seconds', xpReward: 50 },
  { duration: 60, label: '1 Minute', xpReward: 100 },
  { duration: 180, label: '3 Minutes', xpReward: 300 },
  { duration: 300, label: '5 Minutes', xpReward: 500 }
];

export function TimeSkipTrainingRoom() {
  const [isTraining, setIsTraining] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  const [mentorPhase, setMentorPhase] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (!isTraining || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsTraining(false);
          setShowBreakthrough(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTraining, timeRemaining]);

  useEffect(() => {
    if (isTraining && selectedDuration) {
      setProgress((1 - timeRemaining / selectedDuration) * 100);
      
      // Mentor transformation phases
      if (timeRemaining / selectedDuration < 0.25) {
        setMentorPhase(3);
      } else if (timeRemaining / selectedDuration < 0.5) {
        setMentorPhase(2);
      } else if (timeRemaining / selectedDuration < 0.75) {
        setMentorPhase(1);
      } else {
        setMentorPhase(0);
      }
    }
  }, [timeRemaining, selectedDuration, isTraining]);

  const startTraining = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration);
    setIsTraining(true);
    setProgress(0);
    setMentorPhase(0);
    setShowBreakthrough(false);
    const session = trainingSessions.find(s => s.duration === duration);
    setXpGained(session?.xpReward || 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const mentorEmojis = ['🧙', '🧙‍♂️', '✨🧙‍♂️✨', '🌟👑🌟'];

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
            TIME-SKIP <span className="text-cyber-yellow">TRAINING ROOM</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Rapid training sessions with real-time progress. Watch your mentor transform as you push your limits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Arena */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-8"
            >
              {!isTraining ? (
                <>
                  {/* Session Selection */}
                  <div className="text-center mb-8">
                    <h3 className="font-heading text-2xl text-foreground mb-6">Select Training Duration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {trainingSessions.map((session, index) => (
                        <motion.button
                          key={session.duration}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => startTraining(session.duration)}
                          className="p-4 rounded-lg border-2 border-primary/30 bg-background/40 hover:border-primary hover:bg-primary/10 transition-all group"
                        >
                          <Clock className="h-6 w-6 text-cyber-yellow mx-auto mb-2 group-hover:animate-spin" />
                          <p className="font-heading text-sm text-foreground">{session.label}</p>
                          <p className="text-xs text-light-gray mt-1">+{session.xpReward} XP</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-background/40 border border-primary/20 rounded-lg p-6 text-center">
                    <p className="font-paragraph text-light-gray">
                      Choose a duration and watch your mentor transform as you progress through the training session.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Training in Progress */}
                  <div className="text-center">
                    {/* Mentor Transformation */}
                    <motion.div
                      key={mentorPhase}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-9xl mb-8 inline-block"
                    >
                      {mentorEmojis[mentorPhase]}
                    </motion.div>

                    {/* Timer */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="font-heading text-7xl text-cyber-yellow mb-8 font-black"
                    >
                      {formatTime(timeRemaining)}
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="bg-background/50 rounded-full h-6 overflow-hidden border-2 border-primary/30 mb-4">
                        <motion.div
                          initial={false}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyber-yellow via-primary to-secondary"
                        ></motion.div>
                      </div>
                      <p className="text-light-gray text-sm">{Math.round(progress)}% Complete</p>
                    </div>

                    {/* Meter Fill Animation */}
                    <div className="grid grid-cols-5 gap-2 mb-8">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{
                            height: progress > index * 20 ? '100%' : '0%',
                            backgroundColor: progress > index * 20 ? '#00FF00' : '#333333'
                          }}
                          transition={{ duration: 0.3 }}
                          className="h-12 rounded-lg border border-primary/30"
                        ></motion.div>
                      ))}
                    </div>

                    {/* Motivational Text */}
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-light-gray font-paragraph mb-6"
                    >
                      {mentorPhase === 0 && 'Keep pushing!'}
                      {mentorPhase === 1 && 'You\'re getting stronger!'}
                      {mentorPhase === 2 && 'Almost there!'}
                      {mentorPhase === 3 && 'BREAKTHROUGH INCOMING!'}
                    </motion.p>

                    {/* Cancel Button */}
                    <Button
                      onClick={() => setIsTraining(false)}
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Cancel Training
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Session Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-6"
            >
              <h3 className="font-heading text-xl text-foreground mb-4">Session Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest">Status</p>
                  <p className="font-heading text-lg text-primary">
                    {isTraining ? 'TRAINING...' : 'READY'}
                  </p>
                </div>
                {isTraining && (
                  <div>
                    <p className="text-xs text-light-gray uppercase tracking-widest">Time Remaining</p>
                    <p className="font-heading text-lg text-cyber-yellow">{formatTime(timeRemaining)}</p>
                  </div>
                )}
                {selectedDuration && (
                  <div>
                    <p className="text-xs text-light-gray uppercase tracking-widest">XP Reward</p>
                    <p className="font-heading text-lg text-neon-green">
                      +{trainingSessions.find(s => s.duration === selectedDuration)?.xpReward || 0}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Breakthrough Card */}
            <AnimatePresence>
              {showBreakthrough && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-cyber-yellow/20 via-primary/20 to-secondary/20 backdrop-blur-md border-2 border-cyber-yellow rounded-lg p-6 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4 inline-block"
                  >
                    ⚡
                  </motion.div>
                  <h3 className="font-heading text-2xl text-cyber-yellow mb-2">BREAKTHROUGH ACHIEVED!</h3>
                  <p className="font-paragraph text-light-gray mb-4">
                    You've completed the training session and unlocked new power!
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <Button
                    onClick={() => {
                      setShowBreakthrough(false);
                      setSelectedDuration(null);
                    }}
                    className="w-full bg-cyber-yellow text-dark-gray hover:bg-cyber-yellow/90 font-heading uppercase"
                  >
                    Claim Reward
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
