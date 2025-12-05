import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play } from 'lucide-react';

interface TimeVariant {
  id: string;
  duration: number;
  label: string;
  description: string;
  emoji: string;
  color: string;
  content: string;
}

const timeVariants: TimeVariant[] = [
  {
    id: '5s',
    duration: 5,
    label: '5 Second Blitz',
    description: 'Ultra-quick concept overview',
    emoji: '⚡',
    color: '#FFFF00',
    content: 'Quadratic equations are polynomial equations of degree 2. They have the form ax² + bx + c = 0 and can be solved using the quadratic formula.'
  },
  {
    id: '15s',
    duration: 15,
    label: '15 Second Summary',
    description: 'Quick explanation with key points',
    emoji: '📝',
    color: '#00FFFF',
    content: 'Quadratic equations are polynomial equations of degree 2. They have the form ax² + bx + c = 0. You can solve them using: 1) Factoring, 2) Completing the square, or 3) The quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. The discriminant (b² - 4ac) tells you how many real solutions exist.'
  },
  {
    id: '30s',
    duration: 30,
    label: '30 Second Deep Dive',
    description: 'Comprehensive explanation with examples',
    emoji: '🎓',
    color: '#00FF00',
    content: 'Quadratic equations are polynomial equations of degree 2 with the form ax² + bx + c = 0. There are three main solving methods: 1) Factoring (fastest when possible), 2) Completing the square (always works), 3) Quadratic formula (most reliable). The discriminant (b² - 4ac) determines the nature of solutions: positive = 2 real solutions, zero = 1 real solution, negative = 2 complex solutions. Real-world applications include projectile motion, optimization problems, and engineering calculations.'
  }
];

export function ReelTimeVariants() {
  const [selectedVariant, setSelectedVariant] = useState<TimeVariant>(timeVariants[1]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-heading text-3xl text-foreground mb-2">
          Explain in Different Time Lengths
        </h3>
        <p className="text-light-gray">
          Choose how much time you have to learn a concept
        </p>
      </motion.div>

      {/* Time Variant Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {timeVariants.map((variant, index) => (
          <motion.button
            key={variant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedVariant(variant)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-lg border-2 transition-all text-center ${
              selectedVariant.id === variant.id
                ? 'bg-dark-gray'
                : 'bg-background/40 hover:bg-background/60'
            }`}
            style={{
              borderColor: selectedVariant.id === variant.id ? variant.color : '#333333',
              boxShadow: selectedVariant.id === variant.id ? `0 0 20px ${variant.color}40` : 'none'
            }}
          >
            <div className="text-4xl mb-3">{variant.emoji}</div>
            <h4 className="font-heading text-lg text-foreground mb-1">
              {variant.label}
            </h4>
            <p className="text-xs text-light-gray mb-3">
              {variant.description}
            </p>
            <Badge style={{ backgroundColor: variant.color + '20', color: variant.color }}>
              <Clock className="w-3 h-3 mr-1" />
              {variant.duration}s
            </Badge>
          </motion.button>
        ))}
      </motion.div>

      {/* Content Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        key={selectedVariant.id}
      >
        <Card className="bg-dark-gray border-2 border-primary p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{selectedVariant.emoji}</div>
                <div className="text-left">
                  <h4 className="font-heading text-2xl text-foreground">
                    {selectedVariant.label}
                  </h4>
                  <p className="text-light-gray text-sm">
                    {selectedVariant.description}
                  </p>
                </div>
              </div>
              <Badge
                style={{ backgroundColor: selectedVariant.color + '20', color: selectedVariant.color }}
                className="text-lg px-4 py-2"
              >
                <Clock className="w-4 h-4 mr-2" />
                {selectedVariant.duration}s
              </Badge>
            </div>
          </div>

          {/* Video Preview */}
          <div
            className="h-64 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: selectedVariant.color + '20' }}
          >
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🎬
            </motion.div>

            {/* Play Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            </motion.div>

            {/* Duration Indicator */}
            {isPlaying && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: selectedVariant.duration, ease: 'linear' }}
                onAnimationComplete={() => setIsPlaying(false)}
                className="absolute bottom-0 left-0 h-1 bg-primary"
              ></motion.div>
            )}
          </div>

          {/* Content Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/40 rounded-lg p-6 mb-6 border border-primary/20"
          >
            <p className="font-paragraph text-foreground leading-relaxed">
              {selectedVariant.content}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {isPlaying ? 'Pause' : 'Play'} Reel
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
            >
              📝 Take Notes
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
            >
              ❓ Quiz
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Info */}
      <Card className="bg-background/40 border border-primary/20 p-6">
        <h4 className="font-heading text-lg text-foreground mb-3">Why Multiple Durations?</h4>
        <ul className="space-y-2 text-sm font-paragraph text-light-gray">
          <li>⚡ <strong>5 seconds:</strong> Quick refresher or busy schedule</li>
          <li>📝 <strong>15 seconds:</strong> Balanced overview with key points</li>
          <li>🎓 <strong>30 seconds:</strong> Deep understanding with examples</li>
          <li>✨ <strong>Choose based on your time and learning goals</strong></li>
        </ul>
      </Card>
    </div>
  );
}
