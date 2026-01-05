import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimeReelFeed } from '@/components/ui/anime-reel';
import { QuestSystem, sampleQuests } from '@/components/ui/quest-system';
import { CourseSystem, sampleCourses } from '@/components/ui/course-system';
import { 
  BookOpen, 
  Play, 
  Lock, 
  Clock,
  Users,
  Target,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { getTranslation } from '@/lib/translations';

export default function LearnPage() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [viewMode, setViewMode] = useState<'grid' | 'courses' | 'reels' | 'quests'>('grid');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['1', '3']);
  const [completedLessons, setCompletedLessons] = useState<{[key: string]: string[]}>({
    '1': ['1-1', '1-2'],
    '3': ['3-1']
  });
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  // Handler functions for course interactions
  const handleEnrollCourse = (courseId: string) => {
    setEnrolledCourses(prev => [...prev, courseId]);
    console.log('Enrolled in course:', courseId);
  };

  const handleStartLesson = (courseId: string, lessonId: string) => {
    console.log('Starting lesson:', lessonId, 'in course:', courseId);
  };

  const handleCompleteLesson = (courseId: string, lessonId: string) => {
    setCompletedLessons(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), lessonId]
    }));
    console.log('Completed lesson:', lessonId, 'in course:', courseId);
  };

  // Handler functions for quest interactions
  const handleStartQuest = (questId: string) => {
    console.log('Starting quest:', questId);
  };

  const handleCompleteQuest = (questId: string) => {
    setCompletedQuests(prev => [...prev, questId]);
    console.log('Completed quest:', questId);
  };

  // Update courses with enrollment and completion status
  const updatedCourses = sampleCourses.map(course => ({
    ...course,
    isEnrolled: enrolledCourses.includes(course.id),
    lessons: course.lessons.map(lesson => ({
      ...lesson,
      isCompleted: completedLessons[course.id]?.includes(lesson.id) || false,
      isLocked: lesson.id !== course.lessons[0].id && 
                !completedLessons[course.id]?.includes(course.lessons[course.lessons.findIndex(l => l.id === lesson.id) - 1]?.id)
    })),
    progress: course.lessons.length > 0 ? 
      Math.round(((completedLessons[course.id]?.length || 0) / course.lessons.length) * 100) : 0
  }));

  // Update quests with completion status
  const updatedQuests = sampleQuests.map(quest => ({
    ...quest,
    isCompleted: completedQuests.includes(quest.id)
  }));
  const subjects = [
    {
      id: 1,
      name: 'Programming',
      icon: <span className="text-4xl">💻</span>,
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
      icon: <span className="text-4xl">🧮</span>,
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
      icon: <span className="text-4xl">⚛️</span>,
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
      icon: <span className="text-4xl">🌍</span>,
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
      icon: <span className="text-4xl">🎨</span>,
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
      icon: <span className="text-4xl">🧠</span>,
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-heading font-black text-primary mb-4">
                {getTranslation(currentLanguage, 'learn.title')}
              </h1>
              <p className="text-xl font-paragraph text-light-gray">
                Choose your path and begin your cyberpunk education journey
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-dark-gray rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-light-gray'}
              >
                <span className="mr-2 text-lg">📚</span>
                {getTranslation(currentLanguage, 'learn.topics')}
              </Button>
              <Button
                variant={viewMode === 'courses' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('courses')}
                className={viewMode === 'courses' ? 'bg-neon-green text-black' : 'text-light-gray'}
              >
                <span className="mr-2 text-lg">🎓</span>
                Courses
              </Button>
              <Button
                variant={viewMode === 'reels' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('reels')}
                className={viewMode === 'reels' ? 'bg-secondary text-secondary-foreground' : 'text-light-gray'}
              >
                <span className="mr-2 text-lg">🎬</span>
                {getTranslation(currentLanguage, 'reels.title')}
              </Button>
              <Button
                variant={viewMode === 'quests' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('quests')}
                className={viewMode === 'quests' ? 'bg-cyber-yellow text-black' : 'text-light-gray'}
              >
                <span className="mr-2 text-lg">⚔️</span>
                Quests
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {viewMode === 'grid' ? (
              <>
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
                                <Button 
                                  size="sm" 
                                  className="bg-primary text-primary-foreground"
                                  onClick={() => setViewMode('courses')}
                                >
                                  <span className="mr-1 text-lg">▶️</span>
                                  Explore
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
                                <span className="text-lg">⚡</span>
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
                          
                          <Button 
                            className="bg-primary text-primary-foreground hover:bg-primary/90 ml-6"
                            onClick={() => setViewMode('quests')}
                          >
                            <span className="mr-2 text-lg">▶️</span>
                            Start Quest
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </>
            ) : viewMode === 'courses' ? (
              /* Course System View */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-heading font-bold text-neon-green mb-2">Course Catalog</h2>
                  <p className="font-paragraph text-light-gray">
                    Structured learning paths with interactive lessons and assessments
                  </p>
                </div>
                <CourseSystem 
                  courses={updatedCourses}
                  onEnrollCourse={handleEnrollCourse}
                  onStartLesson={handleStartLesson}
                  onCompleteLesson={handleCompleteLesson}
                />
              </motion.div>
            ) : viewMode === 'reels' ? (
              /* Anime Reels View */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-md">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-heading font-bold text-primary mb-2">Anime Learning Reels</h2>
                    <p className="font-paragraph text-light-gray">
                      Learn through immersive anime scenes and stories
                    </p>
                  </div>
                  <AnimeReelFeed />
                  
                  {/* Additional Anime Reel Features */}
                  <div className="mt-8 text-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-dark-gray border-primary/20 p-4">
                        <h4 className="font-heading font-bold text-primary mb-2">Interactive Learning</h4>
                        <p className="text-sm font-paragraph text-light-gray">
                          Answer questions during reels to earn bonus XP
                        </p>
                      </Card>
                      <Card className="bg-dark-gray border-secondary/20 p-4">
                        <h4 className="font-heading font-bold text-secondary mb-2">Story Mode</h4>
                        <p className="text-sm font-paragraph text-light-gray">
                          Follow anime characters through learning adventures
                        </p>
                      </Card>
                      <Card className="bg-dark-gray border-neon-green/20 p-4">
                        <h4 className="font-heading font-bold text-neon-green mb-2">Social Features</h4>
                        <p className="text-sm font-paragraph text-light-gray">
                          Share reels and compete with friends
                        </p>
                      </Card>
                    </div>
                    
                    <Button 
                      onClick={() => setViewMode('grid')} 
                      variant="outline" 
                      className="border-primary text-primary"
                    >
                      <span className="mr-2 text-lg">📚</span>
                      Switch to Subject View
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Quest System View */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-heading font-bold text-cyber-yellow mb-2">Quest System</h2>
                  <p className="font-paragraph text-light-gray">
                    Embark on epic learning adventures and defeat knowledge bosses
                  </p>
                </div>
                <QuestSystem 
                  quests={updatedQuests}
                  onStartQuest={handleStartQuest}
                  onCompleteQuest={handleCompleteQuest}
                />
              </motion.div>
            )}
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
                          <span className="text-lg">🏆</span>
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
                    { label: 'Courses Enrolled', value: enrolledCourses.length.toString(), color: 'text-primary' },
                    { label: 'Lessons Completed', value: Object.values(completedLessons).flat().length.toString(), color: 'text-secondary' },
                    { label: 'Quests Finished', value: completedQuests.length.toString(), color: 'text-neon-green' },
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
                  <Button 
                    onClick={() => setViewMode('courses')}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span className="mr-2 text-lg">🎯</span>
                    Browse Courses
                  </Button>
                  <Button 
                    onClick={() => setViewMode('quests')}
                    variant="outline" 
                    className="w-full border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <span className="mr-2 text-lg">🏆</span>
                    Start Quest
                  </Button>
                  <Link to="/battle">
                    <Button variant="outline" className="w-full border-neon-green text-neon-green hover:bg-neon-green/10">
                      <span className="mr-2 text-lg">👥</span>
                      Battle Arena
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
