import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';

interface Mood {
  id: string;
  name: string;
  color: string;
  bgImage: string;
  description: string;
  emoji: string;
}

const moods: Mood[] = [
  {
    id: 'calm',
    name: 'Calm Forest',
    color: '#00FF00',
    bgImage: 'https://static.wixstatic.com/media/c5b305_490d743d8ecb496da658ec88b53d728f~mv2.png?originWidth=1920&originHeight=1024',
    description: 'Peaceful learning environment',
    emoji: '🌲'
  },
  {
    id: 'battle',
    name: 'Battle Arena',
    color: '#FF0000',
    bgImage: 'https://static.wixstatic.com/media/c5b305_33595e345346413ea180cd88272002e3~mv2.png?originWidth=1600&originHeight=896',
    description: 'Intense combat training',
    emoji: '⚔️'
  },
  {
    id: 'study',
    name: 'Study Temple',
    color: '#00FFFF',
    bgImage: 'https://static.wixstatic.com/media/c5b305_2b388092ea9449b5b7d8c824de9478eb~mv2.png?originWidth=1600&originHeight=896',
    description: 'Sacred knowledge sanctuary',
    emoji: '🏯'
  }
];

export function EmotionAdaptiveRealityShift() {
  const [currentMood, setCurrentMood] = useState<Mood>(moods[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMoodChange = (mood: Mood) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMood(mood);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="w-full py-24 md:py-40 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={currentMood.bgImage}
              alt={currentMood.description}
              width={1920}
              height={1024}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[120rem] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-6xl md:text-7xl text-foreground mb-4">
            EMOTION-ADAPTIVE <span style={{ color: currentMood.color }} className="transition-colors duration-500">REALITY SHIFT</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your learning environment adapts to your emotional state. Choose your mood and watch the world transform around you.
          </p>
        </motion.div>

        {/* Mood Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleMoodChange(mood)}
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 group overflow-hidden ${
                currentMood.id === mood.id
                  ? `border-[${mood.color}] bg-background/80 backdrop-blur-sm`
                  : 'border-primary/20 bg-background/40 hover:border-primary/50'
              }`}
              style={{
                borderColor: currentMood.id === mood.id ? mood.color : undefined,
                boxShadow: currentMood.id === mood.id ? `0 0 20px ${mood.color}40` : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/5 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">{mood.emoji}</div>
                <h3 className="font-heading text-xl text-foreground mb-2">{mood.name}</h3>
                <p className="font-paragraph text-sm text-light-gray">{mood.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Current Mood Display */}
        <motion.div
          key={currentMood.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg p-8 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4 inline-block"
          >
            {currentMood.emoji}
          </motion.div>
          <h3 className="font-heading text-3xl text-foreground mb-2">{currentMood.name}</h3>
          <p className="font-paragraph text-light-gray">
            Your learning environment is now optimized for {currentMood.description.toLowerCase()}
          </p>
          <motion.div
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-4"
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
}
