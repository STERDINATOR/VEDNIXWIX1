import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashbackScene {
  id: string;
  title: string;
  character: string;
  characterEmoji: string;
  scene: string;
  dialogue: string[];
  background: string;
  emotion: string;
  unlocked: boolean;
}

const flashbackScenes: FlashbackScene[] = [
  {
    id: 'scene1',
    title: 'The Mentor\'s Past',
    character: 'Master Logic',
    characterEmoji: '🧙‍♂️',
    scene: 'A wise mentor reveals their journey to mastery',
    dialogue: [
      'Long ago, I was just like you...',
      'Struggling with the fundamentals of logic.',
      'But I never gave up. I pushed forward.',
      'And now, I stand here to guide you.'
    ],
    background: 'A mystical temple with ancient scrolls',
    emotion: 'Inspirational',
    unlocked: true
  },
  {
    id: 'scene2',
    title: 'The First Defeat',
    character: 'Rival Sage',
    characterEmoji: '⚔️',
    scene: 'A rival shares their greatest failure and recovery',
    dialogue: [
      'I once thought I was invincible...',
      'Until I faced the Logic Guardian.',
      'I was crushed. Humiliated.',
      'But that defeat taught me everything.'
    ],
    background: 'A dark battlefield with storm clouds',
    emotion: 'Dramatic',
    unlocked: true
  },
  {
    id: 'scene3',
    title: 'The Hidden Truth',
    character: 'Ancient Sage',
    characterEmoji: '👴',
    scene: 'An ancient sage reveals a secret about learning',
    dialogue: [
      'Knowledge is not just about facts...',
      'It is about understanding the connections.',
      'Between all things in the universe.',
      'This is the true path to mastery.'
    ],
    background: 'A cosmic library with floating books',
    emotion: 'Mysterious',
    unlocked: false
  },
  {
    id: 'scene4',
    title: 'The Breakthrough',
    character: 'Fellow Student',
    characterEmoji: '🎓',
    scene: 'A fellow student shares their breakthrough moment',
    dialogue: [
      'I finally understood the pattern!',
      'Everything clicked into place.',
      'Years of struggle suddenly made sense.',
      'You will experience this too, I promise.'
    ],
    background: 'A bright classroom with golden light',
    emotion: 'Hopeful',
    unlocked: true
  }
];

export function CharacterFlashbackScenes() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedData = flashbackScenes.find(s => s.id === selectedScene);

  const handleSceneSelect = (sceneId: string) => {
    const scene = flashbackScenes.find(s => s.id === sceneId);
    if (scene?.unlocked) {
      setSelectedScene(sceneId);
      setCurrentDialogueIndex(0);
      setIsPlaying(true);
    }
  };

  const handleNextDialogue = () => {
    if (selectedData && currentDialogueIndex < selectedData.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(prev => prev - 1);
    }
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
            CHARACTER <span className="text-primary">FLASHBACK SCENES</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Discover the stories of characters in visual novel style. Unlock new scenes as you progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scene Selection */}
          <div className="lg:col-span-2 space-y-4">
            {flashbackScenes.map((scene, index) => {
              const isSelected = selectedScene === scene.id;

              return (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleSceneSelect(scene.id)}
                  className={`cursor-pointer transition-all ${!scene.unlocked ? 'opacity-60' : ''}`}
                >
                  <Card
                    className={`border-2 p-6 transition-all ${
                      isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                    }`}
                    style={{
                      borderColor: isSelected ? '#00FFFF' : '#333333'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Character Avatar */}
                      <motion.div
                        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-5xl flex-shrink-0"
                      >
                        {scene.characterEmoji}
                      </motion.div>

                      {/* Scene Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl text-foreground">
                            {scene.title}
                          </h3>
                          {!scene.unlocked && (
                            <Badge className="bg-destructive/20 text-destructive border-destructive border">
                              🔒 Locked
                            </Badge>
                          )}
                        </div>
                        <p className="font-paragraph text-light-gray text-sm mb-3">
                          {scene.character} - {scene.scene}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="border-primary text-primary"
                          >
                            {scene.emotion}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-secondary text-secondary"
                          >
                            {scene.dialogue.length} Dialogue Lines
                          </Badge>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ▶️
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Scene Viewer */}
          <div>
            <AnimatePresence mode="wait">
              {selectedData && isPlaying ? (
                <motion.div
                  key={selectedData.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Visual Novel Frame */}
                  <Card className="bg-dark-gray border-2 border-primary p-0 overflow-hidden">
                    {/* Background */}
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-background/60 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-8xl"
                      >
                        {selectedData.characterEmoji}
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-transparent to-transparent"></div>
                    </div>

                    {/* Dialogue Box */}
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                          {selectedData.character}
                        </p>
                        <h3 className="font-heading text-xl text-foreground mb-4">
                          {selectedData.title}
                        </h3>
                      </div>

                      {/* Current Dialogue */}
                      <motion.div
                        key={currentDialogueIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-background/60 border border-primary/30 rounded-lg p-4 mb-4 min-h-24 flex items-center"
                      >
                        <p className="font-paragraph text-foreground text-sm leading-relaxed">
                          "{selectedData.dialogue[currentDialogueIndex]}"
                        </p>
                      </motion.div>

                      {/* Dialogue Progress */}
                      <div className="flex items-center gap-2 mb-4">
                        {selectedData.dialogue.map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`h-2 flex-1 rounded-full ${
                              index <= currentDialogueIndex
                                ? 'bg-primary'
                                : 'bg-background/40'
                            }`}
                          ></motion.div>
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex gap-2">
                        <Button
                          onClick={handlePrevDialogue}
                          disabled={currentDialogueIndex === 0}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-primary text-primary disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={handleNextDialogue}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {currentDialogueIndex === selectedData.dialogue.length - 1
                            ? 'Finish'
                            : 'Next'}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Scene Info */}
                  <Card className="bg-background/40 border border-primary/20 p-4">
                    <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                      Scene Background
                    </p>
                    <p className="font-paragraph text-foreground text-sm">
                      {selectedData.background}
                    </p>
                  </Card>
                </motion.div>
              ) : selectedData ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <Card className="bg-dark-gray border-2 border-primary p-6">
                    <div className="text-center mb-6">
                      <div className="text-7xl mb-4">{selectedData.characterEmoji}</div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        {selectedData.title}
                      </h3>
                      <p className="text-sm text-light-gray mb-4">
                        {selectedData.character}
                      </p>
                    </div>

                    <div className="bg-background/40 rounded p-4 mb-4">
                      <p className="font-paragraph text-foreground text-sm">
                        {selectedData.scene}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Badge
                        variant="outline"
                        className="border-primary text-primary justify-center"
                      >
                        {selectedData.emotion}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-secondary text-secondary justify-center"
                      >
                        {selectedData.dialogue.length} Lines
                      </Badge>
                    </div>

                    <Button
                      onClick={() => setIsPlaying(true)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
                    >
                      Watch Scene
                    </Button>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-background/40 border border-primary/20 rounded-lg p-6 text-center h-full flex items-center justify-center"
                >
                  <p className="font-paragraph text-light-gray">
                    Select a scene to watch
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
