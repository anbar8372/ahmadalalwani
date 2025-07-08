// This file is intentionally empty to prevent any database connections
// All database functionality has been removed from the application

interface SyncStatus {
  connected: boolean;
  lastSynced: Date | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  error?: string;
}

export function useSyncStatus() {
  // Return a mock implementation that doesn't connect to any database
  return {
    syncStatus: {
      connected: false,
      lastSynced: null,
      status: 'disconnected',
      error: 'Database connections have been disabled'
    },
    isSyncing: false,
    syncNow: async () => ({ success: false, error: 'Database connections have been disabled' }),
    checkSyncStatus: async () => {}
  };
}