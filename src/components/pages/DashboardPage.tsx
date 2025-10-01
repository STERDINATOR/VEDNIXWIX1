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
  Play, 
  Trophy, 
  Users, 
  BookOpen, 
  Zap, 
  Target, 
  Flame,
  Star,
  Sword,
  Crown,
  Calendar,
  TrendingUp,
  Sparkles,
  User,
  MessageCircle,
  Video,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Image } from '@/components/ui/image';

export default function DashboardPage() {
  const { member } = useMember();
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [showMentorCall, setShowMentorCall] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [userCharacter, setUserCharacter] = useState<any>(null);
  const [petInteractionCount, setPetInteractionCount] = useState(0);
  const [questProgress, setQuestProgress] = useState<{[key: number]: number}>({
    1: 75,
    2: 30,
    3: 90
  });
  const [weeklyProgress, setWeeklyProgress] = useState(1250);
  const [todayXP, setTodayXP] = useState(450);
  const [dailyStreak, setDailyStreak] = useState(15);

  // Load user character from localStorage on component mount
  useEffect(() => {
    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      try {
        setUserCharacter(JSON.parse(savedCharacter));
      } catch (error) {
        console.error('Error loading user character:', error);
      }
    }

    // Load saved progress data
    const savedProgress = localStorage.getItem('dashboardProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setQuestProgress(progress.questProgress || { 1: 75, 2: 30, 3: 90 });
        setWeeklyProgress(progress.weeklyProgress || 1250);
        setTodayXP(progress.todayXP || 450);
        setDailyStreak(progress.dailyStreak || 15);
        setPetInteractionCount(progress.petInteractionCount || 0);
      } catch (error) {
        console.error('Error loading progress data:', error);
      }
    }
  }, []);

  // Save progress data to localStorage
  const saveProgress = () => {
    const progressData = {
      questProgress,
      weeklyProgress,
      todayXP,
      dailyStreak,
      petInteractionCount
    };
    localStorage.setItem('dashboardProgress', JSON.stringify(progressData));
  };

  // Save character to localStorage when it changes
  const handleCharacterGenerated = (character: any) => {
    setUserCharacter(character);
    localStorage.setItem('userCharacter', JSON.stringify(character));
    setShowCharacterGenerator(false);
  };

  // Handle quest continuation
  const handleContinueQuest = (questId: number) => {
    setQuestProgress(prev => {
      const newProgress = { ...prev };
      if (newProgress[questId] < 100) {
        newProgress[questId] = Math.min(100, newProgress[questId] + 10);
        setTodayXP(prevXP => prevXP + 50);
        setWeeklyProgress(prevWeekly => prevWeekly + 50);
      }
      return newProgress;
    });
    saveProgress();
  };

  // Handle pet interaction
  const handlePetInteraction = () => {
    setPetInteractionCount(prev => prev + 1);
    setTodayXP(prevXP => prevXP + 25);
    setWeeklyProgress(prevWeekly => prevWeekly + 25);
    saveProgress();
  };

  // Handle daily streak extension
  const handleStreakBonus = () => {
    setDailyStreak(prev => prev + 1);
    setTodayXP(prevXP => prevXP + 100);
    setWeeklyProgress(prevWeekly => prevWeekly + 100);
    saveProgress();
  };

  // Dynamic data that updates based on user interactions
  const dashboardData = {
    dailyStreak,
    todayXP,
    weeklyGoal: 2000,
    weeklyProgress,
    currentQuests: [
      { id: 1, title: 'Master Quantum Physics', progress: questProgress[1], difficulty: 'Hard', xp: 500 },
      { id: 2, title: 'Algebra Boss Battle', progress: questProgress[2], difficulty: 'Epic', xp: 750 },
      { id: 3, title: 'Code the Matrix', progress: questProgress[3], difficulty: 'Medium', xp: 300 }
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
      { rank: 4, name: member?.profile?.nickname || 'You', xp: 15750 + weeklyProgress, avatar: '⚡', isUser: true },
      { rank: 5, name: 'MathMaster', xp: 15200, avatar: '🧮' }
    ],
    petStatus: {
      name: 'Neko-chan',
      mood: petInteractionCount > 5 ? 'Ecstatic' : petInteractionCount > 2 ? 'Happy' : 'Content',
      energy: Math.min(100, 85 + (petInteractionCount * 3)),
      level: 38 + Math.floor(petInteractionCount / 3),
      nextEvolution: 40
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Welcome Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-heading font-black text-primary mb-4">
            Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'Cyber Student'}!
          </h1>
          <p className="text-xl font-paragraph text-light-gray">
            Ready to continue your cyberpunk learning adventure?
          </p>
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
                    icon: <Flame className="h-8 w-8" />, 
                    color: 'text-secondary',
                    bgColor: 'bg-secondary/20'
                  },
                  { 
                    label: 'Today\'s XP', 
                    value: dashboardData.todayXP, 
                    icon: <Zap className="h-8 w-8" />, 
                    color: 'text-primary',
                    bgColor: 'bg-primary/20'
                  },
                  { 
                    label: 'Active Quests', 
                    value: dashboardData.currentQuests.length, 
                    icon: <Target className="h-8 w-8" />, 
                    color: 'text-neon-green',
                    bgColor: 'bg-neon-green/20'
                  },
                  { 
                    label: 'Rank', 
                    value: '#4', 
                    icon: <Crown className="h-8 w-8" />, 
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
                          <Play className="h-4 w-4 mr-1" />
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
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowCharacterGenerator(true)}
                        className="border-secondary text-secondary w-full"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
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
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Character
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Pet Status */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6 text-center">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">Your Anime Pet</h3>
                <div 
                  className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-5xl animate-bounce cursor-pointer hover:scale-110 transition-transform relative overflow-hidden"
                  onClick={() => setShowPetModal(true)}
                >
                  {/* Enhanced anime-style pet display */}
                  <div className="relative">
                    <span className="text-5xl filter drop-shadow-lg">🐱</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-yellow rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  </div>
                </div>
                <h4 className="font-heading font-bold text-primary mb-2">{dashboardData.petStatus.name}</h4>
                <p className="text-sm font-paragraph text-light-gray mb-3">
                  Level {dashboardData.petStatus.level} • {dashboardData.petStatus.mood}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span>Energy</span>
                    <span>{dashboardData.petStatus.energy}%</span>
                  </div>
                  <Progress value={dashboardData.petStatus.energy} className="h-2" />
                </div>
                <p className="text-xs font-paragraph text-light-gray mb-3">
                  {dashboardData.petStatus.nextEvolution - dashboardData.petStatus.level} levels to evolution
                </p>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
                    onClick={handlePetInteraction}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Interact (+25 XP)
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10 w-full"
                    onClick={() => setShowPetModal(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Customize Pet
                  </Button>
                  <div className="text-xs font-paragraph text-neon-green">
                    💧 "{petInteractionCount > 5 ? 'You\'re the best trainer ever!' : 
                         petInteractionCount > 2 ? 'Thanks for playing with me!' : 
                         'Remember to drink water!'}"
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
                    <TrendingUp className="h-4 w-4 mr-2" />
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
                        {event.type === 'battle' && <Sword className="h-4 w-4 text-secondary" />}
                        {event.type === 'event' && <Star className="h-4 w-4 text-cyber-yellow" />}
                        {event.type === 'raid' && <Trophy className="h-4 w-4 text-primary" />}
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
                    <Calendar className="h-4 w-4 mr-2" />
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
              { label: 'Start Learning', icon: <BookOpen className="h-6 w-6" />, link: '/learn', color: 'bg-primary' },
              { label: 'Battle Arena', icon: <Sword className="h-6 w-6" />, link: '/battle', color: 'bg-secondary' },
              { label: 'Join Guild', icon: <Users className="h-6 w-6" />, link: '/guilds', color: 'bg-neon-green' },
              { 
                label: 'AI Mentor', 
                icon: <MessageCircle className="h-6 w-6" />, 
                action: () => userCharacter ? setShowMentorCall(true) : setShowCharacterGenerator(true), 
                color: 'bg-cyber-yellow' 
              },
              { label: 'Shop', icon: <Star className="h-6 w-6" />, link: '/shop', color: 'bg-primary' }
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