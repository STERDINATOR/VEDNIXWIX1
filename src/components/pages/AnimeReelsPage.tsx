import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReelFeed } from '@/components/ui/reel-feed';
import { AnimeTrialReels } from '@/components/ui/anime-trial-reels';
import { InteractiveQuiz } from '@/components/ui/interactive-quiz';
import { MentorMonologue } from '@/components/ui/mentor-monologue';
import { HabitTracker } from '@/components/ui/habit-tracker';
import { EngagementDashboard } from '@/components/ui/engagement-dashboard';
import { PersonalizedReelFeed } from '@/components/ui/personalized-reel-feed';
import { InteractiveReelOverlay } from '@/components/ui/interactive-reel-overlay';
import { ReelPlaylistSystem } from '@/components/ui/reel-playlist-system';
import { ReelTimeVariants } from '@/components/ui/reel-time-variants';
import { MentorReelReminders } from '@/components/ui/mentor-reel-reminders';
import { EmotionAdaptiveRealityShift } from '@/components/ui/emotion-adaptive-reality-shift';
import { TimeSkipTrainingRoom } from '@/components/ui/time-skip-training-room';
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
  Target,
  Heart,
  Layers,
  Bell
} from 'lucide-react';
import { InstagramStyleReels } from '@/components/ui/instagram-style-reels';
import { getTopicCoverImage, getTopicIcon } from '@/lib/reel-cover-images';
import { useMember } from '@/integrations';
import { useProgressStore } from '@/stores/userProgressStore';

export default function AnimeReelsPage() {
  const { member } = useMember();
  const { userProgress } = useProgressStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'instagram' | 'personalized' | 'interactive' | 'playlists' | 'timeVariants' | 'reminders' | 'quiz' | 'mentor' | 'analytics'>('instagram');

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
          className="flex gap-4 mb-8 overflow-x-auto pb-2 flex-wrap"
        >
          {[
            { id: 'instagram', label: 'Instagram Reels', icon: Film },
            { id: 'personalized', label: 'Personalized', icon: Heart },
            { id: 'interactive', label: 'Interactive', icon: Zap },
            { id: 'playlists', label: 'Playlists', icon: Layers },
            { id: 'timeVariants', label: 'Time Variants', icon: Clock },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'quiz', label: 'Quiz', icon: Target },
            { id: 'mentor', label: 'Mentor', icon: BookOpen },
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
          {/* Instagram Style Reels Tab */}
          {activeTab === 'instagram' && (
            <InstagramStyleReels
              reels={[
                {
                  id: 'reel-1',
                  title: 'Algebra Fundamentals',
                  topic: 'Algebra',
                  difficulty: 'Easy',
                  duration: 420,
                  coverImage: getTopicCoverImage('Algebra'),
                  topicIcon: getTopicIcon('Algebra'),
                  description: 'Learn the fundamentals of algebra with clear explanations and examples.',
                  viewCount: 1250,
                  likeCount: 340,
                  commentCount: 45,
                  saveCount: 120,
                  xpReward: 7
                },
                {
                  id: 'reel-2',
                  title: 'Quadratic Equations',
                  topic: 'Algebra',
                  difficulty: 'Medium',
                  duration: 540,
                  coverImage: getTopicCoverImage('Algebra'),
                  topicIcon: getTopicIcon('Algebra'),
                  description: 'Master quadratic equations and their solutions.',
                  viewCount: 980,
                  likeCount: 280,
                  commentCount: 32,
                  saveCount: 95,
                  xpReward: 9
                },
                {
                  id: 'reel-3',
                  title: 'Advanced Polynomials',
                  topic: 'Algebra',
                  difficulty: 'Hard',
                  duration: 720,
                  coverImage: getTopicCoverImage('Algebra'),
                  topicIcon: getTopicIcon('Algebra'),
                  description: 'Explore advanced polynomial operations and factoring techniques.',
                  viewCount: 650,
                  likeCount: 190,
                  commentCount: 28,
                  saveCount: 75,
                  xpReward: 12
                },
                {
                  id: 'reel-4',
                  title: 'Geometry Basics',
                  topic: 'Geometry',
                  difficulty: 'Easy',
                  duration: 480,
                  coverImage: getTopicCoverImage('Geometry'),
                  topicIcon: getTopicIcon('Geometry'),
                  description: 'Introduction to basic geometry concepts and shapes.',
                  viewCount: 1450,
                  likeCount: 420,
                  commentCount: 52,
                  saveCount: 140,
                  xpReward: 8
                },
                {
                  id: 'reel-5',
                  title: 'Trigonometry Intro',
                  topic: 'Geometry',
                  difficulty: 'Medium',
                  duration: 600,
                  coverImage: getTopicCoverImage('Geometry'),
                  topicIcon: getTopicIcon('Geometry'),
                  description: 'Get started with trigonometry and trigonometric functions.',
                  viewCount: 890,
                  likeCount: 260,
                  commentCount: 35,
                  saveCount: 85,
                  xpReward: 10
                },
                {
                  id: 'reel-6',
                  title: 'Circle Theorems',
                  topic: 'Geometry',
                  difficulty: 'Hard',
                  duration: 660,
                  coverImage: getTopicCoverImage('Geometry'),
                  topicIcon: getTopicIcon('Geometry'),
                  description: 'Deep dive into circle theorems and properties.',
                  viewCount: 720,
                  likeCount: 210,
                  commentCount: 30,
                  saveCount: 80,
                  xpReward: 11
                },
                {
                  id: 'reel-7',
                  title: 'Limits & Continuity',
                  topic: 'Calculus',
                  difficulty: 'Medium',
                  duration: 720,
                  coverImage: getTopicCoverImage('Calculus'),
                  topicIcon: getTopicIcon('Calculus'),
                  description: 'Understand limits and continuity in calculus.',
                  viewCount: 1100,
                  likeCount: 320,
                  commentCount: 48,
                  saveCount: 110,
                  xpReward: 12
                },
                {
                  id: 'reel-8',
                  title: 'Derivatives Explained',
                  topic: 'Calculus',
                  difficulty: 'Hard',
                  duration: 840,
                  coverImage: getTopicCoverImage('Calculus'),
                  topicIcon: getTopicIcon('Calculus'),
                  description: 'Master derivatives and their applications.',
                  viewCount: 850,
                  likeCount: 240,
                  commentCount: 38,
                  saveCount: 95,
                  xpReward: 14
                },
                {
                  id: 'reel-9',
                  title: 'Integrals Mastery',
                  topic: 'Calculus',
                  difficulty: 'Hard',
                  duration: 900,
                  coverImage: getTopicCoverImage('Calculus'),
                  topicIcon: getTopicIcon('Calculus'),
                  description: 'Learn integration techniques and applications.',
                  viewCount: 920,
                  likeCount: 270,
                  commentCount: 42,
                  saveCount: 105,
                  xpReward: 15
                },
                {
                  id: 'reel-10',
                  title: 'Data Distribution',
                  topic: 'Statistics',
                  difficulty: 'Easy',
                  duration: 480,
                  coverImage: getTopicCoverImage('Statistics'),
                  topicIcon: getTopicIcon('Statistics'),
                  description: 'Understand data distributions and statistical analysis.',
                  viewCount: 1320,
                  likeCount: 380,
                  commentCount: 50,
                  saveCount: 125,
                  xpReward: 8
                },
                {
                  id: 'reel-11',
                  title: 'Probability Theory',
                  topic: 'Statistics',
                  difficulty: 'Medium',
                  duration: 600,
                  coverImage: getTopicCoverImage('Statistics'),
                  topicIcon: getTopicIcon('Statistics'),
                  description: 'Master probability concepts and applications.',
                  viewCount: 1050,
                  likeCount: 300,
                  commentCount: 44,
                  saveCount: 100,
                  xpReward: 10
                },
                {
                  id: 'reel-12',
                  title: 'Hypothesis Testing',
                  topic: 'Statistics',
                  difficulty: 'Hard',
                  duration: 780,
                  coverImage: getTopicCoverImage('Statistics'),
                  topicIcon: getTopicIcon('Statistics'),
                  description: 'Learn hypothesis testing and statistical inference.',
                  viewCount: 780,
                  likeCount: 220,
                  commentCount: 36,
                  saveCount: 88,
                  xpReward: 13
                },
                {
                  id: 'reel-13',
                  title: 'Motion & Forces',
                  topic: 'Physics',
                  difficulty: 'Easy',
                  duration: 540,
                  coverImage: getTopicCoverImage('Physics'),
                  topicIcon: getTopicIcon('Physics'),
                  description: 'Understand motion, forces, and Newton\'s laws.',
                  viewCount: 1180,
                  likeCount: 340,
                  commentCount: 46,
                  saveCount: 115,
                  xpReward: 9
                },
                {
                  id: 'reel-14',
                  title: 'Energy & Work',
                  topic: 'Physics',
                  difficulty: 'Medium',
                  duration: 660,
                  coverImage: getTopicCoverImage('Physics'),
                  topicIcon: getTopicIcon('Physics'),
                  description: 'Explore energy, work, and power concepts.',
                  viewCount: 950,
                  likeCount: 280,
                  commentCount: 40,
                  saveCount: 98,
                  xpReward: 11
                },
                {
                  id: 'reel-15',
                  title: 'Quantum Mechanics',
                  topic: 'Physics',
                  difficulty: 'Epic',
                  duration: 900,
                  coverImage: getTopicCoverImage('Physics'),
                  topicIcon: getTopicIcon('Physics'),
                  description: 'Introduction to quantum mechanics and wave-particle duality.',
                  viewCount: 680,
                  likeCount: 200,
                  commentCount: 32,
                  saveCount: 75,
                  xpReward: 16
                }
              ]}
              onPlayReel={(reelId) => {
                console.log(`Playing reel: ${reelId}`);
                // Reel playback is now fully functional with the modal viewer
              }}
              onMentorAccess={(reelId) => {
                console.log(`Accessing mentor for reel: ${reelId}`);
                // Navigate to mentor page or open mentor chat
                window.location.href = '/mentor';
              }}
            />
          )}
          {/* Personalized Feed Tab */}
          {activeTab === 'personalized' && (
            <PersonalizedReelFeed />
          )}

          {/* Interactive Overlay Tab */}
          {activeTab === 'interactive' && (
            <InteractiveReelOverlay />
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <ReelPlaylistSystem />
          )}

          {/* Time Variants Tab */}
          {activeTab === 'timeVariants' && (
            <ReelTimeVariants />
          )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <MentorReelReminders />
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

        {/* Emotion-Adaptive Reality Shift - Mood-Based Learning */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-heading font-bold text-primary mb-8">Emotion-Adaptive Learning Experience</h2>
          <p className="text-lg font-paragraph text-light-gray mb-8 max-w-3xl">
            Your emotional state shapes your learning world. The system adapts content difficulty, pacing, and rewards based on how you're feeling, creating a personalized learning environment that responds to your mood.
          </p>
          <EmotionAdaptiveRealityShift />
        </motion.div>

        {/* Time-Skip Training Room - Accelerated Learning */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-heading font-bold text-secondary mb-8">Time-Skip Training Room</h2>
          <p className="text-lg font-paragraph text-light-gray mb-8 max-w-3xl">
            Accelerate your learning with compressed time progression. Complete weeks of study in hours with our advanced training methodology that maintains retention while maximizing efficiency.
          </p>
          <TimeSkipTrainingRoom />
        </motion.div>
      </div>
    </div>
  );
}
