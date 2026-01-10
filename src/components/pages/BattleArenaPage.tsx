import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image } from '@/components/ui/image';
import { NeuralStoryCombat } from '@/components/ui/neural-story-combat';
import { 
  Sword, 
  Shield, 
  Zap, 
  Trophy, 
  Users, 
  Clock, 
  Star,
  Crown,
  Target,
  Flame,
  Heart,
  Timer,
  CheckCircle,
  XCircle,
  Play,
  Pause
} from 'lucide-react';
import { useMember } from '@/integrations';

interface BattleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  timeLimit: number; // seconds
  points: number;
}

interface BattleParticipant {
  id: string;
  name: string;
  avatar: string;
  level: number;
  score: number;
  streak: number;
  isReady: boolean;
  character?: {
    name: string;
    image: string;
    personality: string;
    specialMove: string;
  };
}

interface BattleRoom {
  id: string;
  name: string;
  type: 'solo' | 'guild' | 'tournament';
  subject: string;
  difficulty: string;
  maxParticipants: number;
  currentParticipants: number;
  participants: BattleParticipant[];
  status: 'waiting' | 'starting' | 'active' | 'finished';
  timeRemaining: number;
  prize: number;
}

export default function BattleArenaPage() {
  const { member } = useMember();
  const [selectedMode, setSelectedMode] = useState<'solo' | 'guild' | 'tournament'>('solo');
  const [currentBattle, setCurrentBattle] = useState<BattleRoom | null>(null);
  const [battleQuestions, setBattleQuestions] = useState<BattleQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [battlePhase, setBattlePhase] = useState<'lobby' | 'battle' | 'results'>('lobby');
  const [animeCharacter, setAnimeCharacter] = useState<any>(null);

  // Mock battle rooms
  const battleRooms: BattleRoom[] = [
    {
      id: '1',
      name: 'Programming Dojo',
      type: 'solo',
      subject: 'Programming',
      difficulty: 'Medium',
      maxParticipants: 8,
      currentParticipants: 6,
      participants: [],
      status: 'waiting',
      timeRemaining: 120,
      prize: 500
    },
    {
      id: '2',
      name: 'Math Masters Guild War',
      type: 'guild',
      subject: 'Mathematics',
      difficulty: 'Hard',
      maxParticipants: 16,
      currentParticipants: 12,
      participants: [],
      status: 'starting',
      timeRemaining: 30,
      prize: 1500
    },
    {
      id: '3',
      name: 'Physics Championship',
      type: 'tournament',
      subject: 'Physics',
      difficulty: 'Epic',
      maxParticipants: 32,
      currentParticipants: 28,
      participants: [],
      status: 'waiting',
      timeRemaining: 300,
      prize: 5000
    }
  ];

  // Mock battle questions
  const sampleQuestions: BattleQuestion[] = [
    {
      id: '1',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 1,
      subject: 'Programming',
      difficulty: 'Medium',
      timeLimit: 30,
      points: 100
    },
    {
      id: '2',
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswer: 1,
      subject: 'Mathematics',
      difficulty: 'Easy',
      timeLimit: 20,
      points: 75
    },
    {
      id: '3',
      question: 'What is the speed of light in vacuum?',
      options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁷ m/s'],
      correctAnswer: 0,
      subject: 'Physics',
      difficulty: 'Medium',
      timeLimit: 25,
      points: 100
    }
  ];

  // Generate anime character using AI (mock implementation)
  const generateAnimeCharacter = async () => {
    // In real implementation, this would call Gemini AI
    const characters = [
      {
        name: 'Akira Shadowblade',
        image: 'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png?originWidth=192&originHeight=192',
        personality: 'Calm and strategic, prefers analytical thinking',
        specialMove: 'Logic Strike',
        voiceType: 'deep and confident'
      },
      {
        name: 'Yuki Stormcaster',
        image: 'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png?originWidth=192&originHeight=192',
        personality: 'Energetic and competitive, loves challenges',
        specialMove: 'Lightning Quiz',
        voiceType: 'bright and enthusiastic'
      },
      {
        name: 'Rei Mindweaver',
        image: 'https://static.wixstatic.com/media/c5b305_250ce96b9d044dd39f26c8889a4be084~mv2.png?originWidth=192&originHeight=192',
        personality: 'Wise and supportive, excellent teacher',
        specialMove: 'Knowledge Beam',
        voiceType: 'gentle and encouraging'
      }
    ];
    
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setAnimeCharacter(randomCharacter);
  };

  useEffect(() => {
    generateAnimeCharacter();
  }, []);

  // Timer for battle questions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (battlePhase === 'battle' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [battlePhase, timeLeft]);

  const joinBattle = (room: BattleRoom) => {
    setCurrentBattle(room);
    setBattleQuestions(sampleQuestions);
    setBattlePhase('battle');
    setTimeLeft(30);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = battleQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 5) * 10;
      const streakBonus = streak * 25;
      const totalPoints = currentQuestion.points + timeBonus + streakBonus;
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < battleQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(battleQuestions[currentQuestionIndex + 1].timeLimit);
      } else {
        setBattlePhase('results');
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    setStreak(0);
    if (currentQuestionIndex < battleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(battleQuestions[currentQuestionIndex + 1].timeLimit);
    } else {
      setBattlePhase('results');
    }
  };

  const resetBattle = () => {
    setBattlePhase('lobby');
    setCurrentBattle(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
  };

  if (battlePhase === 'battle' && currentBattle) {
    const currentQuestion = battleQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-4xl mx-auto">
          {/* Battle Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-secondary text-secondary-foreground">
                Question {currentQuestionIndex + 1}/{battleQuestions.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-xl font-heading font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-cyber-yellow" />
                <span className="text-lg font-heading">{streak}x</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-destructive" />
                <span className="text-2xl font-heading font-bold text-destructive">{timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className="w-32 h-3" />
            </div>
          </div>

          {/* Anime Character */}
          {animeCharacter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <div className="relative inline-block">
                <Image
                  src={animeCharacter.image}
                  alt={animeCharacter.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 rounded-full border-4 border-primary"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {animeCharacter.name}
                  </Badge>
                </div>
              </div>
              <p className="text-sm font-paragraph text-light-gray mt-2">
                "{streak > 2 ? 'Incredible streak! Keep it up!' : 'Show me your knowledge, warrior!'}"
              </p>
            </motion.div>
          )}

          {/* Question Card */}
          <Card className="bg-dark-gray border-primary/20 p-8 mb-6">
            <div className="text-center mb-6">
              <Badge className="mb-4 bg-neon-green text-black">
                {currentQuestion.subject} • {currentQuestion.difficulty}
              </Badge>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                {currentQuestion.question}
              </h2>
              <p className="text-primary font-paragraph">+{currentQuestion.points} points</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full h-16 text-left justify-start p-4 ${
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
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Battle Progress */}
          <div className="text-center">
            <Progress 
              value={((currentQuestionIndex + 1) / battleQuestions.length) * 100} 
              className="w-full h-2 mb-2"
            />
            <p className="text-sm font-paragraph text-light-gray">
              Battle Progress: {currentQuestionIndex + 1} of {battleQuestions.length} questions
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (battlePhase === 'results') {
    const accuracy = Math.round((score / (battleQuestions.length * 100)) * 100);
    const rank = score > 800 ? 'S' : score > 600 ? 'A' : score > 400 ? 'B' : score > 200 ? 'C' : 'D';
    
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="bg-dark-gray border-primary/20 p-8 text-center">
            <div className="mb-6">
              <div className={`text-6xl font-heading font-black mb-4 ${
                rank === 'S' ? 'text-cyber-yellow' :
                rank === 'A' ? 'text-primary' :
                rank === 'B' ? 'text-neon-green' :
                rank === 'C' ? 'text-secondary' :
                'text-light-gray'
              }`}>
                {rank}
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Battle Complete!
              </h2>
              <p className="text-lg font-paragraph text-light-gray">
                {rank === 'S' ? 'Perfect Victory!' :
                 rank === 'A' ? 'Excellent Performance!' :
                 rank === 'B' ? 'Good Job!' :
                 rank === 'C' ? 'Keep Practicing!' :
                 'Try Again!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-3xl font-heading font-bold text-primary">{score}</p>
                <p className="text-sm font-paragraph text-light-gray">Total Score</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-secondary">{accuracy}%</p>
                <p className="text-sm font-paragraph text-light-gray">Accuracy</p>
              </div>
            </div>

            {animeCharacter && (
              <div className="mb-6">
                <Image
                  src={animeCharacter.image}
                  alt={animeCharacter.name}
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full border-2 border-primary mx-auto mb-3"
                />
                <p className="font-paragraph text-light-gray italic">
                  "{rank === 'S' ? 'Incredible! You are a true warrior!' :
                    rank === 'A' ? 'Well done! Your skills are impressive!' :
                    'Good effort! Keep training and you\'ll improve!'}"
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={resetBattle} className="bg-primary text-primary-foreground">
                <Play className="h-4 w-4 mr-2" />
                Battle Again
              </Button>
              <Button onClick={resetBattle} variant="outline" className="border-primary text-primary">
                Return to Arena
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
            Battle Arena
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-3xl mx-auto">
            Test your knowledge in epic quiz battles. Fight solo, with your guild, or in massive tournaments.
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-dark-gray rounded-lg p-1">
            {(['solo', 'guild', 'tournament'] as const).map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? 'default' : 'ghost'}
                onClick={() => setSelectedMode(mode)}
                className={`px-6 py-3 ${
                  selectedMode === mode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-light-gray hover:text-foreground'
                }`}
              >
                {mode === 'solo' && <Target className="h-4 w-4 mr-2" />}
                {mode === 'guild' && <Users className="h-4 w-4 mr-2" />}
                {mode === 'tournament' && <Crown className="h-4 w-4 mr-2" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Battle Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {battleRooms
            .filter(room => room.type === selectedMode)
            .map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-dark-gray border-primary/20 p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {room.name}
                    </h3>
                    <Badge 
                      className={
                        room.status === 'waiting' ? 'bg-neon-green text-black' :
                        room.status === 'starting' ? 'bg-cyber-yellow text-black' :
                        room.status === 'active' ? 'bg-primary text-primary-foreground' :
                        'bg-light-gray text-dark-gray'
                      }
                    >
                      {room.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-light-gray">Subject:</span>
                      <Badge variant="outline" className="border-primary text-primary">
                        {room.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-light-gray">Difficulty:</span>
                      <Badge variant="outline" className={
                        room.difficulty === 'Epic' ? 'border-secondary text-secondary' :
                        room.difficulty === 'Hard' ? 'border-destructive text-destructive' :
                        'border-neon-green text-neon-green'
                      }>
                        {room.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-light-gray">Players:</span>
                      <span className="font-heading text-foreground">
                        {room.currentParticipants}/{room.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-light-gray">Prize:</span>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-heading text-primary">{room.prize} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-paragraph text-light-gray mb-2">
                      <span>Room Capacity</span>
                      <span>{Math.round((room.currentParticipants / room.maxParticipants) * 100)}%</span>
                    </div>
                    <Progress value={(room.currentParticipants / room.maxParticipants) * 100} className="h-2" />
                  </div>

                  {room.status === 'starting' && (
                    <div className="mb-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-cyber-yellow">
                        <Clock className="h-4 w-4" />
                        <span className="font-heading">Starting in {Math.floor(room.timeRemaining / 60)}:{(room.timeRemaining % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => joinBattle(room)}
                    disabled={room.status === 'active' || room.status === 'finished'}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Sword className="h-4 w-4 mr-2" />
                    {room.status === 'waiting' ? 'Join Battle' :
                     room.status === 'starting' ? 'Join Now' :
                     room.status === 'active' ? 'In Progress' :
                     'Finished'}
                  </Button>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Quick Battle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              Quick Battle
            </h3>
            <p className="font-paragraph text-light-gray mb-6">
              Jump into an instant battle with random opponents and questions
            </p>
            <Button 
              onClick={() => joinBattle(battleRooms[0])}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Quick Battle
            </Button>
          </Card>
        </motion.div>

        {/* Neural Story Combat - Battle Mechanics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-heading font-bold text-primary mb-8">Neural Story Combat System</h2>
          <p className="text-lg font-paragraph text-light-gray mb-8 max-w-3xl">
            Experience epic battles where knowledge is your greatest weapon. Face off against AI opponents in real-time combat scenarios that test your understanding and strategic thinking.
          </p>
          <NeuralStoryCombat />
        </motion.div>
      </div>
    </div>
  );
}