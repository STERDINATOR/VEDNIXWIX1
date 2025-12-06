import { useEffect, useCallback } from 'react';
import { useUserDataStore } from '@/stores/userDataStore';
import { BaseCrudService } from '@/integrations';

interface RealtimeUpdateOptions {
  enabled?: boolean;
  interval?: number;
  collections?: string[];
  onUpdate?: (data: any) => void;
}

export const useRealtimeUpdates = (options: RealtimeUpdateOptions = {}) => {
  const {
    enabled = true,
    interval = 5000,
    collections = ['studyguilds', 'quests', 'shopitems'],
    onUpdate,
  } = options;

  const { userData } = useUserDataStore();

  const fetchUpdates = useCallback(async () => {
    if (!enabled || !userData) return;

    try {
      const updates: Record<string, any> = {};

      // Fetch guild updates
      if (collections.includes('studyguilds') && userData.guildId) {
        const guild = await BaseCrudService.getById('studyguilds', userData.guildId);
        updates.guild = guild;
      }

      // Fetch quest updates
      if (collections.includes('quests')) {
        const { items: quests } = await BaseCrudService.getAll('quests');
        updates.quests = quests;
      }

      // Fetch shop items
      if (collections.includes('shopitems')) {
        const { items: shopItems } = await BaseCrudService.getAll('shopitems');
        updates.shopItems = shopItems;
      }

      if (onUpdate) {
        onUpdate(updates);
      }

      return updates;
    } catch (error) {
      console.error('Error fetching real-time updates:', error);
    }
  }, [enabled, userData, collections, onUpdate]);

  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately
    fetchUpdates();

    // Then set up interval
    const intervalId = setInterval(fetchUpdates, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, fetchUpdates]);

  return { fetchUpdates };
};
