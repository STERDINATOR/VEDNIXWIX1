import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReelFeed } from '@/components/ui/reel-feed';
import { InteractiveQuiz } from '@/components/ui/interactive-quiz';
import { MentorMonologue } from '@/components/ui/mentor-monologue';
import { HabitTracker } from '@/components/ui/habit-tracker';
import { EngagementDashboard } from '@/components/ui/engagement-dashboard';
import { 
  Film, 
  Play, 
  Star, 
  Zap, 
  Clock, 
  Users,
  TrendingUp,
  Filter,
  Search,
  BookOpen,
  Trophy,
  Target
} from 'lucide-react';
import { useMember } from '@/integrations';
import { useProgressStore } from '@/stores/userProgressStore';

export default function AnimeReelsPage() {
  const { member } = useMember();
  const { userProgress } = useProgressStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'feed' | 'quiz' | 'mentor' | 'analytics'>('feed');

  const categories = [
    { id: 'all', name: 'All Topics', count: 15 },
    { id: 'Algebra', name: 'Algebra', count: 3 },
    { id: 'Geometry', name: 'Geometry', count: 3 },
    { id: 'Calculus', name: 'Calculus', count: 3 },
    { id: 'Statistics', name: 'Statistics', count: 3 },
    { id: 'Physics', name: 'Physics', count: 3 }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Easy', name: 'Easy', color: 'text-cyber-yellow' },
    { id: 'Medium', name: 'Medium', color: 'text-neon-green' },
    { id: 'Hard', name: 'Hard', color: 'text-primary' },
    { id: 'Epic', name: 'Epic', color: 'text-secondary' }
  ];

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
          <h1 className="text-6xl font-heading font-black text-primary mb-4">
            Anime Learning Reels
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-3xl mx-auto">
            Immerse yourself in educational content through captivating anime scenes. 
            Learn, interact, and earn XP through our revolutionary reel-based learning system.
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
            <Film className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">15</p>
            <p className="text-sm font-paragraph text-light-gray">Total Reels</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Zap className="h-8 w-8 text-neon-green mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{userProgress?.totalXP || 0}</p>
            <p className="text-sm font-paragraph text-light-gray">Your Total XP</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{userProgress?.level || 1}</p>
            <p className="text-sm font-paragraph text-light-gray">Current Level</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Star className="h-8 w-8 text-cyber-yellow mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{userProgress?.achievements.length || 0}</p>
            <p className="text-sm font-paragraph text-light-gray">Achievements</p>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 mb-8 overflow-x-auto pb-2"
        >
          {[
            { id: 'feed', label: 'Reel Feed', icon: Film },
            { id: 'quiz', label: 'Interactive Quiz', icon: Target },
            { id: 'mentor', label: 'Mentor Guidance', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-dark-gray border border-primary/20 text-light-gray hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Reel Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Filters */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Category Filter */}
                  <Card className="bg-dark-gray border-primary/20 p-6">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Topics
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'ghost'}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full justify-between ${
                            selectedCategory === category.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-light-gray hover:text-foreground'
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {category.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Difficulty Filter */}
                  <Card className="bg-dark-gray border-primary/20 p-6">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-secondary" />
                      Difficulty
                    </h3>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <Button
                          key={difficulty.id}
                          variant={selectedDifficulty === difficulty.id ? 'default' : 'ghost'}
                          onClick={() => setSelectedDifficulty(difficulty.id)}
                          className={`w-full justify-start ${
                            selectedDifficulty === difficulty.id 
                              ? 'bg-secondary text-secondary-foreground' 
                              : 'text-light-gray hover:text-foreground'
                          }`}
                        >
                          <span className={difficulty.color || 'text-foreground'}>
                            {difficulty.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-dark-gray border-primary/20 p-6">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-neon-green" />
                      Your Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-paragraph text-light-gray text-sm">Reels Watched:</span>
                        <span className="font-heading font-bold text-primary">
                          {userProgress?.completedReels.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-paragraph text-light-gray text-sm">XP Earned:</span>
                        <span className="font-heading font-bold text-neon-green">
                          {userProgress?.totalXP || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-paragraph text-light-gray text-sm">Quizzes Completed:</span>
                        <span className="font-heading font-bold text-secondary">
                          {userProgress?.completedQuizzes.length || 0}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main Content - Reel Feed */}
                <div className="lg:col-span-3">
                  <ReelFeed topicFilter={selectedCategory === 'all' ? undefined : selectedCategory} difficultyFilter={selectedDifficulty === 'all' ? undefined : selectedDifficulty} />
                </div>
              </div>
            </div>
          )}

          {/* Interactive Quiz Tab */}
          {activeTab === 'quiz' && (
            <Card className="bg-dark-gray border-primary/20 p-8">
              <InteractiveQuiz onComplete={(score, total) => {
                console.log(`Quiz completed with score: ${score}/${total}`);
              }} />
            </Card>
          )}

          {/* Mentor Guidance Tab */}
          {activeTab === 'mentor' && (
            <div className="space-y-6">
              <MentorMonologue topic={selectedCategory === 'all' ? 'Algebra' : selectedCategory} difficulty={selectedDifficulty === 'all' ? 'Medium' : selectedDifficulty} />
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="font-heading text-lg text-primary mb-4">Mentor Tips</h3>
                <div className="space-y-4">
                  <p className="font-paragraph text-light-gray">
                    💡 <strong>Consistency is Key:</strong> Study a little bit every day rather than cramming. Your daily streak shows your commitment!
                  </p>
                  <p className="font-paragraph text-light-gray">
                    🎯 <strong>Focus on Weak Areas:</strong> The system identifies topics where you struggle. Spend extra time on these to improve faster.
                  </p>
                  <p className="font-paragraph text-light-gray">
                    🏆 <strong>Unlock Achievements:</strong> Complete challenges to earn special badges and unlock exclusive content.
                  </p>
                  <p className="font-paragraph text-light-gray">
                    📈 <strong>Track Progress:</strong> Check your analytics dashboard to see how far you've come and celebrate your wins!
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {userProgress && (
                <>
                  <HabitTracker
                    userId={member?.loginEmail || 'user'}
                    dailyStreak={userProgress.dailyStreak}
                    lastActivityDate={userProgress.lastActivityDate}
                    reelsWatchedToday={userProgress.completedReels.length}
                    quizzesTakenToday={userProgress.completedQuizzes.length}
                    xpEarnedToday={userProgress.totalXP}
                  />
                  <EngagementDashboard
                    totalXP={userProgress.totalXP}
                    level={userProgress.level}
                    completedReels={userProgress.completedReels.length}
                    completedQuizzes={userProgress.completedQuizzes.length}
                    achievements={userProgress.achievements.length}
                  />
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}