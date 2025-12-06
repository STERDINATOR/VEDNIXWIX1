import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PET_PRESETS, PetPreset } from '@/lib/pet-presets';
import { Sparkles, Heart, Zap, Shield } from 'lucide-react';

interface PetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPet: (pet: PetPreset) => void;
  selectedPetId?: string;
}

export function PetSelectorModal({
  isOpen,
  onClose,
  onSelectPet,
  selectedPetId
}: PetSelectorModalProps) {
  const [hoveredPetId, setHoveredPetId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-heading font-bold text-foreground text-2xl">Choose Your Pet Companion</h2>
                  <p className="text-sm font-paragraph text-light-gray">Select a pet to accompany you on your learning journey</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-light-gray hover:text-foreground"
              >
                ✕
              </Button>
            </div>

            {/* Pet Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PET_PRESETS.map((pet) => (
                  <motion.div
                    key={pet.id}
                    whileHover={{ y: -8 }}
                    onHoverStart={() => setHoveredPetId(pet.id)}
                    onHoverEnd={() => setHoveredPetId(null)}
                  >
                    <Card
                      className={`cursor-pointer overflow-hidden transition-all duration-300 border-2 ${
                        selectedPetId === pet.id
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/50'
                          : 'border-primary/20 hover:border-primary/50'
                      }`}
                      onClick={() => onSelectPet(pet)}
                    >
                      {/* Pet Display Area */}
                      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-cyber-yellow/10"></div>
                        
                        {/* Pet Emoji */}
                        <motion.div
                          animate={hoveredPetId === pet.id ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative z-10 text-7xl filter drop-shadow-lg"
                        >
                          {pet.emoji}
                        </motion.div>

                        {/* Selection Indicator */}
                        {selectedPetId === pet.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                          >
                            ✓
                          </motion.div>
                        )}

                        {/* Floating particles on hover */}
                        {hoveredPetId === pet.id && (
                          <>
                            <motion.div
                              animate={{ y: -20, opacity: 0 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute top-1/2 left-1/4 w-2 h-2 bg-cyber-yellow rounded-full"
                            />
                            <motion.div
                              animate={{ y: -20, opacity: 0 }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full"
                            />
                          </>
                        )}
                      </div>

                      {/* Pet Info */}
                      <div className="p-4 space-y-3">
                        {/* Name and Type */}
                        <div>
                          <h3 className="font-heading font-bold text-foreground text-lg">{pet.name}</h3>
                          <p className="text-sm font-paragraph text-light-gray capitalize">{pet.type}</p>
                        </div>

                        {/* Description */}
                        <p className="text-xs font-paragraph text-light-gray line-clamp-2">
                          {pet.description}
                        </p>

                        {/* Personality Badge */}
                        <Badge className="bg-primary/20 text-primary border border-primary/30 capitalize">
                          {pet.personality}
                        </Badge>

                        {/* Stats Preview */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/10">
                          <div className="text-center">
                            <Heart className="h-4 w-4 text-secondary mx-auto mb-1" />
                            <p className="text-xs text-light-gray font-heading">Loyal</p>
                          </div>
                          <div className="text-center">
                            <Zap className="h-4 w-4 text-cyber-yellow mx-auto mb-1" />
                            <p className="text-xs text-light-gray font-heading">Energetic</p>
                          </div>
                          <div className="text-center">
                            <Shield className="h-4 w-4 text-neon-green mx-auto mb-1" />
                            <p className="text-xs text-light-gray font-heading">Protective</p>
                          </div>
                        </div>

                        {/* Special Abilities */}
                        <div className="pt-2 border-t border-primary/10">
                          <p className="text-xs font-heading text-primary mb-2">Special Abilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {pet.specialAbilities.slice(0, 2).map((ability, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-neon-green/30 text-neon-green bg-neon-green/5"
                              >
                                ⚡ {ability}
                              </Badge>
                            ))}
                            {pet.specialAbilities.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-neon-green/30 text-neon-green bg-neon-green/5"
                              >
                                +{pet.specialAbilities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Select Button */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => onSelectPet(pet)}
                            className={`w-full transition-all duration-300 ${
                              selectedPetId === pet.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                            }`}
                          >
                            {selectedPetId === pet.id ? '✓ Selected' : 'Select Pet'}
                          </Button>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-primary/20 bg-dark-gray/50">
              <p className="text-sm font-paragraph text-light-gray">
                💡 Tip: You can customize your pet further after selection!
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-light-gray text-light-gray hover:bg-light-gray/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
