import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zamxmcm5uYnV6YmZ5ZXBqc3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NzA0NDUsImV4cCI6MjA2NzI0NjQ0NX0.eKXbbuZWlSjd8Drp0aDTMDR3oxpXRPZHFpt1yyU274k';

// Configurar URL de Supabase si no está definida
const finalSupabaseUrl = supabaseUrl || 'https://osjlfrnnbuzbfyepjsve.supabase.co';

if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL no está definido. Usando URL predeterminada.');
}

// Crear cliente de Supabase
export const supabase = createClient(finalSupabaseUrl, supabaseAnonKey);

// Database types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  imageCaption?: string;
  category?: string;
  youtubeUrl?: string;
  images?: string[];
  content_html?: string;
  created_at?: string;
  updated_at?: string;
}

// Enhanced sample news data with categories
export const sampleNewsData: Omit<NewsItem, 'created_at' | 'updated_at'>[] = [
  {
    id: '1',
    title: 'لقاء الدكتور أحمد العلواني مع الشيخ رعد عبد الجبار العلي سليمان',
    content: `استقبل الشيخ الدكتور أحمد عبد الجبار العلواني، رئيس مجلس إدارة مجموعة العلواني، الشيخ رعد عبد الجبار العلي سليمان، في مقر إقامته بمدينة الرمادي.

وناقش اللقاء سبل تعزيز التعاون بين الطرفين، بالإضافة إلى مناقشة عدد من المواضيع التي تهم محافظة الأنبار.

المكتب الإعلامي
للشيخ الدكتور أحمد عبد الجبار العلواني
15 حزيران 2025`,
    date: '2025-06-15',
    author: 'المكتب الإعلامي',
    category: 'political',
    image: 'https://d.top4top.io/p_3473n86931.jpg',
    imageCaption: 'لقاء الدكتور أحمد عبد الجبار العلواني مع الشيخ رعد عبد الجبار العلي سليمان في مقر إقامته بالرمادي'
  },
  {
    id: '2',
    title: 'مجموعة العلواني توقع عقدًا جديدًا مع شركة عالمية',
    content: `وقعت مجموعة العلواني عقدًا جديدًا مع إحدى الشركات العالمية الرائدة في مجال الطاقة المتجددة. يأتي هذا العقد في إطار جهود المجموعة لتوسيع نطاق أعمالها ودخول مجالات جديدة.

وأعرب الشيخ الدكتور أحمد عبد الجبار العلواني عن سعادته بهذا التعاون، مؤكدًا أن هذا العقد سيساهم في تعزيز مكانة المجموعة في السوق العالمية.

المكتب الإعلامي
لمجموعة العلواني
10 حزيران 2025`,
    date: '2025-06-10',
    author: 'المكتب الإعلامي',
    category: 'economic',
    image: 'https://example.com/image2.jpg',
    imageCaption: 'توقيع العقد الجديد بين مجموعة العلواني والشركة العالمية'
  },
  {
    id: '3',
    title: 'مجموعة العلواني تطلق مشروعًا تنمويًا جديدًا في الأنبار',
    content: `أطلقت مجموعة العلواني مشروعًا تنمويًا جديدًا في محافظة الأنبار، يهدف إلى تطوير البنية التحتية وتوفير فرص عمل للشباب. يأتي هذا المشروع في إطار التزام المجموعة بدعم التنمية المحلية وتحسين ظروف المعيشة في المحافظة.

وأكد الشيخ الدكتور أحمد عبد الجبار العلواني أن هذا المشروع هو جزء من خطة شاملة لتطوير محافظة الأنبار، وأن المجموعة ستستمر في دعم المشاريع التنموية في المنطقة.

المكتب الإعلامي
لمجموعة العلواني
5 حزيران 2025`,
    date: '2025-06-05',
    author: 'المكتب الإعلامي',
    category: 'social',
    image: 'https://example.com/image3.jpg',
    imageCaption: 'إطلاق المشروع التنموي الجديد في الأنبار'
  },
  {
    id: '4',
    title: 'مجموعة العلواني تحصل على جائزة أفضل شركة مساهمة في التنمية المستدامة',
    content: `حصلت مجموعة العلواني على جائزة أفضل شركة مساهمة في التنمية المستدامة لعام 2025. جاء هذا التكريم تقديرًا لجهود المجموعة في دعم المشاريع التنموية والبيئية في العراق.

وأعرب الشيخ الدكتور أحمد عبد الجبار العلواني عن فخره بهذا الإنجاز، مؤكدًا أن المجموعة ستستمر في دعم التنمية المستدامة والمساهمة في بناء مستقبل أفضل للعراق.

المكتب الإعلامي
لمجموعة العلواني
1 حزيران 2025`,
    date: '2025-06-01',
    author: 'المكتب الإعلامي',
    category: 'economic',
    image: 'https://example.com/image4.jpg',
    imageCaption: 'استلام جائزة أفضل شركة مساهمة في التنمية المستدامة'
  },
  {
    id: '5',
    title: 'مجموعة العلواني تعلن عن توسيع أعمالها في مجال الطاقة المتجددة',
    content: `أعلنت مجموعة العلواني عن خططها لتوسيع أعمالها في مجال الطاقة المتجددة، وذلك من خلال إنشاء عدد من المشاريع الجديدة في هذا المجال. يأتي هذا التوسع في إطار جهود المجموعة لدعم التحول نحو الطاقة النظيفة والمستدامة.

وأكد الشيخ الدكتور أحمد عبد الجبار العلواني أن المجموعة ملتزمة بدعم المشاريع البيئية والمستدامة، وأن هذا التوسع سيساهم في تعزيز مكانة المجموعة في السوق العالمية.

المكتب الإعلامي
لمجموعة العلواني
25 أيار 2025`,
    date: '2025-05-25',
    author: 'المكتب الإعلامي',
    category: 'economic',
    image: 'https://example.com/image5.jpg',
    imageCaption: 'إعلان مجموعة العلواني عن توسيع أعمالها في مجال الطاقة المتجددة'
  },
  {
    id: '6',
    title: 'مجموعة العلواني تدعم مبادرات التعليم في الأنبار',
    content: `أعلنت مجموعة العلواني عن دعمها لمبادرات التعليم في محافظة الأنبار، وذلك من خلال تمويل بناء مدارس جديدة وتوفير المنح الدراسية للطلاب الموهوبين. يأتي هذا الدعم في إطار التزام المجموعة بدعم التعليم وتحسين ظروف المعيشة في المحافظة.

وأكد الشيخ الدكتور أحمد عبد الجبار العلواني أن التعليم هو الأساس لبناء مستقبل أفضل، وأن المجموعة ستستمر في دعم المبادرات التعليمية في الأنبار.

المكتب الإعلامي
لمجموعة العلواني
20 أيار 2025`,
    date: '2025-05-20',
    author: 'المكتب الإعلامي',
    category: 'educational',
    image: 'https://example.com/image6.jpg',
    imageCaption: 'دعم مجموعة العلواني لمبادرات التعليم في الأنبار'
  }
];

// Enhanced news service with better error handling and fallback
export const newsService = {
  // Inicializar la sincronización en tiempo real
  initializeRealtimeSync() {
    if (!supabase) return;
    
    try {
      // Suscribirse a cambios en la tabla news
      const subscription = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'news'
        }, (payload) => {
          console.log('Cambio en tiempo real recibido:', payload);
          
          // Actualizar localStorage y disparar eventos
          this.broadcastNewsUpdate();
          
          // Notificar a la UI
          window.dispatchEvent(new CustomEvent('newsUpdated', {
            detail: { 
              type: payload.eventType,
              record: payload.new,
              timestamp: Date.now()
            }
          }));
        })
        .subscribe((status) => {
          console.log('Estado de suscripción en tiempo real:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Sincronización en tiempo real activada correctamente');
            
            // Registrar estado de sincronización
            localStorage.setItem('realtime-sync-status', JSON.stringify({
              enabled: true,
              lastChecked: Date.now(),
              status: 'connected'
            }));
          }
        });
        
      // Devolver la suscripción para poder limpiarla más tarde
      return subscription;
    } catch (error) {
      console.error('Error al inicializar la sincronización en tiempo real:', error);
      
      // Registrar error
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        enabled: false,
        lastChecked: Date.now(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
      
      return null;
    }
  },
  
  // Verificar estado de sincronización
  async checkSyncStatus() {
    try {
      if (!supabase) throw new Error('Cliente Supabase no disponible');
      
      // Comprobar conexión con Supabase
      const { data, error } = await supabase
        .from('sync_settings')
        .select('key, value, last_updated')
        .eq('key', 'sync_config')
        .single();
        
      if (error) throw error;
      
      // Actualizar estado de sincronización
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        enabled: data?.value?.enabled || true,
        lastChecked: Date.now(),
        status: 'connected',
        config: data?.value || { interval: 5000, retry_attempts: 3 }
      }));
      
      return {
        connected: true,
        config: data?.value
      };
    } catch (error) {
      console.error('Error al verificar estado de sincronización:', error);
      
      // Actualizar estado en localStorage
      const currentStatus = localStorage.getItem('realtime-sync-status');
      const parsedStatus = currentStatus ? JSON.parse(currentStatus) : {};
      
      localStorage.setItem('realtime-sync-status', JSON.stringify({
        ...parsedStatus,
        lastChecked: Date.now(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
      
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    try {
      // First try to save to localStorage as backup
      const timestamp = Date.now();
      localStorage.setItem('website-news', JSON.stringify(
        sampleNewsData.map(item => ({
          ...item,
          sync_version: 1,
          last_synced: new Date().toISOString(),
          sync_status: 'synced'
        }))
      ));
      localStorage.setItem('website-news-last-updated', timestamp.toString());
      console.log('Sample news data saved to localStorage');

      // Then try to save to Supabase if available
      if (supabase) {
        for (const newsItem of sampleNewsData) {
          await this.upsertNews(newsItem);
        }
        console.log('Sample news data initialized in Supabase successfully');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      // Ensure localStorage backup exists
      localStorage.setItem('website-news', JSON.stringify(sampleNewsData));
    }
  },

  // Get all news items with fallback
  async getAllNews(): Promise<NewsItem[]> {
    try {
      // Verificar estado de sincronización
      await this.checkSyncStatus();
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Save to localStorage as backup with timestamp
        const timestamp = Date.now();
        localStorage.setItem('website-news', JSON.stringify(data));
        localStorage.setItem('website-news-last-updated', timestamp.toString());
        return data;
      }

      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        return JSON.parse(savedNews);
      }

      // If no data exists, initialize with sample data
      await this.initializeSampleData();
      return sampleNewsData;

    } catch (error) {
      console.error('Error fetching news:', error);

      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        return JSON.parse(savedNews);
      }

      // Last resort: return sample data
      return sampleNewsData;
    }
  },

  // Get news by ID with fallback
  async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data;
      }

      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: NewsItem) => item.id === id) || null;
      }

      return null;
    } catch (error) {
      console.error('Error fetching news by ID:', error);

      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: NewsItem) => item.id === id) || null;
      }

      return null;
    }
  },

  // Get latest news with fallback
  async getLatestNews(limit: number = 3): Promise<NewsItem[]> {
    try {
      const allNews = await this.getAllNews();
      return allNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return sampleNewsData.slice(0, limit);
    }
  },

  // Get related news with fallback
  async getRelatedNews(excludeId: string, limit: number = 3): Promise<NewsItem[]> {
    try {
      const allNews = await this.getAllNews();
      return allNews.filter(item => item.id !== excludeId).slice(0, limit);
    } catch (error) {
      console.error('Error fetching related news:', error);
      return sampleNewsData.filter(item => item.id !== excludeId).slice(0, limit);
    }
  },

  // Enhanced upsert with localStorage backup
  async upsertNews(newsItem: Omit<NewsItem, 'created_at' | 'updated_at'>): Promise<NewsItem> {
    try {
      // Verificar estado de sincronización
      await this.checkSyncStatus();
      
      // Always save to localStorage first
      const savedNews = localStorage.getItem('website-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];

      // Update or add the news item
      const existingIndex = allNews.findIndex((item: NewsItem) => item.id === newsItem.id);
      const updatedItem = {
        ...newsItem,
        ...newsItem,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        allNews[existingIndex] = { ...allNews[existingIndex], ...updatedItem };
      } else {
        allNews.unshift(updatedItem);
      }

      // Save to localStorage
      const timestamp = Date.now();
      localStorage.setItem('website-news', JSON.stringify(allNews));
      localStorage.setItem('website-news-last-updated', timestamp.toString());
      console.log('News saved to localStorage successfully');

      // Broadcast immediate update to all tabs and devices
      this.broadcastNewsUpdate();
      
      // Guardar en Supabase
      const { data, error } = await supabase
        .from('news')
        .upsert({
          ...newsItem,
          sync_version: existingIndex >= 0 ? (allNews[existingIndex].sync_version || 0) + 1 : 1,
          last_synced: new Date().toISOString(),
          sync_status: 'synced'
        })
        .select();
      
      if (!error && data && data.length > 0) {
          console.log('News saved to Supabase successfully');
          return data[0];
      }

      return updatedItem;
    } catch (error) {
      console.error('Error upserting news:', error);
      throw new Error('فشل في حفظ الخبر');
    }
  },

  // Enhanced delete with localStorage backup
  async deleteNews(id: string): Promise<void> {
    try {
      // Verificar estado de sincronización
      await this.checkSyncStatus();
      
      // Delete from localStorage first
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: NewsItem) => item.id !== id);
        const timestamp = Date.now();
        localStorage.setItem('website-news', JSON.stringify(filteredNews));
        localStorage.setItem('website-news-last-updated', timestamp.toString());
        console.log('News deleted from localStorage successfully');
      }

      // Broadcast immediate update to all tabs and devices
      this.broadcastNewsUpdate();
      
      // Eliminar de Supabase
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (!error) {
        console.log('News deleted from Supabase successfully');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('فشل في حذف الخبر');
    }
  },

  // Enhanced broadcast function for immediate sync
  broadcastNewsUpdate(): void {
    try {
      const timestamp = Date.now();
      
      // Broadcast to other tabs using BroadcastChannel
      const channel = new BroadcastChannel('news-updates');
      channel.postMessage({ 
        type: 'NEWS_UPDATED', 
        timestamp,
        source: 'admin-panel'
      });
      
      // Trigger storage event for cross-tab communication
      localStorage.setItem('news-update-trigger', timestamp.toString());
      
      // Also trigger a custom event for immediate UI updates
      window.dispatchEvent(new CustomEvent('newsUpdated', {
        detail: { timestamp }
      }));
      
      console.log('News update broadcasted successfully');
    } catch (error) {
      console.error('Error broadcasting news update:', error);
    }
  },
  // Upload image with fallback
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('فشل في رفع الصورة');
    }
  },

  // Delete image
  async deleteImage(imagePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('news-images')
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  },
  
  // Sincronizar datos con el servidor
  async syncWithServer(): Promise<{success: boolean, message: string}> {
    try {
      // Verificar estado de sincronización
      const syncStatus = await this.checkSyncStatus();
      if (!syncStatus.connected) {
        throw new Error('No se puede conectar con el servidor para sincronizar');
      }
      
      // Obtener datos locales
      const savedNews = localStorage.getItem('website-news');
      const lastUpdated = localStorage.getItem('website-news-last-updated');
      
      if (!savedNews) {
        // No hay datos locales para sincronizar
        return { success: true, message: 'No hay datos locales para sincronizar' };
      }
      
      // Registrar inicio de sincronización
      console.log('Iniciando sincronización con el servidor...');
      
      // Obtener datos del servidor
      const { data: serverData, error } = await supabase
        .from('news')
        .select('*');
        
      if (error) throw error;
      
      // Comparar y resolver conflictos
      const localData = JSON.parse(savedNews);
      const mergedData = this.mergeData(localData, serverData || []);
      
      // Guardar datos fusionados en localStorage
      const timestamp = Date.now();
      localStorage.setItem('website-news', JSON.stringify(mergedData));
      localStorage.setItem('website-news-last-updated', timestamp.toString());
      
      // Actualizar servidor con datos fusionados
      for (const item of mergedData) {
        // Solo sincronizar elementos modificados localmente
        if (item.sync_status === 'modified' || !item.sync_status) {
          await supabase
            .from('news')
            .upsert({
              ...item,
              sync_version: (item.sync_version || 0) + 1,
              last_synced: new Date().toISOString(),
              sync_status: 'synced'
            });
        }
      }
      
      // Registrar sincronización exitosa
      await supabase
        .from('sync_settings')
        .upsert({
          key: 'last_sync',
          value: {
            timestamp: Date.now(),
            status: 'success',
            items_synced: mergedData.length
          },
          updated_by: 'web-client'
        });
      
      // Notificar a todos los clientes
      this.broadcastNewsUpdate();
      
      return { 
        success: true, 
        message: `Sincronización completada. ${mergedData.length} elementos sincronizados.` 
      };
    } catch (error) {
      console.error('Error en la sincronización:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error desconocido durante la sincronización' 
      };
    }
  },
  
  // Fusionar datos locales y del servidor
  mergeData(localData: NewsItem[], serverData: NewsItem[]): NewsItem[] {
    const mergedMap = new Map<string, NewsItem>();
    
    // Primero agregar todos los datos del servidor
    for (const item of serverData) {
      mergedMap.set(item.id, {
        ...item,
        sync_status: 'synced'
      });
    }
    
    // Luego revisar datos locales y resolver conflictos
    for (const localItem of localData) {
      const serverItem = mergedMap.get(localItem.id);
      
      if (!serverItem) {
        // El elemento solo existe localmente
        mergedMap.set(localItem.id, {
          ...localItem,
          sync_status: 'modified'
        });
      } else {
        // El elemento existe en ambos lados, resolver según versión
        const localVersion = localItem.sync_version || 0;
        const serverVersion = serverItem.sync_version || 0;
        
        if (localVersion >= serverVersion) {
          // La versión local es más reciente o igual
          mergedMap.set(localItem.id, {
            ...localItem,
            sync_status: 'modified'
          });
        }
        // Si la versión del servidor es más reciente, mantener la del servidor
      }
    }
    
    return Array.from(mergedMap.values());
  }
};