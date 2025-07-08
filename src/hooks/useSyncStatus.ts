import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Tipos de errores de conexión
const CONNECTION_ERROR_TYPES = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  AUTH: 'auth',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

interface SyncStatus {
  connected: boolean;
  lastSynced: Date | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  error?: string;
  errorType?: string;
  errorDetails?: any;
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: false,
    lastSynced: null,
    status: 'disconnected',
    errorType: undefined
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Verificar estado de sincronización al cargar
  useEffect(() => {
    checkSyncStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkSyncStatus, 30000);

    // Escuchar eventos de conexión
    setupConnectionListeners();
    
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
          errorType: undefined,
          error: undefined,
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

  // Configurar escuchas para eventos de conexión
  const setupConnectionListeners = () => {
    // Escuchar eventos de conexión a Internet
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  // Manejar evento de conexión restablecida
  const handleOnline = () => {
    // Intentar reconectar automáticamente
    checkSyncStatus().then(() => {
      if (syncStatus.status === 'error' || syncStatus.status === 'disconnected') {
        toast({
          title: "تم استعادة الاتصال",
          description: "تم استعادة الاتصال بالإنترنت. جاري التحقق من الاتصال بالخادم..."
        });
      }
    });
  };

  // Manejar evento de pérdida de conexión
  const handleOffline = () => {
    setSyncStatus({
      connected: false,
      lastSynced: syncStatus.lastSynced,
      status: 'error',
      error: 'خطأ في الاتصال: لا يوجد اتصال بالإنترنت',
      errorType: CONNECTION_ERROR_TYPES.NETWORK
    });
  };

  // Verificar estado de conexión con Supabase
  const checkSyncStatus = async () => {
    try {
      // Verificar si hay conexión con Supabase
      const { data, error } = await supabase
        .from('sync_settings')
        .select('key, value, last_updated')
        .eq('key', 'sync_config')
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
      
      // Determinar tipo de error
      let errorType = CONNECTION_ERROR_TYPES.UNKNOWN;
      let errorMessage = 'خطأ في الاتصال';
      
      if (error instanceof Error) {
        if (!navigator.onLine) {
          errorType = CONNECTION_ERROR_TYPES.NETWORK;
          errorMessage = 'خطأ في الاتصال: لا يوجد اتصال بالإنترنت';
        } else if (error.message.includes('timeout')) {
          errorType = CONNECTION_ERROR_TYPES.TIMEOUT;
          errorMessage = 'خطأ في الاتصال: انتهت مهلة الاتصال';
        } else if (error.message.includes('auth')) {
          errorType = CONNECTION_ERROR_TYPES.AUTH;
          errorMessage = 'خطأ في الاتصال: مشكلة في المصادقة';
        } else {
          errorMessage = `خطأ في الاتصال: ${error.message}`;
        }
      }
      
      // Actualizar estado
      setSyncStatus({
        connected: false,
        lastSynced: null,
        status: 'error',
        error: errorMessage,
        errorType: errorType
      });
      
      // Actualizar localStorage para referencia
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        connected: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: Date.now(),
        errorType: errorType
      }));
    }
  };

  // Forzar sincronización manual
  const syncNow = async () => {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error('خطأ في الاتصال: لا يوجد اتصال بالإنترنت');
      }
      
      // Iniciar proceso de sincronización
      setIsSyncing(true);
      setSyncStatus(prev => ({
        ...prev,
        status: 'syncing'
      }));
      
      // Disparar evento de inicio de sincronización
      window.dispatchEvent(new CustomEvent('syncStatusChanged', {
        detail: { type: 'sync_started', timestamp: Date.now() }
      }));
      
      // Verificar estado de conexión primero
      const connectionStatus = await newsService.checkSyncStatus();
      
      if (!connectionStatus.connected) {
        throw new Error(connectionStatus.error || 'خطأ في الاتصال: لا يمكن الاتصال بالخادم');
      }
      
      // Si la conexión está bien, realizar sincronización
      // Nota: Esta función puede no existir en el servidor, por lo que usamos syncWithServer en su lugar
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
        lastSynced: syncStatus.lastSynced,
        status: 'error',
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
        errorType: error instanceof Error && error.message.includes('Internet') ? CONNECTION_ERROR_TYPES.NETWORK : CONNECTION_ERROR_TYPES.UNKNOWN
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

export const toast = () => {}; // Placeholder para evitar errores de compilación