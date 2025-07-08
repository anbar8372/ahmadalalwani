import { useState, useEffect } from 'react';
import { supabase, newsService } from '@/lib/supabaseClient';

interface SyncStatus {
  connected: boolean;
  lastSynced: Date | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  error?: string;
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: false,
    lastSynced: null,
    status: 'disconnected'
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Check sync status on load
  useEffect(() => {
    checkSyncStatus();
    
    // Set up interval to check status
    const interval = setInterval(checkSyncStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
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

  // Initialize realtime sync
  useEffect(() => {
    const subscription = newsService.initializeRealtimeSync();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check sync status
  const checkSyncStatus = async () => {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        setSyncStatus({
          connected: false,
          lastSynced: null,
          status: 'error',
          error: 'Supabase client not initialized'
        });
        return;
      }

      // Check Supabase connection with a simple query
      const { data, error } = await supabase
        .from('news')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        setSyncStatus({
          connected: false,
          lastSynced: null,
          status: 'error',
          error: `خطأ في الاتصال: ${error.message}`
        });
        return;
      }
      
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
      console.error('Network error checking sync status:', error);
      
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      });
      
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: 'خطأ في الشبكة - تحقق من الاتصال بالإنترنت',
        timestamp: Date.now()
      }));
    }
  };

  // Force manual sync
  const syncNow = async () => {
    try {
      // Start sync process
      if (!supabase) {
        return { 
          success: false, 
          error: 'Supabase client not available' 
        };
      }

      setIsSyncing(true);
      setSyncStatus(prev => ({
        ...prev,
        status: 'syncing'
      }));
      
      // Trigger sync started event
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { type: 'sync_started', timestamp: Date.now() }
      }));
      
      // Get all news from Supabase
      const { data, error } = await supabase!
        .from('news')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      // Update localStorage
      if (data) {
        localStorage.setItem('website-news', JSON.stringify(data));
      }
      
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
      console.error('Network error during sync:', error);
      
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      });
      
      return { 
        success: false, 
        error: 'خطأ في الشبكة - تحقق من الاتصال بالإنترنت'
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