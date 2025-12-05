import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Lightbulb, BookOpen } from 'lucide-react';

interface ReelStep {
  id: string;
  title: string;
  description: string;
  formula?: string;
  hint?: string;
  emoji: string;
}

const mockSteps: ReelStep[] = [
  {
    id: '1',
    title: 'Identify the Problem',
    description: 'First, understand what the problem is asking for',
    hint: 'Look for keywords like "find", "calculate", "solve"',
    emoji: '🔍'
  },
  {
    id: '2',
    title: 'Set Up the Equation',
    description: 'Write down the mathematical equation',
    formula: 'ax² + bx + c = 0',
    hint: 'Rearrange to standard form',
    emoji: '📝'
  },
  {
    id: '3',
    title: 'Apply the Formula',
    description: 'Use the quadratic formula to solve',
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    hint: 'Be careful with signs and operations',
    emoji: '⚙️'
  },
  {
    id: '4',
    title: 'Verify Your Answer',
    description: 'Check if your solution is correct',
    hint: 'Substitute back into the original equation',
    emoji: '✅'
  }
];

export function InteractiveReelOverlay() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

  const toggleHint = (stepId: string) => {
    const newRevealed = new Set(revealedHints);
    if (newRevealed.has(stepId)) {
      newRevealed.delete(stepId);
    } else {
      newRevealed.add(stepId);
    }
    setRevealedHints(newRevealed);
  };

  return (
    <div className="w-full py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-heading text-3xl text-foreground mb-2">
          Tap to Reveal Steps & Formulas
        </h3>
        <p className="text-light-gray">Interactive overlay system for deep learning</p>
      </motion.div>

      {/* Reel Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 backdrop-blur-md border-2 border-primary rounded-lg p-8 text-center"
      >
        <div className="text-6xl mb-4">📐</div>
        <h4 className="font-heading text-2xl text-foreground mb-2">
          Solving Quadratic Equations
        </h4>
        <p className="text-light-gray mb-6">
          Tap on any step below to reveal detailed explanations and formulas
        </p>

        {/* Steps Container */}
        <div className="space-y-3">
          {mockSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-dark-gray border-2 border-primary/30 rounded-lg p-4 text-left hover:border-primary/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{step.emoji}</span>
                    <div>
                      <p className="font-heading text-foreground">
                        Step {index + 1}: {step.title}
                      </p>
                      <p className="text-xs text-light-gray">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedStep === step.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Card className="bg-background/60 border-2 border-primary/30 rounded-b-none mt-2 p-4 space-y-4">
                      {/* Formula Display */}
                      {step.formula && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-dark-gray border-2 border-primary/20 rounded p-4"
                        >
                          <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                            Formula
                          </p>
                          <p className="font-heading text-xl text-primary font-mono">
                            {step.formula}
                          </p>
                        </motion.div>
                      )}

                      {/* Hint Button */}
                      {step.hint && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          onClick={() => toggleHint(step.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded p-3 text-left hover:border-primary/60 transition-all"
                        >
                          <Lightbulb className="w-5 h-5 text-cyber-yellow flex-shrink-0" />
                          <span className="font-heading text-foreground">
                            {revealedHints.has(step.id) ? 'Hide Hint' : 'Show Hint'}
                          </span>
                        </motion.button>
                      )}

                      {/* Revealed Hint */}
                      <AnimatePresence>
                        {revealedHints.has(step.id) && step.hint && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-cyber-yellow/10 border-2 border-cyber-yellow/30 rounded p-3"
                          >
                            <p className="text-sm text-light-gray">
                              <span className="font-heading text-cyber-yellow">💡 Hint: </span>
                              {step.hint}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Additional Resources */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-2 pt-2"
                      >
                        <Button
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          📝 Practice
                        </Button>
                      </motion.div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Box */}
      <Card className="bg-background/40 border border-primary/20 p-6">
        <h4 className="font-heading text-lg text-foreground mb-3">How It Works</h4>
        <ul className="space-y-2 text-sm font-paragraph text-light-gray">
          <li>✓ Tap any step to expand and see detailed explanations</li>
          <li>✓ Formulas are displayed in a clear, easy-to-read format</li>
          <li>✓ Hints help guide you without giving away the answer</li>
          <li>✓ Practice problems linked to each step</li>
          <li>✓ Learn more resources for deeper understanding</li>
        </ul>
      </Card>
    </div>
  );
}
