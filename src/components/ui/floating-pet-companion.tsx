import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/petStore';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, X, Bell } from 'lucide-react';
import { Image } from '@/components/ui/image';

export function FloatingPetCompanion() {
  const { pet, stats, isVisible, setVisible, notifications } = usePetStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [petAnimation, setPetAnimation] = useState<'idle' | 'happy' | 'alert'>('idle');

  // Pet animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      const animations = ['idle', 'happy', 'alert'] as const;
      setPetAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!pet || !isVisible) return null;

  const getAnimationClass = () => {
    switch (petAnimation) {
      case 'happy':
        return 'animate-bounce';
      case 'alert':
        return 'animate-pulse';
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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
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
                    {notifications.map((notif) => (
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
                            <p className="text-xs text-light-gray mt-1">
                              {notif.timestamp.toLocaleTimeString()}
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
              onClick={() => setIsMinimized(!isMinimized)}
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
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 flex gap-2"
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
