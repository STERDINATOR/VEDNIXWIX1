import { motion } from 'framer-motion';
import { useMember } from '@/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimeCharacterGenerator } from '@/components/ui/anime-character-generator';
import { AnimeMentor } from '@/components/ui/anime-mentor';
import { AnimePet } from '@/components/ui/anime-pet';
import { 
  BookOpen, 
  Zap, 
  Target, 
  Calendar,
  TrendingUp,
  User,
  MessageCircle,
  Video,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Image } from '@/components/ui/image';
import { useProgressStore, initializeProgressStore } from '@/stores/progressStore';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export default function DashboardPage() {
  const { member } = useMember();
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [showMentorCall, setShowMentorCall] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [userCharacter, setUserCharacter] = useState<any>(null);

  // Use the progress store for real-time sync
  const {
    progressData,
    updateQuestProgress,
    updateWeeklyProgress,
    updateTodayXP,
    incrementDailyStreak,
    incrementPetInteraction,
    isSyncing,
  } = useProgressStore();

  // Setup real-time synchronization
  const { manualSync } = useRealtimeSync({
    enabled: true,
    interval: 30000, // Sync every 30 seconds
    onSyncSuccess: () => {
      console.log('Progress synced successfully');
    },
    onSyncError: (error) => {
      console.error('Sync error:', error);
    },
    broadcastChannel: true, // Enable cross-tab sync
  });

  // Load user character from localStorage on component mount
  useEffect(() => {
    // Initialize progress store from localStorage
    initializeProgressStore();

    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      try {
        setUserCharacter(JSON.parse(savedCharacter));
      } catch (error) {
        console.error('Error loading user character:', error);
      }
    }
  }, []);

  // Save character to localStorage when it changes
  const handleCharacterGenerated = (character: any) => {
    setUserCharacter(character);
    localStorage.setItem('userCharacter', JSON.stringify(character));
    setShowCharacterGenerator(false);
  };

  // Handle quest continuation with real-time sync
  const handleContinueQuest = (questId: number) => {
    const currentProgress = progressData.questProgress[questId] || 0;
    if (currentProgress < 100) {
      updateQuestProgress(questId, currentProgress + 10);
      updateTodayXP(50);
      updateWeeklyProgress(50);
      // Trigger immediate sync
      manualSync();
    }
  };

  // Handle pet interaction with real-time sync
  const handlePetInteraction = () => {
    incrementPetInteraction();
    updateTodayXP(25);
    updateWeeklyProgress(25);
    // Trigger immediate sync
    manualSync();
  };

  // Handle daily streak extension with real-time sync
  const handleStreakBonus = () => {
    incrementDailyStreak();
    updateTodayXP(100);
    updateWeeklyProgress(100);
    // Trigger immediate sync
    manualSync();
  };

  // Dynamic data that updates based on user interactions
  const dashboardData = {
    dailyStreak: progressData.dailyStreak,
    todayXP: progressData.todayXP,
    weeklyGoal: 2000,
    weeklyProgress: progressData.weeklyProgress,
    currentQuests: [
      { id: 1, title: 'Master Quantum Physics', progress: progressData.questProgress[1] || 0, difficulty: 'Hard', xp: 500 },
      { id: 2, title: 'Algebra Boss Battle', progress: progressData.questProgress[2] || 0, difficulty: 'Epic', xp: 750 },
      { id: 3, title: 'Code the Matrix', progress: progressData.questProgress[3] || 0, difficulty: 'Medium', xp: 300 }
    ],
    upcomingEvents: [
      { title: 'Guild War: Math Masters vs Code Ninjas', time: '2 hours', type: 'battle' },
      { title: 'Seasonal Festival: Cyber Spring', time: '1 day', type: 'event' },
      { title: 'Boss Raid: The Algorithm Dragon', time: '3 days', type: 'raid' }
    ],
    leaderboard: [
      { rank: 1, name: 'CyberSamurai99', xp: 25000, avatar: '🥷' },
      { rank: 2, name: 'QuantumQueen', xp: 23500, avatar: '👑' },
      { rank: 3, name: 'CodeNinja42', xp: 22100, avatar: '🥋' },
      { rank: 4, name: member?.profile?.nickname || 'You', xp: 15750 + progressData.weeklyProgress, avatar: '⚡', isUser: true },
      { rank: 5, name: 'MathMaster', xp: 15200, avatar: '🧮' }
    ],
    petStatus: {
      name: 'Neko-chan',
      mood: progressData.petInteractionCount > 5 ? 'Ecstatic' : progressData.petInteractionCount > 2 ? 'Happy' : 'Content',
      energy: Math.min(100, 85 + (progressData.petInteractionCount * 3)),
      level: 38 + Math.floor(progressData.petInteractionCount / 3),
      nextEvolution: 40
    }
  };

  return (
    <div className="min-h-screen text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Welcome Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-heading font-black text-primary mb-4">
                Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'Cyber Student'}!
              </h1>
              <p className="text-xl font-paragraph text-light-gray">
                Ready to continue your cyberpunk learning adventure?
              </p>
            </div>
            {isSyncing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-paragraph text-primary">Syncing...</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Daily Stats */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { 
                    label: 'Daily Streak', 
                    value: dashboardData.dailyStreak, 
                    icon: <span className="text-4xl">🔥</span>, 
                    color: 'text-secondary',
                    bgColor: 'bg-secondary/20'
                  },
                  { 
                    label: 'Today\'s XP', 
                    value: dashboardData.todayXP, 
                    icon: <span className="text-4xl">⚡</span>, 
                    color: 'text-primary',
                    bgColor: 'bg-primary/20'
                  },
                  { 
                    label: 'Active Quests', 
                    value: dashboardData.currentQuests.length, 
                    icon: <span className="text-4xl">🎯</span>, 
                    color: 'text-neon-green',
                    bgColor: 'bg-neon-green/20'
                  },
                  { 
                    label: 'Rank', 
                    value: '#4', 
                    icon: <span className="text-4xl">👑</span>, 
                    color: 'text-cyber-yellow',
                    bgColor: 'bg-cyber-yellow/20'
                  }
                ].map((stat, index) => (
                  <Card key={index} className={`bg-dark-gray border-primary/20 p-6 ${stat.bgColor}`}>
                    <div className={`${stat.color} mb-3`}>
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-heading font-black text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm font-paragraph text-light-gray">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-heading font-bold text-foreground">Weekly Goal</h3>
                  <Badge className="bg-primary/20 text-primary">
                    {Math.round((dashboardData.weeklyProgress / dashboardData.weeklyGoal) * 100)}% Complete
                  </Badge>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-paragraph text-light-gray mb-2">
                    <span>{dashboardData.weeklyProgress} XP</span>
                    <span>{dashboardData.weeklyGoal} XP</span>
                  </div>
                  <Progress 
                    value={(dashboardData.weeklyProgress / dashboardData.weeklyGoal) * 100} 
                    className="h-4"
                  />
                </div>
                <p className="text-sm font-paragraph text-light-gray">
                  {dashboardData.weeklyGoal - dashboardData.weeklyProgress} XP remaining to reach your weekly goal
                </p>
              </Card>
            </motion.div>

            {/* Active Quests */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-bold text-foreground">Active Quests</h3>
                  <Link to="/learn">
                    <Button variant="outline" className="border-primary text-primary">
                      View All Quests
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {dashboardData.currentQuests.map((quest) => (
                    <div key={quest.id} className="p-4 bg-background rounded border border-primary/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-heading font-bold text-foreground">{quest.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={
                                quest.difficulty === 'Epic' ? 'border-secondary text-secondary' :
                                quest.difficulty === 'Hard' ? 'border-primary text-primary' :
                                'border-neon-green text-neon-green'
                              }
                            >
                              {quest.difficulty}
                            </Badge>
                            <span className="text-sm font-paragraph text-light-gray">+{quest.xp} XP</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleContinueQuest(quest.id)}
                          disabled={quest.progress >= 100}
                        >
                          <span className="mr-1 text-lg">▶️</span>
                          {quest.progress >= 100 ? 'Complete!' : 'Continue'}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={quest.progress} className="flex-1 h-2" />
                        <span className="text-sm font-paragraph text-light-gray">{quest.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Character & AI Mentor */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">Your AI Companion</h3>
                
                {userCharacter ? (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary overflow-hidden">
                      <Image 
                        src={userCharacter.image} 
                        alt={userCharacter.name} 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h4 className="font-heading font-bold text-primary mb-1">{userCharacter.name}</h4>
                    <p className="text-sm font-paragraph text-light-gray mb-3">
                      {userCharacter.personality?.trait || 'AI Study Companion'}
                    </p>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        onClick={() => setShowMentorCall(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                      >
                        <span className="mr-2 text-lg">📹</span>
                        Video Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowCharacterGenerator(true)}
                        className="border-secondary text-secondary w-full"
                      >
                        <span className="mr-2 text-lg">✨</span>
                        Customize
                      </Button>
                    </div>
                    <div className="text-xs font-paragraph text-neon-green mt-3">
                      "{userCharacter.personality?.catchphrase || 'Ready to learn together!'}"
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Create Your AI Mentor</h4>
                    <p className="text-sm font-paragraph text-light-gray mb-4">
                      Design a personalized Japanese anime character to guide your learning journey
                    </p>
                    <Button 
                      onClick={() => setShowCharacterGenerator(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    >
                      <span className="mr-2 text-lg">✨</span>
                      Create Character
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Enhanced Anime Pet Status */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6 text-center relative overflow-hidden">
                {/* Anime-style background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-cyber-yellow/10 opacity-50"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/20 rounded-full blur-lg"></div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                    <span className="text-primary">✨</span>
                    Your Anime Pet
                    <span className="text-secondary">✨</span>
                  </h3>
                  
                  {/* Enhanced Pet Display */}
                  <div 
                    className="w-28 h-28 mx-auto mb-4 relative cursor-pointer group"
                    onClick={() => setShowPetModal(true)}
                  >
                    {/* Multiple layered background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-cyber-yellow/30 rounded-full blur-lg scale-110 animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/15 to-secondary/15 rounded-full"></div>
                    
                    {/* Main pet container */}
                    <div className="relative z-10 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-primary/40 group-hover:border-primary/70 transition-all duration-300 shadow-lg">
                      {/* Enhanced anime-style pet display */}
                      <div className="relative">
                        <span className="text-6xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">🐱</span>
                        
                        {/* Floating anime particles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyber-yellow rounded-full animate-ping opacity-80"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary rounded-full animate-bounce opacity-70"></div>
                        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        
                        {/* Holographic effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyber-yellow rounded-full animate-bounce flex items-center justify-center text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                      ⭐
                    </div>
                    <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-primary rounded-full animate-pulse flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform duration-300">
                      💎
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Enhanced Pet Info */}
                  <div className="mb-4">
                    <h4 className="font-heading font-bold text-primary mb-2 flex items-center justify-center gap-2">
                      <span className="text-cyber-yellow">✦</span>
                      {dashboardData.petStatus.name}
                      <span className="text-neon-green">✦</span>
                    </h4>
                    
                    <div className="bg-background/50 rounded-lg p-2 mb-3 border border-primary/20">
                      <p className="text-sm font-paragraph text-light-gray">
                        Level {dashboardData.petStatus.level} • {dashboardData.petStatus.mood}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Badge className="bg-primary/20 text-primary text-xs">
                          <span className="mr-1">⚡</span>
                          Cyber Cat
                        </Badge>
                        <Badge className="bg-secondary/20 text-secondary text-xs">
                          <span className="mr-1">💫</span>
                          Playful
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Energy Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <span className="text-neon-green">⚡</span>
                        Energy
                      </span>
                      <span className="text-neon-green font-bold">{dashboardData.petStatus.energy}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={dashboardData.petStatus.energy} className="h-3 bg-dark-gray" />
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-cyber-yellow/20 rounded-full blur-sm"></div>
                    </div>
                  </div>
                  
                  {/* Evolution Progress */}
                  <div className="mb-4">
                    <p className="text-xs font-paragraph text-light-gray mb-2 flex items-center justify-center gap-1">
                      <span className="text-cyber-yellow">🌟</span>
                      {dashboardData.petStatus.nextEvolution - dashboardData.petStatus.level} levels to evolution
                      <span className="text-cyber-yellow">🌟</span>
                    </p>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70 w-full border border-secondary/30 shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handlePetInteraction}
                    >
                      <span className="mr-2 text-lg">💖</span>
                      <span className="font-heading font-bold">Interact (+25 XP)</span>
                      <span className="ml-2">💖</span>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10 w-full border-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => setShowPetModal(true)}
                    >
                      <span className="mr-2 text-lg">✨</span>
                      <span className="font-heading font-bold">Customize Pet</span>
                      <span className="ml-2">✨</span>
                    </Button>
                    
                    {/* Pet Chat Bubble */}
                    <div className="bg-primary/10 rounded-lg p-3 border border-primary/20 mt-3">
                      <div className="text-xs font-paragraph text-neon-green text-center italic">
                        <span className="text-primary">💬</span>
                        "{progressData.petInteractionCount > 5 ? 'You\'re the best trainer ever! ✨' : 
                           progressData.petInteractionCount > 2 ? 'Thanks for playing with me! 🎮' : 
                           'Remember to drink water! 💧'}"
                        <span className="text-secondary">💬</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">Weekly Leaderboard</h3>
                <div className="space-y-3">
                  {dashboardData.leaderboard.map((player) => (
                    <div 
                      key={player.rank} 
                      className={`flex items-center gap-3 p-2 rounded ${
                        player.isUser ? 'bg-primary/20 border border-primary/50' : 'bg-background'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        player.rank === 1 ? 'bg-cyber-yellow text-black' :
                        player.rank === 2 ? 'bg-light-gray text-black' :
                        player.rank === 3 ? 'bg-secondary text-white' :
                        'bg-dark-gray text-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <div className="text-lg">{player.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-paragraph text-foreground truncate">{player.name}</p>
                        <p className="text-xs text-light-gray">{player.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full mt-4 border-primary text-primary">
                    <span className="mr-2 text-lg">📈</span>
                    View Full Leaderboard
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {dashboardData.upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-background rounded border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        {event.type === 'battle' && <span className="text-lg">⚔️</span>}
                        {event.type === 'event' && <span className="text-lg">🌟</span>}
                        {event.type === 'raid' && <span className="text-lg">🏆</span>}
                        <Badge variant="outline" className="text-xs">
                          {event.time}
                        </Badge>
                      </div>
                      <p className="text-sm font-paragraph text-foreground">{event.title}</p>
                    </div>
                  ))}
                </div>
                <Link to="/achievements">
                  <Button variant="outline" className="w-full mt-4 border-primary text-primary">
                    <span className="mr-2 text-lg">📅</span>
                    View All Events
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Start Learning', icon: <span className="text-2xl">📚</span>, link: '/learn', color: 'bg-primary' },
              { label: 'Battle Arena', icon: <span className="text-2xl">⚔️</span>, link: '/battle', color: 'bg-secondary' },
              { label: 'Join Guild', icon: <span className="text-2xl">👥</span>, link: '/guilds', color: 'bg-neon-green' },
              { 
                label: 'AI Mentor', 
                icon: <span className="text-2xl">💬</span>, 
                action: () => userCharacter ? setShowMentorCall(true) : setShowCharacterGenerator(true), 
                color: 'bg-cyber-yellow' 
              },
              { label: 'Shop', icon: <span className="text-2xl">🌟</span>, link: '/shop', color: 'bg-primary' }
            ].map((action, index) => (
              action.link ? (
                <Link key={index} to={action.link}>
                  <Button 
                    className={`w-full h-20 ${action.color} text-black hover:opacity-90 flex-col gap-2`}
                  >
                    {action.icon}
                    <span className="font-heading font-bold">{action.label}</span>
                  </Button>
                </Link>
              ) : (
                <Button 
                  key={index}
                  onClick={action.action}
                  className={`w-full h-20 ${action.color} text-black hover:opacity-90 flex-col gap-2`}
                >
                  {action.icon}
                  <span className="font-heading font-bold">{action.label}</span>
                </Button>
              )
            ))}
          </div>
        </motion.div>

        {/* Character Generator Modal */}
        {showCharacterGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <h3 className="text-xl font-heading font-bold text-foreground">Create Your AI Mentor</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCharacterGenerator(false)}
                  className="text-light-gray hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[80vh]">
                <AnimeCharacterGenerator 
                  onCharacterGenerated={handleCharacterGenerated}
                  userPreferences={{
                    subject: 'general',
                    learningStyle: 'supportive',
                    personality: 'wise'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Mentor Video Call */}
        <AnimeMentor 
          isOpen={showMentorCall} 
          onClose={() => setShowMentorCall(false)}
          userCharacter={userCharacter}
        />

        {/* Anime Pet Modal */}
        <AnimePet 
          isOpen={showPetModal} 
          onClose={() => setShowPetModal(false)}
        />
      </div>
    </div>
  );
}
