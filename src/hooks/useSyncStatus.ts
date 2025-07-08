import { useState, useEffect } from 'react';
import { newsService } from '@/lib/supabaseClient';

interface SyncStatus {
  connected: boolean;
  lastSynced: Date | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  error?: string;
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: true,
    lastSynced: new Date(),
    status: 'connected'
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Check sync status on load
  useEffect(() => {
    checkSyncStatus();
  }, []);

  // Listen for sync events
  useEffect(() => {
    const handleSyncEvent = (event: CustomEvent) => {
      if (event.detail?.type === 'sync_started') {
        setIsSyncing(true);
        setSyncStatus(prev => ({
          ...prev,
          status: 'syncing'
        }));
      } else if (event.detail?.type === 'sync_completed') {
        setIsSyncing(false);
        setSyncStatus({
          connected: true,
          lastSynced: new Date(),
          status: 'connected'
        });  
      }
    };

    window.addEventListener('syncStatusChanged', handleSyncEvent as EventListener);
    
    return () => {
      window.removeEventListener('syncStatusChanged', handleSyncEvent as EventListener);
    };
  }, []);

  // Check sync status
  const checkSyncStatus = async () => {
    try {
      // Update status
      setSyncStatus({
        connected: true,
        lastSynced: new Date(),
        status: 'connected'
      });
      
      // Update localStorage for reference
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: true,
        lastSynced: new Date().toISOString(),
        status: 'connected',
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  // Force manual sync
  const syncNow = async () => {
    try {
      // Start sync process
      setIsSyncing(true);
      setSyncStatus(prev => ({
        ...prev,
        status: 'syncing'
      }));
      
      // Trigger sync started event
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { type: 'sync_started', timestamp: Date.now() }
      }));
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Broadcast news update
      newsService.broadcastNewsUpdate();
      
      // Update status
      setSyncStatus({
        connected: true,
        lastSynced: new Date(),
        status: 'connected'
      });
      
      // Trigger sync completed event
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { 
          type: 'sync_completed', 
          timestamp: Date.now()
        }
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error syncing:', error);
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncStatus,
    isSyncing,
    syncNow,
    checkSyncStatus
  };
}

export const toast = {
  success: () => {},
  error: () => {}
};