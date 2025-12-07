import React, { useEffect } from 'react';
import { usePetStore } from '@/stores/petStore';

const HEALTH_REMINDERS = [
  { message: "Time to hydrate! Drink some water! 💧", icon: '💧', type: 'health' as const },
  { message: "Your eyes need a break! Look away for 20 seconds. 👀", icon: '👀', type: 'health' as const },
  { message: "Let's stretch! Your body will thank you. 🤸", icon: '🤸', type: 'health' as const },
  { message: "Take a deep breath! Relax for a moment. 🧘", icon: '🧘', type: 'health' as const },
  { message: "Stand up and move around! 🚶", icon: '🚶', type: 'health' as const }
];

const MOTIVATIONAL_MESSAGES = [
  { message: "You're doing amazing! Keep it up! 🌟", icon: '🌟', type: 'motivation' as const },
  { message: "Every step forward is progress! 💪", icon: '💪', type: 'motivation' as const },
  { message: "You've got this! Believe in yourself! 🚀", icon: '🚀', type: 'motivation' as const },
  { message: "Your dedication is inspiring! 🔥", icon: '🔥', type: 'motivation' as const },
  { message: "Learning is a superpower! 🧠", icon: '🧠', type: 'motivation' as const },
  { message: "You're leveling up! Keep going! ⚡", icon: '⚡', type: 'motivation' as const }
];

const ACHIEVEMENT_MESSAGES = [
  { message: "Great job! You've earned 100 XP! 🎉", icon: '🎉', type: 'achievement' as const },
  { message: "Milestone reached! You're on fire! 🔥", icon: '🔥', type: 'achievement' as const },
  { message: "New achievement unlocked! 🏆", icon: '🏆', type: 'achievement' as const }
];

export function PetNotificationSystem() {
  const { pet, addNotification, stats } = usePetStore();

  // Health reminders every 30 minutes
  useEffect(() => {
    if (!pet) return;

    const healthInterval = setInterval(() => {
      const reminder = HEALTH_REMINDERS[Math.floor(Math.random() * HEALTH_REMINDERS.length)];
      addNotification({
        type: reminder.type,
        message: reminder.message,
        icon: reminder.icon
      });

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`${pet.name} says:`, {
            body: reminder.message,
            icon: '🐱'
          });
        } catch (error) {
          console.log('Notification failed');
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(healthInterval);
  }, [pet, addNotification]);

  // Motivational messages every 45 minutes
  useEffect(() => {
    if (!pet) return;

    const motivationInterval = setInterval(() => {
      const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      addNotification({
        type: message.type,
        message: message.message,
        icon: message.icon
      });
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(motivationInterval);
  }, [pet, addNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {
        console.log('Notification permission denied');
      });
    }
  }, []);

  // Pet health degradation and reminders
  useEffect(() => {
    if (!pet) return;

    const healthCheckInterval = setInterval(() => {
      // Simulate health degradation over time
      if (stats.health < 50) {
        addNotification({
          type: 'health',
          message: `${pet.name} is getting tired! Time for a break! 😴`,
          icon: '😴'
        });
      }

      if (stats.energy < 40) {
        addNotification({
          type: 'health',
          message: `${pet.name} needs rest! Take a break and recharge! ⚡`,
          icon: '⚡'
        });
      }

      if (stats.happiness < 60) {
        addNotification({
          type: 'motivation',
          message: `${pet.name} misses you! Let's play together! 🎮`,
          icon: '🎮'
        });
      }
    }, 20 * 60 * 1000); // Check every 20 minutes

    return () => clearInterval(healthCheckInterval);
  }, [pet, stats, addNotification]);

  return null; // This component only manages side effects
}
