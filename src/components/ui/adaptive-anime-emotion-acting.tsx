import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type MentorEmotion = 'proud' | 'encouraging' | 'challenging' | 'celebrating';

interface MentorState {
  emotion: MentorEmotion;
  emoji: string;
  expression: string;
  message: string;
  animation: string;
}

const emotionStates: Record<MentorEmotion, MentorState> = {
  proud: {
    emotion: 'proud',
    emoji: '😊',
    expression: 'Proud',
    message: 'I\'m proud of your progress. Keep pushing forward!',
    animation: 'scale'
  },
  encouraging: {
    emotion: 'encouraging',
    emoji: '💪',
    expression: 'Encouraging',
    message: 'You\'re doing great! Don\'t give up now!',
    animation: 'bounce'
  },
  challenging: {
    emotion: 'challenging',
    emoji: '🎯',
    expression: 'Challenging',
    message: 'Ready for a real challenge? Let\'s push your limits!',
    animation: 'pulse'
  },
  celebrating: {
    emotion: 'celebrating',
    emoji: '🎉',
    expression: 'Celebrating',
    message: 'Incredible! You\'ve achieved something amazing!',
    animation: 'spin'
  }
};

export function AdaptiveAnimeEmotionActing() {
  const [studentProgress, setStudentProgress] = useState(65);
  const [mentorEmotion, setMentorEmotion] = useState<MentorEmotion>('encouraging');
  const [emotionHistory, setEmotionHistory] = useState<MentorEmotion[]>(['encouraging']);

  // Update mentor emotion based on progress
  useEffect(() => {
    if (studentProgress >= 90) {
      setMentorEmotion('celebrating');
    } else if (studentProgress >= 70) {
      setMentorEmotion('proud');
    } else if (studentProgress >= 50) {
      setMentorEmotion('encouraging');
    } else {
      setMentorEmotion('challenging');
    }

    setEmotionHistory(prev => [...prev.slice(-4), mentorEmotion]);
  }, [studentProgress]);

  const currentState = emotionStates[mentorEmotion];

  const handleProgressChange = (value: number) => {
    setStudentProgress(value);
  };

  const getAnimationVariants = () => {
    switch (currentState.animation) {
      case 'scale':
        return {
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 2, repeat: Infinity }
        };
      case 'bounce':
        return {
          animate: { y: [0, -20, 0] },
          transition: { duration: 1.5, repeat: Infinity }
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.15, 1] },
          transition: { duration: 1, repeat: Infinity }
        };
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {};
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
            ADAPTIVE ANIME <span className="text-primary">EMOTION ACTING</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your mentor's emotions and reactions adapt to your learning progress in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 backdrop-blur-md border-2 border-primary rounded-lg p-12 text-center"
            >
              {/* Mentor Emoji with Animation */}
              <motion.div
                key={mentorEmotion}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                {...getAnimationVariants()}
                className="text-9xl mb-6"
              >
                {currentState.emoji}
              </motion.div>

              {/* Mentor Name and Expression */}
              <h3 className="font-heading text-3xl text-foreground mb-2">
                Master Sensei
              </h3>
              <motion.p
                key={mentorEmotion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-primary mb-6 font-heading"
              >
                {currentState.expression}
              </motion.p>

              {/* Mentor Message */}
              <motion.div
                key={mentorEmotion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-background/60 border-2 border-primary/30 rounded-lg p-6 mb-6"
              >
                <p className="font-paragraph text-lg text-foreground italic">
                  "{currentState.message}"
                </p>
              </motion.div>

              {/* Emotion Indicator */}
              <div className="flex justify-center gap-2">
                {(Object.keys(emotionStates) as MentorEmotion[]).map((emotion) => (
                  <motion.div
                    key={emotion}
                    animate={mentorEmotion === emotion ? { scale: 1.2 } : { scale: 1 }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      mentorEmotion === emotion
                        ? 'bg-primary'
                        : 'bg-primary/30'
                    }`}
                  ></motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress Slider */}
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-xl text-foreground mb-4">
                Student Progress Simulator
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-light-gray uppercase tracking-widest">
                      Learning Progress
                    </span>
                    <span className="text-sm font-heading text-primary">
                      {studentProgress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={studentProgress}
                    onChange={(e) => handleProgressChange(Number(e.target.value))}
                    className="w-full h-3 bg-background/50 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Progress Milestones */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-light-gray mb-1">Struggling</p>
                    <div className="h-2 bg-destructive/30 rounded"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-light-gray mb-1">Learning</p>
                    <div className="h-2 bg-cyber-yellow/30 rounded"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-light-gray mb-1">Progressing</p>
                    <div className="h-2 bg-primary/30 rounded"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-light-gray mb-1">Mastering</p>
                    <div className="h-2 bg-neon-green/30 rounded"></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emotion Responses */}
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-xl text-foreground mb-4">
                Mentor Responses by Progress Level
              </h3>
              <div className="space-y-3">
                {[
                  { range: '0-30%', emotion: 'challenging', message: 'Let\'s tackle this together!' },
                  { range: '31-60%', emotion: 'encouraging', message: 'You\'re on the right track!' },
                  { range: '61-85%', emotion: 'proud', message: 'Excellent work so far!' },
                  { range: '86-100%', emotion: 'celebrating', message: 'You\'ve mastered this!' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/40 rounded p-3 border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {emotionStates[item.emotion as MentorEmotion].emoji}
                      </span>
                      <div className="flex-1">
                        <p className="font-heading text-sm text-foreground">
                          {item.range}
                        </p>
                        <p className="text-xs text-light-gray">
                          {item.message}
                        </p>
                      </div>
                    </div>
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
                    Mentor Emotion
                  </p>
                  <p className="font-heading text-2xl">
                    {currentState.emoji} {currentState.expression}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Student Progress
                  </p>
                  <p className="font-heading text-3xl text-primary">
                    {studentProgress}%
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
                        className="w-8 h-8 rounded flex items-center justify-center text-sm border border-primary/30 bg-background/40"
                      >
                        {emotionStates[emotion].emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">How It Works</h3>
              <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                <li>✓ Emotions change with progress</li>
                <li>✓ Unique animations per emotion</li>
                <li>✓ Personalized messages</li>
                <li>✓ Real-time adaptation</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
