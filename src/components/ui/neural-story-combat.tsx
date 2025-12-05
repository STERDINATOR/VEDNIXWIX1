import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Heart, Shield } from 'lucide-react';

interface Enemy {
  id: string;
  name: string;
  emoji: string;
  health: number;
  maxHealth: number;
  dialogue: string[];
  weaknessHint: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const enemies: Enemy[] = [
  {
    id: 'ignorance',
    name: 'Ignorance Wraith',
    emoji: '👻',
    health: 100,
    maxHealth: 100,
    dialogue: [
      'You dare challenge me?',
      'Your knowledge is weak!',
      'I feed on confusion!',
      'Impossible... I am fading...'
    ],
    weaknessHint: 'Answer questions correctly to weaken this foe'
  },
  {
    id: 'confusion',
    name: 'Confusion Phantom',
    emoji: '🌀',
    health: 80,
    maxHealth: 80,
    dialogue: [
      'Everything is unclear!',
      'You cannot understand!',
      'Chaos reigns supreme!',
      'No... clarity defeats me...'
    ],
    weaknessHint: 'Solve the puzzle to dispel the chaos'
  }
];

const questions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of Japan?',
    options: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'],
    correctIndex: 1,
    explanation: 'Tokyo is the capital and largest city of Japan.'
  },
  {
    id: '2',
    text: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctIndex: 1,
    explanation: 'Mercury is the closest planet to the Sun in our solar system.'
  },
  {
    id: '3',
    text: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctIndex: 2,
    explanation: 'Au is the chemical symbol for Gold, derived from its Latin name "aurum".'
  }
];

export function NeuralStoryCombat() {
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [enemy, setEnemy] = useState<Enemy>(JSON.parse(JSON.stringify(enemies[0])));
  const [playerHealth, setPlayerHealth] = useState(100);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [combatLog, setCombatLog] = useState<string[]>(['Battle started!']);
  const [isAttacking, setIsAttacking] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    setIsAttacking(true);

    const isCorrect = index === currentQuestion.correctIndex;
    const damage = isCorrect ? 30 : 10;
    const newHealth = Math.max(0, enemy.health - damage);

    if (isCorrect) {
      setCombatLog(prev => [...prev, `✓ Correct! ${currentQuestion.explanation}`]);
      setCombatLog(prev => [...prev, `⚡ ${enemy.name} takes ${damage} damage!`]);
    } else {
      setCombatLog(prev => [...prev, `✗ Incorrect. ${currentQuestion.explanation}`]);
      setCombatLog(prev => [...prev, `💥 You take ${damage} damage!`]);
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }

    setEnemy(prev => ({
      ...prev,
      health: newHealth
    }));

    // Update dialogue
    if (newHealth <= 0) {
      setDialogueIndex(prev => Math.min(prev + 1, enemy.dialogue.length - 1));
    } else {
      setDialogueIndex(prev => Math.min(prev + 1, enemy.dialogue.length - 2));
    }

    setTimeout(() => {
      setIsAttacking(false);
    }, 600);
  };

  const handleNextRound = () => {
    if (enemy.health <= 0) {
      // Enemy defeated
      if (currentEnemyIndex < enemies.length - 1) {
        setCurrentEnemyIndex(prev => prev + 1);
        setEnemy(JSON.parse(JSON.stringify(enemies[currentEnemyIndex + 1])));
        setCurrentQuestionIndex(0);
        setPlayerHealth(100);
        setSelectedAnswer(null);
        setShowResult(false);
        setDialogueIndex(0);
        setCombatLog(['New battle started!']);
      } else {
        setCombatLog(prev => [...prev, '🏆 All enemies defeated! Victory!']);
      }
    } else {
      // Next question
      setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const allEnemiesDefeated = currentEnemyIndex === enemies.length - 1 && enemy.health <= 0;

  return (
    <div className="w-full py-24 md:py-40 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-6xl md:text-7xl text-foreground mb-4">
            NEURAL STORY <span className="text-secondary">COMBAT</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Battle knowledge enemies. Answer questions correctly to weaken them. Watch epic attack sequences unfold.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Combat Arena */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-8"
            >
              {/* Enemy Display */}
              <div className="text-center mb-8">
                <motion.div
                  animate={isAttacking ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-8xl mb-4 inline-block"
                >
                  {enemy.emoji}
                </motion.div>
                <h3 className="font-heading text-3xl text-foreground mb-2">{enemy.name}</h3>
                <p className="text-light-gray mb-4">{enemy.dialogue[dialogueIndex]}</p>

                {/* Enemy Health Bar */}
                <div className="bg-background/50 rounded-full h-4 overflow-hidden border border-primary/20 mb-2">
                  <motion.div
                    initial={false}
                    animate={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-secondary to-destructive"
                  ></motion.div>
                </div>
                <p className="text-sm text-light-gray">
                  HP: {Math.max(0, enemy.health)} / {enemy.maxHealth}
                </p>
              </div>

              {/* Question */}
              <div className="bg-background/40 border border-primary/20 rounded-lg p-6 mb-6">
                <p className="font-heading text-xl text-foreground mb-4">{currentQuestion.text}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left font-paragraph ${
                        selectedAnswer === null
                          ? 'border-primary/30 bg-background/30 hover:border-primary hover:bg-primary/5 cursor-pointer'
                          : selectedAnswer === index
                          ? index === currentQuestion.correctIndex
                            ? 'border-neon-green bg-neon-green/10'
                            : 'border-destructive bg-destructive/10'
                          : index === currentQuestion.correctIndex
                          ? 'border-neon-green bg-neon-green/10'
                          : 'border-primary/20 bg-background/30 opacity-50'
                      }`}
                    >
                      <span className="font-heading text-lg mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Attack Animation */}
              <AnimatePresence>
                {isAttacking && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center mb-4"
                  >
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl"
                    >
                      ⚡ ATTACK! ⚡
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  {enemy.health <= 0 && currentEnemyIndex === enemies.length - 1 ? (
                    <Button className="w-full bg-neon-green text-dark-gray hover:bg-neon-green/90 font-heading uppercase">
                      🏆 Victory! Return Home
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextRound}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
                    >
                      {enemy.health <= 0 ? 'Next Battle' : 'Next Question'}
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Combat Log & Stats */}
          <div className="space-y-6">
            {/* Player Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-6"
            >
              <h3 className="font-heading text-xl text-foreground mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-light-gray mb-2">Health</p>
                  <div className="bg-background/50 rounded-full h-3 overflow-hidden border border-primary/20">
                    <motion.div
                      initial={false}
                      animate={{ width: `${playerHealth}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-cyber-yellow"
                    ></motion.div>
                  </div>
                  <p className="text-xs text-light-gray mt-1">{playerHealth} / 100</p>
                </div>
                <div className="flex items-center gap-2 text-light-gray">
                  <Zap className="h-4 w-4 text-cyber-yellow" />
                  <span className="text-sm">Correct Answers: {currentQuestionIndex}</span>
                </div>
              </div>
            </motion.div>

            {/* Combat Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-6 max-h-96 overflow-y-auto"
            >
              <h3 className="font-heading text-xl text-foreground mb-4">Battle Log</h3>
              <div className="space-y-2">
                {combatLog.map((log, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-paragraph text-light-gray"
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
