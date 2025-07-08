import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Maximum number of retries for connection attempts
const MAX_RETRIES = 3;

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
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const initialCheck = async () => {
      try {
        await checkSyncStatus();
      } catch (error) {
        console.error('Initial sync status check failed:', error);
      }
    };
    
    initialCheck();
    
    // Set up interval to check status
    const interval = setInterval(() => {
      if (retryCount < MAX_RETRIES || syncStatus.connected) {
        checkSyncStatus();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [retryCount, syncStatus.connected]);

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
      console.log('Checking sync status...');
      
      // Check if Supabase client is available
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setSyncStatus({
          connected: false,
          lastSynced: null,
          status: 'error',
          error: 'Supabase client not initialized'
        });
        return;
      }

      // Use a Promise with timeout to handle potential hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
      
      const fetchPromise = supabase.from('news').select('id').limit(1);
      
      // Race between the fetch and the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise.then(() => { throw new Error('Connection timeout'); })
      ]) as any;
      
      if (error) {
        console.warn('Supabase connection error:', error.message);
        setSyncStatus({
          connected: false,
          lastSynced: null,
          status: 'error',
          error: `Database error: ${error.message} - Using offline mode`
        });
        
        // Update localStorage to indicate offline mode
        localStorage.setItem('realtime-sync-status', JSON.stringify({
          connected: false,
          lastSynced: null,
          status: 'error',
          error: `Database error: ${error.message}`,
          timestamp: Date.now()
        }));
        return;
      }
      
      // Reset retry count on success
      setRetryCount(0);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('Error checking sync status - switching to offline mode:', errorMessage);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
      
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: `Network error: ${errorMessage} - Using offline mode`
      });
      
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: `Network error: ${errorMessage}`,
        timestamp: Date.now()
      }));
    }
  };

  // Force manual sync
  const syncNow = async () => {
    try {
      console.log('Manual sync initiated...');
      
      // Start sync process
      if (!supabase) {
        console.warn('Supabase client not available for manual sync');
        return { 
          success: false, 
          error: 'Supabase client not available - using offline mode' 
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
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
      
        // Update localStorage
        if (data) {
          localStorage.setItem('dr-ahmed-news', JSON.stringify(data));
          console.log(`Synced ${data.length} news items to localStorage`);
        }
      } catch (queryError) {
        console.error('Error fetching data during sync:', queryError);
        throw queryError;
      }
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('Error during manual sync - continuing in offline mode:', errorMessage);
      
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: `Sync error: ${errorMessage} - Using offline mode`
      });
      
      return { 
        success: false, 
        error: `Sync error: ${errorMessage} - continuing in offline mode`
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