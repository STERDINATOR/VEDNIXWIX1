import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { 
  Sparkles, 
  Palette, 
  User, 
  MessageCircle, 
  Mic, 
  Video,
  Save,
  RotateCcw,
  Download,
  Share2,
  Settings,
  Zap,
  Star,
  Heart,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeCharacterStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  tags: string[];
}

interface CharacterPersonality {
  trait: string;
  description: string;
  voiceType: string;
  catchphrase: string;
}

interface GeneratedCharacter {
  id: string;
  name: string;
  image: string;
  personality: CharacterPersonality;
  appearance: {
    hairColor: string;
    eyeColor: string;
    outfit: string;
    accessories: string[];
    bodyType: string;
    height: string;
  };
  abilities: {
    specialMove: string;
    element: string;
    weapon: string;
    stats: {
      intelligence: number;
      creativity: number;
      leadership: number;
      empathy: number;
    };
  };
  backstory: string;
  voiceSettings: {
    pitch: number;
    speed: number;
    tone: string;
  };
}

interface AnimeCharacterGeneratorProps {
  onCharacterGenerated?: (character: GeneratedCharacter) => void;
  userPreferences?: {
    subject?: string;
    learningStyle?: string;
    personality?: string;
  };
}

export function AnimeCharacterGenerator({ 
  onCharacterGenerated, 
  userPreferences 
}: AnimeCharacterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<GeneratedCharacter | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern-anime');
  const [generationStep, setGenerationStep] = useState(0);

  // Predefined anime styles
  const animeStyles: AnimeCharacterStyle[] = [
    {
      id: 'modern-anime',
      name: 'Modern Anime',
      description: 'Contemporary anime style with vibrant colors and detailed features',
      preview: 'https://static.wixstatic.com/media/c5b305_fd90950c93814acd814f3a7c5ab01769~mv2.png?originWidth=192&originHeight=192',
      tags: ['colorful', 'detailed', 'contemporary']
    },
    {
      id: 'cyberpunk-anime',
      name: 'Cyberpunk Anime',
      description: 'Futuristic cyberpunk aesthetic with neon colors and tech elements',
      preview: 'https://static.wixstatic.com/media/c5b305_44824461597f42c9a5bbf4d6c15f39af~mv2.png?originWidth=192&originHeight=192',
      tags: ['futuristic', 'neon', 'tech', 'edgy']
    },
    {
      id: 'kawaii-anime',
      name: 'Kawaii Style',
      description: 'Cute and adorable anime style with soft features and pastel colors',
      preview: 'https://static.wixstatic.com/media/c5b305_26d41712ff724ce9896152371682ddf1~mv2.png?originWidth=192&originHeight=192',
      tags: ['cute', 'soft', 'pastel', 'friendly']
    },
    {
      id: 'shounen-anime',
      name: 'Shounen Hero',
      description: 'Dynamic action-oriented style with bold features and determined expressions',
      preview: 'https://static.wixstatic.com/media/c5b305_7f10be46f72c4d52988a64fe89ea9bbb~mv2.png?originWidth=192&originHeight=192',
      tags: ['dynamic', 'bold', 'heroic', 'energetic']
    },
    {
      id: 'mystical-anime',
      name: 'Mystical Sage',
      description: 'Wise and mystical appearance with ethereal elements and ancient wisdom',
      preview: 'https://static.wixstatic.com/media/c5b305_ac8ba358564946fe938fd010cbc95f09~mv2.png?originWidth=192&originHeight=192',
      tags: ['wise', 'mystical', 'ethereal', 'ancient']
    }
  ];

  // Personality templates based on learning subjects
  const personalityTemplates = {
    programming: {
      trait: 'Logical Innovator',
      description: 'Analytical and creative, loves solving complex problems with elegant solutions',
      voiceType: 'confident and precise',
      catchphrase: 'Every bug is just a puzzle waiting to be solved!'
    },
    mathematics: {
      trait: 'Pattern Seeker',
      description: 'Methodical and insightful, finds beauty in mathematical relationships',
      voiceType: 'calm and thoughtful',
      catchphrase: 'Numbers never lie, they just reveal hidden truths!'
    },
    physics: {
      trait: 'Reality Bender',
      description: 'Curious and experimental, fascinated by the fundamental laws of the universe',
      voiceType: 'enthusiastic and wonder-filled',
      catchphrase: 'The universe is the ultimate laboratory!'
    },
    default: {
      trait: 'Knowledge Guardian',
      description: 'Wise and supportive, dedicated to helping others learn and grow',
      voiceType: 'warm and encouraging',
      catchphrase: 'Every question is a step toward wisdom!'
    }
  };

  // Simulate AI character generation (in real app, this would call Gemini AI)
  const generateCharacter = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate generation steps
    const steps = [
      'Analyzing your preferences...',
      'Designing character appearance...',
      'Crafting personality traits...',
      'Generating backstory...',
      'Finalizing character details...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate character based on preferences and style
    const subject = userPreferences?.subject || 'default';
    const personality = personalityTemplates[subject as keyof typeof personalityTemplates] || personalityTemplates.default;
    
    const character: GeneratedCharacter = {
      id: Date.now().toString(),
      name: generateRandomName(),
      image: 'https://static.wixstatic.com/media/c5b305_8fcc61039e1f47c0924465599bdd05f9~mv2.png?originWidth=384&originHeight=448',
      personality,
      appearance: {
        hairColor: getRandomElement(['Silver', 'Crimson', 'Azure', 'Golden', 'Violet', 'Emerald']),
        eyeColor: getRandomElement(['Sapphire', 'Amber', 'Jade', 'Ruby', 'Amethyst', 'Crystal']),
        outfit: getRandomElement(['Cyber Uniform', 'Scholar Robes', 'Battle Gear', 'Casual Modern', 'Mystical Attire']),
        accessories: getRandomElements(['Neural Interface', 'Ancient Tome', 'Energy Gauntlets', 'Wisdom Pendant', 'Tech Visor'], 2),
        bodyType: getRandomElement(['Athletic', 'Slender', 'Robust', 'Graceful']),
        height: getRandomElement(['Petite', 'Average', 'Tall', 'Imposing'])
      },
      abilities: {
        specialMove: generateSpecialMove(subject),
        element: getRandomElement(['Lightning', 'Fire', 'Water', 'Earth', 'Wind', 'Light', 'Shadow', 'Cyber']),
        weapon: getRandomElement(['Knowledge Blade', 'Logic Staff', 'Wisdom Orb', 'Code Gauntlets', 'Truth Bow']),
        stats: {
          intelligence: Math.floor(Math.random() * 30) + 70,
          creativity: Math.floor(Math.random() * 30) + 70,
          leadership: Math.floor(Math.random() * 30) + 60,
          empathy: Math.floor(Math.random() * 30) + 80
        }
      },
      backstory: generateBackstory(subject),
      voiceSettings: {
        pitch: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
        speed: Math.random() * 0.3 + 0.9, // 0.9 to 1.2
        tone: personality.voiceType
      }
    };

    setCurrentCharacter(character);
    setIsGenerating(false);
    onCharacterGenerated?.(character);
  };

  const generateRandomName = () => {
    const firstNames = ['Akira', 'Yuki', 'Rei', 'Kaito', 'Sora', 'Luna', 'Zen', 'Nova', 'Kira', 'Sage'];
    const lastNames = ['Shadowblade', 'Stormcaster', 'Mindweaver', 'Codebreaker', 'Starseeker', 'Voidwalker', 'Lightbringer', 'Dreamforge'];
    return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
  };

  const generateSpecialMove = (subject: string) => {
    const moves = {
      programming: ['Code Tsunami', 'Algorithm Strike', 'Debug Beam', 'Syntax Storm', 'Logic Bomb'],
      mathematics: ['Equation Blast', 'Calculus Wave', 'Geometry Shield', 'Number Spiral', 'Proof Lightning'],
      physics: ['Quantum Leap', 'Gravity Well', 'Energy Burst', 'Particle Beam', 'Force Field'],
      default: ['Knowledge Blast', 'Wisdom Wave', 'Truth Strike', 'Learning Light', 'Insight Beam']
    };
    return getRandomElement(moves[subject as keyof typeof moves] || moves.default);
  };

  const generateBackstory = (subject: string) => {
    const stories = {
      programming: 'Born in the digital realm, this character mastered the ancient art of code manipulation from a young age. They believe that every algorithm holds the key to solving real-world problems.',
      mathematics: 'Raised in the mystical Academy of Numbers, they discovered that mathematics is the universal language that connects all realities. Their mission is to help others see the beauty in equations.',
      physics: 'A former researcher who gained the ability to manipulate fundamental forces after a laboratory accident. Now they use their powers to teach others about the wonders of the physical universe.',
      default: 'A guardian of knowledge from an ancient civilization, awakened in the modern era to guide new generations of learners. They possess wisdom accumulated over millennia.'
    };
    return stories[subject as keyof typeof stories] || stories.default;
  };

  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const getRandomElements = <T,>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const regenerateCharacter = () => {
    setCurrentCharacter(null);
    generateCharacter();
  };

  const saveCharacter = () => {
    if (currentCharacter) {
      // In real app, this would save to user's collection
      console.log('Saving character:', currentCharacter);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-primary mb-2">
          AI Anime Character Generator
        </h2>
        <p className="font-paragraph text-light-gray">
          Create your perfect study companion with advanced AI technology
        </p>
      </div>

      {!currentCharacter ? (
        <div className="space-y-8">
          {/* Style Selection */}
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Choose Art Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {animeStyles.map((style) => (
                <motion.div
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg border-2 transition-all ${
                    selectedStyle === style.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-primary/20 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg">
                    <Image
                      src={style.preview}
                      alt={style.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-heading font-bold text-foreground text-sm mb-1">
                      {style.name}
                    </h4>
                    <p className="text-xs font-paragraph text-light-gray mb-2">
                      {style.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {style.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Custom Prompt */}
          <Card className="bg-dark-gray border-primary/20 p-6">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Custom Requirements</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-paragraph text-light-gray mb-2">
                  Character Description (Optional)
                </label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your ideal study companion... (e.g., 'A wise mentor with blue hair who specializes in mathematics and has a calm personality')"
                  className="bg-background border-primary/20 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Subject Focus</label>
                  <select className="w-full p-2 bg-background border border-primary/20 rounded text-foreground">
                    <option value="programming">Programming</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="general">General Studies</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Personality Type</label>
                  <select className="w-full p-2 bg-background border border-primary/20 rounded text-foreground">
                    <option value="supportive">Supportive & Encouraging</option>
                    <option value="challenging">Challenging & Motivating</option>
                    <option value="friendly">Friendly & Casual</option>
                    <option value="professional">Professional & Formal</option>
                    <option value="playful">Playful & Fun</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Voice Type</label>
                  <select className="w-full p-2 bg-background border border-primary/20 rounded text-foreground">
                    <option value="gentle">Gentle & Calm</option>
                    <option value="energetic">Energetic & Upbeat</option>
                    <option value="wise">Wise & Thoughtful</option>
                    <option value="confident">Confident & Strong</option>
                    <option value="cheerful">Cheerful & Bright</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={generateCharacter}
              disabled={isGenerating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Character
                </>
              )}
            </Button>
          </div>

          {/* Generation Progress */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="bg-dark-gray border-primary/20 p-6">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-foreground">
                      Creating Your Character
                    </h3>
                    <p className="font-paragraph text-primary">
                      {['Analyzing your preferences...', 'Designing character appearance...', 'Crafting personality traits...', 'Generating backstory...', 'Finalizing character details...'][generationStep]}
                    </p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((generationStep + 1) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Character Display */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="bg-dark-gray border-primary/20 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Character Image */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={currentCharacter.image}
                    alt={currentCharacter.name}
                    width={400}
                    height={500}
                    className="w-80 h-96 object-cover rounded-lg border-4 border-primary"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h3 className="text-2xl font-heading font-bold text-primary">
                    {currentCharacter.name}
                  </h3>
                  <p className="font-paragraph text-light-gray italic">
                    "{currentCharacter.personality.catchphrase}"
                  </p>
                </div>
              </div>

              {/* Character Details */}
              <div className="space-y-6">
                <Tabs defaultValue="personality" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personality">Personality</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                    <TabsTrigger value="backstory">Story</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personality" className="space-y-4">
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Personality Trait</h4>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {currentCharacter.personality.trait}
                      </Badge>
                      <p className="font-paragraph text-light-gray mt-2">
                        {currentCharacter.personality.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Voice Type</h4>
                      <p className="font-paragraph text-light-gray">
                        {currentCharacter.personality.voiceType}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Hair</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.appearance.hairColor}</p>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Eyes</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.appearance.eyeColor}</p>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Outfit</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.appearance.outfit}</p>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Build</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.appearance.bodyType}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Accessories</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentCharacter.appearance.accessories.map((accessory, index) => (
                          <Badge key={index} variant="outline" className="border-primary text-primary">
                            {accessory}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="abilities" className="space-y-4">
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Special Move</h4>
                      <Badge className="bg-neon-green text-black">
                        <Zap className="h-3 w-3 mr-1" />
                        {currentCharacter.abilities.specialMove}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Element</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.abilities.element}</p>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Weapon</h4>
                        <p className="font-paragraph text-light-gray">{currentCharacter.abilities.weapon}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Stats</h4>
                      <div className="space-y-2">
                        {Object.entries(currentCharacter.abilities.stats).map(([stat, value]) => (
                          <div key={stat} className="flex items-center gap-3">
                            <span className="w-20 text-sm font-paragraph text-light-gray capitalize">
                              {stat}
                            </span>
                            <div className="flex-1 bg-background rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-sm font-heading text-primary">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="backstory">
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-2">Origin Story</h4>
                      <p className="font-paragraph text-light-gray leading-relaxed">
                        {currentCharacter.backstory}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={regenerateCharacter} variant="outline" className="border-primary text-primary">
              <RotateCcw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
            <Button onClick={saveCharacter} className="bg-neon-green text-black hover:bg-neon-green/90">
              <Save className="h-4 w-4 mr-2" />
              Save Character
            </Button>
            <Button variant="outline" className="border-secondary text-secondary">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}