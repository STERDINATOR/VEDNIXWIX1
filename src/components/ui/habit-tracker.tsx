import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp } from 'lucide-react';

interface HabitTrackerProps {
  userId: string;
  dailyStreak: number;
  lastActivityDate: string;
  reelsWatchedToday: number;
  quizzesTakenToday: number;
  xpEarnedToday: number;
}

export function HabitTracker({
  userId,
  dailyStreak,
  lastActivityDate,
  reelsWatchedToday,
  quizzesTakenToday,
  xpEarnedToday,
}: HabitTrackerProps) {
  const [weekData, setWeekData] = useState<number[]>([]);

  useEffect(() => {
    // Generate mock week data
    const data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    setWeekData(data);
  }, []);

  const maxValue = Math.max(...weekData, 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Streak Card */}
      <Card className="bg-dark-gray/50 border-primary/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-primary">Daily Streak</h3>
          <Flame className="w-6 h-6 text-secondary" />
        </div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center py-6"
        >
          <div className="text-5xl font-bold text-secondary mb-2">{dailyStreak}</div>
          <p className="font-paragraph text-light-gray">days in a row</p>
          <p className="font-paragraph text-xs text-light-gray/60 mt-2">
            Last activity: {new Date(lastActivityDate).toLocaleDateString()}
          </p>
        </motion.div>
      </Card>

      {/* Today's Activity Card */}
      <Card className="bg-dark-gray/50 border-primary/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-primary">Today's Activity</h3>
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-paragraph text-light-gray">Reels Watched</span>
            <Badge className="bg-primary/20 text-primary">{reelsWatchedToday}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-paragraph text-light-gray">Quizzes Taken</span>
            <Badge className="bg-secondary/20 text-secondary">{quizzesTakenToday}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-paragraph text-light-gray">XP Earned</span>
            <Badge className="bg-cyber-yellow/20 text-cyber-yellow">{xpEarnedToday}</Badge>
          </div>
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="bg-dark-gray/50 border-primary/20 p-6 md:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg text-primary">Weekly Activity</h3>
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-end justify-between h-40 gap-2">
          {weekData.map((value, index) => (
            <motion.div
              key={index}
              className="flex-1 flex flex-col items-center"
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
              <span className="font-paragraph text-xs text-light-gray/60 mt-2">
                {days[index]}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="font-paragraph text-sm text-light-gray">
            Total XP this week: <span className="text-primary font-bold">{weekData.reduce((a, b) => a + b, 0)}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
