import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CombatMove {
  id: string;
  name: string;
  emoji: string;
  damage: number;
  accuracy: number;
  cooldown: number;
  description: string;
}

interface Enemy {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  level: number;
  moves: CombatMove[];
}

const playerMoves: CombatMove[] = [
  {
    id: 'logic-strike',
    name: 'Logic Strike',
    emoji: '⚡',
    damage: 25,
    accuracy: 95,
    cooldown: 0,
    description: 'A precise strike using pure logic'
  },
  {
    id: 'knowledge-burst',
    name: 'Knowledge Burst',
    emoji: '💥',
    damage: 40,
    accuracy: 80,
    cooldown: 2,
    description: 'Unleash accumulated knowledge'
  },
  {
    id: 'shield-spell',
    name: 'Shield Spell',
    emoji: '🛡️',
    damage: 0,
    accuracy: 100,
    cooldown: 1,
    description: 'Reduce incoming damage'
  },
  {
    id: 'ultimate-wisdom',
    name: 'Ultimate Wisdom',
    emoji: '✨',
    damage: 60,
    accuracy: 70,
    cooldown: 3,
    description: 'Devastating attack with all knowledge'
  }
];

const enemies: Enemy[] = [
  {
    id: 'confusion-demon',
    name: 'Confusion Demon',
    emoji: '😵',
    hp: 80,
    maxHp: 80,
    level: 5,
    moves: [
      { id: 'confuse', name: 'Confuse', emoji: '🌀', damage: 15, accuracy: 85, cooldown: 0, description: 'Confuses the player' }
    ]
  },
  {
    id: 'procrastination-boss',
    name: 'Procrastination Boss',
    emoji: '😴',
    hp: 120,
    maxHp: 120,
    level: 8,
    moves: [
      { id: 'delay', name: 'Delay Attack', emoji: '⏰', damage: 20, accuracy: 90, cooldown: 1, description: 'Delays your actions' }
    ]
  },
  {
    id: 'doubt-shadow',
    name: 'Doubt Shadow',
    emoji: '👻',
    hp: 100,
    maxHp: 100,
    level: 7,
    moves: [
      { id: 'doubt', name: 'Doubt Strike', emoji: '❓', damage: 25, accuracy: 80, cooldown: 0, description: 'Shakes your confidence' }
    ]
  }
];

export function NeuralStoryCombat() {
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy>(enemies[0]);
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(selectedEnemy.hp);
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!']);
  const [inBattle, setInBattle] = useState(false);
  const [selectedMove, setSelectedMove] = useState<CombatMove | null>(null);
  const [battleResult, setBattleResult] = useState<'win' | 'loss' | null>(null);

  const handleSelectEnemy = (enemy: Enemy) => {
    setSelectedEnemy(enemy);
    setEnemyHp(enemy.hp);
    setPlayerHp(maxPlayerHp);
    setBattleLog(['Battle started!']);
    setInBattle(true);
    setBattleResult(null);
  };

  const handleAttack = (move: CombatMove) => {
    if (!inBattle || battleResult) return;

    setSelectedMove(move);
    const hitChance = Math.random() * 100;
    const hit = hitChance <= move.accuracy;
    const damage = hit ? move.damage : 0;

    const newEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newEnemyHp);

    const newLog = [
      ...battleLog,
      hit
        ? `You used ${move.name}! Dealt ${damage} damage!`
        : `${move.name} missed!`
    ];

    if (newEnemyHp <= 0) {
      newLog.push(`Victory! You defeated ${selectedEnemy.name}!`);
      setBattleResult('win');
      setBattleLog(newLog);
      return;
    }

    // Enemy counter attack
    const enemyMove = selectedEnemy.moves[0];
    const enemyHit = Math.random() * 100 <= enemyMove.accuracy;
    const enemyDamage = enemyHit ? enemyMove.damage : 0;
    const newPlayerHp = Math.max(0, playerHp - enemyDamage);

    newLog.push(
      enemyHit
        ? `${selectedEnemy.name} used ${enemyMove.name}! You took ${enemyDamage} damage!`
        : `${selectedEnemy.name}'s attack missed!`
    );

    setPlayerHp(newPlayerHp);

    if (newPlayerHp <= 0) {
      newLog.push(`Defeat! You were defeated by ${selectedEnemy.name}...`);
      setBattleResult('loss');
    }

    setBattleLog(newLog);
    setSelectedMove(null);
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
            NEURAL <span className="text-primary">STORY COMBAT</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Battle knowledge demons using your learned skills. Defeat enemies to unlock new abilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Battle Arena */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enemy Selection */}
            {!inBattle && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enemies.map((enemy) => (
                  <motion.button
                    key={enemy.id}
                    onClick={() => handleSelectEnemy(enemy)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-primary/30 rounded-lg p-6 text-center bg-background/40 hover:bg-background/60 transition-all"
                  >
                    <div className="text-6xl mb-3">{enemy.emoji}</div>
                    <h3 className="font-heading text-lg text-foreground mb-1">
                      {enemy.name}
                    </h3>
                    <p className="text-xs text-light-gray">Level {enemy.level}</p>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Battle Screen */}
            {inBattle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Battle Arena */}
                <Card className="bg-dark-gray border-2 border-primary p-8">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Player */}
                    <div className="text-center">
                      <motion.div
                        animate={playerHp <= 30 ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-4"
                      >
                        🧙‍♂️
                      </motion.div>
                      <h3 className="font-heading text-lg text-foreground mb-2">You</h3>
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-light-gray">HP</span>
                          <span className="text-sm font-heading text-primary">
                            {playerHp} / {maxPlayerHp}
                          </span>
                        </div>
                        <Progress value={(playerHp / maxPlayerHp) * 100} className="h-3" />
                      </div>
                    </div>

                    {/* Enemy */}
                    <div className="text-center">
                      <motion.div
                        animate={enemyHp <= 30 ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-4"
                      >
                        {selectedEnemy.emoji}
                      </motion.div>
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {selectedEnemy.name}
                      </h3>
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-light-gray">HP</span>
                          <span className="text-sm font-heading text-secondary">
                            {enemyHp} / {selectedEnemy.maxHp}
                          </span>
                        </div>
                        <Progress value={(enemyHp / selectedEnemy.maxHp) * 100} className="h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Battle Log */}
                  <div className="bg-background/60 rounded p-4 h-32 overflow-y-auto mb-4 border border-primary/20">
                    <div className="space-y-2">
                      {battleLog.slice(-5).map((log, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-paragraph text-sm text-light-gray"
                        >
                          {log}
                        </motion.p>
                      ))}
                    </div>
                  </div>

                  {/* Battle Result */}
                  <AnimatePresence>
                    {battleResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`text-center p-6 rounded-lg mb-4 border-2 ${
                          battleResult === 'win'
                            ? 'bg-neon-green/20 border-neon-green'
                            : 'bg-destructive/20 border-destructive'
                        }`}
                      >
                        <p className="font-heading text-2xl mb-2">
                          {battleResult === 'win' ? '🎉 VICTORY!' : '💔 DEFEAT'}
                        </p>
                        <p className="font-paragraph text-light-gray">
                          {battleResult === 'win'
                            ? `You defeated ${selectedEnemy.name} and gained 500 XP!`
                            : 'Try again to overcome this challenge!'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Move Selection */}
                {!battleResult && (
                  <div className="grid grid-cols-2 gap-3">
                    {playerMoves.map((move) => (
                      <motion.button
                        key={move.id}
                        onClick={() => handleAttack(move)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-primary/30 rounded-lg p-4 bg-background/40 hover:bg-background/60 transition-all text-center"
                      >
                        <div className="text-3xl mb-2">{move.emoji}</div>
                        <p className="font-heading text-sm text-foreground mb-1">
                          {move.name}
                        </p>
                        <p className="text-xs text-light-gray">
                          {move.damage > 0 ? `${move.damage} DMG` : 'Defend'}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Battle End */}
                {battleResult && (
                  <Button
                    onClick={() => setInBattle(false)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
                  >
                    Return to Selection
                  </Button>
                )}
              </motion.div>
            )}
          </div>

          {/* Combat Stats */}
          <div className="space-y-4">
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Combat Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Battles Won
                  </p>
                  <p className="font-heading text-2xl text-primary">12</p>
                </div>
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Win Rate
                  </p>
                  <p className="font-heading text-2xl text-secondary">85%</p>
                </div>
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-1">
                    Total Damage
                  </p>
                  <p className="font-heading text-2xl text-cyber-yellow">2,450</p>
                </div>
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Move Guide</h3>
              <div className="space-y-3 text-sm">
                {playerMoves.map((move) => (
                  <div key={move.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-heading text-foreground">
                      {move.emoji} {move.name}
                    </p>
                    <p className="text-xs text-light-gray">
                      {move.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
