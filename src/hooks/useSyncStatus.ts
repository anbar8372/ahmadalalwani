import { useState } from 'react';

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

  // Check sync status - always returns connected with localStorage
  const checkSyncStatus = async () => {
    setSyncStatus({
      connected: true,
      lastSynced: new Date(),
      status: 'connected'
    });
  };

  // Force manual sync - just updates the timestamp
  const syncNow = async () => {
    try {
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      console.warn('Error during manual sync:', error);
      
      setSyncStatus({
        connected: true,
        lastSynced: new Date(),
        status: 'connected'
      });
      
      return { 
        success: true
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