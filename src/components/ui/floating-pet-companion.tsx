import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/petStore';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, X, Bell, Settings, Gift, Zap, Sparkles, Palette, Send } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function FloatingPetCompanion() {
  const { pet, stats, isVisible, setVisible, notifications, updateStats, setPet, addNotification } = usePetStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [petAnimation, setPetAnimation] = useState<'idle' | 'happy' | 'alert' | 'excited'>('idle');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'pet'; message: string }>>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(pet?.name || '');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pet animation cycle with improved variety
  useEffect(() => {
    const interval = setInterval(() => {
      const animations = ['idle', 'happy', 'alert', 'excited'] as const;
      setPetAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized && containerRef.current) {
      setIsDragging(true);
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!pet || !isVisible) return null;

  // Pet interactions
  const feedPet = () => {
    updateStats({
      happiness: Math.min(100, stats.happiness + 15),
      energy: Math.min(100, stats.energy + 8)
    });
    setPetAnimation('excited');
    setTimeout(() => setPetAnimation('happy'), 2000);
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
    setPetAnimation('excited');
    setTimeout(() => setPetAnimation('happy'), 3000);
    addNotification({
      type: 'motivation',
      message: `${pet.name} had so much fun playing with you! 🎮`,
      icon: '🎮'
    });
  };

  const generateAIPetImage = async () => {
    setIsGeneratingImage(true);
    setPetAnimation('alert');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const petImages = {
        cat: 'https://static.wixstatic.com/media/c5b305_b9df0ad6afab410f863521c8d8673a09~mv2.png?originWidth=192&originHeight=192',
        dragon: 'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png?originWidth=192&originHeight=192',
        robot: 'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png?originWidth=192&originHeight=192',
        phoenix: 'https://static.wixstatic.com/media/c5b305_250ce96b9d044dd39f26c8889a4be084~mv2.png?originWidth=192&originHeight=192',
        wolf: 'https://static.wixstatic.com/media/c5b305_64b1f78e7d084df480fb0b1f510cd2f2~mv2.png?originWidth=384&originHeight=384',
        fox: 'https://static.wixstatic.com/media/c5b305_b9df0ad6afab410f863521c8d8673a09~mv2.png?originWidth=192&originHeight=192',
        bunny: 'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png?originWidth=192&originHeight=192',
        panda: 'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png?originWidth=192&originHeight=192'
      };
      
      const generatedImage = petImages[pet.type as keyof typeof petImages] || petImages.cat;
      
      setPet({
        ...pet,
        image: generatedImage
      });
      
      setPetAnimation('happy');
      addNotification({
        type: 'achievement',
        message: `${pet.name} got a new look! ✨`,
        icon: '✨'
      });
    } catch (error) {
      console.error('Error generating pet image:', error);
      setPetAnimation('idle');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', message }]);
    setChatMessage('');
    setPetAnimation('alert');

    setTimeout(() => {
      const responses = [
        `${pet.name}: That's awesome! Keep it up! 🌟`,
        `${pet.name}: I'm so proud of you! 💪`,
        `${pet.name}: You're doing great! Let's keep learning! 📚`,
        `${pet.name}: Remember to take breaks! Your health matters! 💚`,
        `${pet.name}: You've got this! Never give up! 🚀`,
        `${pet.name}: I believe in you! 🎯`,
        `${pet.name}: Your dedication is inspiring! 🔥`,
        `${pet.name}: Let's achieve great things together! ✨`
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { sender: 'pet', message: response }]);
      setPetAnimation('happy');
      
      updateStats({
        happiness: Math.min(100, stats.happiness + 3),
        intelligence: Math.min(100, stats.intelligence + 2)
      });
    }, 1000);
  };

  const savePetName = () => {
    if (newName.trim()) {
      setPet({
        ...pet,
        name: newName
      });
      setEditingName(false);
      addNotification({
        type: 'achievement',
        message: `Your pet is now called ${newName}! 🎉`,
        icon: '🎉'
      });
    }
  };

  const getAnimationClass = () => {
    switch (petAnimation) {
      case 'happy':
        return 'animate-bounce';
      case 'excited':
        return 'animate-pulse';
      case 'alert':
        return 'animate-ping';
      default:
        return '';
    }
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`fixed z-40 ${isMinimized ? 'cursor-grab active:cursor-grabbing' : 'bottom-6 right-6'}`}
          drag={isMinimized}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-24 right-0 w-80 bg-dark-gray border-2 border-primary/30 rounded-2xl p-4 shadow-2xl max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-secondary" />
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-light-gray hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-sm text-light-gray text-center py-4">
                    No notifications yet. Keep up the great work! 🌟
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border transition-all ${
                          notif.isRead
                            ? 'bg-background/50 border-primary/10 opacity-60'
                            : 'bg-primary/10 border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg mt-1">{notif.icon || '💬'}</span>
                          <div className="flex-1">
                            <p className="text-sm font-paragraph text-foreground">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Menu Panel */}
          <AnimatePresence>
            {showQuickMenu && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-24 right-0 w-72 bg-dark-gray border-2 border-primary/30 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground">Quick Actions</h3>
                  <button
                    onClick={() => setShowQuickMenu(false)}
                    className="text-light-gray hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={feedPet}
                    className="w-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Feed Pet 🍰
                  </Button>

                  <Button
                    onClick={playWithPet}
                    className="w-full bg-gradient-to-r from-neon-green to-neon-green/80 text-black hover:from-neon-green/90 hover:to-neon-green/70"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Play with Pet 🎮
                  </Button>

                  <Button
                    onClick={generateAIPetImage}
                    disabled={isGeneratingImage}
                    className="w-full bg-gradient-to-r from-cyber-yellow to-cyber-yellow/80 text-black hover:from-cyber-yellow/90 hover:to-cyber-yellow/70"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGeneratingImage ? 'Generating...' : 'Generate AI Image'} ✨
                  </Button>

                  <Button
                    onClick={() => {
                      setShowChat(true);
                      setShowQuickMenu(false);
                    }}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>

                  <Button
                    onClick={() => {
                      setShowCustomization(true);
                      setShowQuickMenu(false);
                    }}
                    variant="outline"
                    className="w-full border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-24 right-0 w-80 bg-dark-gray border-2 border-primary/30 rounded-2xl p-4 shadow-2xl flex flex-col max-h-96"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground">Chat with {pet.name}</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-light-gray hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-48">
                  {chatHistory.length === 0 ? (
                    <p className="text-sm text-light-gray text-center py-4">
                      Start a conversation with {pet.name}! 💬
                    </p>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-foreground'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Say something..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(chatMessage);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage(chatMessage)}
                    size="sm"
                    className="bg-primary text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Customization Panel */}
          <AnimatePresence>
            {showCustomization && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-24 right-0 w-80 bg-dark-gray border-2 border-primary/30 rounded-2xl p-4 shadow-2xl max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground">Customize {pet.name}</h3>
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="text-light-gray hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Pet Name */}
                  <div>
                    <Label className="text-sm">Pet Name</Label>
                    {editingName ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter new name..."
                          className="flex-1"
                        />
                        <Button
                          onClick={savePetName}
                          size="sm"
                          className="bg-primary text-primary-foreground"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-2 p-2 bg-background rounded border border-primary/20">
                        <span className="text-foreground">{pet.name}</span>
                        <Button
                          onClick={() => {
                            setEditingName(true);
                            setNewName(pet.name);
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-primary"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Pet Stats */}
                  <div className="space-y-3">
                    <Label className="text-sm">Pet Stats</Label>
                    {Object.entries(stats).map(([stat, value]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-light-gray capitalize">{stat}</span>
                          <span className="text-primary font-bold">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>

                  {/* Pet Info */}
                  <div className="p-3 bg-background rounded border border-primary/20">
                    <p className="text-xs text-light-gray mb-2">
                      <span className="text-primary font-bold">Type:</span> {pet.type}
                    </p>
                    <p className="text-xs text-light-gray">
                      <span className="text-primary font-bold">Personality:</span> {pet.personality}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pet Container */}
          <motion.div
            className={`relative ${isMinimized ? 'w-16 h-16' : 'w-24 h-24'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-cyber-yellow/30 rounded-full blur-lg animate-pulse"></div>

            {/* Pet Display */}
            <div
              className={`relative z-10 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full border-2 border-primary/50 flex items-center justify-center cursor-pointer transition-all ${getAnimationClass()}`}
              onClick={() => !isMinimized && setShowQuickMenu(!showQuickMenu)}
            >
              {pet.image ? (
                <Image
                  src={pet.image}
                  alt={pet.name}
                  width={isMinimized ? 64 : 96}
                  height={isMinimized ? 64 : 96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className={`${isMinimized ? 'text-3xl' : 'text-5xl'}`}>
                  {getPetEmoji()}
                </span>
              )}

              {/* Floating particles */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-yellow rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
            </div>

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-dark-gray"
              >
                {unreadCount}
              </motion.div>
            )}

            {/* Mini Stats (when expanded) */}
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-paragraph text-light-gray"
              >
                <span className="text-primary">❤️ {stats.happiness}%</span>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons (when expanded) */}
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 flex gap-2 z-50"
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNotifications(!showNotifications)}
                className="border-secondary text-secondary hover:bg-secondary/10"
                title="Notifications"
              >
                <Bell className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMinimized(true)}
                className="border-primary text-primary hover:bg-primary/10"
                title="Minimize"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}

          {/* Tooltip when minimized */}
          {isMinimized && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-dark-gray border border-primary/30 rounded-lg px-3 py-2 text-sm font-paragraph text-foreground whitespace-nowrap"
            >
              {pet.name} is here! 👋
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
