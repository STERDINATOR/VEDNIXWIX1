import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Crown, 
  Target, 
  Zap, 
  Flame,
  Award,
  Lock,
  CheckCircle,
  Calendar,
  Users,
  BookOpen,
  Sword,
  Heart,
  Code,
  Calculator,
  Atom
} from 'lucide-react';
import { useMember } from '@/integrations';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'combat' | 'special' | 'streak' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  requirements: string[];
}

export default function AchievementsPage() {
  const { member } = useMember();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const achievements: Achievement[] = [
    // Learning Achievements
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first learning module',
      icon: '🎯',
      category: 'learning',
      rarity: 'common',
      xpReward: 100,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      requirements: ['Complete 1 learning module']
    },
    {
      id: '2',
      name: 'Knowledge Seeker',
      description: 'Complete 10 learning modules',
      icon: '📚',
      category: 'learning',
      rarity: 'rare',
      xpReward: 500,
      unlocked: true,
      unlockedAt: new Date('2024-02-01'),
      requirements: ['Complete 10 learning modules']
    },
    {
      id: '3',
      name: 'Master Scholar',
      description: 'Complete 50 learning modules',
      icon: '🎓',
      category: 'learning',
      rarity: 'epic',
      xpReward: 2000,
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      requirements: ['Complete 50 learning modules']
    },
    {
      id: '4',
      name: 'Code Warrior',
      description: 'Master all programming courses',
      icon: '⚔️',
      category: 'learning',
      rarity: 'legendary',
      xpReward: 5000,
      unlocked: false,
      progress: 8,
      maxProgress: 15,
      requirements: ['Complete all programming courses', 'Achieve 90% average score']
    },

    // Combat Achievements
    {
      id: '5',
      name: 'First Victory',
      description: 'Win your first battle arena match',
      icon: '🏆',
      category: 'combat',
      rarity: 'common',
      xpReward: 200,
      unlocked: true,
      unlockedAt: new Date('2024-01-20'),
      requirements: ['Win 1 battle arena match']
    },
    {
      id: '6',
      name: 'Battle Veteran',
      description: 'Win 25 battle arena matches',
      icon: '🛡️',
      category: 'combat',
      rarity: 'rare',
      xpReward: 1000,
      unlocked: false,
      progress: 12,
      maxProgress: 25,
      requirements: ['Win 25 battle arena matches']
    },
    {
      id: '7',
      name: 'Boss Slayer',
      description: 'Defeat 5 different boss battles',
      icon: '🐉',
      category: 'combat',
      rarity: 'epic',
      xpReward: 3000,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      requirements: ['Defeat 5 unique boss battles']
    },

    // Social Achievements
    {
      id: '8',
      name: 'Team Player',
      description: 'Join your first study guild',
      icon: '🤝',
      category: 'social',
      rarity: 'common',
      xpReward: 150,
      unlocked: true,
      unlockedAt: new Date('2024-01-25'),
      requirements: ['Join a study guild']
    },
    {
      id: '9',
      name: 'Guild Leader',
      description: 'Create and manage a study guild',
      icon: '👑',
      category: 'social',
      rarity: 'epic',
      xpReward: 2500,
      unlocked: false,
      requirements: ['Create a study guild', 'Reach 20 members']
    },
    {
      id: '10',
      name: 'Mentor',
      description: 'Help 10 students with their studies',
      icon: '🧙‍♂️',
      category: 'social',
      rarity: 'rare',
      xpReward: 1500,
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      requirements: ['Help 10 different students', 'Receive positive feedback']
    },

    // Streak Achievements
    {
      id: '11',
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'common',
      xpReward: 300,
      unlocked: true,
      unlockedAt: new Date('2024-02-05'),
      requirements: ['Study for 7 consecutive days']
    },
    {
      id: '12',
      name: 'Dedication Master',
      description: 'Maintain a 30-day learning streak',
      icon: '⚡',
      category: 'streak',
      rarity: 'epic',
      xpReward: 2000,
      unlocked: false,
      progress: 15,
      maxProgress: 30,
      requirements: ['Study for 30 consecutive days']
    },

    // Special Achievements
    {
      id: '13',
      name: 'Speed Demon',
      description: 'Complete a quiz in under 30 seconds',
      icon: '💨',
      category: 'special',
      rarity: 'rare',
      xpReward: 750,
      unlocked: true,
      unlockedAt: new Date('2024-02-10'),
      requirements: ['Complete any quiz in under 30 seconds']
    },
    {
      id: '14',
      name: 'Perfect Score',
      description: 'Achieve 100% on 5 different quizzes',
      icon: '💯',
      category: 'special',
      rarity: 'epic',
      xpReward: 2500,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      requirements: ['Score 100% on 5 different quizzes']
    },
    {
      id: '15',
      name: 'Cyber Legend',
      description: 'Reach the highest rank in the academy',
      icon: '🌟',
      category: 'milestone',
      rarity: 'mythic',
      xpReward: 10000,
      unlocked: false,
      progress: 38,
      maxProgress: 50,
      requirements: ['Reach level 50', 'Complete all courses', 'Win 100 battles']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: <Trophy className="h-4 w-4" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'combat', name: 'Combat', icon: <Sword className="h-4 w-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="h-4 w-4" /> },
    { id: 'streak', name: 'Streaks', icon: <Flame className="h-4 w-4" /> },
    { id: 'special', name: 'Special', icon: <Star className="h-4 w-4" /> },
    { id: 'milestone', name: 'Milestones', icon: <Crown className="h-4 w-4" /> }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow';
      case 'legendary': return 'border-secondary bg-secondary/10 text-secondary';
      case 'epic': return 'border-primary bg-primary/10 text-primary';
      case 'rare': return 'border-neon-green bg-neon-green/10 text-neon-green';
      default: return 'border-light-gray bg-light-gray/10 text-light-gray';
    }
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalXP = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100);

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
            Achievements
          </h1>
          <p className="text-xl font-paragraph text-light-gray">
            Track your progress and unlock rewards for your accomplishments
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{unlockedAchievements.length}</p>
            <p className="text-sm font-paragraph text-light-gray">Unlocked</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Target className="h-8 w-8 text-secondary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{completionRate}%</p>
            <p className="text-sm font-paragraph text-light-gray">Completion</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Zap className="h-8 w-8 text-neon-green mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{totalXP.toLocaleString()}</p>
            <p className="text-sm font-paragraph text-light-gray">XP Earned</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Star className="h-8 w-8 text-cyber-yellow mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">
              {achievements.filter(a => a.rarity === 'legendary' || a.rarity === 'mythic').filter(a => a.unlocked).length}
            </p>
            <p className="text-sm font-paragraph text-light-gray">Rare Unlocked</p>
          </Card>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7 bg-dark-gray">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`bg-dark-gray border-2 ${getRarityColor(achievement.rarity)} p-6 h-full relative ${
                  !achievement.unlocked ? 'opacity-75' : ''
                }`}>
                  {/* Rarity Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                    </Badge>
                  </div>

                  {/* Achievement Icon */}
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-4xl ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-primary/20 to-secondary/20' 
                        : 'bg-dark-gray border-2 border-light-gray'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="h-8 w-8 text-light-gray" />}
                    </div>
                    
                    {achievement.unlocked && (
                      <CheckCircle className="h-6 w-6 text-neon-green mx-auto" />
                    )}
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-sm font-paragraph text-light-gray mb-3">
                      {achievement.description}
                    </p>
                    
                    {/* XP Reward */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-heading font-bold text-primary">
                        +{achievement.xpReward} XP
                      </span>
                    </div>

                    {/* Unlock Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="flex items-center justify-center gap-2 text-xs text-light-gray">
                        <Calendar className="h-3 w-3" />
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-paragraph text-light-gray mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-heading font-bold text-foreground">Requirements:</h4>
                    <ul className="space-y-1">
                      {achievement.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs font-paragraph text-light-gray flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Recent Achievements</h3>
            
            <div className="space-y-4">
              {unlockedAchievements
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 5)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 bg-background rounded">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-foreground">{achievement.name}</h4>
                      <p className="text-sm font-paragraph text-light-gray">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-heading font-bold text-primary">+{achievement.xpReward}</span>
                      </div>
                      <p className="text-xs text-light-gray">
                        {achievement.unlockedAt?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}