import React from 'react';
import { useUserDataStore } from '@/stores/userDataStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const DashboardTestControls = () => {
  const { userData, addXP, completeReel, completeQuiz, completeQuest, recordBattleResult, updatePetStats, unlockAchievement } = useUserDataStore();

  if (!userData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <Card className="bg-background/50 border-primary/30 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">Test Controls</h2>
        <p className="text-light-gray text-sm mb-6">Use these buttons to test dashboard features and real-time updates</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* XP Buttons */}
          <Button
            onClick={() => addXP(50)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            +50 XP
          </Button>
          
          <Button
            onClick={() => addXP(100)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            +100 XP
          </Button>

          <Button
            onClick={() => addXP(500)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            +500 XP (Level Up!)
          </Button>

          {/* Completion Buttons */}
          <Button
            onClick={() => completeReel(`reel-${Date.now()}`)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Complete Reel
          </Button>

          <Button
            onClick={() => completeQuiz(`quiz-${Date.now()}`)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Complete Quiz
          </Button>

          <Button
            onClick={() => completeQuest(`quest-${Date.now()}`)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Complete Quest
          </Button>

          {/* Battle Buttons */}
          <Button
            onClick={() => recordBattleResult(true)}
            className="bg-cyber-yellow text-dark-gray hover:bg-cyber-yellow/90"
          >
            Win Battle
          </Button>

          <Button
            onClick={() => recordBattleResult(false)}
            className="bg-cyber-yellow text-dark-gray hover:bg-cyber-yellow/90"
          >
            Lose Battle
          </Button>

          {/* Pet Buttons */}
          <Button
            onClick={() => updatePetStats({ happiness: Math.min(100, userData.petStats.happiness + 20) })}
            className="bg-neon-green text-dark-gray hover:bg-neon-green/90"
          >
            Pet +Happiness
          </Button>

          <Button
            onClick={() => updatePetStats({ energy: Math.min(100, userData.petStats.energy + 20) })}
            className="bg-neon-green text-dark-gray hover:bg-neon-green/90"
          >
            Pet +Energy
          </Button>

          <Button
            onClick={() => updatePetStats({ hunger: Math.max(0, userData.petStats.hunger - 20) })}
            className="bg-neon-green text-dark-gray hover:bg-neon-green/90"
          >
            Pet -Hunger
          </Button>

          {/* Achievement Button */}
          <Button
            onClick={() => unlockAchievement(`achievement-${Date.now()}`)}
            className="border-2 border-primary text-primary hover:bg-primary/10"
          >
            Unlock Achievement
          </Button>
        </div>

        {/* Status Info */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded">
          <p className="text-xs text-light-gray">
            <span className="text-primary font-heading">Current Stats:</span> Level {userData.level} • {userData.totalXP} XP • {userData.dailyStreak} Streak • {userData.battleStats.wins}W/{userData.battleStats.losses}L
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
