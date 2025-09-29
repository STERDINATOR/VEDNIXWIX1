import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image } from '@/components/ui/image';
import { 
  Play, 
  Trophy, 
  Star, 
  Zap, 
  Clock, 
  Users, 
  Target, 
  Sword,
  Crown,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic' | 'Legendary';
  type: 'lesson' | 'quiz' | 'boss' | 'group' | 'speedrun';
  xp: number;
  duration: number; // in minutes
  prerequisites: string[];
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  participants?: number;
  thumbnail: string;
}

interface QuestSystemProps {
  quests: Quest[];
  onStartQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
}

export function QuestSystem({ quests, onStartQuest, onCompleteQuest }: QuestSystemProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questTimer, setQuestTimer] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeQuest && questTimer > 0) {
      interval = setInterval(() => {
        setQuestTimer(prev => {
          if (prev <= 1) {
            // Quest time expired
            setActiveQuest(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuest, questTimer]);

  const startQuest = (quest: Quest) => {
    if (quest.isLocked || quest.isCompleted) return;
    
    setActiveQuest(quest);
    setQuestTimer(quest.duration * 60); // Convert minutes to seconds
    onStartQuest(quest.id);
  };

  const completeQuest = () => {
    if (!activeQuest) return;
    
    onCompleteQuest(activeQuest.id);
    setActiveQuest(null);
    setQuestTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'border-neon-green text-neon-green';
      case 'Medium': return 'border-cyber-yellow text-cyber-yellow';
      case 'Hard': return 'border-primary text-primary';
      case 'Epic': return 'border-secondary text-secondary';
      case 'Legendary': return 'border-destructive text-destructive';
      default: return 'border-light-gray text-light-gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <Play className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'boss': return <Sword className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'speedrun': return <Timer className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Active Quest Timer */}
      <AnimatePresence>
        {activeQuest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50"
          >
            <Card className="bg-dark-gray border-primary/50 p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-bold text-primary text-sm">Active Quest</h4>
                <Button
                  size="sm"
                  onClick={completeQuest}
                  className="bg-neon-green text-black hover:bg-neon-green/90"
                >
                  Complete
                </Button>
              </div>
              <p className="font-paragraph text-foreground text-xs mb-2">{activeQuest.title}</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyber-yellow" />
                <span className="font-paragraph text-cyber-yellow text-sm">
                  {formatTime(questTimer)}
                </span>
              </div>
              <Progress value={(questTimer / (activeQuest.duration * 60)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card 
              className={`bg-dark-gray border-primary/20 p-6 h-full relative overflow-hidden cursor-pointer transition-all ${
                quest.isLocked ? 'opacity-50' : 
                quest.isCompleted ? 'border-neon-green/50' : 
                'hover:border-primary/50'
              }`}
              onClick={() => setSelectedQuest(quest)}
            >
              {/* Status Icons */}
              <div className="absolute top-4 right-4 flex gap-2">
                {quest.isCompleted && (
                  <CheckCircle className="h-5 w-5 text-neon-green" />
                )}
                {quest.isLocked && (
                  <XCircle className="h-5 w-5 text-light-gray" />
                )}
                {quest.difficulty === 'Legendary' && (
                  <Crown className="h-5 w-5 text-cyber-yellow" />
                )}
              </div>

              {/* Quest Thumbnail */}
              <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <Image
                  src={quest.thumbnail}
                  alt={quest.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quest Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {quest.title}
                  </h3>
                  <p className="font-paragraph text-light-gray text-sm">
                    {quest.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-light-gray text-light-gray">
                    <div className="mr-1">{getTypeIcon(quest.type)}</div>
                    {quest.type}
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary">
                    {quest.subject}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm font-paragraph text-light-gray">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />
                    +{quest.xp} XP
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {quest.duration}m
                  </div>
                  {quest.participants && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {quest.participants}
                    </div>
                  )}
                </div>

                {/* Progress */}
                {quest.progress > 0 && !quest.isCompleted && (
                  <div>
                    <div className="flex justify-between text-xs font-paragraph text-light-gray mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    startQuest(quest);
                  }}
                  disabled={quest.isLocked || quest.isCompleted || !!activeQuest}
                  className={`w-full ${
                    quest.isCompleted ? 'bg-neon-green text-black' :
                    quest.isLocked ? 'bg-light-gray text-dark-gray' :
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {quest.isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : quest.isLocked ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Locked
                    </>
                  ) : activeQuest ? (
                    <>
                      <Timer className="h-4 w-4 mr-2" />
                      Quest Active
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quest
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quest Detail Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                      {selectedQuest.title}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getDifficultyColor(selectedQuest.difficulty)}>
                        {selectedQuest.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-primary text-primary">
                        {selectedQuest.subject}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedQuest(null)}>
                    ✕
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Description</h4>
                    <p className="font-paragraph text-light-gray">{selectedQuest.description}</p>
                  </div>

                  {/* Requirements */}
                  {selectedQuest.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Prerequisites</h4>
                      <ul className="space-y-1">
                        {selectedQuest.prerequisites.map((req, index) => (
                          <li key={index} className="font-paragraph text-light-gray text-sm">
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rewards */}
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Rewards</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-paragraph text-foreground">
                          {selectedQuest.rewards.xp} XP
                        </span>
                      </div>
                      {selectedQuest.rewards.badges.map((badge, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-cyber-yellow" />
                          <span className="font-paragraph text-foreground">{badge}</span>
                        </div>
                      ))}
                      {selectedQuest.rewards.unlocks.map((unlock, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-secondary" />
                          <span className="font-paragraph text-foreground">Unlocks: {unlock}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm font-paragraph text-light-gray">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedQuest.duration} minutes
                    </div>
                    {selectedQuest.participants && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {selectedQuest.participants} players
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      startQuest(selectedQuest);
                      setSelectedQuest(null);
                    }}
                    disabled={selectedQuest.isLocked || selectedQuest.isCompleted || !!activeQuest}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quest
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sample quest data
export const sampleQuests: Quest[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming with interactive exercises and real-world examples.',
    subject: 'Programming',
    difficulty: 'Easy',
    type: 'lesson',
    xp: 100,
    duration: 30,
    prerequisites: [],
    rewards: {
      xp: 100,
      badges: ['JavaScript Novice'],
      unlocks: ['Advanced JavaScript Quest']
    },
    progress: 0,
    isCompleted: false,
    isLocked: false,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_c9efae309ef145edb8af0d14e26c678f~mv2.png?originWidth=256&originHeight=192'
  },
  {
    id: '2',
    title: 'The Algorithm Dragon',
    description: 'Face the legendary Algorithm Dragon in an epic coding battle. Solve complex algorithms to defeat this mighty foe.',
    subject: 'Programming',
    difficulty: 'Epic',
    type: 'boss',
    xp: 500,
    duration: 60,
    prerequisites: ['JavaScript Fundamentals', 'Data Structures Basics'],
    rewards: {
      xp: 500,
      badges: ['Dragon Slayer', 'Algorithm Master'],
      unlocks: ['Advanced Boss Battles', 'Legendary Quests']
    },
    progress: 0,
    isCompleted: false,
    isLocked: true,
    participants: 1247,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_8457da178e414a9f85039f660f24b9c8~mv2.png?originWidth=256&originHeight=192'
  },
  {
    id: '3',
    title: 'Calculus Speed Challenge',
    description: 'Race against time to solve calculus problems. Test your mathematical reflexes in this high-speed challenge.',
    subject: 'Mathematics',
    difficulty: 'Medium',
    type: 'speedrun',
    xp: 200,
    duration: 15,
    prerequisites: ['Basic Calculus'],
    rewards: {
      xp: 200,
      badges: ['Speed Calculator'],
      unlocks: ['Advanced Calculus Challenges']
    },
    progress: 45,
    isCompleted: false,
    isLocked: false,
    participants: 892,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_3f43bb39960343cd84e92de9aa8ca984~mv2.png?originWidth=256&originHeight=192'
  },
  {
    id: '4',
    title: 'Physics Lab Experiment',
    description: 'Conduct virtual physics experiments and discover the laws of motion through interactive simulations.',
    subject: 'Physics',
    difficulty: 'Medium',
    type: 'lesson',
    xp: 150,
    duration: 45,
    prerequisites: [],
    rewards: {
      xp: 150,
      badges: ['Physics Explorer'],
      unlocks: ['Advanced Physics Experiments']
    },
    progress: 0,
    isCompleted: false,
    isLocked: false,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_330d9eeb59084a239c09d197c1a2e51a~mv2.png?originWidth=256&originHeight=192'
  },
  {
    id: '5',
    title: 'Team Chemistry Challenge',
    description: 'Work with other students to solve complex chemistry problems. Collaboration is key to success!',
    subject: 'Chemistry',
    difficulty: 'Hard',
    type: 'group',
    xp: 300,
    duration: 90,
    prerequisites: ['Basic Chemistry'],
    rewards: {
      xp: 300,
      badges: ['Team Chemist', 'Collaboration Master'],
      unlocks: ['Advanced Team Challenges']
    },
    progress: 0,
    isCompleted: false,
    isLocked: false,
    participants: 456,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_f5aba9c93a6d44b5a2579a59a61d5c01~mv2.png?originWidth=256&originHeight=192'
  },
  {
    id: '6',
    title: 'History Mystery Quiz',
    description: 'Solve historical mysteries through a series of challenging quiz questions. Uncover the secrets of the past!',
    subject: 'History',
    difficulty: 'Easy',
    type: 'quiz',
    xp: 80,
    duration: 20,
    prerequisites: [],
    rewards: {
      xp: 80,
      badges: ['History Detective'],
      unlocks: ['Advanced History Mysteries']
    },
    progress: 100,
    isCompleted: true,
    isLocked: false,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_e316f61747db45b3b6909b9d1836bb66~mv2.png?originWidth=256&originHeight=192'
  }
];