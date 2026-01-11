/**
 * Emotion-Adaptive Battle System Component
 * Generates and manages story-based battles that adapt to user's emotional state
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image } from '@/components/ui/image';
import { EmotionDetector, type DetectedEmotion } from '@/components/ui/emotion-detector';
import {
  generateEmotionalBattle,
  generateEmotionalQuiz,
  getEmotionalFeedback,
  type AdaptiveBattle,
  type EmotionalQuiz,
  type BattleQuestion,
  type UserEmotion
} from '@/lib/emotion-adaptive-battles';
import {
  Zap,
  Heart,
  Brain,
  Sparkles,
  CheckCircle,
  XCircle,
  Timer,
  Flame,
  Trophy,
  ArrowRight,
  Loader
} from 'lucide-react';

type BattlePhase = 'emotion-detection' | 'battle-intro' | 'battle-active' | 'battle-results' | 'quiz-intro' | 'quiz-active' | 'quiz-results';

interface BattleStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  streak: number;
}

export function EmotionAdaptiveBattleSystem() {
  const [phase, setPhase] = useState<BattlePhase>('emotion-detection');
  const [selectedEmotion, setSelectedEmotion] = useState<UserEmotion | null>(null);
  const [battleMode, setBattleMode] = useState<'battle' | 'quiz'>('battle');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  
  const [battle, setBattle] = useState<AdaptiveBattle | null>(null);
  const [quiz, setQuiz] = useState<EmotionalQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [stats, setStats] = useState<BattleStats>({
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    timeSpent: 0,
    streak: 0
  });

  const topics = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Programming',
    'History',
    'Literature',
    'Geography'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Epic'];

  // Timer for questions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((phase === 'battle-active' || phase === 'quiz-active') && timeLeft > 0) {
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
  }, [phase, timeLeft]);

  const handleEmotionDetected = async (emotion: DetectedEmotion) => {
    setSelectedEmotion(emotion as UserEmotion);
    setPhase('battle-intro');
  };

  const startBattle = async () => {
    if (!selectedEmotion || !selectedTopic) return;
    
    setIsLoading(true);
    try {
      const generatedBattle = await generateEmotionalBattle(
        selectedEmotion,
        selectedTopic,
        selectedDifficulty
      );
      setBattle(generatedBattle);
      setStats({
        score: 0,
        correctAnswers: 0,
        totalQuestions: generatedBattle.questions.length,
        timeSpent: 0,
        streak: 0
      });
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setPhase('battle-active');
    } catch (error) {
      console.error('Error starting battle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!selectedEmotion || !selectedTopic) return;
    
    setIsLoading(true);
    try {
      const generatedQuiz = await generateEmotionalQuiz(
        selectedEmotion,
        selectedTopic,
        selectedDifficulty
      );
      setQuiz(generatedQuiz);
      setStats({
        score: 0,
        correctAnswers: 0,
        totalQuestions: generatedQuiz.questions.length,
        timeSpent: 0,
        streak: 0
      });
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setPhase('quiz-active');
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestions = battle?.questions || quiz?.questions || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 5) * 10;
      const streakBonus = stats.streak * 25;
      const totalPoints = currentQuestion.points + timeBonus + streakBonus;
      
      setStats(prev => ({
        ...prev,
        score: prev.score + totalPoints,
        correctAnswers: prev.correctAnswers + 1,
        streak: prev.streak + 1
      }));
    } else {
      setStats(prev => ({
        ...prev,
        streak: 0
      }));
    }

    // Move to next question after delay
    setTimeout(() => {
      const totalQuestions = stats.totalQuestions;
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        setPhase(phase === 'battle-active' ? 'battle-results' : 'quiz-results');
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    setStats(prev => ({
      ...prev,
      streak: 0
    }));
    
    const totalQuestions = stats.totalQuestions;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setPhase(phase === 'battle-active' ? 'battle-results' : 'quiz-results');
    }
  };

  const resetBattle = () => {
    setPhase('emotion-detection');
    setBattle(null);
    setQuiz(null);
    setSelectedEmotion(null);
    setSelectedTopic('');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setStats({
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      timeSpent: 0,
      streak: 0
    });
  };

  // Emotion Detection Phase
  if (phase === 'emotion-detection') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">
            Emotion-Adaptive Battle System
          </h2>
          <p className="text-lg font-paragraph text-light-gray max-w-2xl mx-auto">
            Let's start by understanding how you're feeling. Your emotional state will help us create the perfect learning experience for you.
          </p>
        </motion.div>

        <Card className="bg-dark-gray border-primary/20 p-8">
          <EmotionDetector onEmotionDetected={handleEmotionDetected} />
        </Card>
      </div>
    );
  }

  // Battle/Quiz Introduction Phase
  if (phase === 'battle-intro' || phase === 'quiz-intro') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge className="mb-4 bg-primary text-primary-foreground">
            Emotion: {selectedEmotion?.toUpperCase()}
          </Badge>
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">
            {phase === 'battle-intro' ? 'Choose Your Battle' : 'Choose Your Quiz'}
          </h2>
          <p className="text-lg font-paragraph text-light-gray max-w-2xl mx-auto">
            Select a topic and difficulty level. Your experience will be adapted to your {selectedEmotion} mood.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Selection */}
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">
              Select Topic
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {topics.map(topic => (
                <Button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`${
                    selectedTopic === topic
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-primary/20 text-light-gray hover:text-foreground'
                  }`}
                  variant={selectedTopic === topic ? 'default' : 'outline'}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </Card>

          {/* Difficulty Selection */}
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">
              Select Difficulty
            </h3>
            <div className="space-y-3">
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`w-full ${
                    selectedDifficulty === difficulty
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-background border border-secondary/20 text-light-gray hover:text-foreground'
                  }`}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                >
                  {difficulty}
                  {difficulty === 'Easy' && ' (50 XP per question)'}
                  {difficulty === 'Medium' && ' (100 XP per question)'}
                  {difficulty === 'Hard' && ' (150 XP per question)'}
                  {difficulty === 'Epic' && ' (250 XP per question)'}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Mode Selection */}
        <Card className="bg-dark-gray border-primary/20 p-6">
          <h3 className="text-xl font-heading font-bold text-foreground mb-4">
            Choose Experience Mode
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setBattleMode('battle');
                startBattle();
              }}
              disabled={!selectedTopic || isLoading}
              className="h-20 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-heading"
            >
              {isLoading && battleMode === 'battle' ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Zap className="h-6 w-6 mr-2" />
                  Story-Based Battle
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setBattleMode('quiz');
                startQuiz();
              }}
              disabled={!selectedTopic || isLoading}
              className="h-20 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-heading"
            >
              {isLoading && battleMode === 'quiz' ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Brain className="h-6 w-6 mr-2" />
                  Adaptive Quiz
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Battle Active Phase
  if (phase === 'battle-active' && battle) {
    const currentQuestion = battle.questions[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        {/* Battle Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-secondary text-secondary-foreground">
              Question {currentQuestionIndex + 1}/{battle.questions.length}
            </Badge>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-xl font-heading font-bold">{stats.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-cyber-yellow" />
              <span className="text-lg font-heading">{stats.streak}x</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-destructive" />
              <span className="text-2xl font-heading font-bold text-destructive">{timeLeft}s</span>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="w-32 h-3" />
          </div>
        </div>

        {/* Enemy Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-primary bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3">
              <span className="text-6xl">⚔️</span>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {battle.enemyCharacter.name}
            </Badge>
          </div>
          <p className="text-sm font-paragraph text-light-gray mt-3 max-w-md mx-auto">
            {battle.enemyCharacter.emotionalResponse}
          </p>
        </motion.div>

        {/* Question Card */}
        <Card className="bg-dark-gray border-primary/20 p-8">
          <div className="text-center mb-6">
            <p className="text-sm font-paragraph text-light-gray mb-2">
              {currentQuestion.storyElement}
            </p>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
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

          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg"
            >
              <p className="text-sm font-paragraph text-light-gray">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </Card>

        {/* Progress */}
        <div className="text-center">
          <Progress 
            value={((currentQuestionIndex + 1) / battle.questions.length) * 100} 
            className="w-full h-2 mb-2"
          />
          <p className="text-sm font-paragraph text-light-gray">
            Battle Progress: {currentQuestionIndex + 1} of {battle.questions.length} questions
          </p>
        </div>
      </div>
    );
  }

  // Quiz Active Phase
  if (phase === 'quiz-active' && quiz) {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-secondary text-secondary-foreground">
              Question {currentQuestionIndex + 1}/{quiz.questions.length}
            </Badge>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-xl font-heading font-bold">{stats.score}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-destructive" />
              <span className="text-2xl font-heading font-bold text-destructive">{timeLeft}s</span>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="w-32 h-3" />
          </div>
        </div>

        {/* Quiz Info */}
        <Card className="bg-dark-gray border-primary/20 p-6">
          <p className="text-sm font-paragraph text-light-gray mb-2">
            Pacing: {quiz.pacing === 'slow' ? 'Take your time' : quiz.pacing === 'fast' ? 'Move quickly' : 'Steady pace'}
          </p>
          <p className="text-foreground">{quiz.encouragement}</p>
        </Card>

        {/* Question Card */}
        <Card className="bg-dark-gray border-primary/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
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

          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg"
            >
              <p className="text-sm font-paragraph text-light-gray">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </Card>

        {/* Progress */}
        <div className="text-center">
          <Progress 
            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
            className="w-full h-2 mb-2"
          />
          <p className="text-sm font-paragraph text-light-gray">
            Quiz Progress: {currentQuestionIndex + 1} of {quiz.questions.length} questions
          </p>
        </div>
      </div>
    );
  }

  // Results Phase
  if (phase === 'battle-results' || phase === 'quiz-results') {
    const accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
    const feedback = getEmotionalFeedback(
      selectedEmotion || 'neutral',
      stats.score,
      stats.totalQuestions * 100,
      stats.timeSpent
    );
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-dark-gray border-primary/20 p-8 text-center">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-cyber-yellow mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              {phase === 'battle-results' ? 'Battle Complete!' : 'Quiz Complete!'}
            </h2>
            <p className="text-lg font-paragraph text-light-gray">
              {feedback.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-3xl font-heading font-bold text-primary">{stats.score}</p>
              <p className="text-sm font-paragraph text-light-gray">Total Score</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-secondary">{accuracy}%</p>
              <p className="text-sm font-paragraph text-light-gray">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-neon-green">{stats.correctAnswers}/{stats.totalQuestions}</p>
              <p className="text-sm font-paragraph text-light-gray">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-cyber-yellow">{feedback.emotionalBonus}</p>
              <p className="text-sm font-paragraph text-light-gray">Emotion Bonus</p>
            </div>
          </div>

          <div className="mb-8 p-6 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-lg font-paragraph text-light-gray mb-2">
              {feedback.encouragement}
            </p>
            <p className="text-sm font-paragraph text-light-gray">
              {feedback.nextSteps}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={resetBattle} className="bg-primary text-primary-foreground">
              <ArrowRight className="h-4 w-4 mr-2" />
              Try Another
            </Button>
            <Button onClick={resetBattle} variant="outline" className="border-primary text-primary">
              Return to Menu
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return null;
}
