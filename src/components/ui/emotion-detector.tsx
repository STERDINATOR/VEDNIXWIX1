/**
 * Emotion Detector Component
 * Simulated emotion detection UI for user interactions
 * Real webcam analysis can be added later with face-api.js or ml5.js
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';

export type DetectedEmotion = 'happy' | 'sad' | 'neutral' | 'confused' | 'excited';

interface EmotionDetectorProps {
  onEmotionDetected?: (emotion: DetectedEmotion) => void;
  showWebcamPlaceholder?: boolean;
}

const emotions: { id: DetectedEmotion; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'excited', label: 'Excited', icon: '🚀', color: 'text-yellow-400' },
  { id: 'happy', label: 'Happy', icon: '😄', color: 'text-green-400' },
  { id: 'neutral', label: 'Neutral', icon: '😐', color: 'text-gray-400' },
  { id: 'confused', label: 'Confused', icon: '🤔', color: 'text-orange-400' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'text-blue-400' },
];

export function EmotionDetector({ onEmotionDetected, showWebcamPlaceholder = true }: EmotionDetectorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<DetectedEmotion | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleEmotionSelect = (emotion: DetectedEmotion) => {
    setSelectedEmotion(emotion);
    setIsDetecting(true);

    // Simulate detection animation
    setTimeout(() => {
      setIsDetecting(false);
      onEmotionDetected?.(emotion);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Webcam Placeholder */}
      {showWebcamPlaceholder && (
        <Card className="border-primary/30 bg-gray-900 p-4">
          <div className="relative w-full aspect-video rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-primary/20 overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-sm text-gray-400">Webcam Placeholder</p>
              <p className="text-xs text-gray-500 mt-1">Real emotion detection coming soon</p>
            </div>

            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </Card>
      )}

      {/* Emotion Selection */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-300">How are you feeling?</p>
        <div className="grid grid-cols-5 gap-2">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              className={`p-3 rounded-lg transition-all ${
                selectedEmotion === emotion.id
                  ? 'bg-primary text-black scale-110'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isDetecting}
            >
              <div className="text-2xl">{emotion.icon}</div>
              <p className="text-xs mt-1 font-semibold">{emotion.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detection Status */}
      {isDetecting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/20 border border-primary/50 rounded-lg p-3 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block"
          >
            <span className="text-2xl">
              {emotions.find(e => e.id === selectedEmotion)?.icon}
            </span>
          </motion.div>
          <p className="text-sm text-primary font-semibold mt-2">
            Detecting emotion...
          </p>
        </motion.div>
      )}

      {/* Emotion Feedback */}
      {selectedEmotion && !isDetecting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-3"
        >
          <p className="text-sm text-green-400 font-semibold">
            ✓ Emotion detected: {emotions.find(e => e.id === selectedEmotion)?.label}
          </p>
          <p className="text-xs text-green-300 mt-1">
            Your mentor will adapt their teaching style accordingly!
          </p>
        </motion.div>
      )}
    </div>
  );
}
