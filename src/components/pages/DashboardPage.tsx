import React, { useEffect, useState } from 'react';
import { useMember } from '@/integrations';
import { useUserDataStore } from '@/stores/userDataStore';
import { NeonCityBackground } from '@/components/ui/neon-city-background';
import { DashboardTestControls } from '@/components/ui/dashboard-test-controls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Zap, Trophy, Flame, TrendingUp, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { member } = useMember();
  const { userData, loadUserData, startAutoSync, stopAutoSync } = useUserDataStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (member?.contact?.firstName) {
        await loadUserData(member.contact.firstName);
        startAutoSync(30000); // Auto-sync every 30 seconds
        setIsInitializing(false);
      } else {
        setIsInitializing(false);
      }
    };

    initializeUser();

    // Cleanup on unmount
    return () => {
      stopAutoSync();
    };
  }, [member, loadUserData, startAutoSync, stopAutoSync]);

  if (isInitializing || !userData) {
    return (
      <div className="min-h-screen bg-background text-foreground relative">
        <NeonCityBackground colorScheme="cyan" intensity="medium" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-light-gray">Initializing your academy profile...</p>
            {!member && (
              <p className="text-xs text-light-gray mt-4">Please sign in to continue</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const levelProgress = (userData.currentLevelXP / userData.maxLevelXP) * 100;
  const nextLevelXP = userData.maxLevelXP - userData.currentLevelXP;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <NeonCityBackground colorScheme="cyan" intensity="medium" />
      
      <div className="relative z-10">
        <div className="max-w-[120rem] mx-auto px-4 md:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-black text-primary mb-2">
              Welcome Back, {member?.profile?.nickname || member?.contact?.firstName}
            </h1>
            <p className="text-light-gray text-lg">Your learning journey continues...</p>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Level Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-background/50 border-primary/30 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-light-gray">LEVEL</h3>
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <p className="text-5xl font-heading font-black text-primary mb-2">{userData.level}</p>
                <Progress value={levelProgress} className="h-2 mb-2" />
                <p className="text-xs text-light-gray">{nextLevelXP} XP to next level</p>
              </Card>
            </motion.div>

            {/* Total XP Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/50 border-secondary/30 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-light-gray">TOTAL XP</h3>
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-4xl font-heading font-black text-secondary">{userData.totalXP.toLocaleString()}</p>
              </Card>
            </motion.div>

            {/* Daily Streak Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-background/50 border-neon-green/30 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-light-gray">STREAK</h3>
                  <Flame className="h-5 w-5 text-neon-green" />
                </div>
                <p className="text-4xl font-heading font-black text-neon-green">{userData.dailyStreak}</p>
                <p className="text-xs text-light-gray mt-2">days in a row</p>
              </Card>
            </motion.div>

            {/* Battle Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-background/50 border-cyber-yellow/30 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-light-gray">BATTLES</h3>
                  <Trophy className="h-5 w-5 text-cyber-yellow" />
                </div>
                <p className="text-3xl font-heading font-black text-cyber-yellow">
                  {userData.battleStats.wins}W / {userData.battleStats.losses}L
                </p>
                <p className="text-xs text-light-gray mt-2">
                  {userData.battleStats.totalBattles} total
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Link to="/reels">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-lg font-heading">
                <span className="mr-3">▶️</span>
                Watch Anime Reels
              </Button>
            </Link>

            <Link to="/learn">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-16 text-lg font-heading">
                <span className="mr-3">📚</span>
                Start Learning
              </Button>
            </Link>

            <Link to="/battle">
              <Button className="w-full bg-cyber-yellow text-dark-gray hover:bg-cyber-yellow/90 h-16 text-lg font-heading">
                <span className="mr-3">⚔️</span>
                Battle Arena
              </Button>
            </Link>

            <Link to="/guilds">
              <Button className="w-full bg-neon-green text-dark-gray hover:bg-neon-green/90 h-16 text-lg font-heading">
                <span className="mr-3">👥</span>
                Join Guilds
              </Button>
            </Link>

            <Link to="/mentor">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 h-16 text-lg font-heading">
                <span className="mr-3">🧙‍♂️</span>
                AI Mentor
              </Button>
            </Link>

            <Link to="/shop">
              <Button className="w-full border-2 border-primary text-primary hover:bg-primary/10 h-16 text-lg font-heading">
                <span className="mr-3">🛍️</span>
                Shop
              </Button>
            </Link>

            <Link to="/achievements">
              <Button className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10 h-16 text-lg font-heading">
                <span className="mr-3">🏅</span>
                Achievements
              </Button>
            </Link>

            <Link to="/profile">
              <Button className="w-full border-2 border-neon-green text-neon-green hover:bg-neon-green/10 h-16 text-lg font-heading">
                <span className="mr-3">👤</span>
                Profile
              </Button>
            </Link>

            <Link to="/settings">
              <Button className="w-full border-2 border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10 h-16 text-lg font-heading">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </Link>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Learning Progress */}
            <Card className="bg-background/50 border-primary/30 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">Learning Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Reels Completed</span>
                    <span className="text-primary font-heading">{userData.completedReels.length}</span>
                  </div>
                  <Progress value={(userData.completedReels.length / 50) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Quizzes Passed</span>
                    <span className="text-primary font-heading">{userData.completedQuizzes.length}</span>
                  </div>
                  <Progress value={(userData.completedQuizzes.length / 50) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Quests Completed</span>
                    <span className="text-primary font-heading">{userData.completedQuests.length}</span>
                  </div>
                  <Progress value={(userData.completedQuests.length / 30) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Achievements Unlocked</span>
                    <span className="text-primary font-heading">{userData.achievements.length}</span>
                  </div>
                  <Progress value={(userData.achievements.length / 25) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Pet Stats */}
            <Card className="bg-background/50 border-secondary/30 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-6">Pet Companion</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Happiness</span>
                    <span className="text-secondary font-heading">{userData.petStats.happiness}%</span>
                  </div>
                  <Progress value={userData.petStats.happiness} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Hunger</span>
                    <span className="text-secondary font-heading">{userData.petStats.hunger}%</span>
                  </div>
                  <Progress value={userData.petStats.hunger} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-gray">Energy</span>
                    <span className="text-secondary font-heading">{userData.petStats.energy}%</span>
                  </div>
                  <Progress value={userData.petStats.energy} className="h-2" />
                </div>
                <div className="pt-4 border-t border-secondary/20">
                  <p className="text-light-gray text-sm">Pet Level: <span className="text-secondary font-heading">{userData.petStats.level}</span></p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Test Controls */}
          <DashboardTestControls />
        </div>
      </div>
    </div>
  );
}
