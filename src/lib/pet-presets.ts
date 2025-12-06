/**
 * Pet Preset Definitions
 * Predefined pet templates for easy selection
 */

export interface PetPreset {
  id: string;
  type: 'cat' | 'dragon' | 'robot' | 'phoenix' | 'wolf' | 'fox' | 'bunny' | 'panda';
  name: string;
  emoji: string;
  description: string;
  personality: 'playful' | 'wise' | 'energetic' | 'calm' | 'mischievous' | 'loyal' | 'mysterious';
  color: string;
  secondaryColor: string;
  specialAbilities: string[];
  backstory: string;
  favoriteActivity: string;
  appearance: {
    eyes: 'normal' | 'sparkly' | 'sleepy' | 'determined' | 'mischievous' | 'wise';
    expression: 'happy' | 'content' | 'excited' | 'focused' | 'sleepy' | 'curious';
    pattern: 'solid' | 'stripes' | 'spots' | 'gradient' | 'cyber' | 'holographic';
    size: 'small' | 'medium' | 'large';
  };
}

export const PET_PRESETS: PetPreset[] = [
  {
    id: 'cyber-cat',
    type: 'cat',
    name: 'Neko-chan',
    emoji: '🐱',
    description: 'Agile and curious digital feline companion',
    personality: 'playful',
    color: '#FF6B9D',
    secondaryColor: '#FFB6C1',
    specialAbilities: ['Digital Healing', 'Study Boost', 'Focus Beam'],
    backstory: 'A cybernetic cat born in the digital realm to help students achieve their learning goals. Neko-chan loves playing with data streams and making learning fun!',
    favoriteActivity: 'Playing with holographic butterflies while you study',
    appearance: {
      eyes: 'sparkly',
      expression: 'happy',
      pattern: 'cyber',
      size: 'medium'
    }
  },
  {
    id: 'data-dragon',
    type: 'dragon',
    name: 'Ryu-kun',
    emoji: '🐉',
    description: 'Wise and powerful knowledge guardian dragon',
    personality: 'wise',
    color: '#9370DB',
    secondaryColor: '#DDA0DD',
    specialAbilities: ['Quantum Leap', 'Knowledge Surge', 'Wisdom Shield'],
    backstory: 'An ancient dragon who has guarded knowledge for centuries. Ryu-kun brings wisdom and deep insights to your learning journey, guiding you through complex concepts.',
    favoriteActivity: 'Meditating under digital cherry blossoms',
    appearance: {
      eyes: 'wise',
      expression: 'focused',
      pattern: 'gradient',
      size: 'large'
    }
  },
  {
    id: 'study-bot',
    type: 'robot',
    name: 'Cyber-san',
    emoji: '🤖',
    description: 'Efficient and logical learning assistant robot',
    personality: 'energetic',
    color: '#00FFFF',
    secondaryColor: '#E0FFFF',
    specialAbilities: ['Circuit Surge', 'Data Shield', 'Logic Boost'],
    backstory: 'A state-of-the-art AI robot designed to optimize your learning efficiency. Cyber-san processes information at lightning speed and provides logical solutions to problems.',
    favoriteActivity: 'Racing through cyber circuits',
    appearance: {
      eyes: 'determined',
      expression: 'excited',
      pattern: 'cyber',
      size: 'medium'
    }
  },
  {
    id: 'code-phoenix',
    type: 'phoenix',
    name: 'Phoenix-sama',
    emoji: '🔥',
    description: 'Resilient and inspiring flame spirit phoenix',
    personality: 'energetic',
    color: '#FF4500',
    secondaryColor: '#FFE4B5',
    specialAbilities: ['Phoenix Fire', 'Rebirth Protocol', 'Motivation Surge'],
    backstory: 'A legendary phoenix that rises from the ashes of failure. Phoenix-sama inspires you to never give up and always bounce back stronger from setbacks.',
    favoriteActivity: 'Dancing with data streams',
    appearance: {
      eyes: 'determined',
      expression: 'excited',
      pattern: 'gradient',
      size: 'large'
    }
  },
  {
    id: 'wisdom-wolf',
    type: 'wolf',
    name: 'Luna-chan',
    emoji: '🐺',
    description: 'Loyal and determined pack leader wolf',
    personality: 'loyal',
    color: '#696969',
    secondaryColor: '#A9A9A9',
    specialAbilities: ['Shadow Step', 'Pack Bond', 'Night Vision'],
    backstory: 'A noble wolf who leads with loyalty and determination. Luna-chan is your steadfast companion who never leaves your side, always ready to support your learning journey.',
    favoriteActivity: 'Exploring quantum dimensions',
    appearance: {
      eyes: 'determined',
      expression: 'focused',
      pattern: 'stripes',
      size: 'large'
    }
  },
  {
    id: 'cyber-fox',
    type: 'fox',
    name: 'Kitsune-kun',
    emoji: '🦊',
    description: 'Clever and mischievous trickster fox',
    personality: 'mischievous',
    color: '#FF8C00',
    secondaryColor: '#FFD700',
    specialAbilities: ['Illusion Weave', 'Trick Learning', 'Quick Wit'],
    backstory: 'A clever fox with nine tails, each representing a different learning technique. Kitsune-kun makes learning exciting with creative tricks and unexpected insights.',
    favoriteActivity: 'Creating pixel art masterpieces',
    appearance: {
      eyes: 'mischievous',
      expression: 'curious',
      pattern: 'stripes',
      size: 'medium'
    }
  },
  {
    id: 'quantum-bunny',
    type: 'bunny',
    name: 'Mochi-chan',
    emoji: '🐰',
    description: 'Quick and energetic speed demon bunny',
    personality: 'energetic',
    color: '#FFB6C1',
    secondaryColor: '#FFC0CB',
    specialAbilities: ['Speed Burst', 'Luck Charm', 'Energy Restore'],
    backstory: 'A quantum bunny that moves at incredible speeds. Mochi-chan brings boundless energy and enthusiasm to your studies, making every session feel like an adventure.',
    favoriteActivity: 'Collecting virtual stardust',
    appearance: {
      eyes: 'sparkly',
      expression: 'excited',
      pattern: 'spots',
      size: 'small'
    }
  },
  {
    id: 'zen-panda',
    type: 'panda',
    name: 'Panda-san',
    emoji: '🐼',
    description: 'Calm and balanced meditation master panda',
    personality: 'calm',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    specialAbilities: ['Zen Focus', 'Bamboo Strength', 'Peace Aura'],
    backstory: 'A serene panda master who teaches the way of balance and mindfulness. Panda-san helps you maintain calm focus during intense study sessions and brings inner peace.',
    favoriteActivity: 'Solving algorithmic puzzles',
    appearance: {
      eyes: 'sleepy',
      expression: 'content',
      pattern: 'solid',
      size: 'medium'
    }
  }
];

export function getPetPresetById(id: string): PetPreset | undefined {
  return PET_PRESETS.find(pet => pet.id === id);
}

export function getPetPresetByType(type: string): PetPreset | undefined {
  return PET_PRESETS.find(pet => pet.type === type);
}

export function getRandomPetPreset(): PetPreset {
  return PET_PRESETS[Math.floor(Math.random() * PET_PRESETS.length)];
}
