import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface MentorMonologueProps {
  topic: string;
  difficulty: string;
  onComplete?: () => void;
}

export function MentorMonologue({ topic, difficulty, onComplete }: MentorMonologueProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');

  // Generate mentor monologue based on topic and difficulty
  useEffect(() => {
    const generateMonologue = async () => {
      // This would integrate with Gemini AI in production
      const monologues: Record<string, Record<string, string>> = {
        'Algebra': {
          'Easy': 'Welcome, student! Today we\'re exploring the fundamentals of algebra. Think of algebra as a way to solve puzzles using letters and numbers. When we see "x", we\'re looking for an unknown value. Let\'s start with simple equations and build our way up!',
          'Medium': 'Algebra is the language of mathematics. We use variables to represent unknown quantities and create equations to solve real-world problems. Understanding how to manipulate equations is crucial for advanced mathematics.',
          'Hard': 'Advanced algebra involves complex polynomial equations, systems of equations, and abstract algebraic structures. Mastery requires understanding the underlying principles of mathematical operations and their properties.'
        },
        'Geometry': {
          'Easy': 'Geometry is all around us! It\'s the study of shapes, sizes, and positions. From circles to triangles, understanding these basic shapes helps us understand the world. Let\'s explore how shapes fit together!',
          'Medium': 'Geometry teaches us about spatial relationships and properties of figures. We use theorems and proofs to understand why shapes behave the way they do. This foundation is essential for physics and engineering.',
          'Hard': 'Advanced geometry explores non-Euclidean spaces, transformations, and coordinate geometry. Understanding these concepts opens doors to calculus and higher mathematics.'
        },
        'Calculus': {
          'Easy': 'Calculus might seem intimidating, but it\'s really about understanding change. How fast is something moving? How much area does a shape cover? These are questions calculus helps us answer!',
          'Medium': 'Calculus is divided into two main branches: derivatives and integrals. Derivatives measure rates of change, while integrals measure accumulation. Together, they form the foundation of mathematical analysis.',
          'Hard': 'Multivariable calculus extends single-variable concepts to multiple dimensions. Understanding partial derivatives, multiple integrals, and vector calculus is essential for physics, engineering, and advanced mathematics.'
        }
      };

      const text = monologues[topic]?.[difficulty] || 
        `Welcome to ${topic}! This is an important concept in mathematics. Pay attention to the key principles and don't hesitate to ask questions.`;
      
      setFullText(text);
    };

    generateMonologue();
  }, [topic, difficulty]);

  // Typewriter effect
  useEffect(() => {
    if (!isPlaying) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        onComplete?.();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, fullText, onComplete]);

  const handlePlay = () => {
    if (!isPlaying) {
      setDisplayedText('');
      setIsPlaying(true);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-2xl">🧙</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-heading text-lg text-primary mb-2">Mentor Guidance</h3>
          
          <div className="bg-dark-gray/50 rounded-lg p-4 mb-4 min-h-24">
            <p className="font-paragraph text-light-gray leading-relaxed">
              {displayedText}
              {isPlaying && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePlay}
              disabled={isPlaying || displayedText === fullText}
              className="bg-primary text-black hover:bg-primary/80"
            >
              {isPlaying ? 'Playing...' : displayedText === fullText ? 'Complete' : 'Play Explanation'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
