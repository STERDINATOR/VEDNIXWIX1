import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Sparkles
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
  type: 'cat' | 'dragon' | 'robot' | 'phoenix' | 'wolf';
  color: string;
  accessories: string[];
  personality: 'playful' | 'wise' | 'energetic' | 'calm' | 'mischievous';
  level: number;
  xp: number;
  xpToNext: number;
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

export function AnimePet({ isOpen, onClose }: AnimePetProps) {
  const [pet, setPet] = useState<PetPersonality>({
    name: 'Neko-chan',
    type: 'cat',
    color: '#FF6B9D',
    accessories: ['Cyber Collar', 'Holographic Wings'],
    personality: 'playful',
    level: 15,
    xp: 2450,
    xpToNext: 3000
  });

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

    // Generate pet response
    setTimeout(() => {
      setIsTyping(false);
      setPetAnimation('happy');
      
      const responses = [
        "That's a great question! Let me think... 🤔",
        "I'm here to help! Based on what you're asking, I'd suggest... 💡",
        "You're so curious! I love that about you! Here's what I think... ✨",
        "Hmm, that reminds me of something I learned recently... 🧠",
        "Great point! You know, when I was helping other students... 🎓",
        "I'm proud of how hard you're working! For this question... 🌟"
      ];

      const specificResponses: Record<string, string> = {
        'water': "You should drink water every 30-60 minutes while studying! It helps your brain function better! 💧",
        'break': "Take a 5-10 minute break every hour. Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds! 👀",
        'tired': "Feeling tired? Try some light stretching or a quick walk. Fresh air works wonders! 🚶‍♀️",
        'stuck': "When you're stuck, try explaining the problem out loud to me! Sometimes talking through it helps! 🗣️",
        'motivation': "Remember why you started! Every small step forward is progress. You're doing amazing! 🌟",
        'help': "I'm here to remind you to stay healthy, take breaks, and keep motivated! What specific help do you need? 🤗"
      };

      let response = responses[Math.floor(Math.random() * responses.length)];
      
      // Check for specific keywords
      const lowerMessage = message.toLowerCase();
      for (const [keyword, specificResponse] of Object.entries(specificResponses)) {
        if (lowerMessage.includes(keyword)) {
          response = specificResponse;
          break;
        }
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
      wolf: '🐺'
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
              <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                ✕
              </Button>
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
                      <div className={`text-8xl mb-4 ${getAnimationClass()}`}>
                        {getPetEmoji()}
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

  const handleSave = () => {
    onSave(editedPet);
    onClose();
  };

  const petTypes = [
    { value: 'cat', label: 'Cyber Cat 🐱', emoji: '🐱' },
    { value: 'dragon', label: 'Data Dragon 🐉', emoji: '🐉' },
    { value: 'robot', label: 'Study Bot 🤖', emoji: '🤖' },
    { value: 'phoenix', label: 'Code Phoenix 🔥', emoji: '🔥' },
    { value: 'wolf', label: 'Wisdom Wolf 🐺', emoji: '🐺' }
  ];

  const personalities = [
    { value: 'playful', label: 'Playful & Fun' },
    { value: 'wise', label: 'Wise & Thoughtful' },
    { value: 'energetic', label: 'Energetic & Motivating' },
    { value: 'calm', label: 'Calm & Peaceful' },
    { value: 'mischievous', label: 'Mischievous & Clever' }
  ];

  const accessories = [
    'Cyber Collar', 'Holographic Wings', 'Digital Glasses', 'Neon Bow Tie',
    'Circuit Patterns', 'LED Stripes', 'Quantum Aura', 'Data Crown'
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
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground text-xl">Customize Your Pet</h3>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Pet Preview */}
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {petTypes.find(type => type.value === editedPet.type)?.emoji}
                </div>
                <h4 className="font-heading font-bold text-foreground text-lg">{editedPet.name}</h4>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pet-name">Pet Name</Label>
                  <Input
                    id="pet-name"
                    value={editedPet.name}
                    onChange={(e) => setEditedPet(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter pet name..."
                  />
                </div>

                <div>
                  <Label htmlFor="pet-type">Pet Type</Label>
                  <select
                    id="pet-type"
                    value={editedPet.type}
                    onChange={(e) => setEditedPet(prev => ({ 
                      ...prev, 
                      type: e.target.value as PetPersonality['type']
                    }))}
                    className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground"
                  >
                    {petTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="personality">Personality</Label>
                  <select
                    id="personality"
                    value={editedPet.personality}
                    onChange={(e) => setEditedPet(prev => ({ 
                      ...prev, 
                      personality: e.target.value as PetPersonality['personality']
                    }))}
                    className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground"
                  >
                    {personalities.map((personality) => (
                      <option key={personality.value} value={personality.value}>
                        {personality.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="color">Primary Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={editedPet.color}
                    onChange={(e) => setEditedPet(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Accessories</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {accessories.map((accessory) => (
                      <label key={accessory} className="flex items-center gap-2">
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
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-primary/20">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Pet
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}