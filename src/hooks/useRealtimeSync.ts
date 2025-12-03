import { useEffect, useRef, useCallback } from 'react';
import { useProgressStore } from '@/stores/progressStore';

interface SyncConfig {
  enabled?: boolean;
  interval?: number; // milliseconds
  onSyncSuccess?: () => void;
  onSyncError?: (error: string) => void;
  broadcastChannel?: boolean; // Enable cross-tab sync
}

/**
 * Hook for real-time synchronization of progress data
 * Handles:
 * - Automatic periodic syncing
 * - Cross-tab/device synchronization via BroadcastChannel
 * - Conflict resolution
 * - Offline support
 */
export const useRealtimeSync = (config: SyncConfig = {}) => {
  const {
    enabled = true,
    interval = 30000, // 30 seconds default
    onSyncSuccess,
    onSyncError,
    broadcastChannel: enableBroadcast = true,
  } = config;

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(0);

  const {
    syncProgress,
    setProgressData,
    progressData,
    isSyncing,
    syncError,
  } = useProgressStore();

  // Initialize BroadcastChannel for cross-tab sync
  useEffect(() => {
    if (!enableBroadcast || typeof BroadcastChannel === 'undefined') {
      return;
    }

    try {
      broadcastChannelRef.current = new BroadcastChannel('progress-sync');

      // Listen for messages from other tabs
      broadcastChannelRef.current.onmessage = (event) => {
        const { type, data, timestamp } = event.data;

        if (type === 'PROGRESS_UPDATE') {
          // Only update if the incoming data is newer
          if (timestamp > lastSyncRef.current) {
            setProgressData(data);
            lastSyncRef.current = timestamp;
          }
        }
      };

      return () => {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.close();
          broadcastChannelRef.current = null;
        }
      };
    } catch (error) {
      console.warn('BroadcastChannel not supported:', error);
    }
  }, [enableBroadcast, setProgressData]);

  // Broadcast progress updates to other tabs
  const broadcastUpdate = useCallback(() => {
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'PROGRESS_UPDATE',
          data: progressData,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error broadcasting update:', error);
      }
    }
  }, [progressData]);

  // Handle sync with error callback
  const handleSync = useCallback(async () => {
    try {
      await syncProgress();
      broadcastUpdate();
      lastSyncRef.current = Date.now();
      onSyncSuccess?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      onSyncError?.(errorMsg);
    }
  }, [syncProgress, broadcastUpdate, onSyncSuccess, onSyncError]);

  // Setup auto-sync interval
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Sync immediately on mount
    handleSync();

    // Setup interval for periodic syncing
    syncIntervalRef.current = setInterval(handleSync, interval);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [enabled, interval, handleSync]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      // Sync when coming back online
      handleSync();
    };

    const handleOffline = () => {
      // Could implement offline queue here
      console.log('App is offline - changes will sync when online');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSync]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  return {
    isSyncing,
    syncError,
    manualSync: handleSync,
    broadcastUpdate,
  };
};

/**
 * Hook for subscribing to specific progress updates
 * Useful for components that only care about certain fields
 */
export const useProgressSubscription = (selector: (state: any) => any) => {
  return useProgressStore(selector);
};

/**
 * Hook for batch updates with automatic sync
 */
export const useBatchProgressUpdate = () => {
  const store = useProgressStore();
  const batchUpdatesRef = useRef<any>({});
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addBatchUpdate = useCallback((key: string, value: any) => {
    batchUpdatesRef.current[key] = value;

    // Clear existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    // Debounce batch update for 500ms
    batchTimeoutRef.current = setTimeout(() => {
      const updates = batchUpdatesRef.current;
      batchUpdatesRef.current = {};

      // Apply all updates at once
      store.setProgressData({
        ...store.progressData,
        ...updates,
      });

      // Trigger sync
      store.syncProgress();
    }, 500);
  }, [store]);

  const flushBatchUpdates = useCallback(() => {
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    if (Object.keys(batchUpdatesRef.current).length > 0) {
      const updates = batchUpdatesRef.current;
      batchUpdatesRef.current = {};

      store.setProgressData({
        ...store.progressData,
        ...updates,
      });

      store.syncProgress();
    }
  }, [store]);

  useEffect(() => {
    return () => {
      flushBatchUpdates();
    };
  }, [flushBatchUpdates]);

  return { addBatchUpdate, flushBatchUpdates };
};
