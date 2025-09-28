import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Lock, 
  Star, 
  Trophy, 
  Zap, 
  Clock,
  Users,
  Target,
  Brain,
  Code,
  Calculator,
  Atom,
  Globe,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearnPage() {
  // Mock learning data
  const subjects = [
    {
      id: 1,
      name: 'Programming',
      icon: <Code className="h-8 w-8" />,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      progress: 75,
      level: 8,
      totalLevels: 12,
      description: 'Master the art of coding in the digital realm',
      courses: 15,
      unlocked: true
    },
    {
      id: 2,
      name: 'Mathematics',
      icon: <Calculator className="h-8 w-8" />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      progress: 60,
      level: 6,
      totalLevels: 10,
      description: 'Unlock the secrets of numbers and equations',
      courses: 12,
      unlocked: true
    },
    {
      id: 3,
      name: 'Physics',
      icon: <Atom className="h-8 w-8" />,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/20',
      progress: 45,
      level: 4,
      totalLevels: 8,
      description: 'Explore the fundamental laws of the universe',
      courses: 10,
      unlocked: true
    },
    {
      id: 4,
      name: 'Languages',
      icon: <Globe className="h-8 w-8" />,
      color: 'text-cyber-yellow',
      bgColor: 'bg-cyber-yellow/20',
      progress: 30,
      level: 3,
      totalLevels: 15,
      description: 'Communicate across the global network',
      courses: 20,
      unlocked: true
    },
    {
      id: 5,
      name: 'Art & Design',
      icon: <Palette className="h-8 w-8" />,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      progress: 15,
      level: 2,
      totalLevels: 6,
      description: 'Create beautiful digital masterpieces',
      courses: 8,
      unlocked: false
    },
    {
      id: 6,
      name: 'Neuroscience',
      icon: <Brain className="h-8 w-8" />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      progress: 0,
      level: 0,
      totalLevels: 12,
      description: 'Understand the mysteries of the mind',
      courses: 14,
      unlocked: false
    }
  ];

  const featuredQuests = [
    {
      id: 1,
      title: 'The Algorithm Dragon',
      subject: 'Programming',
      difficulty: 'Epic',
      xp: 1000,
      duration: '45 min',
      participants: 1247,
      description: 'Face the legendary Algorithm Dragon in an epic coding battle',
      type: 'boss'
    },
    {
      id: 2,
      title: 'Quantum Mechanics Mystery',
      subject: 'Physics',
      difficulty: 'Hard',
      xp: 750,
      duration: '30 min',
      participants: 892,
      description: 'Solve the quantum puzzle and unlock new dimensions',
      type: 'quest'
    },
    {
      id: 3,
      title: 'Calculus Speedrun',
      subject: 'Mathematics',
      difficulty: 'Medium',
      xp: 500,
      duration: '15 min',
      participants: 2156,
      description: 'Race against time to solve calculus problems',
      type: 'speedrun'
    }
  ];

  const dailyChallenges = [
    { title: 'Debug the Matrix', xp: 100, timeLeft: '4h 23m', completed: false },
    { title: 'Solve for X', xp: 150, timeLeft: '6h 45m', completed: true },
    { title: 'Physics Puzzle', xp: 200, timeLeft: '8h 12m', completed: false }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-heading font-black text-primary mb-4">
            Learning Academy
          </h1>
          <p className="text-xl font-paragraph text-light-gray">
            Choose your path and begin your cyberpunk education journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Subject Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Subjects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`bg-dark-gray border-primary/20 p-6 h-full relative overflow-hidden ${
                      !subject.unlocked ? 'opacity-60' : 'hover:border-primary/50 cursor-pointer'
                    } transition-all`}>
                      {!subject.unlocked && (
                        <div className="absolute top-4 right-4">
                          <Lock className="h-5 w-5 text-light-gray" />
                        </div>
                      )}
                      
                      <div className={`${subject.bgColor} p-4 rounded-lg mb-4 w-fit`}>
                        <div className={subject.color}>
                          {subject.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        {subject.name}
                      </h3>
                      
                      <p className="font-paragraph text-light-gray text-sm mb-4">
                        {subject.description}
                      </p>
                      
                      {subject.unlocked ? (
                        <>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm font-paragraph text-light-gray mb-2">
                              <span>Level {subject.level}/{subject.totalLevels}</span>
                              <span>{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-primary/50 text-primary">
                              {subject.courses} Courses
                            </Badge>
                            <Button size="sm" className="bg-primary text-primary-foreground">
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="font-paragraph text-light-gray text-sm mb-4">
                            Complete more quests to unlock
                          </p>
                          <Button size="sm" variant="outline" disabled className="border-light-gray text-light-gray">
                            <Lock className="h-4 w-4 mr-1" />
                            Locked
                          </Button>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Quests */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Featured Quests</h2>
              <div className="space-y-4">
                {featuredQuests.map((quest, index) => (
                  <Card key={quest.id} className="bg-dark-gray border-primary/20 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-heading font-bold text-foreground">{quest.title}</h3>
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
                          <Badge variant="outline" className="border-cyber-yellow text-cyber-yellow">
                            {quest.type}
                          </Badge>
                        </div>
                        
                        <p className="font-paragraph text-light-gray mb-3">{quest.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm font-paragraph text-light-gray">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-primary" />
                            +{quest.xp} XP
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quest.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {quest.participants.toLocaleString()} players
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {quest.subject}
                          </div>
                        </div>
                      </div>
                      
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 ml-6">
                        <Play className="h-4 w-4 mr-2" />
                        Start Quest
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Daily Challenges</h3>
                <div className="space-y-3">
                  {dailyChallenges.map((challenge, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border ${
                        challenge.completed 
                          ? 'bg-neon-green/10 border-neon-green/50' 
                          : 'bg-background border-primary/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-paragraph font-semibold text-foreground text-sm">
                          {challenge.title}
                        </h4>
                        {challenge.completed && (
                          <Trophy className="h-4 w-4 text-neon-green" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-paragraph text-light-gray">
                          +{challenge.xp} XP
                        </span>
                        <span className={`font-paragraph ${
                          challenge.completed ? 'text-neon-green' : 'text-light-gray'
                        }`}>
                          {challenge.completed ? 'Completed' : challenge.timeLeft}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-primary text-primary">
                  View All Challenges
                </Button>
              </Card>
            </motion.div>

            {/* Learning Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Your Progress</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Courses Completed', value: '23', color: 'text-primary' },
                    { label: 'Quests Finished', value: '156', color: 'text-secondary' },
                    { label: 'Boss Battles Won', value: '12', color: 'text-neon-green' },
                    { label: 'Study Streak', value: '15 days', color: 'text-cyber-yellow' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-paragraph text-light-gray text-sm">{stat.label}</span>
                      <span className={`font-heading font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/quiz">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Target className="h-4 w-4 mr-2" />
                      Random Quiz
                    </Button>
                  </Link>
                  <Link to="/battle">
                    <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10">
                      <Trophy className="h-4 w-4 mr-2" />
                      Battle Arena
                    </Button>
                  </Link>
                  <Link to="/study-groups">
                    <Button variant="outline" className="w-full border-neon-green text-neon-green hover:bg-neon-green/10">
                      <Users className="h-4 w-4 mr-2" />
                      Study Groups
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}