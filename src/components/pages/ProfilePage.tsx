import { motion } from 'framer-motion';
import { useMember } from '@/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Target, 
  Calendar,
  Settings,
  Heart,
  Flame,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { member } = useMember();

  // Mock user data - in real app this would come from database
  const userStats = {
    level: 42,
    xp: 15750,
    xpToNext: 18000,
    streak: 15,
    totalAchievements: 28,
    rank: 'Cyber Samurai',
    petName: 'Neko-chan',
    petLevel: 38,
    guilds: ['Code Ninjas', 'Math Masters'],
    favoriteSubjects: ['Programming', 'Mathematics', 'Physics']
  };

  const achievements = [
    { name: 'First Quest', icon: '🎯', rarity: 'common' },
    { name: 'Speed Demon', icon: '⚡', rarity: 'rare' },
    { name: 'Knowledge Master', icon: '🧠', rarity: 'epic' },
    { name: 'Boss Slayer', icon: '⚔️', rarity: 'legendary' },
    { name: 'Perfect Streak', icon: '🔥', rarity: 'mythic' },
    { name: 'Team Player', icon: '🤝', rarity: 'rare' }
  ];

  const recentActivity = [
    { action: 'Completed', subject: 'Advanced Calculus Quest', xp: 250, time: '2 hours ago' },
    { action: 'Defeated', subject: 'Algebra Boss Battle', xp: 500, time: '1 day ago' },
    { action: 'Unlocked', subject: 'Quantum Physics Module', xp: 100, time: '2 days ago' },
    { action: 'Joined', subject: 'Code Ninjas Guild', xp: 50, time: '3 days ago' }
  ];

  const animeFeatures = [
    {
      title: 'Anime World Map',
      description: 'Explore vast learning territories',
      icon: '🗺️',
      path: '/anime-world'
    },
    {
      title: 'Story Arcs',
      description: 'Choose your narrative journey',
      icon: '📖',
      path: '/story-arcs'
    },
    {
      title: 'Episode Progression',
      description: 'Track your learning episodes',
      icon: '📺',
      path: '/episode-progression'
    },
    {
      title: 'Multiverse Portal',
      description: 'Explore alternate dimensions',
      icon: '🌀',
      path: '/multiverse'
    },
    {
      title: 'Character Flashbacks',
      description: 'Dive into character backstories',
      icon: '⚡',
      path: '/character-flashback'
    },
    {
      title: 'Manga Story Mode',
      description: 'Experience manga-style learning',
      icon: '📚',
      path: '/manga-story'
    }
  ];

  const advancedFeatures = [
    {
      title: 'Emotion-Adaptive Reality',
      icon: '✨',
      description: 'Content adapts to your emotional state'
    },
    {
      title: 'Knowledge Genome Mapping',
      icon: '🧬',
      description: 'Visualize your knowledge structure'
    },
    {
      title: 'Neural Story Combat',
      icon: '⚔️',
      description: 'Battle knowledge challenges'
    },
    {
      title: 'Multi-Mentor Collaboration',
      icon: '👥',
      description: 'Learn from multiple AI mentors'
    },
    {
      title: 'Time-Skip Training',
      icon: '⏱️',
      description: 'Accelerated learning sessions'
    },
    {
      title: 'Spirit Power Meter',
      icon: '⚡',
      description: 'Track your learning energy'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={member?.profile?.photo?.url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-heading">
                {member?.profile?.nickname?.[0] || member?.contact?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-heading font-black text-primary mb-2">
                {member?.profile?.nickname || member?.contact?.firstName || 'Cyber Student'}
              </h1>
              <p className="text-xl font-paragraph text-light-gray">
                Level {userStats.level} {userStats.rank}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="border-secondary text-secondary">
                  Rank #{Math.floor(Math.random() * 100) + 1}
                </Badge>
                <Badge variant="outline" className="border-neon-green text-neon-green">
                  <Flame className="h-4 w-4 mr-1" />
                  {userStats.streak} Day Streak
                </Badge>
              </div>
            </div>
          </div>
          
          <Link to="/settings">
            <Button variant="outline" className="border-primary text-primary">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-heading font-bold text-foreground">Experience Points</h3>
                  <div className="text-right">
                    <p className="text-3xl font-heading font-black text-primary">{userStats.xp.toLocaleString()}</p>
                    <p className="text-sm font-paragraph text-light-gray">
                      {(userStats.xpToNext - userStats.xp).toLocaleString()} XP to next level
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(userStats.xp / userStats.xpToNext) * 100} 
                  className="h-4 bg-dark-gray"
                />
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Quests Completed', value: '156', icon: <Target className="h-6 w-6" />, color: 'text-primary' },
                  { label: 'Boss Battles Won', value: '23', icon: <Trophy className="h-6 w-6" />, color: 'text-secondary' },
                  { label: 'Study Hours', value: '89', icon: <Calendar className="h-6 w-6" />, color: 'text-neon-green' },
                  { label: 'Achievements', value: userStats.totalAchievements.toString(), icon: <Award className="h-6 w-6" />, color: 'text-cyber-yellow' }
                ].map((stat, index) => (
                  <Card key={index} className="bg-dark-gray border-primary/20 p-4 text-center">
                    <div className={`${stat.color} mb-2 flex justify-center`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-paragraph text-light-gray">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background rounded border border-primary/10">
                      <div>
                        <p className="font-paragraph text-foreground">
                          <span className="text-primary font-semibold">{activity.action}</span> {activity.subject}
                        </p>
                        <p className="text-sm text-light-gray">{activity.time}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary">
                        +{activity.xp} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Pet & Achievements */}
          <div className="space-y-8">
            {/* Anime Pet */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6 text-center">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Your Companion</h3>
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-6xl">
                  🐱
                </div>
                <h4 className="text-lg font-heading font-bold text-primary mb-2">{userStats.petName}</h4>
                <p className="text-sm font-paragraph text-light-gray mb-4">Level {userStats.petLevel} Cyber Cat</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="h-4 w-4 text-secondary" />
                  <Progress value={85} className="w-20 h-2" />
                  <span className="text-xs text-light-gray">Happy</span>
                </div>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Feed Pet
                </Button>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Latest Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border text-center ${
                        achievement.rarity === 'mythic' ? 'border-cyber-yellow bg-cyber-yellow/10' :
                        achievement.rarity === 'legendary' ? 'border-secondary bg-secondary/10' :
                        achievement.rarity === 'epic' ? 'border-primary bg-primary/10' :
                        achievement.rarity === 'rare' ? 'border-neon-green bg-neon-green/10' :
                        'border-light-gray bg-light-gray/10'
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-paragraph text-foreground font-semibold">{achievement.name}</p>
                    </div>
                  ))}
                </div>
                <Link to="/achievements">
                  <Button variant="outline" className="w-full mt-4 border-primary text-primary">
                    View All Achievements
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Guilds */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Study Guilds</h3>
                <div className="space-y-3">
                  {userStats.guilds.map((guild, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background rounded border border-primary/10">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
                        {guild[0]}
                      </div>
                      <span className="font-paragraph text-foreground">{guild}</span>
                    </div>
                  ))}
                </div>
                <Link to="/guilds">
                  <Button variant="outline" className="w-full mt-4 border-primary text-primary">
                    Manage Guilds
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Anime Universe & Story Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-heading font-bold text-primary mb-8">
            Anime Universe Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animeFeatures.map((feature, index) => (
              <Link key={index} to={feature.path}>
                <Card className="bg-dark-gray border-primary/20 p-6 hover:border-primary/50 transition-all cursor-pointer h-full hover:scale-105 transform duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-paragraph text-light-gray">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Advanced Learning Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-primary">
              Advanced Learning Features
            </h2>
            <Link to="/advanced-learning">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View All Features
              </Button>
            </Link>
          </div>
          <Card className="bg-dark-gray border-primary/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedFeatures.map((feature, index) => (
                <div key={index} className="p-4 bg-background rounded border border-primary/10 hover:border-primary/30 transition-all">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-heading font-bold text-foreground mb-1">{feature.title}</h4>
                  <p className="text-xs font-paragraph text-light-gray">{feature.description}</p>
                </div>
              ))}
            </div>
            <Link to="/advanced-learning" className="mt-6 block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Explore All Advanced Features
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
