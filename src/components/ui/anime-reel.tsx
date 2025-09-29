import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Heart, Share, BookOpen, CheckCircle, XCircle, Zap, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeReel {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  duration: number;
  thumbnail: string;
  videoSrc: string;
  description: string;
  xp: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
  questions?: QuizQuestion[];
  learningObjectives: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timestamp: number; // When to show the question (in seconds)
}

interface AnimeReelPlayerProps {
  reel: AnimeReel;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AnimeReelPlayer({ reel, onComplete, onNext, onPrevious }: AnimeReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likes);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      
      // Check for quiz questions at current timestamp
      if (reel.questions && !currentQuestion) {
        const questionToShow = reel.questions.find(
          q => Math.abs(video.currentTime - q.timestamp) < 0.5 && 
               !questionsAnswered.includes(q.id)
        );
        
        if (questionToShow) {
          video.pause();
          setIsPlaying(false);
          setCurrentQuestion(questionToShow);
        }
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowCompletionModal(true);
      // Calculate final XP based on questions answered correctly
      const correctAnswers = questionsAnswered.length;
      const bonusXP = correctAnswers * 25; // 25 XP per correct answer
      setEarnedXP(reel.xp + bonusXP);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete, reel.questions, currentQuestion, questionsAnswered, reel.xp]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      setQuestionsAnswered(prev => [...prev, currentQuestion.id]);
    }
    
    // Continue video after 3 seconds
    setTimeout(() => {
      setCurrentQuestion(null);
      setSelectedAnswer(null);
      setShowExplanation(false);
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
      }
    }, 3000);
  };

  const handleCompletionClose = () => {
    setShowCompletionModal(false);
    onComplete?.();
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / reel.duration) * 100;

  return (
    <div className="relative w-full max-w-md mx-auto bg-dark-gray rounded-2xl overflow-hidden border border-primary/20">
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={reel.thumbnail}
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={reel.videoSrc} type="video/mp4" />
          {/* Fallback for demo - using image */}
          <Image
            src={reel.thumbnail}
            alt={reel.title}
            width={400}
            height={600}
            className="w-full h-full object-cover"
          />
        </video>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Top Info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div>
              <Badge 
                className={`mb-2 ${
                  reel.difficulty === 'Epic' ? 'bg-secondary text-secondary-foreground' :
                  reel.difficulty === 'Hard' ? 'bg-primary text-primary-foreground' :
                  reel.difficulty === 'Medium' ? 'bg-neon-green text-black' :
                  'bg-cyber-yellow text-black'
                }`}
              >
                {reel.difficulty}
              </Badge>
              <h3 className="font-heading font-bold text-white text-lg leading-tight">
                {reel.title}
              </h3>
              <p className="font-paragraph text-light-gray text-sm">
                {reel.subject} • +{reel.xp} XP
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={togglePlay}
                    className="bg-primary/90 text-primary-foreground hover:bg-primary w-16 h-16 rounded-full"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(reel.duration)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={restart}
                  className="text-white hover:text-primary"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={togglePlay}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleLike}
                  className={`text-white hover:text-secondary ${isLiked ? 'text-secondary' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1 text-xs">{likes}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-primary"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-neon-green"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Quiz Overlay */}
        <AnimatePresence>
          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            >
              <Card className="bg-dark-gray border-primary/20 p-6 max-w-md w-full">
                <div className="text-center mb-4">
                  <Badge className="bg-primary text-primary-foreground mb-2">
                    Quiz Time!
                  </Badge>
                  <h4 className="font-heading font-bold text-foreground text-lg">
                    {currentQuestion.question}
                  </h4>
                </div>
                
                <div className="space-y-3 mb-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left justify-start p-4 h-auto ${
                        selectedAnswer === null
                          ? 'bg-background border-primary/20 text-foreground hover:border-primary/50'
                          : selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-neon-green text-black border-neon-green'
                            : 'bg-destructive text-destructive-foreground border-destructive'
                          : index === currentQuestion.correctAnswer
                          ? 'bg-neon-green text-black border-neon-green'
                          : 'bg-background border-primary/20 text-light-gray opacity-50'
                      }`}
                      variant="outline"
                    >
                      <span className="font-heading font-bold mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                      {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 ml-auto" />
                      )}
                      {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background p-4 rounded border border-primary/20"
                  >
                    <p className="font-paragraph text-light-gray text-sm">
                      {currentQuestion.explanation}
                    </p>
                    {selectedAnswer === currentQuestion.correctAnswer && (
                      <div className="flex items-center gap-2 mt-2 text-neon-green">
                        <Zap className="h-4 w-4" />
                        <span className="font-heading font-bold">+25 Bonus XP!</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletionModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            >
              <Card className="bg-dark-gray border-primary/20 p-8 max-w-md w-full text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Reel Complete!
                  </h3>
                  <p className="font-paragraph text-light-gray">
                    Great job learning about {reel.subject}!
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-background rounded">
                    <span className="font-paragraph text-light-gray">Base XP:</span>
                    <span className="font-heading font-bold text-primary">{reel.xp}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded">
                    <span className="font-paragraph text-light-gray">Quiz Bonus:</span>
                    <span className="font-heading font-bold text-neon-green">
                      +{questionsAnswered.length * 25}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/20 rounded border border-primary">
                    <span className="font-heading font-bold text-foreground">Total XP:</span>
                    <span className="font-heading font-bold text-primary text-xl">{earnedXP}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCompletionClose}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    Continue
                  </Button>
                  <Button 
                    onClick={() => {
                      restart();
                      setShowCompletionModal(false);
                    }}
                    variant="outline" 
                    className="border-secondary text-secondary"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-black/30 hover:bg-black/50 text-white rounded-l flex items-center justify-center transition-colors"
          >
            ‹
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-black/30 hover:bg-black/50 text-white rounded-r flex items-center justify-center transition-colors"
          >
            ›
          </button>
        )}
      </div>

      {/* Description & Learning Objectives */}
      <div className="p-4">
        <p className="font-paragraph text-light-gray text-sm mb-3">
          {reel.description}
        </p>
        
        {/* Learning Objectives */}
        {reel.learningObjectives && reel.learningObjectives.length > 0 && (
          <div className="mb-4">
            <h4 className="font-heading font-bold text-foreground text-sm mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {reel.learningObjectives.map((objective, index) => (
                <li key={index} className="text-xs font-paragraph text-light-gray flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Progress Indicator */}
        {reel.questions && reel.questions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-paragraph text-light-gray mb-2">
              <span>Quiz Progress</span>
              <span>{questionsAnswered.length}/{reel.questions.length}</span>
            </div>
            <Progress 
              value={(questionsAnswered.length / reel.questions.length) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {reel.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-primary/30 text-primary text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sample data for demo with interactive questions
export const sampleAnimeReels: AnimeReel[] = [
  {
    id: '1',
    title: 'Quantum Physics: The Anime Way',
    subject: 'Physics',
    difficulty: 'Hard',
    duration: 45,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_b58762dfa9f14bfc85a23e2d1ed6f14e~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/quantum-physics-anime.mp4',
    description: 'Dive into the quantum realm with our anime heroes as they explore wave-particle duality!',
    xp: 150,
    likes: 1247,
    isLiked: false,
    tags: ['quantum', 'physics', 'anime', 'science'],
    learningObjectives: ['Understand wave-particle duality', 'Learn quantum superposition', 'Explore quantum entanglement'],
    questions: [
      {
        id: 'q1',
        question: 'What is wave-particle duality?',
        options: [
          'Light can only behave as a wave',
          'Light can only behave as a particle',
          'Light can behave as both a wave and a particle',
          'Light has no defined behavior'
        ],
        correctAnswer: 2,
        explanation: 'Wave-particle duality means that light and matter exhibit both wave and particle characteristics depending on how they are observed.',
        timestamp: 15
      },
      {
        id: 'q2',
        question: 'What is quantum superposition?',
        options: [
          'A particle can be in multiple states simultaneously',
          'Particles always have fixed positions',
          'Quantum effects only work in space',
          'Superposition is just a theory'
        ],
        correctAnswer: 0,
        explanation: 'Quantum superposition allows particles to exist in multiple states simultaneously until they are measured.',
        timestamp: 30
      }
    ]
  },
  {
    id: '2',
    title: 'JavaScript Jutsu: Array Methods',
    subject: 'Programming',
    difficulty: 'Medium',
    duration: 60,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_fdc74db31b2e419e886d0d837677c45b~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/javascript-jutsu.mp4',
    description: 'Master the ancient art of JavaScript array methods with ninja-level precision!',
    xp: 100,
    likes: 892,
    isLiked: true,
    tags: ['javascript', 'programming', 'arrays', 'coding'],
    learningObjectives: ['Master array.map()', 'Understand array.filter()', 'Learn array.reduce()'],
    questions: [
      {
        id: 'q3',
        question: 'What does the map() method do?',
        options: [
          'Removes elements from an array',
          'Creates a new array with transformed elements',
          'Sorts the array',
          'Finds a specific element'
        ],
        correctAnswer: 1,
        explanation: 'The map() method creates a new array with the results of calling a function for every array element.',
        timestamp: 20
      },
      {
        id: 'q4',
        question: 'Which method would you use to find elements that meet a condition?',
        options: [
          'map()',
          'reduce()',
          'filter()',
          'forEach()'
        ],
        correctAnswer: 2,
        explanation: 'The filter() method creates a new array with all elements that pass a test implemented by a provided function.',
        timestamp: 40
      }
    ]
  },
  {
    id: '3',
    title: 'Calculus Chronicles: Derivatives',
    subject: 'Mathematics',
    difficulty: 'Epic',
    duration: 90,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_6a12baa62b9646ca9bf288b2c3fc3f67~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/calculus-chronicles.mp4',
    description: 'Join our mathematical mages as they unlock the secrets of derivatives and rates of change!',
    xp: 200,
    likes: 2156,
    isLiked: false,
    tags: ['calculus', 'mathematics', 'derivatives', 'math'],
    learningObjectives: ['Understand derivatives', 'Learn the power rule', 'Apply chain rule'],
    questions: [
      {
        id: 'q5',
        question: 'What is the derivative of x²?',
        options: [
          'x',
          '2x',
          'x²',
          '2x²'
        ],
        correctAnswer: 1,
        explanation: 'Using the power rule, the derivative of x² is 2x¹ = 2x.',
        timestamp: 25
      },
      {
        id: 'q6',
        question: 'What does a derivative represent?',
        options: [
          'The area under a curve',
          'The rate of change at a point',
          'The maximum value of a function',
          'The integral of a function'
        ],
        correctAnswer: 1,
        explanation: 'A derivative represents the instantaneous rate of change of a function at a specific point.',
        timestamp: 60
      }
    ]
  },
  {
    id: '4',
    title: 'Chemistry Chaos: Molecular Bonds',
    subject: 'Chemistry',
    difficulty: 'Medium',
    duration: 55,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_0e891d69bf5b411298b43710343965e1~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/chemistry-chaos.mp4',
    description: 'Witness explosive reactions as anime alchemists demonstrate molecular bonding!',
    xp: 120,
    likes: 1456,
    isLiked: false,
    tags: ['chemistry', 'molecules', 'bonds', 'science'],
    learningObjectives: ['Understand ionic bonds', 'Learn covalent bonds', 'Explore metallic bonds'],
    questions: [
      {
        id: 'q7',
        question: 'What type of bond forms between a metal and non-metal?',
        options: [
          'Covalent bond',
          'Ionic bond',
          'Metallic bond',
          'Hydrogen bond'
        ],
        correctAnswer: 1,
        explanation: 'Ionic bonds form between metals and non-metals through the transfer of electrons.',
        timestamp: 18
      }
    ]
  },
  {
    id: '5',
    title: 'History Heroes: Ancient Civilizations',
    subject: 'History',
    difficulty: 'Easy',
    duration: 40,
    thumbnail: 'https://static.wixstatic.com/media/c5b305_e49d00d625444340bdd5ecbfef5d7c03~mv2.png?originWidth=384&originHeight=576',
    videoSrc: '/videos/history-heroes.mp4',
    description: 'Travel through time with anime warriors exploring ancient civilizations!',
    xp: 80,
    likes: 987,
    isLiked: true,
    tags: ['history', 'ancient', 'civilizations', 'time-travel'],
    learningObjectives: ['Learn about ancient Egypt', 'Understand Roman Empire', 'Explore Greek philosophy'],
    questions: [
      {
        id: 'q8',
        question: 'Which ancient civilization built the pyramids?',
        options: [
          'Romans',
          'Greeks',
          'Egyptians',
          'Babylonians'
        ],
        correctAnswer: 2,
        explanation: 'The ancient Egyptians built the famous pyramids, including the Great Pyramid of Giza.',
        timestamp: 12
      }
    ]
  }
];

interface AnimeReelFeedProps {
  reels?: AnimeReel[];
  className?: string;
}

export function AnimeReelFeed({ reels = sampleAnimeReels, className = '' }: AnimeReelFeedProps) {
  const [currentReel, setCurrentReel] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [completedReels, setCompletedReels] = useState<string[]>([]);

  const nextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleComplete = () => {
    const currentReelId = reels[currentReel].id;
    if (!completedReels.includes(currentReelId)) {
      setCompletedReels(prev => [...prev, currentReelId]);
    }
    // Auto-advance to next reel after completion
    setTimeout(nextReel, 1000);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Session Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="bg-dark-gray border-primary/20 p-4 text-center">
          <div className="text-2xl font-heading font-bold text-primary">{completedReels.length}</div>
          <div className="text-xs font-paragraph text-light-gray">Reels Completed</div>
        </Card>
        <Card className="bg-dark-gray border-primary/20 p-4 text-center">
          <div className="text-2xl font-heading font-bold text-neon-green">{totalXPEarned}</div>
          <div className="text-xs font-paragraph text-light-gray">XP Earned</div>
        </Card>
        <Card className="bg-dark-gray border-primary/20 p-4 text-center">
          <div className="text-2xl font-heading font-bold text-secondary">{reels.length}</div>
          <div className="text-xs font-paragraph text-light-gray">Total Reels</div>
        </Card>
      </div>

      <div className="flex justify-center">
        <AnimeReelPlayer
          reel={reels[currentReel]}
          onComplete={handleComplete}
          onNext={nextReel}
          onPrevious={prevReel}
        />
      </div>
      
      {/* Reel Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {reels.map((reel, index) => (
          <button
            key={index}
            onClick={() => setCurrentReel(index)}
            className={`w-3 h-3 rounded-full transition-colors relative ${
              index === currentReel ? 'bg-primary' : 'bg-light-gray/30'
            }`}
            title={reel.title}
          >
            {completedReels.includes(reel.id) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Current Reel Info */}
      <div className="mt-4 text-center">
        <h3 className="font-heading font-bold text-foreground">{reels[currentReel].title}</h3>
        <p className="text-sm font-paragraph text-light-gray">
          {reels[currentReel].subject} • {currentReel + 1} of {reels.length}
        </p>
      </div>
    </div>
  );
}