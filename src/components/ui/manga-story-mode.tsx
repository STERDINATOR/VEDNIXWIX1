import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextSceneId: string;
}

interface MangaScene {
  id: string;
  title: string;
  panelEmoji: string;
  narrative: string;
  characterDialogue: string;
  character: string;
  characterEmoji: string;
  choices: Choice[];
  background: string;
}

const mangaStory: Record<string, MangaScene> = {
  scene1: {
    id: 'scene1',
    title: 'The Mysterious Academy',
    panelEmoji: '🏯',
    narrative: 'You stand before the gates of an ancient academy. The wind whispers secrets of knowledge yet untold.',
    characterDialogue: 'Welcome, student. Your journey begins now. But first, you must choose your path.',
    character: 'Gatekeeper',
    characterEmoji: '🧙‍♂️',
    background: 'A mystical academy gate with glowing runes',
    choices: [
      {
        id: 'choice1',
        text: 'Enter through the Logic Gate',
        consequence: 'You feel your mind sharpening with each step.',
        nextSceneId: 'scene2a'
      },
      {
        id: 'choice2',
        text: 'Enter through the Alchemy Gate',
        consequence: 'Mystical energies swirl around you.',
        nextSceneId: 'scene2b'
      },
      {
        id: 'choice3',
        text: 'Enter through the History Gate',
        consequence: 'Echoes of the past surround you.',
        nextSceneId: 'scene2c'
      }
    ]
  },
  scene2a: {
    id: 'scene2a',
    title: 'The Logic Chamber',
    panelEmoji: '🧠',
    narrative: 'You enter a chamber filled with floating equations and glowing symbols. A wise sage appears before you.',
    characterDialogue: 'Ah, a seeker of logic! To master this realm, you must solve the Paradox of Truth.',
    character: 'Logic Master',
    characterEmoji: '🧙',
    background: 'A chamber with floating equations and cosmic energy',
    choices: [
      {
        id: 'choice4',
        text: 'Face the paradox directly',
        consequence: 'Your mind expands with understanding!',
        nextSceneId: 'scene3'
      },
      {
        id: 'choice5',
        text: 'Ask for a hint',
        consequence: 'The master smiles and offers guidance.',
        nextSceneId: 'scene3'
      }
    ]
  },
  scene2b: {
    id: 'scene2b',
    title: 'The Alchemy Laboratory',
    panelEmoji: '⚗️',
    narrative: 'You step into a bubbling laboratory where elements dance in harmony. An alchemist greets you.',
    characterDialogue: 'Welcome to the art of transformation! Can you combine these elements correctly?',
    character: 'Alchemist',
    characterEmoji: '🧪',
    background: 'A mystical laboratory with bubbling potions',
    choices: [
      {
        id: 'choice6',
        text: 'Mix the elements boldly',
        consequence: 'A brilliant reaction occurs!',
        nextSceneId: 'scene3'
      },
      {
        id: 'choice7',
        text: 'Study the elements first',
        consequence: 'Knowledge flows into your mind.',
        nextSceneId: 'scene3'
      }
    ]
  },
  scene2c: {
    id: 'scene2c',
    title: 'The History Archive',
    panelEmoji: '📜',
    narrative: 'You find yourself in an endless library of scrolls. A historian materializes from the shadows.',
    characterDialogue: 'History repeats itself for those who understand. Can you see the patterns?',
    character: 'Historian',
    characterEmoji: '📚',
    background: 'An ancient library with floating scrolls',
    choices: [
      {
        id: 'choice8',
        text: 'Analyze the patterns',
        consequence: 'The past reveals its secrets!',
        nextSceneId: 'scene3'
      },
      {
        id: 'choice9',
        text: 'Learn from the mistakes',
        consequence: 'Wisdom fills your heart.',
        nextSceneId: 'scene3'
      }
    ]
  },
  scene3: {
    id: 'scene3',
    title: 'The Breakthrough',
    panelEmoji: '✨',
    narrative: 'Your choice has led you to a moment of clarity. The boundaries between disciplines blur, and you see the unity of all knowledge.',
    characterDialogue: 'You have taken the first step on your journey. The path ahead is long, but you are ready.',
    character: 'The Mentor',
    characterEmoji: '👑',
    background: 'A transcendent space where all knowledge converges',
    choices: [
      {
        id: 'choice10',
        text: 'Continue your journey',
        consequence: 'Your adventure has just begun!',
        nextSceneId: 'scene1'
      }
    ]
  }
};

export function MangaStoryMode() {
  const [currentSceneId, setCurrentSceneId] = useState('scene1');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  const currentScene = mangaStory[currentSceneId];

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice.id);
    setShowConsequence(true);
    setStoryProgress(prev => Math.min(prev + 20, 100));

    setTimeout(() => {
      setCurrentSceneId(choice.nextSceneId);
      setSelectedChoice(null);
      setShowConsequence(false);
    }, 2000);
  };

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
            MANGA <span className="text-primary">STORY MODE</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your choices shape the narrative. Every decision leads to a different path and unique learning experience.
          </p>
        </motion.div>

        {/* Story Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between mb-2">
            <span className="text-xs text-light-gray uppercase tracking-widest">Story Progress</span>
            <span className="text-xs font-heading text-primary">{storyProgress}%</span>
          </div>
          <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-primary/20">
            <motion.div
              initial={false}
              animate={{ width: `${storyProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-cyber-yellow"
            ></motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Manga Panel */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentSceneId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Main Panel */}
              <Card className="bg-dark-gray border-2 border-primary p-0 overflow-hidden">
                {/* Panel Header */}
                <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-background/60 p-6 border-b border-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl"
                    >
                      {currentScene.panelEmoji}
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-2xl text-foreground">
                        {currentScene.title}
                      </h3>
                      <p className="text-sm text-light-gray">Scene {Object.keys(mangaStory).indexOf(currentSceneId) + 1}</p>
                    </div>
                  </div>
                </div>

                {/* Narrative Box */}
                <div className="p-6 border-b border-primary/20">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-paragraph text-foreground text-lg leading-relaxed italic"
                  >
                    {currentScene.narrative}
                  </motion.p>
                </div>

                {/* Character Dialogue */}
                <div className="p-6 bg-background/40">
                  <div className="flex gap-4 items-start">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl flex-shrink-0"
                    >
                      {currentScene.characterEmoji}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                        {currentScene.character}
                      </p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-background/60 border-l-4 border-primary rounded p-4"
                      >
                        <p className="font-paragraph text-foreground">
                          "{currentScene.characterDialogue}"
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Choices */}
              <div className="space-y-3">
                <p className="text-xs text-light-gray uppercase tracking-widest">What do you do?</p>
                {currentScene.choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={selectedChoice !== null}
                    className={`w-full text-left transition-all ${
                      selectedChoice === choice.id
                        ? 'opacity-100'
                        : selectedChoice !== null
                        ? 'opacity-50'
                        : 'hover:opacity-100'
                    }`}
                  >
                    <Card className="border-2 border-primary/30 p-4 hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-foreground">
                          {choice.text}
                        </span>
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </div>
                    </Card>
                  </motion.button>
                ))}
              </div>

              {/* Consequence Display */}
              <AnimatePresence>
                {showConsequence && selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-r from-cyber-yellow/20 via-primary/20 to-secondary/20 backdrop-blur-md border-2 border-cyber-yellow rounded-lg p-6 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                      className="text-5xl mb-4"
                    >
                      ✨
                    </motion.div>
                    <p className="font-heading text-xl text-cyber-yellow mb-2">
                      Choice Made!
                    </p>
                    <p className="font-paragraph text-light-gray">
                      {currentScene.choices.find(c => c.id === selectedChoice)?.consequence}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Story Info Sidebar */}
          <div className="space-y-4">
            {/* Current Scene Info */}
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Scene Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Background
                  </p>
                  <p className="font-paragraph text-foreground text-sm">
                    {currentScene.background}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Character
                  </p>
                  <p className="font-paragraph text-foreground text-sm">
                    {currentScene.character}
                  </p>
                </div>
              </div>
            </Card>

            {/* Story Stats */}
            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Story Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Choices Made
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < Math.floor(storyProgress / 20)
                            ? 'bg-primary'
                            : 'bg-background/40'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Current Path
                  </p>
                  <Badge variant="outline" className="border-primary text-primary">
                    {currentScene.title}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Story Guide */}
            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Story Guide</h3>
              <p className="font-paragraph text-light-gray text-sm mb-4">
                Your choices matter. Each decision leads to a unique learning path and different story outcomes.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                View All Paths
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
