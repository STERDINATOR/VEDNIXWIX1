/**
 * Companion Hub
 * Consolidated interface for Pet Companion and AI Mentor
 * Combines "My Companion" (pet) and "Akira Sensei" (mentor) into one unified concept
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image } from '@/components/ui/image';
import { usePetStore } from '@/stores/petStore';
import { X, Heart, MessageCircle, Zap, Gift, Settings, Sparkles } from 'lucide-react';

interface CompanionHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanionHub({ isOpen, onClose }: CompanionHubProps) {
  const { pet, stats, updateStats, addNotification } = usePetStore();
  const [activeTab, setActiveTab] = useState<'companion' | 'mentor'>('companion');

  if (!pet) return null;

  const feedPet = () => {
    updateStats({
      happiness: Math.min(100, stats.happiness + 15),
      energy: Math.min(100, stats.energy + 8)
    });
    addNotification({
      type: 'motivation',
      message: `${pet.name} is happy after eating! 😋`,
      icon: '😋'
    });
  };

  const playWithPet = () => {
    updateStats({
      happiness: Math.min(100, stats.happiness + 20),
      energy: Math.max(0, stats.energy - 15),
      intelligence: Math.min(100, stats.intelligence + 5)
    });
    addNotification({
      type: 'motivation',
      message: `${pet.name} had so much fun playing! 🎮`,
      icon: '🎮'
    });
  };

  const restPet = () => {
    updateStats({
      energy: Math.min(100, stats.energy + 30),
      happiness: Math.min(100, stats.happiness + 5)
    });
    addNotification({
      type: 'motivation',
      message: `${pet.name} is well-rested and ready to learn! 😴`,
      icon: '😴'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-dark-gray border-primary/20">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-heading text-primary">
            My Companion Hub
          </DialogTitle>
          <DialogClose className="text-light-gray hover:text-foreground" />
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background">
            <TabsTrigger value="companion" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              My Pet
            </TabsTrigger>
            <TabsTrigger value="mentor" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Mentor
            </TabsTrigger>
          </TabsList>

          {/* Pet Companion Tab */}
          <TabsContent value="companion" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Pet Display */}
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-secondary bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                  <span className="text-6xl">
                    {pet.type === 'cat' ? '🐱' : 
                     pet.type === 'dragon' ? '🐉' : 
                     pet.type === 'robot' ? '🤖' : 
                     pet.type === 'phoenix' ? '🔥' : 
                     pet.type === 'wolf' ? '🐺' : 
                     pet.type === 'fox' ? '🦊' : 
                     pet.type === 'bunny' ? '🐰' : 
                     pet.type === 'panda' ? '🐼' : '🐱'}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {pet.name}
                </h3>
                <Badge className="bg-secondary text-secondary-foreground">
                  Level {pet.level}
                </Badge>
              </div>

              {/* Pet Stats */}
              <Card className="bg-background p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-paragraph text-light-gray">Happiness</span>
                      <span className="text-sm font-heading text-secondary">{stats.happiness}%</span>
                    </div>
                    <Progress value={stats.happiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-paragraph text-light-gray">Energy</span>
                      <span className="text-sm font-heading text-primary">{stats.energy}%</span>
                    </div>
                    <Progress value={stats.energy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-paragraph text-light-gray">Intelligence</span>
                      <span className="text-sm font-heading text-neon-green">{stats.intelligence}%</span>
                    </div>
                    <Progress value={stats.intelligence} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-paragraph text-light-gray">Health</span>
                      <span className="text-sm font-heading text-cyber-yellow">{stats.health}%</span>
                    </div>
                    <Progress value={stats.health} className="h-2" />
                  </div>
                </div>
              </Card>

              {/* Pet Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={feedPet}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-col items-center gap-1 h-auto py-3"
                >
                  <span className="text-xl">🍖</span>
                  <span className="text-xs">Feed</span>
                </Button>
                <Button
                  onClick={playWithPet}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex flex-col items-center gap-1 h-auto py-3"
                >
                  <span className="text-xl">🎮</span>
                  <span className="text-xs">Play</span>
                </Button>
                <Button
                  onClick={restPet}
                  className="bg-neon-green text-dark-gray hover:bg-neon-green/90 flex flex-col items-center gap-1 h-auto py-3"
                >
                  <span className="text-xl">😴</span>
                  <span className="text-xs">Rest</span>
                </Button>
              </div>

              {/* Pet Info */}
              <div className="mt-6 p-4 bg-background rounded border border-secondary/20">
                <p className="text-sm font-paragraph text-light-gray">
                  {pet.name} is your loyal learning companion. Keep them happy and healthy by interacting with them regularly!
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* AI Mentor Tab */}
          <TabsContent value="mentor" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Mentor Display */}
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-primary bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-6xl">🧙‍♂️</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Akira Sensei
                </h3>
                <Badge className="bg-primary text-primary-foreground">
                  AI Learning Mentor
                </Badge>
              </div>

              {/* Mentor Features */}
              <Card className="bg-background p-6 mb-6">
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">Personalized Learning</h4>
                      <p className="text-sm font-paragraph text-light-gray">
                        Akira adapts teaching methods to your learning style and pace
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">Real-Time Guidance</h4>
                      <p className="text-sm font-paragraph text-light-gray">
                        Get instant answers and explanations for any concept you're struggling with
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">Adaptive Difficulty</h4>
                      <p className="text-sm font-paragraph text-light-gray">
                        Content difficulty adjusts based on your performance and emotional state
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-cyber-yellow mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">Motivation & Rewards</h4>
                      <p className="text-sm font-paragraph text-light-gray">
                        Earn XP, achievements, and special rewards for your learning progress
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mentor Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Guidance
                </Button>
              </div>

              {/* Mentor Info */}
              <div className="mt-6 p-4 bg-background rounded border border-primary/20">
                <p className="text-sm font-paragraph text-light-gray">
                  Akira Sensei is your AI learning mentor. They're here to help you master any subject and achieve your learning goals!
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
