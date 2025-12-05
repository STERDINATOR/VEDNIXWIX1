import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, CheckCircle, X } from 'lucide-react';

interface Reminder {
  id: string;
  mentorName: string;
  mentorEmoji: string;
  message: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  scheduledTime: string;
  reelId: string;
  dismissed: boolean;
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    mentorName: 'Logic Sage',
    mentorEmoji: '🧙‍♂️',
    message: 'You haven\'t reviewed quadratic equations in 3 days. Time to refresh your memory!',
    topic: 'Algebra',
    urgency: 'high',
    scheduledTime: 'Now',
    reelId: 'reel-1',
    dismissed: false
  },
  {
    id: '2',
    mentorName: 'Code Master',
    mentorEmoji: '💻',
    message: 'Great progress on recursion! Ready for the advanced concepts?',
    topic: 'Programming',
    urgency: 'medium',
    scheduledTime: '2:00 PM',
    reelId: 'reel-2',
    dismissed: false
  },
  {
    id: '3',
    mentorName: 'Math Wizard',
    mentorEmoji: '🔢',
    message: 'Your weak topic playlist is ready. 5 new reels on calculus fundamentals.',
    topic: 'Calculus',
    urgency: 'medium',
    scheduledTime: '3:30 PM',
    reelId: 'reel-3',
    dismissed: false
  },
  {
    id: '4',
    mentorName: 'Physics Oracle',
    mentorEmoji: '⚛️',
    message: 'You\'ve earned a new achievement! Keep up the momentum!',
    topic: 'Physics',
    urgency: 'low',
    scheduledTime: 'Tomorrow',
    reelId: 'reel-4',
    dismissed: false
  }
];

export function MentorReelReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);

  const handleDismiss = (reminderId: string) => {
    setReminders(reminders.map(r => r.id === reminderId ? { ...r, dismissed: true } : r));
  };

  const handleWatchReel = (reminderId: string) => {
    console.log(`Watching reel for reminder: ${reminderId}`);
    handleDismiss(reminderId);
  };

  const activeReminders = reminders.filter(r => !r.dismissed);
  const dismissedCount = reminders.filter(r => r.dismissed).length;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#FF4500';
      case 'medium':
        return '#FFFF00';
      case 'low':
        return '#00FF00';
      default:
        return '#00FFFF';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '🔴 Urgent';
      case 'medium':
        return '🟡 Important';
      case 'low':
        return '🟢 Optional';
      default:
        return 'Info';
    }
  };

  return (
    <div className="w-full py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-heading text-3xl text-foreground mb-2">
          Smart Reel Reminders
        </h3>
        <p className="text-light-gray">
          AI-powered mentor reminders to keep you on track
        </p>
      </motion.div>

      {/* Reminder Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-dark-gray border-2 border-primary p-6 text-center">
          <Bell className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-3xl font-heading text-foreground">{activeReminders.length}</p>
          <p className="text-sm text-light-gray">Active Reminders</p>
        </Card>
        <Card className="bg-dark-gray border-2 border-primary p-6 text-center">
          <Clock className="w-8 h-8 text-cyber-yellow mx-auto mb-3" />
          <p className="text-3xl font-heading text-foreground">
            {activeReminders.filter(r => r.urgency === 'high').length}
          </p>
          <p className="text-sm text-light-gray">Urgent</p>
        </Card>
        <Card className="bg-dark-gray border-2 border-primary p-6 text-center">
          <CheckCircle className="w-8 h-8 text-neon-green mx-auto mb-3" />
          <p className="text-3xl font-heading text-foreground">{dismissedCount}</p>
          <p className="text-sm text-light-gray">Completed</p>
        </Card>
      </motion.div>

      {/* Reminders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {activeReminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className="bg-dark-gray border-2 overflow-hidden hover:border-primary/60 transition-all cursor-pointer"
                style={{ borderColor: getUrgencyColor(reminder.urgency) + '40' }}
              >
                <motion.button
                  onClick={() => setExpandedReminder(expandedReminder === reminder.id ? null : reminder.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Mentor Avatar */}
                      <div className="text-4xl flex-shrink-0">
                        {reminder.mentorEmoji}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-heading text-lg text-foreground">
                            {reminder.mentorName}
                          </h4>
                          <Badge
                            style={{
                              backgroundColor: getUrgencyColor(reminder.urgency) + '20',
                              color: getUrgencyColor(reminder.urgency)
                            }}
                            className="text-xs"
                          >
                            {getUrgencyLabel(reminder.urgency)}
                          </Badge>
                        </div>
                        <p className="text-light-gray mb-2">
                          {reminder.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-light-gray">
                          <span>📚 {reminder.topic}</span>
                          <span>⏰ {reminder.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(reminder.id);
                      }}
                      className="flex-shrink-0 ml-4 p-2 rounded hover:bg-background/40 transition-all"
                    >
                      <X className="w-5 h-5 text-light-gray hover:text-foreground" />
                    </motion.button>
                  </div>
                </motion.button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedReminder === reminder.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-primary/20"
                    >
                      <div className="p-6 space-y-4 bg-background/40">
                        {/* Mentor Quote */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-dark-gray rounded-lg p-4 border-l-4"
                          style={{ borderColor: getUrgencyColor(reminder.urgency) }}
                        >
                          <p className="font-paragraph text-foreground italic">
                            "{reminder.message}"
                          </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-3"
                        >
                          <Button
                            onClick={() => handleWatchReel(reminder.id)}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase"
                          >
                            ▶ Watch Reel
                          </Button>
                          <Button
                            onClick={() => handleDismiss(reminder.id)}
                            variant="outline"
                            className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                          >
                            ✓ Dismiss
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {activeReminders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">✨</div>
          <h4 className="font-heading text-2xl text-foreground mb-2">
            All Caught Up!
          </h4>
          <p className="text-light-gray">
            No pending reminders. Great job staying on track!
          </p>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="bg-background/40 border border-primary/20 p-6">
        <h4 className="font-heading text-lg text-foreground mb-3">How Reminders Work</h4>
        <ul className="space-y-2 text-sm font-paragraph text-light-gray">
          <li>✓ AI analyzes your learning patterns and weak areas</li>
          <li>✓ Mentors send personalized reminders at optimal times</li>
          <li>✓ Urgency levels help you prioritize learning</li>
          <li>✓ Each reminder links directly to relevant reels</li>
          <li>✓ Dismiss reminders when you've completed the task</li>
        </ul>
      </Card>
    </div>
  );
}
