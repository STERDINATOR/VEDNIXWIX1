import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Gene {
  id: string;
  name: string;
  emoji: string;
  level: number;
  maxLevel: number;
  color: string;
  description: string;
  connections: string[];
}

const genes: Gene[] = [
  {
    id: 'logic',
    name: 'Logic Gene',
    emoji: '🧬',
    level: 8,
    maxLevel: 10,
    color: '#00FFFF',
    description: 'Core reasoning and problem-solving abilities',
    connections: ['math', 'programming']
  },
  {
    id: 'math',
    name: 'Math Gene',
    emoji: '🔢',
    level: 7,
    maxLevel: 10,
    color: '#FFFF00',
    description: 'Numerical and computational mastery',
    connections: ['logic', 'physics']
  },
  {
    id: 'programming',
    name: 'Programming Gene',
    emoji: '💻',
    level: 9,
    maxLevel: 10,
    color: '#00FF00',
    description: 'Code writing and algorithm design',
    connections: ['logic', 'physics']
  },
  {
    id: 'physics',
    name: 'Physics Gene',
    emoji: '⚛️',
    level: 6,
    maxLevel: 10,
    color: '#FF00FF',
    description: 'Understanding of natural laws',
    connections: ['math', 'programming']
  },
  {
    id: 'creativity',
    name: 'Creativity Gene',
    emoji: '🎨',
    level: 7,
    maxLevel: 10,
    color: '#FF6B00',
    description: 'Innovative thinking and design',
    connections: ['programming', 'communication']
  },
  {
    id: 'communication',
    name: 'Communication Gene',
    emoji: '💬',
    level: 8,
    maxLevel: 10,
    color: '#FF00FF',
    description: 'Expression and collaboration skills',
    connections: ['creativity', 'logic']
  }
];

export function KnowledgeGenomeMapping() {
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const [hoveredGene, setHoveredGene] = useState<string | null>(null);

  const selectedData = genes.find(g => g.id === selectedGene);

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
            KNOWLEDGE <span className="text-primary">GENOME MAPPING</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Your learning DNA visualized. Each gene represents a core skill, connected through your knowledge network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DNA Helix Visualization */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-md border-2 border-primary/30 rounded-lg p-8 aspect-video"
            >
              {/* DNA Helix Background */}
              <motion.svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <path id="helix" d="M 50 0 Q 70 25 50 50 Q 30 75 50 100" fill="none" stroke="currentColor" strokeWidth="2" />
                </defs>
                <use href="#helix" />
                <use href="#helix" transform="translate(0, 0) scaleX(-1)" />
              </motion.svg>

              {/* Gene Nodes */}
              <div className="relative h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  {/* Connection Lines */}
                  {genes.map((gene, index) => {
                    const angle = (index / genes.length) * Math.PI * 2;
                    const x = 50 + 35 * Math.cos(angle);
                    const y = 50 + 35 * Math.sin(angle);

                    return gene.connections.map((connectedId) => {
                      const connectedGene = genes.find(g => g.id === connectedId);
                      if (!connectedGene) return null;
                      const connectedIndex = genes.indexOf(connectedGene);
                      const connectedAngle = (connectedIndex / genes.length) * Math.PI * 2;
                      const connectedX = 50 + 35 * Math.cos(connectedAngle);
                      const connectedY = 50 + 35 * Math.sin(connectedAngle);

                      return (
                        <line
                          key={`${gene.id}-${connectedId}`}
                          x1={`${x}%`}
                          y1={`${y}%`}
                          x2={`${connectedX}%`}
                          y2={`${connectedY}%`}
                          stroke={gene.color}
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      );
                    });
                  })}
                </svg>

                {/* Gene Circles */}
                {genes.map((gene, index) => {
                  const angle = (index / genes.length) * Math.PI * 2;
                  const x = 50 + 35 * Math.cos(angle);
                  const y = 50 + 35 * Math.sin(angle);
                  const isSelected = selectedGene === gene.id;
                  const isHovered = hoveredGene === gene.id;

                  return (
                    <motion.button
                      key={gene.id}
                      onMouseEnter={() => setHoveredGene(gene.id)}
                      onMouseLeave={() => setHoveredGene(null)}
                      onClick={() => setSelectedGene(gene.id)}
                      className="absolute group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }}
                    >
                      <motion.div
                        animate={
                          isSelected || isHovered
                            ? { scale: 1.4, rotate: 360 }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        {/* Outer Ring */}
                        <div
                          className="absolute inset-0 rounded-full border-2 opacity-50"
                          style={{
                            borderColor: gene.color,
                            width: '100px',
                            height: '100px',
                            left: '-50px',
                            top: '-50px'
                          }}
                        ></div>

                        {/* Main Circle */}
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2 transition-all cursor-pointer"
                          style={{
                            borderColor: gene.color,
                            backgroundColor: `${gene.color}20`,
                            boxShadow: `0 0 20px ${gene.color}40`
                          }}
                        >
                          {gene.emoji}
                        </div>

                        {/* Level Badge */}
                        <div
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading border-2"
                          style={{
                            borderColor: gene.color,
                            backgroundColor: 'background',
                            color: gene.color
                          }}
                        >
                          {gene.level}
                        </div>
                      </motion.div>
                    </motion.button>
                  );
                })}

                {/* Center Core */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-3xl"
                  style={{ backgroundColor: '#00FFFF20' }}
                >
                  🧬
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Gene Details */}
          <div>
            <AnimatePresence mode="wait">
              {selectedData ? (
                <motion.div
                  key={selectedData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="bg-dark-gray border-2 p-6" style={{ borderColor: selectedData.color }}>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-3">{selectedData.emoji}</div>
                      <h3 className="font-heading text-2xl text-foreground mb-2">
                        {selectedData.name}
                      </h3>
                      <p className="font-paragraph text-light-gray text-sm">
                        {selectedData.description}
                      </p>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-light-gray uppercase tracking-widest">
                          Gene Level
                        </span>
                        <span className="text-sm font-heading" style={{ color: selectedData.color }}>
                          {selectedData.level} / {selectedData.maxLevel}
                        </span>
                      </div>
                      <div className="h-3 bg-background/50 rounded-full overflow-hidden border border-primary/20">
                        <motion.div
                          initial={false}
                          animate={{
                            width: `${(selectedData.level / selectedData.maxLevel) * 100}%`
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: selectedData.color }}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Connected Genes */}
                    <div>
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                        Connected Genes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedData.connections.map((connId) => {
                          const connGene = genes.find(g => g.id === connId);
                          return connGene ? (
                            <Badge
                              key={connId}
                              style={{
                                backgroundColor: `${connGene.color}20`,
                                color: connGene.color,
                                borderColor: connGene.color
                              }}
                              className="border"
                            >
                              {connGene.emoji} {connGene.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 font-heading uppercase"
                      style={{
                        backgroundColor: selectedData.color,
                        color: '#000000'
                      }}
                    >
                      Upgrade Gene
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
                    Click on a gene to view details
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
