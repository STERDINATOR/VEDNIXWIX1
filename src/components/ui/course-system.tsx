import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image } from '@/components/ui/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Star, 
  Zap, 
  Clock, 
  Users, 
  Trophy,
  Target,
  ArrowRight,
  Download,
  FileText,
  Video,
  Headphones,
  Code,
  Calculator,
  Atom,
  Globe,
  Palette,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz' | 'assignment';
  duration: number; // in minutes
  isCompleted: boolean;
  isLocked: boolean;
  content?: {
    videoUrl?: string;
    readingMaterial?: string;
    quizQuestions?: QuizQuestion[];
    interactiveElements?: any[];
  };
  xp: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  instructor: string;
  duration: number; // total duration in hours
  lessons: Lesson[];
  prerequisites: string[];
  learningObjectives: string[];
  thumbnail: string;
  rating: number;
  studentsEnrolled: number;
  isEnrolled: boolean;
  progress: number;
  certificate: boolean;
  price: number; // 0 for free courses
}

interface CourseSystemProps {
  courses: Course[];
  onEnrollCourse: (courseId: string) => void;
  onStartLesson: (courseId: string, lessonId: string) => void;
  onCompleteLesson: (courseId: string, lessonId: string) => void;
}

export function CourseSystem({ courses, onEnrollCourse, onStartLesson, onCompleteLesson }: CourseSystemProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const subjects = ['all', 'Programming', 'Mathematics', 'Physics', 'Languages', 'Art & Design', 'Neuroscience'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredCourses = courses.filter(course => {
    const subjectMatch = filterSubject === 'all' || course.subject === filterSubject;
    const difficultyMatch = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Programming': return <Code className="h-5 w-5" />;
      case 'Mathematics': return <Calculator className="h-5 w-5" />;
      case 'Physics': return <Atom className="h-5 w-5" />;
      case 'Languages': return <Globe className="h-5 w-5" />;
      case 'Art & Design': return <Palette className="h-5 w-5" />;
      case 'Neuroscience': return <Brain className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'interactive': return <Target className="h-4 w-4" />;
      case 'quiz': return <Trophy className="h-4 w-4" />;
      case 'assignment': return <Download className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'border-neon-green text-neon-green';
      case 'Intermediate': return 'border-cyber-yellow text-cyber-yellow';
      case 'Advanced': return 'border-primary text-primary';
      case 'Expert': return 'border-secondary text-secondary';
      default: return 'border-light-gray text-light-gray';
    }
  };

  const startLesson = (course: Course, lesson: Lesson) => {
    if (lesson.isLocked) return;
    setActiveLesson(lesson);
    onStartLesson(course.id, lesson.id);
    
    if (lesson.type === 'quiz' && lesson.content?.quizQuestions) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      setShowResults(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!activeLesson?.content?.quizQuestions) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = activeLesson.content.quizQuestions[currentQuestionIndex];
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < activeLesson.content.quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 2000);
  };

  const completeLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    
    onCompleteLesson(selectedCourse.id, activeLesson.id);
    setActiveLesson(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setShowResults(false);
  };

  // Course Detail Modal
  if (selectedCourse) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-primary/20">
            <h2 className="text-2xl font-heading font-bold text-foreground">{selectedCourse.title}</h2>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCourse(null)}
              className="text-light-gray hover:text-foreground"
            >
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[70vh]">
            {/* Course Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <Image
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getSubjectIcon(selectedCourse.subject)}
                  <span className="font-paragraph text-light-gray">{selectedCourse.subject}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                    {selectedCourse.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-cyber-yellow" />
                    <span className="font-paragraph text-light-gray">{selectedCourse.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm font-paragraph text-light-gray">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedCourse.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{selectedCourse.studentsEnrolled.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>{selectedCourse.certificate ? 'Certificate included' : 'No certificate'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-paragraph text-light-gray text-sm">Instructor: {selectedCourse.instructor}</p>
                  <p className="font-paragraph text-foreground">{selectedCourse.description}</p>
                </div>
                
                {selectedCourse.isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-paragraph text-light-gray">
                      <span>Progress</span>
                      <span>{selectedCourse.progress}%</span>
                    </div>
                    <Progress value={selectedCourse.progress} className="h-2" />
                  </div>
                ) : (
                  <Button 
                    onClick={() => onEnrollCourse(selectedCourse.id)}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    {selectedCourse.price > 0 ? `Enroll - $${selectedCourse.price}` : 'Enroll for Free'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Course Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="lessons">
                <TabsList className="grid w-full grid-cols-3 bg-background">
                  <TabsTrigger value="lessons">Lessons</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lessons" className="space-y-4">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="bg-background border-primary/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.isCompleted ? 'bg-neon-green text-black' :
                            lesson.isLocked ? 'bg-dark-gray text-light-gray' :
                            'bg-primary text-primary-foreground'
                          }`}>
                            {lesson.isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : lesson.isLocked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getLessonIcon(lesson.type)}
                              <h4 className="font-heading font-bold text-foreground">{lesson.title}</h4>
                              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                            <p className="text-sm font-paragraph text-light-gray">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs font-paragraph text-light-gray">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-primary" />
                                <span>+{lesson.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => startLesson(selectedCourse, lesson)}
                          disabled={lesson.isLocked}
                          className={
                            lesson.isCompleted ? 'bg-neon-green text-black' :
                            lesson.isLocked ? 'bg-dark-gray text-light-gray' :
                            'bg-primary text-primary-foreground'
                          }
                        >
                          {lesson.isCompleted ? 'Completed' :
                           lesson.isLocked ? 'Locked' :
                           'Start'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="objectives" className="space-y-3">
                  {selectedCourse.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <p className="font-paragraph text-light-gray">{objective}</p>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="prerequisites" className="space-y-3">
                  {selectedCourse.prerequisites.length > 0 ? (
                    selectedCourse.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-neon-green mt-0.5" />
                        <p className="font-paragraph text-light-gray">{prereq}</p>
                      </div>
                    ))
                  ) : (
                    <p className="font-paragraph text-light-gray">No prerequisites required</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Lesson Modal
  if (activeLesson) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-primary/20">
            <h2 className="text-xl font-heading font-bold text-foreground">{activeLesson.title}</h2>
            <Button 
              variant="ghost" 
              onClick={() => setActiveLesson(null)}
              className="text-light-gray hover:text-foreground"
            >
              ✕
            </Button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {activeLesson.type === 'quiz' && activeLesson.content?.quizQuestions ? (
              <div className="space-y-6">
                {!showResults ? (
                  <>
                    <div className="text-center mb-6">
                      <Badge className="bg-primary text-primary-foreground mb-2">
                        Question {currentQuestionIndex + 1} of {activeLesson.content.quizQuestions.length}
                      </Badge>
                      <h3 className="text-2xl font-heading font-bold text-foreground">
                        {activeLesson.content.quizQuestions[currentQuestionIndex].question}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeLesson.content.quizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`h-auto p-4 text-left justify-start ${
                            selectedAnswer === null
                              ? 'bg-background border-primary/20 text-foreground hover:border-primary/50'
                              : selectedAnswer === index
                              ? index === activeLesson.content.quizQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-neon-green text-black border-neon-green'
                                : 'bg-destructive text-destructive-foreground border-destructive'
                              : index === activeLesson.content.quizQuestions[currentQuestionIndex].correctAnswer
                              ? 'bg-neon-green text-black border-neon-green'
                              : 'bg-background border-primary/20 text-light-gray opacity-50'
                          }`}
                          variant="outline"
                        >
                          <span className="font-heading font-bold mr-3">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background p-4 rounded border border-primary/20"
                      >
                        <p className="font-paragraph text-light-gray">
                          {activeLesson.content.quizQuestions[currentQuestionIndex].explanation}
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div>
                      <Trophy className="h-16 w-16 text-cyber-yellow mx-auto mb-4" />
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                        Quiz Complete!
                      </h3>
                      <p className="text-lg font-paragraph text-light-gray">
                        You scored {quizScore} out of {activeLesson.content.quizQuestions.length}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-xl font-heading font-bold text-primary">
                        +{activeLesson.xp} XP Earned!
                      </span>
                    </div>
                    
                    <Button onClick={completeLesson} className="bg-primary text-primary-foreground">
                      Complete Lesson
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {activeLesson.title}
                  </h3>
                  <p className="font-paragraph text-light-gray">{activeLesson.description}</p>
                </div>
                
                {activeLesson.type === 'video' && (
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-16 w-16 text-light-gray mx-auto mb-4" />
                      <p className="font-paragraph text-light-gray">Video content would be displayed here</p>
                    </div>
                  </div>
                )}
                
                {activeLesson.type === 'reading' && (
                  <div className="bg-background p-6 rounded-lg">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-light-gray mx-auto mb-4" />
                      <p className="font-paragraph text-light-gray">Reading material would be displayed here</p>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <Button onClick={completeLesson} className="bg-primary text-primary-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete (+{activeLesson.xp} XP)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="font-paragraph text-light-gray text-sm">Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-dark-gray border border-primary/20 rounded px-3 py-1 text-foreground font-paragraph text-sm"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-paragraph text-light-gray text-sm">Difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-dark-gray border border-primary/20 rounded px-3 py-1 text-foreground font-paragraph text-sm"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-dark-gray border-primary/20 p-0 overflow-hidden hover:border-primary/50 transition-all cursor-pointer h-full">
              <div onClick={() => setSelectedCourse(course)}>
                <div className="relative">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                      <Star className="h-3 w-3 text-cyber-yellow" />
                      <span className="text-xs font-paragraph text-white">{course.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {getSubjectIcon(course.subject)}
                    <span className="text-xs font-paragraph text-light-gray">{course.subject}</span>
                  </div>
                  
                  <h3 className="text-lg font-heading font-bold text-foreground line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm font-paragraph text-light-gray line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-paragraph text-light-gray">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.studentsEnrolled.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                  </div>
                  
                  {course.isEnrolled && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-paragraph text-light-gray">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 pt-0">
                <Button
                  onClick={() => course.isEnrolled ? setSelectedCourse(course) : onEnrollCourse(course.id)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {course.isEnrolled ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      {course.price > 0 ? `Enroll - $${course.price}` : 'Enroll for Free'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Sample course data
export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals: From Zero to Hero',
    description: 'Master the basics of JavaScript programming with hands-on projects and real-world examples.',
    subject: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Alex Chen',
    duration: 12,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_fdc74db31b2e419e886d0d837677c45b~mv2.png?originWidth=384&originHeight=576',
    rating: 4.8,
    studentsEnrolled: 15420,
    isEnrolled: true,
    progress: 65,
    certificate: true,
    price: 0,
    prerequisites: [],
    learningObjectives: [
      'Understand JavaScript syntax and fundamentals',
      'Work with variables, functions, and objects',
      'Manipulate the DOM and handle events',
      'Build interactive web applications',
      'Debug and troubleshoot JavaScript code'
    ],
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and why it\'s important for web development',
        type: 'video',
        duration: 15,
        isCompleted: true,
        isLocked: false,
        xp: 50
      },
      {
        id: '1-2',
        title: 'Variables and Data Types',
        description: 'Understanding different data types and how to work with variables',
        type: 'interactive',
        duration: 20,
        isCompleted: true,
        isLocked: false,
        xp: 75
      },
      {
        id: '1-3',
        title: 'Functions and Scope',
        description: 'Master functions, parameters, and variable scope',
        type: 'video',
        duration: 25,
        isCompleted: false,
        isLocked: false,
        xp: 100
      },
      {
        id: '1-4',
        title: 'JavaScript Quiz: Basics',
        description: 'Test your knowledge of JavaScript fundamentals',
        type: 'quiz',
        duration: 10,
        isCompleted: false,
        isLocked: false,
        xp: 150,
        content: {
          quizQuestions: [
            {
              id: 'q1',
              question: 'Which of the following is the correct way to declare a variable in JavaScript?',
              options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
              correctAnswer: 0,
              explanation: 'In JavaScript, variables are declared using the "var", "let", or "const" keywords.'
            },
            {
              id: 'q2',
              question: 'What is the result of typeof null in JavaScript?',
              options: ['null', 'undefined', 'object', 'string'],
              correctAnswer: 2,
              explanation: 'This is a known quirk in JavaScript. typeof null returns "object" due to a legacy bug.'
            }
          ]
        }
      },
      {
        id: '1-5',
        title: 'DOM Manipulation',
        description: 'Learn to interact with HTML elements using JavaScript',
        type: 'interactive',
        duration: 30,
        isCompleted: false,
        isLocked: true,
        xp: 125
      }
    ]
  },
  {
    id: '2',
    title: 'Calculus I: Limits and Derivatives',
    description: 'Explore the fundamental concepts of calculus including limits, continuity, and derivatives.',
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    instructor: 'Dr. Sarah Johnson',
    duration: 20,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_6a12baa62b9646ca9bf288b2c3fc3f67~mv2.png?originWidth=384&originHeight=576',
    rating: 4.9,
    studentsEnrolled: 8750,
    isEnrolled: false,
    progress: 0,
    certificate: true,
    price: 49,
    prerequisites: ['Algebra II', 'Trigonometry'],
    learningObjectives: [
      'Understand the concept of limits',
      'Calculate derivatives using various rules',
      'Apply derivatives to solve real-world problems',
      'Analyze function behavior using calculus',
      'Prepare for advanced calculus topics'
    ],
    lessons: [
      {
        id: '2-1',
        title: 'Introduction to Limits',
        description: 'Understanding the fundamental concept of limits in calculus',
        type: 'video',
        duration: 25,
        isCompleted: false,
        isLocked: false,
        xp: 100
      },
      {
        id: '2-2',
        title: 'Limit Laws and Calculations',
        description: 'Learn the rules for calculating limits',
        type: 'reading',
        duration: 30,
        isCompleted: false,
        isLocked: true,
        xp: 125
      }
    ]
  },
  {
    id: '3',
    title: 'Quantum Mechanics: Wave-Particle Duality',
    description: 'Dive deep into the quantum world and understand the dual nature of matter and energy.',
    subject: 'Physics',
    difficulty: 'Advanced',
    instructor: 'Prof. Michael Rodriguez',
    duration: 15,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_b58762dfa9f14bfc85a23e2d1ed6f14e~mv2.png?originWidth=384&originHeight=576',
    rating: 4.7,
    studentsEnrolled: 3200,
    isEnrolled: true,
    progress: 25,
    certificate: true,
    price: 79,
    prerequisites: ['Classical Physics', 'Linear Algebra'],
    learningObjectives: [
      'Understand wave-particle duality',
      'Learn about quantum superposition',
      'Explore the uncertainty principle',
      'Analyze quantum experiments',
      'Apply quantum concepts to modern technology'
    ],
    lessons: [
      {
        id: '3-1',
        title: 'Historical Background',
        description: 'The development of quantum theory',
        type: 'video',
        duration: 20,
        isCompleted: true,
        isLocked: false,
        xp: 75
      },
      {
        id: '3-2',
        title: 'Double-Slit Experiment',
        description: 'Understanding the famous quantum experiment',
        type: 'interactive',
        duration: 35,
        isCompleted: false,
        isLocked: false,
        xp: 150
      }
    ]
  }
];