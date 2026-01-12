/**
 * Draggable Notification Button
 * Separate floating button for notifications
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { usePetStore } from '@/stores/petStore';

interface DraggableNotificationButtonProps {
  onNotificationOpen?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DraggableNotificationButton({ onNotificationOpen, isOpen = false, onOpenChange }: DraggableNotificationButtonProps) {
  const { notifications } = usePetStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPanel, setShowPanel] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle panel toggle
  const handleTogglePanel = () => {
    const newState = !showPanel;
    setShowPanel(newState);
    onOpenChange?.(newState);
    onNotificationOpen?.();
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
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

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed z-40 bottom-6 left-6 cursor-grab active:cursor-grabbing"
      style={{
        transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : undefined
      }}
      drag={!isDragging}
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Notifications Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-20 left-0 w-80 bg-dark-gray border-2 border-primary/30 rounded-2xl p-4 shadow-2xl max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Notifications
              </h3>
              <button
                onClick={() => setShowPanel(false)}
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
                {notifications.slice(0, 10).map((notif) => (
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

      <motion.button
        onClick={handleTogglePanel}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors border-2 border-primary/50"
        title="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-yellow text-dark-gray rounded-full flex items-center justify-center text-xs font-heading font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
