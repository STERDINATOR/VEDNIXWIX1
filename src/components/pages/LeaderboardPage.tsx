import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Zap, 
  TrendingUp,
  Calendar,
  Users,
  Target,
  Flame,
  Award
} from 'lucide-react';
import { useMember } from '@/integrations';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  guild?: string;
  achievements: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const { member } = useMember();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('weekly');

  // Mock leaderboard data
  const leaderboardData: Record<string, LeaderboardEntry[]> = {
    daily: [
      { rank: 1, userId: '1', name: 'CyberSamurai99', avatar: '🥷', xp: 2500, level: 45, streak: 25, guild: 'Code Ninjas', achievements: 42 },
      { rank: 2, userId: '2', name: 'QuantumQueen', avatar: '👑', xp: 2350, level: 43, streak: 18, guild: 'Math Masters', achievements: 38 },
      { rank: 3, userId: '3', name: 'CodeNinja42', avatar: '🥋', xp: 2100, level: 41, streak: 22, guild: 'Code Ninjas', achievements: 35 },
      { rank: 4, userId: '4', name: member?.profile?.nickname || 'You', avatar: '⚡', xp: 1750, level: 38, streak: 15, guild: 'Code Ninjas', achievements: 28, isCurrentUser: true },
      { rank: 5, userId: '5', name: 'MathMaster', avatar: '🧮', xp: 1520, level: 36, streak: 12, guild: 'Math Masters', achievements: 25 }
    ],
    weekly: [
      { rank: 1, userId: '1', name: 'CyberSamurai99', avatar: '🥷', xp: 25000, level: 45, streak: 25, guild: 'Code Ninjas', achievements: 42 },
      { rank: 2, userId: '2', name: 'QuantumQueen', avatar: '👑', xp: 23500, level: 43, streak: 18, guild: 'Math Masters', achievements: 38 },
      { rank: 3, userId: '3', name: 'CodeNinja42', avatar: '🥋', xp: 22100, level: 41, streak: 22, guild: 'Code Ninjas', achievements: 35 },
      { rank: 4, userId: '4', name: member?.profile?.nickname || 'You', avatar: '⚡', xp: 15750, level: 38, streak: 15, guild: 'Code Ninjas', achievements: 28, isCurrentUser: true },
      { rank: 5, userId: '5', name: 'MathMaster', avatar: '🧮', xp: 15200, level: 36, streak: 12, guild: 'Math Masters', achievements: 25 },
      { rank: 6, userId: '6', name: 'PhysicsPhenom', avatar: '⚛️', xp: 14800, level: 35, streak: 8, guild: 'Science Squad', achievements: 23 },
      { rank: 7, userId: '7', name: 'DataDragon', avatar: '🐉', xp: 14200, level: 34, streak: 19, guild: 'Code Ninjas', achievements: 31 },
      { rank: 8, userId: '8', name: 'AlgoAce', avatar: '🎯', xp: 13900, level: 33, streak: 14, guild: 'Math Masters', achievements: 27 },
      { rank: 9, userId: '9', name: 'ByteBeast', avatar: '🤖', xp: 13500, level: 32, streak: 11, guild: 'Code Ninjas', achievements: 24 },
      { rank: 10, userId: '10', name: 'LogicLord', avatar: '🧠', xp: 13200, level: 31, streak: 16, guild: 'Science Squad', achievements: 29 }
    ],
    monthly: [
      { rank: 1, userId: '1', name: 'CyberSamurai99', avatar: '🥷', xp: 125000, level: 45, streak: 25, guild: 'Code Ninjas', achievements: 42 },
      { rank: 2, userId: '2', name: 'QuantumQueen', avatar: '👑', xp: 118000, level: 43, streak: 18, guild: 'Math Masters', achievements: 38 },
      { rank: 3, userId: '3', name: 'CodeNinja42', avatar: '🥋', xp: 110000, level: 41, streak: 22, guild: 'Code Ninjas', achievements: 35 },
      { rank: 4, userId: '4', name: member?.profile?.nickname || 'You', avatar: '⚡', xp: 85000, level: 38, streak: 15, guild: 'Code Ninjas', achievements: 28, isCurrentUser: true },
      { rank: 5, userId: '5', name: 'MathMaster', avatar: '🧮', xp: 82000, level: 36, streak: 12, guild: 'Math Masters', achievements: 25 }
    ],
    allTime: [
      { rank: 1, userId: '1', name: 'CyberSamurai99', avatar: '🥷', xp: 500000, level: 45, streak: 25, guild: 'Code Ninjas', achievements: 42 },
      { rank: 2, userId: '2', name: 'QuantumQueen', avatar: '👑', xp: 485000, level: 43, streak: 18, guild: 'Math Masters', achievements: 38 },
      { rank: 3, userId: '3', name: 'CodeNinja42', avatar: '🥋', xp: 470000, level: 41, streak: 22, guild: 'Code Ninjas', achievements: 35 },
      { rank: 4, userId: '4', name: member?.profile?.nickname || 'You', avatar: '⚡', xp: 350000, level: 38, streak: 15, guild: 'Code Ninjas', achievements: 28, isCurrentUser: true },
      { rank: 5, userId: '5', name: 'MathMaster', avatar: '🧮', xp: 340000, level: 36, streak: 12, guild: 'Math Masters', achievements: 25 }
    ]
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-cyber-yellow" />;
      case 2: return <Medal className="h-6 w-6 text-light-gray" />;
      case 3: return <Award className="h-6 w-6 text-secondary" />;
      default: return <span className="text-lg font-heading font-bold text-light-gray">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-cyber-yellow text-black';
      case 2: return 'bg-light-gray text-black';
      case 3: return 'bg-secondary text-white';
      default: return 'bg-dark-gray text-foreground';
    }
  };

  const currentData = leaderboardData[selectedPeriod];
  const userEntry = currentData.find(entry => entry.isCurrentUser);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-heading font-black text-primary mb-4">
            Leaderboard
          </h1>
          <p className="text-xl font-paragraph text-light-gray">
            Compete with the best cyber students in the academy
          </p>
        </motion.div>

        {/* User's Current Position */}
        {userEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(userEntry.rank)}`}>
                    {getRankIcon(userEntry.rank)}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Your Current Rank</h3>
                    <p className="font-paragraph text-light-gray">
                      #{userEntry.rank} out of {currentData.length} students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-heading font-bold text-primary">
                      {userEntry.xp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-paragraph text-light-gray">XP this {selectedPeriod}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Period Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
            <TabsList className="grid w-full grid-cols-4 bg-dark-gray">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="allTime" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            {currentData[1] && (
              <div className="order-1 md:order-1">
                <Card className="bg-dark-gray border-light-gray p-6 text-center h-full">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-light-gray rounded-full flex items-center justify-center text-3xl">
                      {currentData[1].avatar}
                    </div>
                    <Medal className="h-8 w-8 text-light-gray mx-auto mb-2" />
                    <h3 className="text-lg font-heading font-bold text-foreground">
                      {currentData[1].name}
                    </h3>
                    <p className="text-sm font-paragraph text-light-gray">
                      Level {currentData[1].level}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-heading font-bold text-primary">
                        {currentData[1].xp.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-paragraph text-light-gray">
                        {currentData[1].streak} day streak
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* 1st Place */}
            {currentData[0] && (
              <div className="order-2 md:order-2 md:-mt-8">
                <Card className="bg-gradient-to-b from-cyber-yellow/20 to-cyber-yellow/5 border-cyber-yellow p-6 text-center h-full">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto mb-3 bg-cyber-yellow rounded-full flex items-center justify-center text-4xl">
                      {currentData[0].avatar}
                    </div>
                    <Crown className="h-10 w-10 text-cyber-yellow mx-auto mb-2" />
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {currentData[0].name}
                    </h3>
                    <p className="text-sm font-paragraph text-light-gray">
                      Level {currentData[0].level} • Champion
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-lg font-heading font-bold text-primary">
                        {currentData[0].xp.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-paragraph text-light-gray">
                        {currentData[0].streak} day streak
                      </span>
                    </div>
                    <Badge className="bg-cyber-yellow text-black">
                      <Trophy className="h-3 w-3 mr-1" />
                      {selectedPeriod} Champion
                    </Badge>
                  </div>
                </Card>
              </div>
            )}

            {/* 3rd Place */}
            {currentData[2] && (
              <div className="order-3 md:order-3">
                <Card className="bg-dark-gray border-secondary p-6 text-center h-full">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-secondary rounded-full flex items-center justify-center text-3xl">
                      {currentData[2].avatar}
                    </div>
                    <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <h3 className="text-lg font-heading font-bold text-foreground">
                      {currentData[2].name}
                    </h3>
                    <p className="text-sm font-paragraph text-light-gray">
                      Level {currentData[2].level}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-heading font-bold text-primary">
                        {currentData[2].xp.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-paragraph text-light-gray">
                        {currentData[2].streak} day streak
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Full Rankings
            </h3>
            
            <div className="space-y-3">
              {currentData.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    entry.isCurrentUser 
                      ? 'bg-primary/20 border border-primary/50' 
                      : 'bg-background hover:bg-primary/5'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                      <span className="font-heading font-bold">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="text-2xl">{entry.avatar}</div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-foreground">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <Badge className="ml-2 bg-primary text-primary-foreground">You</Badge>
                        )}
                      </h4>
                      {entry.guild && (
                        <Badge variant="outline" className="border-secondary text-secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {entry.guild}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-paragraph text-light-gray">
                      Level {entry.level} • {entry.achievements} achievements
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-heading font-bold text-primary">
                        {entry.xp.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-3 w-3 text-secondary" />
                      <span className="text-xs font-paragraph text-light-gray">
                        {entry.streak} streak
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-2xl font-heading font-bold text-foreground">{currentData.length}</p>
            <p className="text-sm font-paragraph text-light-gray">Active Students</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-2xl font-heading font-bold text-foreground">
              {Math.round(currentData.reduce((sum, entry) => sum + entry.xp, 0) / currentData.length).toLocaleString()}
            </p>
            <p className="text-sm font-paragraph text-light-gray">Average XP</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-2xl font-heading font-bold text-foreground">
              {Math.round(currentData.reduce((sum, entry) => sum + entry.level, 0) / currentData.length)}
            </p>
            <p className="text-sm font-paragraph text-light-gray">Average Level</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Flame className="h-8 w-8 text-secondary mx-auto mb-3" />
            <p className="text-2xl font-heading font-bold text-foreground">
              {Math.max(...currentData.map(entry => entry.streak))}
            </p>
            <p className="text-sm font-paragraph text-light-gray">Longest Streak</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}