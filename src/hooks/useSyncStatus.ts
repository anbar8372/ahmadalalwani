import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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

  // Verificar estado de sincronización al cargar
  useEffect(() => {
    checkSyncStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkSyncStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Escuchar eventos de sincronización
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
        setSyncStatus(prev => ({
          ...prev,
          connected: true,
          lastSynced: new Date(),
          status: 'connected'
        }));
      } else if (event.detail?.type === 'sync_error') {
        setIsSyncing(false);
        setSyncStatus(prev => ({
          ...prev,
          status: 'error',
          error: event.detail?.error || 'Error desconocido'
        }));
      }
    };

    window.addEventListener('syncStatusChanged', handleSyncEvent as EventListener);
    
    return () => {
      window.removeEventListener('syncStatusChanged', handleSyncEvent as EventListener);
    };
  }, []);

  // Verificar estado de conexión con Supabase
  const checkSyncStatus = async () => {
    try {
      // Verificar si hay conexión con Supabase
      const { data, error } = await supabase
        .from('sync_settings')
        .select('key, value, last_updated')
        .eq('key', 'last_sync')
        .single();
      
      if (error) throw error;
      
      // Actualizar estado
      setSyncStatus({
        connected: true,
        lastSynced: data?.last_updated ? new Date(data.last_updated) : new Date(),
        status: 'connected'
      });
      
      // Actualizar localStorage para referencia
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: true,
        lastSynced: data?.last_updated || new Date().toISOString(),
        status: 'connected',
        timestamp: Date.now()
      }));
      
    } catch (error) {
      console.error('Error al verificar estado de sincronización:', error);
      
      // Actualizar estado
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
      
      // Actualizar localStorage para referencia
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: Date.now()
      }));
    }
  };

  // Forzar sincronización manual
  const syncNow = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus(prev => ({
        ...prev,
        status: 'syncing'
      }));
      
      // Disparar evento de inicio de sincronización
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { type: 'sync_started', timestamp: Date.now() }
      }));
      
      // Realizar sincronización con el servidor
      const { data, error } = await supabase.rpc('sync_all_data');
      
      if (error) throw error;
      
      // Actualizar estado
      setSyncStatus({
        connected: true,
        lastSynced: new Date(),
        status: 'connected'
      });
      
      // Disparar evento de sincronización completada
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { 
          type: 'sync_completed', 
          timestamp: Date.now(),
          result: data
        }
      }));
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al sincronizar:', error);
      
      // Actualizar estado
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
      
      // Disparar evento de error de sincronización
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { 
          type: 'sync_error', 
          timestamp: Date.now(),
          error: error instanceof Error ? error.message : 'Error desconocido'
        }
      }));
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
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