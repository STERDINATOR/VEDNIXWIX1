import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';
import { geminiAI, type PetResponse } from '@/lib/gemini-ai';
import { 
  Heart, 
  Droplets, 
  Coffee, 
  Moon, 
  HelpCircle, 
  Settings, 
  Palette,
  Save,
  RotateCcw,
  MessageCircle,
  Bell,
  Clock,
  Zap,
  Star,
  Gift,
  Sparkles,
  Brain,
  Shuffle,
  Wand2,
  Crown,
  Shield,
  Flame,
  Snowflake,
  Zap as Lightning,
  Eye,
  Smile,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PetStats {
  happiness: number;
  energy: number;
  health: number;
  intelligence: number;
}

interface PetPersonality {
  name: string;
  type: 'cat' | 'dragon' | 'robot' | 'phoenix' | 'wolf' | 'fox' | 'bunny' | 'panda';
  color: string;
  secondaryColor: string;
  accessories: string[];
  personality: 'playful' | 'wise' | 'energetic' | 'calm' | 'mischievous' | 'loyal' | 'mysterious';
  level: number;
  xp: number;
  xpToNext: number;
  appearance: {
    eyes: 'normal' | 'sparkly' | 'sleepy' | 'determined' | 'mischievous' | 'wise';
    expression: 'happy' | 'content' | 'excited' | 'focused' | 'sleepy' | 'curious';
    pattern: 'solid' | 'stripes' | 'spots' | 'gradient' | 'cyber' | 'holographic';
    size: 'small' | 'medium' | 'large';
  };
  specialAbilities: string[];
  backstory: string;
  favoriteActivity: string;
  image?: string; // AI-generated anime pet image
}

interface PetReminder {
  id: string;
  type: 'water' | 'break' | 'exercise' | 'study' | 'sleep';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface AnimePetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PetCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetPersonality;
  onSave: (pet: PetPersonality) => void;
}

export function AnimePet({ isOpen, onClose }: AnimePetProps) {
  const [pet, setPet] = useState<PetPersonality>({
    name: 'Neko-chan',
    type: 'cat',
    color: '#FF6B9D',
    secondaryColor: '#FFB6C1',
    accessories: ['Cyber Collar', 'Holographic Wings'],
    personality: 'playful',
    level: 15,
    xp: 2450,
    xpToNext: 3000,
    appearance: {
      eyes: 'sparkly',
      expression: 'happy',
      pattern: 'cyber',
      size: 'medium'
    },
    specialAbilities: ['Digital Healing', 'Study Boost'],
    backstory: 'A cybernetic companion created to help students achieve their learning goals.',
    favoriteActivity: 'Playing with holographic butterflies while you study',
    image: 'https://static.wixstatic.com/media/c5b305_64b1f78e7d084df480fb0b1f510cd2f2~mv2.png?originWidth=384&originHeight=384'
  });

  const [showCustomization, setShowCustomization] = useState(false);

  const [stats, setStats] = useState<PetStats>({
    happiness: 85,
    energy: 70,
    health: 90,
    intelligence: 65
  });

  const [reminders, setReminders] = useState<PetReminder[]>([
    {
      id: '1',
      type: 'water',
      message: "Hey! You've been studying for 2 hours. Time to hydrate! 💧",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false
    },
    {
      id: '2',
      type: 'break',
      message: "Your eyes need a break! Look away from the screen for 20 seconds. 👀",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, sender: 'user' | 'pet', message: string, timestamp: Date}>>([
    {
      id: '1',
      sender: 'pet',
      message: `Hi! I'm ${pet.name}, your study companion! I'm here to help you stay healthy and motivated while learning. Ask me anything! 🐱`,
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [petInteractionCount, setPetInteractionCount] = useState(0);

  const handleCustomizePet = (newPet: PetPersonality) => {
    setPet(newPet);
    setShowCustomization(false);
    // Save to localStorage
    localStorage.setItem('userPet', JSON.stringify(newPet));
  };

  // Load pet from localStorage on mount
  useEffect(() => {
    const savedPet = localStorage.getItem('userPet');
    if (savedPet) {
      try {
        setPet(JSON.parse(savedPet));
      } catch (error) {
        console.error('Error loading pet data:', error);
      }
    }
  }, []);

  // Pet animations and behaviors
  const [petAnimation, setPetAnimation] = useState<'idle' | 'happy' | 'sleeping' | 'alert' | 'excited'>('idle');

  useEffect(() => {
    // Simulate pet behavior changes
    const interval = setInterval(() => {
      const animations = ['idle', 'happy', 'alert'] as const;
      setPetAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {
        console.log('Notification permission denied');
      });
    }
  }, []);

  useEffect(() => {
    // Auto-generate reminders based on study patterns
    const reminderInterval = setInterval(() => {
      const now = new Date();
      const reminderTypes = [
        { type: 'water', message: "Time for a water break! Stay hydrated! 💧" },
        { type: 'break', message: "You've been focused for a while. Take a 5-minute break! 🧘‍♀️" },
        { type: 'exercise', message: "How about some quick stretches? Your body will thank you! 🤸‍♀️" },
        { type: 'study', message: "Ready to tackle that next lesson? You're doing great! 📚" }
      ];

      const randomReminder = reminderTypes[Math.floor(Math.random() * reminderTypes.length)];
      const newReminder: PetReminder = {
        id: Date.now().toString(),
        type: randomReminder.type as any,
        message: randomReminder.message,
        timestamp: now,
        isRead: false
      };

      setReminders(prev => [newReminder, ...prev.slice(0, 9)]); // Keep only 10 most recent
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`${pet.name} says:`, {
            body: randomReminder.message,
            icon: '🐱'
          });
        } catch (error) {
          console.log('Notification failed');
        }
      }
    }, 15 * 60 * 1000); // Every 15 minutes

    return () => clearInterval(reminderInterval);
  }, [pet.name]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: message.trim(),
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Simulate pet typing
    setIsTyping(true);
    setPetAnimation('alert');

    // Generate enhanced AI pet response
    setTimeout(async () => {
      setIsTyping(false);
      setPetAnimation('happy');
      
      let response = '';
      
      // Check if Gemini AI is available
      const aiServiceStatus = geminiAI.getServiceStatus();
      
      if (aiServiceStatus.available) {
        try {
          // Enhanced context for AI pet response
          const enhancedContext = {
            studyTime: Math.floor(Date.now() / 60000) % 120, // Mock study time
            lastBreak: Math.floor(Math.random() * 60),
            mood: 'curious',
            timeOfDay: new Date().toLocaleTimeString(),
            userActivity: 'studying',
            petStats: stats,
            environmentalFactors: {
              weather: 'clear',
              season: 'spring',
              userStressLevel: stats.happiness > 80 ? 'low' : stats.happiness > 50 ? 'medium' : 'high' as 'low' | 'medium' | 'high'
            }
          };
          
          const aiResponse = await geminiAI.generatePetResponse(
            message,
            {
              name: pet.name,
              type: pet.type,
              personality: pet.personality,
              level: pet.level,
              mood: petAnimation
            },
            enhancedContext
          );
          
          response = aiResponse.message;
          
          // Update pet stats based on AI response mood
          if (aiResponse.mood === 'excited' || aiResponse.mood === 'playful') {
            setStats(prev => ({
              ...prev,
              happiness: Math.min(100, prev.happiness + 3),
              energy: Math.min(100, prev.energy + 2)
            }));
          } else if (aiResponse.mood === 'caring') {
            setStats(prev => ({
              ...prev,
              health: Math.min(100, prev.health + 2),
              intelligence: Math.min(100, prev.intelligence + 1)
            }));
          }
          
        } catch (error) {
          console.error('Error generating AI pet response:', error);
          // Fall back to default responses
          response = getDefaultPetResponse(message);
        }
      } else {
        // Use default responses when AI is not available
        response = getDefaultPetResponse(message);
      }

      const petMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pet' as const,
        message: response,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, petMessage]);
      
      // Update pet stats based on interaction
      setStats(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 2),
        intelligence: Math.min(100, prev.intelligence + 1)
      }));
    }, 1500);
  };

  // Helper function for default pet responses
  const getDefaultPetResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    const specificResponses: Record<string, string> = {
      'water': "*gentle purr* You should drink water every 30-60 minutes while studying! It helps your brain function better! 💧",
      'break': "*stretches paws* Take a 5-10 minute break every hour. Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds! 👀",
      'tired': "*concerned meow* Feeling tired? Try some light stretching or a quick walk. Fresh air works wonders! 🚶‍♀️",
      'stuck': "*encouraging chirp* When you're stuck, try explaining the problem out loud to me! Sometimes talking through it helps! 🗣️",
      'motivation': "*proud purr* Remember why you started! Every small step forward is progress. You're doing amazing! 🌟",
      'help': "*happy wiggle* I'm here to remind you to stay healthy, take breaks, and keep motivated! What specific help do you need? 🤗"
    };

    // Check for specific keywords
    for (const [keyword, specificResponse] of Object.entries(specificResponses)) {
      if (lowerMessage.includes(keyword)) {
        return specificResponse;
      }
    }

    // Default responses based on pet stats and mood
    const responses = [
      "*purrs contentedly* You're doing such a great job! I'm so proud of your dedication.",
      "*bounces with excitement* Learning together is the best! You make studying fun!",
      "*nuzzles gently* I can feel your determination. You're going to achieve amazing things!",
      "*stretches and yawns* Remember to take care of yourself while you learn. Health is important too!",
      "*playful chirp* Your brain is getting stronger every day! Keep up the fantastic work!",
      "*gentle head tilt* I believe in you completely. You have everything it takes to succeed!"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const feedPet = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.min(100, prev.energy + 5)
    }));
    setPetAnimation('excited');
    setTimeout(() => setPetAnimation('happy'), 2000);
  };

  const playWithPet = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10)
    }));
    setPetAnimation('excited');
    setTimeout(() => setPetAnimation('happy'), 3000);
  };

  const markReminderAsRead = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, isRead: true } : reminder
    ));
  };

  const getPetEmoji = () => {
    const emojis = {
      cat: '🐱',
      dragon: '🐉',
      robot: '🤖',
      phoenix: '🔥',
      wolf: '🐺',
      fox: '🦊',
      bunny: '🐰',
      panda: '🐼'
    };
    return emojis[pet.type];
  };

  const getAnimationClass = () => {
    switch (petAnimation) {
      case 'happy': return 'animate-bounce';
      case 'excited': return 'animate-pulse';
      case 'alert': return 'animate-ping';
      case 'sleeping': return 'opacity-70';
      default: return '';
    }
  };

  const getPetDisplay = () => {
    if (pet.image) {
      return (
        <div className={`relative ${getAnimationClass()}`}>
          <Image
            src={pet.image}
            alt={`${pet.name} - ${pet.type} companion`}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-lg border-2 border-primary/30"
          />
          {petAnimation === 'excited' && (
            <div className="absolute inset-0 rounded-lg border-2 border-primary animate-ping" />
          )}
        </div>
      );
    } else {
      return (
        <div className={`text-8xl ${getAnimationClass()}`}>
          {getPetEmoji()}
        </div>
      );
    }
  };

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
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${getAnimationClass()}`}>
                  {getPetEmoji()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">{pet.name}</h3>
                  <p className="text-sm font-paragraph text-light-gray">
                    Level {pet.level} • {pet.personality} {pet.type}
                  </p>
                </div>
                <Badge className="bg-primary/20 text-primary">
                  {pet.xp}/{pet.xpToNext} XP
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCustomization(true)}
                  className="text-light-gray hover:text-foreground"
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                  ✕
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Pet Interaction Area */}
              <div className="flex-1 p-6">
                <Tabs defaultValue="interact" className="h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="interact">Interact</TabsTrigger>
                    <TabsTrigger value="reminders">
                      Reminders
                      {reminders.filter(r => !r.isRead).length > 0 && (
                        <Badge className="ml-2 bg-secondary text-secondary-foreground text-xs">
                          {reminders.filter(r => !r.isRead).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="interact" className="flex-1 flex flex-col">
                    {/* Pet Display */}
                    <div className="text-center mb-6">
                      <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 flex items-center justify-center">
                        {getPetDisplay()}
                      </div>
                      
                      {/* Pet Info */}
                      <div className="mb-4">
                        <h4 className="font-heading font-bold text-foreground text-lg mb-2">{pet.name}</h4>
                        <p className="text-sm font-paragraph text-light-gray mb-2">{pet.backstory}</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary">
                            {pet.appearance.pattern} pattern
                          </Badge>
                          <Badge className="bg-secondary/20 text-secondary">
                            {pet.appearance.eyes} eyes
                          </Badge>
                        </div>
                        <p className="text-xs font-paragraph text-light-gray italic">
                          "Favorite activity: {pet.favoriteActivity}"
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-3">
                        <Button onClick={feedPet} className="bg-secondary text-secondary-foreground">
                          <Gift className="h-4 w-4 mr-2" />
                          Feed
                        </Button>
                        <Button onClick={playWithPet} className="bg-neon-green text-black">
                          <Heart className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                        <Button 
                          onClick={() => setShowCustomization(true)}
                          className="bg-cyber-yellow text-black"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-background rounded-lg border border-primary/20 max-h-[50vh]">
                      <div className="p-3 border-b border-primary/20">
                        <h4 className="font-heading font-bold text-foreground">Chat with {pet.name}</h4>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[35vh]">
                        {chatHistory.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.sender === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-dark-gray text-foreground'
                              }`}
                            >
                              <p className="font-paragraph text-sm">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {msg.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-dark-gray text-foreground p-3 rounded-lg">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-t border-primary/20">
                        <div className="flex gap-2">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Ask me anything about studying or health..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSendMessage(currentMessage);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleSendMessage(currentMessage)}
                            className="bg-primary text-primary-foreground"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reminders" className="space-y-4">
                    <div className="space-y-3">
                      {reminders.map((reminder) => (
                        <Card
                          key={reminder.id}
                          className={`p-4 ${
                            reminder.isRead ? 'opacity-60' : 'border-primary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {reminder.type === 'water' && <Droplets className="h-4 w-4 text-blue-400" />}
                                {reminder.type === 'break' && <Coffee className="h-4 w-4 text-neon-green" />}
                                {reminder.type === 'exercise' && <Zap className="h-4 w-4 text-cyber-yellow" />}
                                {reminder.type === 'study' && <Star className="h-4 w-4 text-primary" />}
                                {reminder.type === 'sleep' && <Moon className="h-4 w-4 text-secondary" />}
                                <Badge variant="outline" className="text-xs">
                                  {reminder.type}
                                </Badge>
                              </div>
                              <p className="font-paragraph text-foreground">{reminder.message}</p>
                              <p className="text-xs text-light-gray mt-1">
                                {reminder.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {!reminder.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markReminderAsRead(reminder.id)}
                                className="ml-3"
                              >
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-6">
                    {/* Pet Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(stats).map(([stat, value]) => (
                        <Card key={stat} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-paragraph text-foreground capitalize">{stat}</span>
                            <span className="font-heading font-bold text-primary">{value}%</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </Card>
                      ))}
                    </div>

                    {/* Level Progress */}
                    <Card className="p-4">
                      <h4 className="font-heading font-bold text-foreground mb-3">Level Progress</h4>
                      <div className="flex justify-between text-sm font-paragraph text-light-gray mb-2">
                        <span>Level {pet.level}</span>
                        <span>{pet.xp}/{pet.xpToNext} XP</span>
                      </div>
                      <Progress value={(pet.xp / pet.xpToNext) * 100} className="h-3" />
                      <p className="text-xs text-light-gray mt-2">
                        {pet.xpToNext - pet.xp} XP until next level
                      </p>
                    </Card>

                    {/* Pet Info */}
                    <Card className="p-4">
                      <h4 className="font-heading font-bold text-foreground mb-3">Pet Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-light-gray">Type:</span>
                          <span className="text-foreground capitalize">{pet.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-gray">Personality:</span>
                          <span className="text-foreground capitalize">{pet.personality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-gray">Accessories:</span>
                          <span className="text-foreground">{pet.accessories.join(', ')}</span>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Pet Customization Modal */}
      {showCustomization && (
        <PetCustomization
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          pet={pet}
          onSave={handleCustomizePet}
        />
      )}
    </AnimatePresence>
  );
}

// Pet Customization Component
interface PetCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetPersonality;
  onSave: (pet: PetPersonality) => void;
}

export function PetCustomization({ isOpen, onClose, pet, onSave }: PetCustomizationProps) {
  const [editedPet, setEditedPet] = useState<PetPersonality>(pet);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleSave = () => {
    onSave(editedPet);
    onClose();
  };

  const generateRandomPet = () => {
    const petTypes = ['cat', 'dragon', 'robot', 'phoenix', 'wolf', 'fox', 'bunny', 'panda'] as const;
    const personalities = ['playful', 'wise', 'energetic', 'calm', 'mischievous', 'loyal', 'mysterious'] as const;
    const eyes = ['normal', 'sparkly', 'sleepy', 'determined', 'mischievous', 'wise'] as const;
    const expressions = ['happy', 'content', 'excited', 'focused', 'sleepy', 'curious'] as const;
    const patterns = ['solid', 'stripes', 'spots', 'gradient', 'cyber', 'holographic'] as const;
    const sizes = ['small', 'medium', 'large'] as const;
    
    const colors = ['#FF6B9D', '#00FFFF', '#FFFF00', '#FF00FF', '#00FF00', '#FF4500', '#9370DB', '#FF69B4'];
    const secondaryColors = ['#FFB6C1', '#E0FFFF', '#FFFFE0', '#FFE4E1', '#F0FFF0', '#FFE4B5', '#DDA0DD', '#FFEFD5'];
    
    const names = ['Neko-chan', 'Ryu-kun', 'Cyber-san', 'Phoenix-sama', 'Luna-chan', 'Kitsune-kun', 'Mochi-chan', 'Panda-san'];
    const activities = [
      'Playing with holographic butterflies',
      'Meditating under digital cherry blossoms',
      'Racing through cyber circuits',
      'Dancing with data streams',
      'Collecting virtual stardust',
      'Exploring quantum dimensions',
      'Creating pixel art masterpieces',
      'Solving algorithmic puzzles'
    ];
    
    const abilities = [
      ['Digital Healing', 'Study Boost'],
      ['Quantum Leap', 'Time Dilation'],
      ['Circuit Surge', 'Data Shield'],
      ['Phoenix Fire', 'Rebirth Protocol'],
      ['Shadow Step', 'Night Vision'],
      ['Illusion Weave', 'Spirit Bond'],
      ['Luck Charm', 'Speed Burst'],
      ['Zen Focus', 'Bamboo Strength']
    ];

    const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSecondaryColor = secondaryColors[Math.floor(Math.random() * secondaryColors.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const randomAbilities = abilities[Math.floor(Math.random() * abilities.length)];

    setEditedPet({
      ...editedPet,
      name: randomName,
      type: randomType,
      color: randomColor,
      secondaryColor: randomSecondaryColor,
      personality: randomPersonality,
      appearance: {
        eyes: eyes[Math.floor(Math.random() * eyes.length)],
        expression: expressions[Math.floor(Math.random() * expressions.length)],
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)]
      },
      specialAbilities: randomAbilities,
      favoriteActivity: randomActivity,
      backstory: `A ${randomPersonality} ${randomType} companion with ${editedPet.appearance.eyes} eyes and a ${editedPet.appearance.pattern} pattern. Born in the digital realm to assist students on their learning journey.`
    });
  };

  const generateAIPetImage = async () => {
    setIsGeneratingImage(true);
    try {
      // In a real implementation, this would call an AI image generation service
      // For now, we'll simulate the process and use a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const imageId = `anime-pet-${editedPet.type}-${Date.now()}`;
      const generatedImage = 'https://static.wixstatic.com/media/c5b305_b9df0ad6afab410f863521c8d8673a09~mv2.png?originWidth=192&originHeight=192';
      
      setEditedPet(prev => ({
        ...prev,
        image: generatedImage
      }));
    } catch (error) {
      console.error('Error generating pet image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const petTypes = [
    { value: 'cat', label: 'Cyber Cat 🐱', emoji: '🐱', description: 'Agile and curious digital feline' },
    { value: 'dragon', label: 'Data Dragon 🐉', emoji: '🐉', description: 'Wise and powerful knowledge guardian' },
    { value: 'robot', label: 'Study Bot 🤖', emoji: '🤖', description: 'Efficient and logical learning assistant' },
    { value: 'phoenix', label: 'Code Phoenix 🔥', emoji: '🔥', description: 'Resilient and inspiring flame spirit' },
    { value: 'wolf', label: 'Wisdom Wolf 🐺', emoji: '🐺', description: 'Loyal and determined pack leader' },
    { value: 'fox', label: 'Cyber Fox 🦊', emoji: '🦊', description: 'Clever and mischievous trickster' },
    { value: 'bunny', label: 'Quantum Bunny 🐰', emoji: '🐰', description: 'Quick and energetic speed demon' },
    { value: 'panda', label: 'Zen Panda 🐼', emoji: '🐼', description: 'Calm and balanced meditation master' }
  ];

  const personalities = [
    { value: 'playful', label: 'Playful & Fun', description: 'Loves games and making learning enjoyable' },
    { value: 'wise', label: 'Wise & Thoughtful', description: 'Provides deep insights and guidance' },
    { value: 'energetic', label: 'Energetic & Motivating', description: 'Full of enthusiasm and drive' },
    { value: 'calm', label: 'Calm & Peaceful', description: 'Brings tranquility and focus' },
    { value: 'mischievous', label: 'Mischievous & Clever', description: 'Keeps things interesting with surprises' },
    { value: 'loyal', label: 'Loyal & Supportive', description: 'Always there when you need encouragement' },
    { value: 'mysterious', label: 'Mysterious & Enigmatic', description: 'Full of secrets and hidden knowledge' }
  ];

  const eyeTypes = [
    { value: 'normal', label: 'Normal', icon: <Eye className="h-4 w-4" /> },
    { value: 'sparkly', label: 'Sparkly', icon: <Star className="h-4 w-4" /> },
    { value: 'sleepy', label: 'Sleepy', icon: <Moon className="h-4 w-4" /> },
    { value: 'determined', label: 'Determined', icon: <Target className="h-4 w-4" /> },
    { value: 'mischievous', label: 'Mischievous', icon: <Smile className="h-4 w-4" /> },
    { value: 'wise', label: 'Wise', icon: <Brain className="h-4 w-4" /> }
  ];

  const expressions = [
    { value: 'happy', label: 'Happy', icon: <Smile className="h-4 w-4" /> },
    { value: 'content', label: 'Content', icon: <Heart className="h-4 w-4" /> },
    { value: 'excited', label: 'Excited', icon: <Zap className="h-4 w-4" /> },
    { value: 'focused', label: 'Focused', icon: <Target className="h-4 w-4" /> },
    { value: 'sleepy', label: 'Sleepy', icon: <Moon className="h-4 w-4" /> },
    { value: 'curious', label: 'Curious', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  const patterns = [
    { value: 'solid', label: 'Solid', icon: <Shield className="h-4 w-4" /> },
    { value: 'stripes', label: 'Stripes', icon: <Zap className="h-4 w-4" /> },
    { value: 'spots', label: 'Spots', icon: <Star className="h-4 w-4" /> },
    { value: 'gradient', label: 'Gradient', icon: <Palette className="h-4 w-4" /> },
    { value: 'cyber', label: 'Cyber', icon: <Lightning className="h-4 w-4" /> },
    { value: 'holographic', label: 'Holographic', icon: <Sparkles className="h-4 w-4" /> }
  ];

  const sizes = [
    { value: 'small', label: 'Small & Cute' },
    { value: 'medium', label: 'Medium & Balanced' },
    { value: 'large', label: 'Large & Majestic' }
  ];

  const accessories = [
    'Cyber Collar', 'Holographic Wings', 'Digital Glasses', 'Neon Bow Tie',
    'Circuit Patterns', 'LED Stripes', 'Quantum Aura', 'Data Crown',
    'Pixel Scarf', 'Binary Bracelet', 'Laser Pointer', 'Virtual Reality Headset',
    'Glowing Tail Ring', 'Nano Armor', 'Energy Shield', 'Cosmic Pendant'
  ];

  const specialAbilities = [
    'Digital Healing', 'Study Boost', 'Quantum Leap', 'Time Dilation',
    'Circuit Surge', 'Data Shield', 'Phoenix Fire', 'Rebirth Protocol',
    'Shadow Step', 'Night Vision', 'Illusion Weave', 'Spirit Bond',
    'Luck Charm', 'Speed Burst', 'Zen Focus', 'Bamboo Strength',
    'Memory Enhancement', 'Focus Beam', 'Stress Relief', 'Energy Restore'
  ];

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
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground text-xl">Create Your Anime Pet</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={generateRandomPet}
                  variant="outline" 
                  className="border-secondary text-secondary"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random
                </Button>
                <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                  ✕
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[75vh]">
              {/* Left Panel - Preview */}
              <div className="w-1/3 p-6 border-r border-primary/20">
                <div className="text-center mb-6">
                  <h4 className="font-heading font-bold text-foreground text-lg mb-4">Pet Preview</h4>
                  
                  {/* Pet Display */}
                  <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 flex items-center justify-center relative">
                    {editedPet.image ? (
                      <Image
                        src={editedPet.image}
                        alt={`${editedPet.name} preview`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-8xl">
                        {petTypes.find(type => type.value === editedPet.type)?.emoji}
                      </div>
                    )}
                    
                    {isGeneratingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-xs text-foreground">Generating...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <h5 className="font-heading font-bold text-foreground text-lg mb-2">{editedPet.name}</h5>
                  <p className="text-sm font-paragraph text-light-gray mb-4">{editedPet.backstory}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <Badge className="bg-primary/20 text-primary">
                        {editedPet.type}
                      </Badge>
                      <Badge className="bg-secondary/20 text-secondary">
                        {editedPet.personality}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                        {editedPet.appearance.pattern} pattern
                      </Badge>
                      <Badge variant="outline" className="border-secondary/30 text-secondary text-xs">
                        {editedPet.appearance.eyes} eyes
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateAIPetImage}
                    disabled={isGeneratingImage}
                    className="bg-cyber-yellow text-black hover:bg-cyber-yellow/90 w-full mb-4"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isGeneratingImage ? 'Generating...' : 'Generate AI Image'}
                  </Button>
                  
                  <div className="text-xs font-paragraph text-light-gray">
                    <p className="mb-1">Special Abilities:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {editedPet.specialAbilities.map((ability, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Customization */}
              <div className="flex-1 p-6 overflow-y-auto">
                <Tabs defaultValue="basic" className="h-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="personality">Personality</TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div>
                      <Label htmlFor="pet-name">Pet Name</Label>
                      <Input
                        id="pet-name"
                        value={editedPet.name}
                        onChange={(e) => setEditedPet(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your pet's name..."
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Pet Type</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {petTypes.map((type) => (
                          <Button
                            key={type.value}
                            variant={editedPet.type === type.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ ...prev, type: type.value as any }))}
                            className={`h-auto p-4 flex flex-col items-center gap-2 ${
                              editedPet.type === type.value 
                                ? 'bg-primary text-primary-foreground' 
                                : 'border-primary/20 text-foreground hover:border-primary/50'
                            }`}
                          >
                            <span className="text-2xl">{type.emoji}</span>
                            <div className="text-center">
                              <p className="font-heading font-bold text-sm">{type.label}</p>
                              <p className="text-xs opacity-70">{type.description}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <Input
                          id="primary-color"
                          type="color"
                          value={editedPet.color}
                          onChange={(e) => setEditedPet(prev => ({ ...prev, color: e.target.value }))}
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondary-color">Secondary Color</Label>
                        <Input
                          id="secondary-color"
                          type="color"
                          value={editedPet.secondaryColor}
                          onChange={(e) => setEditedPet(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appearance" className="space-y-6">
                    <div>
                      <Label>Eye Type</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {eyeTypes.map((eye) => (
                          <Button
                            key={eye.value}
                            variant={editedPet.appearance.eyes === eye.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ 
                              ...prev, 
                              appearance: { ...prev.appearance, eyes: eye.value as any }
                            }))}
                            className="flex items-center gap-2"
                          >
                            {eye.icon}
                            {eye.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Expression</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {expressions.map((expr) => (
                          <Button
                            key={expr.value}
                            variant={editedPet.appearance.expression === expr.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ 
                              ...prev, 
                              appearance: { ...prev.appearance, expression: expr.value as any }
                            }))}
                            className="flex items-center gap-2"
                          >
                            {expr.icon}
                            {expr.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Pattern</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {patterns.map((pattern) => (
                          <Button
                            key={pattern.value}
                            variant={editedPet.appearance.pattern === pattern.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ 
                              ...prev, 
                              appearance: { ...prev.appearance, pattern: pattern.value as any }
                            }))}
                            className="flex items-center gap-2"
                          >
                            {pattern.icon}
                            {pattern.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Size</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {sizes.map((size) => (
                          <Button
                            key={size.value}
                            variant={editedPet.appearance.size === size.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ 
                              ...prev, 
                              appearance: { ...prev.appearance, size: size.value as any }
                            }))}
                          >
                            {size.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="personality" className="space-y-6">
                    <div>
                      <Label>Personality Type</Label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {personalities.map((personality) => (
                          <Button
                            key={personality.value}
                            variant={editedPet.personality === personality.value ? 'default' : 'outline'}
                            onClick={() => setEditedPet(prev => ({ ...prev, personality: personality.value as any }))}
                            className={`h-auto p-4 text-left justify-start ${
                              editedPet.personality === personality.value 
                                ? 'bg-primary text-primary-foreground' 
                                : 'border-primary/20 text-foreground hover:border-primary/50'
                            }`}
                          >
                            <div>
                              <p className="font-heading font-bold">{personality.label}</p>
                              <p className="text-sm opacity-70">{personality.description}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="backstory">Backstory</Label>
                      <textarea
                        id="backstory"
                        value={editedPet.backstory}
                        onChange={(e) => setEditedPet(prev => ({ ...prev, backstory: e.target.value }))}
                        className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground resize-none mt-2"
                        rows={3}
                        placeholder="Tell your pet's origin story..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="favorite-activity">Favorite Activity</Label>
                      <Input
                        id="favorite-activity"
                        value={editedPet.favoriteActivity}
                        onChange={(e) => setEditedPet(prev => ({ ...prev, favoriteActivity: e.target.value }))}
                        placeholder="What does your pet love to do?"
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="abilities" className="space-y-6">
                    <div>
                      <Label>Accessories</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {accessories.map((accessory) => (
                          <label key={accessory} className="flex items-center gap-2 p-2 rounded hover:bg-primary/10">
                            <input
                              type="checkbox"
                              checked={editedPet.accessories.includes(accessory)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditedPet(prev => ({
                                    ...prev,
                                    accessories: [...prev.accessories, accessory]
                                  }));
                                } else {
                                  setEditedPet(prev => ({
                                    ...prev,
                                    accessories: prev.accessories.filter(acc => acc !== accessory)
                                  }));
                                }
                              }}
                              className="rounded border-primary/20"
                            />
                            <span className="text-sm font-paragraph text-foreground">{accessory}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Special Abilities (Choose up to 4)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {specialAbilities.map((ability) => (
                          <label key={ability} className="flex items-center gap-2 p-2 rounded hover:bg-secondary/10">
                            <input
                              type="checkbox"
                              checked={editedPet.specialAbilities.includes(ability)}
                              onChange={(e) => {
                                if (e.target.checked && editedPet.specialAbilities.length < 4) {
                                  setEditedPet(prev => ({
                                    ...prev,
                                    specialAbilities: [...prev.specialAbilities, ability]
                                  }));
                                } else if (!e.target.checked) {
                                  setEditedPet(prev => ({
                                    ...prev,
                                    specialAbilities: prev.specialAbilities.filter(ab => ab !== ability)
                                  }));
                                }
                              }}
                              disabled={!editedPet.specialAbilities.includes(ability) && editedPet.specialAbilities.length >= 4}
                              className="rounded border-primary/20"
                            />
                            <span className={`text-sm font-paragraph ${
                              editedPet.specialAbilities.includes(ability) ? 'text-secondary' : 'text-foreground'
                            }`}>
                              {ability}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-light-gray mt-2">
                        Selected: {editedPet.specialAbilities.length}/4 abilities
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-primary/20">
              <Button 
                onClick={generateRandomPet}
                variant="outline" 
                className="border-cyber-yellow text-cyber-yellow"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Random Pet
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Pet
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Pet Customization Modal */}
      {showCustomization && (
        <PetCustomization
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          pet={pet}
          onSave={handleCustomizePet}
        />
      )}
    </AnimatePresence>
  );
}