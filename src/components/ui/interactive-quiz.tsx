import React, { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgressStore } from '@/stores/userProgressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface Quiz {
  _id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  answerExplanation: string;
  difficulty: string;
  pointsValue: number;
}

interface InteractiveQuizProps {
  reelId?: string;
  topicId?: string;
  onComplete?: (score: number, totalPoints: number) => void;
}

export function InteractiveQuiz({ reelId, topicId, onComplete }: InteractiveQuizProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const { addXP, completeQuiz } = useProgressStore();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Quiz>('reelquizzes');
        setQuizzes(items);
        const total = items.reduce((sum, q) => sum + q.pointsValue, 0);
        setTotalPoints(total);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const currentQuiz = quizzes[currentIndex];
  const isAnswerCorrect = selectedAnswer === currentQuiz?.correctAnswer;

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer);
      setShowResult(true);

      if (answer === currentQuiz.correctAnswer) {
        setScore((prev) => prev + currentQuiz.pointsValue);
        addXP(currentQuiz.pointsValue);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      completeQuiz(currentQuiz._id);
      onComplete?.(score, totalPoints);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (loading) {
    return <div className="text-center text-light-gray">Loading quiz...</div>;
  }

  if (quizzes.length === 0) {
    return <div className="text-center text-light-gray">No quizzes available</div>;
  }

  if (completed) {
    const percentage = Math.round((score / totalPoints) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mb-6">
          {percentage >= 80 ? (
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-secondary mx-auto mb-4" />
          )}
        </div>
        <h2 className="font-heading text-3xl text-primary mb-2">Quiz Complete!</h2>
        <p className="font-paragraph text-light-gray mb-6">
          You scored {score} out of {totalPoints} points ({percentage}%)
        </p>
        <Button onClick={handleRetry} className="bg-primary text-black hover:bg-primary/80">
          Retake Quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-paragraph text-light-gray">
            Question {currentIndex + 1} of {quizzes.length}
          </span>
          <Badge className="bg-primary/20 text-primary">
            {score}/{totalPoints} pts
          </Badge>
        </div>
        <div className="w-full bg-dark-gray/50 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Card className="bg-dark-gray/50 border-primary/20 p-6 mb-6">
        <div className="mb-6">
          <Badge className={`mb-4 ${
            currentQuiz.difficulty === 'Hard'
              ? 'bg-red-500/20 text-red-400'
              : currentQuiz.difficulty === 'Medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-green-500/20 text-green-400'
          }`}>
            {currentQuiz.difficulty}
          </Badge>
          <h3 className="font-heading text-xl text-primary">{currentQuiz.questionText}</h3>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: 'A', value: currentQuiz.optionA },
            { label: 'B', value: currentQuiz.optionB },
            { label: 'C', value: currentQuiz.optionC },
            { label: 'D', value: currentQuiz.optionD },
          ].map(({ label, value }) => (
            <motion.button
              key={label}
              onClick={() => handleAnswerSelect(value)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === value
                  ? isAnswerCorrect
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                  : showResult && value === currentQuiz.correctAnswer
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-primary/20 bg-dark-gray/30 hover:border-primary/50'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="font-heading text-primary font-bold">{label}</span>
                <span className="font-paragraph text-light-gray">{value}</span>
                {showResult && value === currentQuiz.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                )}
                {showResult && selectedAnswer === value && !isAnswerCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg mb-6 ${
                isAnswerCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <p className={`font-paragraph ${isAnswerCorrect ? 'text-green-400' : 'text-red-400'} mb-2`}>
                {isAnswerCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="font-paragraph text-light-gray text-sm">
                {currentQuiz.answerExplanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {showResult && (
        <Button
          onClick={handleNext}
          className="w-full bg-primary text-black hover:bg-primary/80"
        >
          {currentIndex === quizzes.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      )}
    </div>
  );
}
