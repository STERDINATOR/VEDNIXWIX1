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

  // Enhanced AI character generation with Gemini AI integration
  const generateCharacter = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    try {
      // Step 1: Analyze preferences
      setGenerationStep(0);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Generate character concept with AI
      setGenerationStep(1);
      const characterConcept = await generateCharacterWithAI();
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 3: Create personality and traits
      setGenerationStep(2);
      const personality = await generatePersonalityTraits(characterConcept);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Generate backstory
      setGenerationStep(3);
      const backstory = await generateDetailedBackstory(characterConcept, personality);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Finalize character
      setGenerationStep(4);
      const finalCharacter = await finalizeCharacterDetails(characterConcept, personality, backstory);
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentCharacter(finalCharacter);
      setIsGenerating(false);
      onCharacterGenerated?.(finalCharacter);
      
    } catch (error) {
      console.error('Character generation failed:', error);
      // Fallback to basic generation
      await generateBasicCharacter();
    }
  };

  // Simulate Gemini AI character generation
  const generateCharacterWithAI = async (): Promise<any> => {
    const subject = userPreferences?.subject || 'default';
    const style = selectedStyle;
    const prompt = customPrompt;
    
    // Simulate AI processing with Japanese anime character focus
    const japaneseNames = {
      male: ['Akira', 'Hiroshi', 'Kenji', 'Takeshi', 'Ryuu', 'Satoshi', 'Kaito', 'Yuki', 'Ren', 'Sora'],
      female: ['Yuki', 'Sakura', 'Rei', 'Akane', 'Misaki', 'Ayame', 'Kira', 'Luna', 'Nana', 'Miku'],
      surnames: ['Yamamoto', 'Tanaka', 'Watanabe', 'Sato', 'Suzuki', 'Takahashi', 'Nakamura', 'Ito', 'Kobayashi', 'Saito']
    };
    
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = getRandomElement(japaneseNames[gender]);
    const lastName = getRandomElement(japaneseNames.surnames);
    
    // Generate character based on Japanese anime aesthetics
    return {
      name: `${firstName} ${lastName}`,
      gender,
      style: style,
      subject: subject,
      customRequirements: prompt,
      japaneseAesthetic: true,
      image: generateCharacterImage(style, gender, subject)
    };
  };

  const generateCharacterImage = (style: string, gender: string, subject: string): string => {
    // Generate different character images based on style and preferences
    const imageVariants = {
      'modern-anime': [
        'https://static.wixstatic.com/media/c5b305_8fcc61039e1f47c0924465599bdd05f9~mv2.png?originWidth=384&originHeight=448',
        'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png?originWidth=192&originHeight=192',
        'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png?originWidth=192&originHeight=192'
      ],
      'cyberpunk-anime': [
        'https://static.wixstatic.com/media/c5b305_250ce96b9d044dd39f26c8889a4be084~mv2.png?originWidth=192&originHeight=192',
        'https://static.wixstatic.com/media/c5b305_5a947d28a52444b598e8040ddd72d2ea~mv2.png?originWidth=128&originHeight=128',
        'https://static.wixstatic.com/media/c5b305_07cbf53fdac9403280c3dd139e4cf584~mv2.png?originWidth=128&originHeight=128'
      ],
      'kawaii-anime': [
        'https://static.wixstatic.com/media/c5b305_26d41712ff724ce9896152371682ddf1~mv2.png?originWidth=192&originHeight=192',
        'https://static.wixstatic.com/media/c5b305_fd90950c93814acd814f3a7c5ab01769~mv2.png?originWidth=192&originHeight=192'
      ],
      'shounen-anime': [
        'https://static.wixstatic.com/media/c5b305_7f10be46f72c4d52988a64fe89ea9bbb~mv2.png?originWidth=192&originHeight=192',
        'https://static.wixstatic.com/media/c5b305_44824461597f42c9a5bbf4d6c15f39af~mv2.png?originWidth=192&originHeight=192'
      ],
      'mystical-anime': [
        'https://static.wixstatic.com/media/c5b305_ac8ba358564946fe938fd010cbc95f09~mv2.png?originWidth=192&originHeight=192',
        'https://static.wixstatic.com/media/c5b305_8fcc61039e1f47c0924465599bdd05f9~mv2.png?originWidth=384&originHeight=448'
      ]
    };
    
    const styleImages = imageVariants[style as keyof typeof imageVariants] || imageVariants['modern-anime'];
    return getRandomElement(styleImages);
  };

  const generatePersonalityTraits = async (concept: any): Promise<CharacterPersonality> => {
    const subject = concept.subject || 'default';
    const basePersonality = personalityTemplates[subject as keyof typeof personalityTemplates] || personalityTemplates.default;
    
    // Enhanced Japanese anime personality traits
    const japaneseTraits = {
      programming: {
        trait: 'Digital Samurai (デジタル侍)',
        description: 'A disciplined coder who approaches programming with the precision of a samurai. Believes in clean code and elegant solutions.',
        voiceType: 'confident and precise with Japanese honorifics',
        catchphrase: 'コードは心の鏡です (Code is the mirror of the soul!)'
      },
      mathematics: {
        trait: 'Number Sage (数の賢者)',
        description: 'A wise mathematician who sees beauty in equations and finds harmony in numerical patterns.',
        voiceType: 'calm and thoughtful with gentle wisdom',
        catchphrase: '数学は宇宙の言語です (Mathematics is the language of the universe!)'
      },
      physics: {
        trait: 'Quantum Sensei (量子先生)',
        description: 'An enthusiastic physicist who makes complex concepts accessible through creative explanations.',
        voiceType: 'energetic and wonder-filled',
        catchphrase: '物理学で世界を変えましょう (Let\'s change the world with physics!)'
      },
      default: {
        trait: 'Knowledge Guardian (知識の守護者)',
        description: 'A dedicated mentor who guides students with patience and wisdom, embodying the spirit of lifelong learning.',
        voiceType: 'warm and encouraging',
        catchphrase: '学ぶことは生きること (To learn is to live!)'
      }
    };
    
    return japaneseTraits[subject as keyof typeof japaneseTraits] || japaneseTraits.default;
  };

  const generateDetailedBackstory = async (concept: any, personality: CharacterPersonality): Promise<string> => {
    const subject = concept.subject || 'default';
    
    const japaneseBackstories = {
      programming: `Born in Neo-Tokyo's digital district, ${concept.name} discovered their gift for code at the prestigious Cyber Academy. After mastering ancient programming techniques passed down through generations of digital masters, they now dedicate their life to teaching others the way of the code. Their dojo is a place where tradition meets innovation.`,
      
      mathematics: `Raised in the mountain temples of Kyoto, ${concept.name} learned mathematics from the ancient scrolls of the Number Monks. They believe that mathematical harmony can bring peace to the world and now travel the digital realm, sharing the sacred knowledge of numbers with eager students.`,
      
      physics: `A former researcher at Tokyo University's Quantum Lab, ${concept.name} gained extraordinary abilities after an experiment with parallel dimensions. Now they use their unique perspective to help students understand the mysteries of the physical universe, bridging the gap between science and wonder.`,
      
      default: `${concept.name} is a guardian spirit awakened in the digital age, tasked with preserving and sharing knowledge across all disciplines. With memories spanning centuries of human learning, they guide students with ancient wisdom adapted for the modern world.`
    };
    
    return japaneseBackstories[subject as keyof typeof japaneseBackstories] || japaneseBackstories.default;
  };

  const finalizeCharacterDetails = async (concept: any, personality: CharacterPersonality, backstory: string): Promise<GeneratedCharacter> => {
    // Enhanced Japanese anime appearance options
    const japaneseAppearance = {
      hairColors: ['Raven Black (烏黒)', 'Sakura Pink (桜色)', 'Ocean Blue (海色)', 'Silver Moon (銀月)', 'Autumn Red (紅葉)', 'Forest Green (森緑)'],
      eyeColors: ['Amber Gold (琥珀)', 'Sapphire Blue (青玉)', 'Emerald Green (翠玉)', 'Ruby Red (紅玉)', 'Violet Storm (紫嵐)', 'Crystal Clear (水晶)'],
      outfits: ['Traditional Hakama', 'Modern School Uniform', 'Cyber Kimono', 'Battle Gi', 'Scholar Robes', 'Casual Streetwear'],
      accessories: ['Katana Stylus', 'Digital Scroll', 'Wisdom Beads', 'Tech Headband', 'Ancient Charm', 'Neural Interface']
    };
    
    const character: GeneratedCharacter = {
      id: Date.now().toString(),
      name: concept.name,
      image: concept.image,
      personality,
      appearance: {
        hairColor: getRandomElement(japaneseAppearance.hairColors),
        eyeColor: getRandomElement(japaneseAppearance.eyeColors),
        outfit: getRandomElement(japaneseAppearance.outfits),
        accessories: getRandomElements(japaneseAppearance.accessories, 2),
        bodyType: getRandomElement(['Slender', 'Athletic', 'Graceful', 'Sturdy']),
        height: getRandomElement(['Petite (小柄)', 'Average (普通)', 'Tall (高身長)', 'Elegant (優雅)'])
      },
      abilities: {
        specialMove: generateJapaneseSpecialMove(concept.subject),
        element: getRandomElement(['Lightning (雷)', 'Fire (火)', 'Water (水)', 'Earth (土)', 'Wind (風)', 'Light (光)', 'Shadow (影)', 'Void (虚)']),
        weapon: getRandomElement(['Wisdom Katana', 'Knowledge Staff', 'Truth Bow', 'Logic Shuriken', 'Harmony Fans']),
        stats: {
          intelligence: Math.floor(Math.random() * 25) + 75,
          creativity: Math.floor(Math.random() * 25) + 75,
          leadership: Math.floor(Math.random() * 30) + 65,
          empathy: Math.floor(Math.random() * 20) + 80
        }
      },
      backstory,
      voiceSettings: {
        pitch: Math.random() * 0.3 + 0.9, // 0.9 to 1.2 for Japanese voice
        speed: Math.random() * 0.2 + 0.95, // 0.95 to 1.15 for clear pronunciation
        tone: personality.voiceType
      }
    };

    return character;
  };

  const generateJapaneseSpecialMove = (subject: string): string => {
    const moves = {
      programming: ['Code Tsunami (コード津波)', 'Algorithm Strike (アルゴリズム斬)', 'Debug Lightning (デバッグ雷)', 'Syntax Storm (構文嵐)', 'Binary Blade (バイナリ刃)'],
      mathematics: ['Equation Burst (方程式爆発)', 'Calculus Wave (微積分波)', 'Geometry Shield (幾何学盾)', 'Number Spiral (数字螺旋)', 'Proof Thunder (証明雷)'],
      physics: ['Quantum Leap (量子跳躍)', 'Gravity Well (重力井戸)', 'Energy Burst (エネルギー爆発)', 'Particle Beam (粒子線)', 'Force Field (力場)'],
      default: ['Knowledge Blast (知識爆発)', 'Wisdom Wave (知恵波)', 'Truth Strike (真実撃)', 'Learning Light (学習光)', 'Insight Beam (洞察線)']
    };
    return getRandomElement(moves[subject as keyof typeof moves] || moves.default);
  };

  // Fallback basic generation
  const generateBasicCharacter = async () => {
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
        pitch: Math.random() * 0.4 + 0.8,
        speed: Math.random() * 0.3 + 0.9,
        tone: personality.voiceType
      }
    };

    setCurrentCharacter(character);
    setIsGenerating(false);
    onCharacterGenerated?.(character);
  };

  const generateRandomName = () => {
    // Enhanced Japanese name generation
    const japaneseNames = {
      male: {
        first: ['Akira (明)', 'Hiroshi (寛)', 'Kenji (健二)', 'Takeshi (武)', 'Ryuu (龍)', 'Satoshi (聡)', 'Kaito (海斗)', 'Yuki (雪)', 'Ren (廉)', 'Sora (空)'],
        last: ['Yamamoto (山本)', 'Tanaka (田中)', 'Watanabe (渡辺)', 'Sato (佐藤)', 'Suzuki (鈴木)', 'Takahashi (高橋)', 'Nakamura (中村)', 'Ito (伊藤)', 'Kobayashi (小林)', 'Saito (斎藤)']
      },
      female: {
        first: ['Yuki (雪)', 'Sakura (桜)', 'Rei (麗)', 'Akane (茜)', 'Misaki (美咲)', 'Ayame (菖蒲)', 'Kira (輝)', 'Luna (月)', 'Nana (奈々)', 'Miku (未来)'],
        last: ['Yamamoto (山本)', 'Tanaka (田中)', 'Watanabe (渡辺)', 'Sato (佐藤)', 'Suzuki (鈴木)', 'Takahashi (高橋)', 'Nakamura (中村)', 'Ito (伊藤)', 'Kobayashi (小林)', 'Saito (斎藤)']
      }
    };
    
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = getRandomElement(japaneseNames[gender].first);
    const lastName = getRandomElement(japaneseNames[gender].last);
    
    return `${firstName} ${lastName}`;
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
                  placeholder="Describe your ideal Japanese anime study companion... (e.g., 'A wise sensei with blue hair who specializes in mathematics, wears traditional robes, and has a calm personality like a temple monk')"
                  className="bg-background border-primary/20 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Subject Focus</label>
                  <select 
                    className="w-full p-2 bg-background border border-primary/20 rounded text-foreground"
                    onChange={(e) => {
                      if (userPreferences) {
                        userPreferences.subject = e.target.value;
                      }
                    }}
                  >
                    <option value="programming">Programming (プログラミング)</option>
                    <option value="mathematics">Mathematics (数学)</option>
                    <option value="physics">Physics (物理学)</option>
                    <option value="chemistry">Chemistry (化学)</option>
                    <option value="general">General Studies (一般教養)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Personality Type</label>
                  <select 
                    className="w-full p-2 bg-background border border-primary/20 rounded text-foreground"
                    onChange={(e) => {
                      if (userPreferences) {
                        userPreferences.personality = e.target.value;
                      }
                    }}
                  >
                    <option value="supportive">Supportive Sensei (支援的先生)</option>
                    <option value="challenging">Strict Master (厳格な師匠)</option>
                    <option value="friendly">Friendly Senpai (親しい先輩)</option>
                    <option value="professional">Formal Teacher (正式な教師)</option>
                    <option value="playful">Playful Kouhai (遊び心のある後輩)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-paragraph text-light-gray mb-2">Voice Type</label>
                  <select 
                    className="w-full p-2 bg-background border border-primary/20 rounded text-foreground"
                    onChange={(e) => {
                      if (userPreferences) {
                        userPreferences.learningStyle = e.target.value;
                      }
                    }}
                  >
                    <option value="gentle">Gentle & Calm (優しく穏やか)</option>
                    <option value="energetic">Energetic & Upbeat (元気で明るい)</option>
                    <option value="wise">Wise & Thoughtful (賢明で思慮深い)</option>
                    <option value="confident">Confident & Strong (自信に満ちた)</option>
                    <option value="cheerful">Cheerful & Bright (陽気で明るい)</option>
                  </select>
                </div>
              </div>
              
              {/* Japanese Character Traits */}
              <div className="mt-6">
                <h4 className="text-lg font-heading font-bold text-foreground mb-3">Japanese Character Traits</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { trait: 'Respectful (礼儀正しい)', value: 'respectful' },
                    { trait: 'Determined (決意)', value: 'determined' },
                    { trait: 'Humble (謙虚)', value: 'humble' },
                    { trait: 'Loyal (忠実)', value: 'loyal' },
                    { trait: 'Curious (好奇心)', value: 'curious' },
                    { trait: 'Patient (忍耐)', value: 'patient' },
                    { trait: 'Honorable (名誉)', value: 'honorable' },
                    { trait: 'Wise (賢明)', value: 'wise' }
                  ].map((trait) => (
                    <label key={trait.value} className="flex items-center gap-2 p-2 rounded border border-primary/20 hover:bg-primary/5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        defaultChecked={Math.random() > 0.5}
                      />
                      <span className="text-sm font-paragraph text-foreground">{trait.trait}</span>
                    </label>
                  ))}
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