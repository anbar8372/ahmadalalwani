import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase credentials before creating client
const isValidSupabaseUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
const isValidAnonKey = supabaseAnonKey && supabaseAnonKey.length > 20;

// Log connection details for debugging
console.log('Supabase URL valid:', isValidSupabaseUrl);
console.log('Supabase key valid:', isValidAnonKey);

export const supabase = (isValidSupabaseUrl && isValidAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      global: {
        fetch: (url, options = {}) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          return fetch(url, {
            ...options,
            signal: controller.signal
          }).finally(() => {
            clearTimeout(timeoutId);
          }).catch(error => {
            // Handle different error types
            if (error.name === 'AbortError' || error.name === 'TimeoutError') {
              console.warn('Supabase request timed out:', url);
              throw new Error('Request timeout - check your internet connection or Supabase service status');
            } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              console.warn('Supabase network error:', error.message);
              throw new Error('Network error - check your internet connection');
            } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
              console.warn('Supabase CORS error:', error.message);
              throw new Error('CORS error - check Supabase configuration');
            }
            throw error;
          });
        }
      }
    })
  : null;

// Log connection status for debugging
if (supabase) {
  console.log('Supabase client initialized with URL:', supabaseUrl?.substring(0, 20) + '...');
  
  // Test connection
  supabase.from('news').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.warn('Supabase connection test failed:', error.message);
      } else {
        console.log('Supabase connection test successful');
      }
    })
    .catch(error => {
      console.warn('Supabase connection test error:', error.message);
    });
} else {
  console.warn('Supabase client initialization failed. Running in offline mode with localStorage.');
}

// Database types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  imagecaption?: string;
  category?: string;
  youtubeurl?: string;
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
    imagecaption: 'لقاء الدكتور أحمد عبد الجبار العلواني مع الشيخ رعد عبد الجبار العلي سليمان في مقر إقامته بالرمادي'
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
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    imagecaption: 'توقيع العقد الجديد بين مجموعة العلواني والشركة العالمية'
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
    image: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg',
    imagecaption: 'إطلاق المشروع التنموي الجديد في الأنبار'
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
    image: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
    imagecaption: 'استلام جائزة أفضل شركة مساهمة في التنمية المستدامة'
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
    image: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg',
    imagecaption: 'إعلان مجموعة العلواني عن توسيع أعمالها في مجال الطاقة المتجددة'
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
    image: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg',
    imagecaption: 'دعم مجموعة العلواني لمبادرات التعليم في الأنبار'
  }
];

// Enhanced news service with better error handling and fallback
export const newsService = {
  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    try {
      console.log('Initializing sample news data...');

      // Then try to save to Supabase if available
      if (supabase) {
        console.log('Attempting to save sample data to Supabase...');
        for (const newsItem of sampleNewsData) {
          try {
            await this.upsertNews(newsItem);
            console.log(`Saved news item: ${newsItem.id} - ${newsItem.title}`);
          } catch (itemError) {
            console.error(`Failed to save news item ${newsItem.id}:`, itemError);
          }
        }
        console.log('Sample news data initialized in Supabase successfully');
      } else {
        console.log('Supabase not available, saving to localStorage only');
      }
      
      // Always save to localStorage as backup
      localStorage.setItem('website-news', JSON.stringify(sampleNewsData));
      console.log('Sample news data saved to localStorage');
    } catch (error) {
      console.error('Error initializing sample data:', error);
      // Ensure localStorage backup exists
      localStorage.setItem('website-news', JSON.stringify(sampleNewsData));
    }
  },

  // Get all news items with fallback
  async getAllNews(): Promise<NewsItem[]> {
    try {
      console.log('Fetching all news...');
      if (supabase) {
        try {
          console.log('Attempting to fetch from Supabase...');
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false });

          if (error) {
            console.warn('Supabase query error:', error.message);
            throw error;
          }

          if (data && data.length > 0) {
            console.log(`Fetched ${data.length} news items from Supabase`);
            // Save to localStorage as backup
            localStorage.setItem('website-news', JSON.stringify(data));
            return data;
          }

          console.log('No data found in Supabase, initializing sample data...');
          // If no data in Supabase, try to initialize with sample data
          await this.initializeSampleData();
          
          // Try fetching again
          const { data: refreshedData, error: refreshedError } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false });
            
          if (refreshedError) {
            console.warn('Supabase refresh query error:', refreshedError.message);
            throw refreshedError;
          }
          
          if (refreshedData && refreshedData.length > 0) {
            console.log(`Fetched ${refreshedData.length} news items after initialization`);
            localStorage.setItem('website-news', JSON.stringify(refreshedData));
            return refreshedData;
          }
        } catch (supabaseError) {
          console.error('Supabase fetch error:', supabaseError);
          throw supabaseError;
        }
      }

      // Fallback to localStorage
      console.log('Falling back to localStorage...');
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        console.log(`Loaded ${parsedNews.length} news items from localStorage`);
        return parsedNews;
      }

      console.log('No data in localStorage, using sample data');
      return sampleNewsData;
    } catch (error) {
      console.error('Error fetching news:', error);

      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        console.log(`Loaded ${parsedNews.length} news items from localStorage`);
        return parsedNews;
      }

      // Last resort: return sample data
      console.log('Using sample data as last resort');
      return sampleNewsData;
    }
  },

  // Get news by ID with fallback
  async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data;
        }
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
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false })
          .limit(limit);

        if (error) throw error;

        if (data && data.length > 0) {
          return data;
        }
      }

      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching latest news:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.slice(0, limit);
      }
      
      return sampleNewsData.slice(0, limit);
    }
  },

  // Get related news with fallback
  async getRelatedNews(excludeId: string, limit: number = 3): Promise<NewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .neq('id', excludeId)
          .order('date', { ascending: false })
          .limit(limit);

        if (error) throw error;

        if (data && data.length > 0) {
          return data;
        }
      }

      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews.filter(item => item.id !== excludeId).slice(0, limit);
    } catch (error) {
      console.error('Error fetching related news:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.filter((item: NewsItem) => item.id !== excludeId).slice(0, limit);
      }
      
      return sampleNewsData.filter(item => item.id !== excludeId).slice(0, limit);
    }
  },

  // Enhanced upsert with localStorage backup
  async upsertNews(newsItem: Omit<NewsItem, 'created_at' | 'updated_at'>): Promise<NewsItem> {
    try {
      console.log(`Upserting news item: ${newsItem.id} - ${newsItem.title}`);
      // Always save to localStorage first
      const savedNews = localStorage.getItem('website-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];

      // Update or add the news item
      const existingIndex = allNews.findIndex((item: NewsItem) => item.id === newsItem.id);
      const updatedItem = {
        ...newsItem,
        created_at: existingIndex >= 0 && allNews[existingIndex].created_at 
          ? allNews[existingIndex].created_at 
          : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        allNews[existingIndex] = { ...allNews[existingIndex], ...updatedItem };
      } else {
        allNews.unshift(updatedItem);
      }

      // Save to localStorage
      localStorage.setItem('website-news', JSON.stringify(allNews));
      console.log('News saved to localStorage successfully');

      // Try to save to Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from('news').upsert({
            id: updatedItem.id,
            title: updatedItem.title,
            content: updatedItem.content,
            date: updatedItem.date,
            author: updatedItem.author,
            image: updatedItem.image || null,
            imagecaption: updatedItem.imagecaption || null,
            category: updatedItem.category || null,
            youtubeurl: updatedItem.youtubeurl || null,
            content_html: updatedItem.content_html || null,
            created_at: updatedItem.created_at,
            updated_at: updatedItem.updated_at
          }).select().single();

        if (error) {
          console.warn('Supabase save failed, but localStorage backup successful:', error.message);
          // Return the locally updated item
          return updatedItem;
        }

        console.log('News saved to Supabase successfully');
        
        // Broadcast immediate update to all tabs and devices
        this.broadcastNewsUpdate();
        
        return data;
      }
      
      // Broadcast immediate update to all tabs and devices
      this.broadcastNewsUpdate();
      
      return updatedItem;
    } catch (error) {
      console.error('Error upserting news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`فشل في حفظ الخبر: ${errorMessage}`);
    }
  },

  // Enhanced delete with localStorage backup
  async deleteNews(id: string): Promise<void> {
    try {
      // Delete from localStorage first
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        try {
          const allNews = JSON.parse(savedNews);
          const filteredNews = allNews.filter((item: NewsItem) => item.id !== id);
          localStorage.setItem('website-news', JSON.stringify(filteredNews));
          console.log('News deleted from localStorage successfully');
        } catch (parseError) {
          console.error('Error parsing localStorage news:', parseError);
        }
      }

      // Try to delete from Supabase if available
      if (supabase) {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Supabase delete failed, but localStorage delete successful:', error.message);
        } else {
          console.log('News deleted from Supabase successfully');
        }
      }
      
      // Broadcast immediate update to all tabs and devices
      this.broadcastNewsUpdate();
    } catch (error) {
      console.error('Error deleting news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`فشل في حذف الخبر: ${errorMessage}`);
    }
  },

  // Enhanced broadcast function for immediate sync
  broadcastNewsUpdate(): void {
    try {
      // Broadcast to other tabs using BroadcastChannel
      const channel = new BroadcastChannel('news-updates');
      channel.postMessage({ 
        type: 'NEWS_UPDATED', 
        timestamp: Date.now(),
        source: 'admin-panel'
      });
      
      // Trigger storage event for cross-tab communication
      localStorage.setItem('news-update-trigger', Date.now().toString());
      
      // Also trigger a custom event for immediate UI updates
      window.dispatchEvent(new CustomEvent('newsUpdated', {
        detail: { timestamp: Date.now() }
      }));
      
      console.log('News update broadcasted successfully');
    } catch (error) {
      console.error('Error broadcasting news update:', error);
    }
  },

  // Upload image with fallback
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      console.log(`Uploading image: ${fileName}`);
      
      try {
        const { data, error } = await supabase.storage
          .from('news-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Storage upload error:', error.message);
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('news-images')
          .getPublicUrl(data.path);

        console.log(`Image uploaded successfully: ${publicUrl}`);
        return publicUrl;
      } catch (storageError) {
        console.error('Storage operation error:', storageError);
        throw storageError;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Fallback to local URL
      console.log('Falling back to local URL for image');
      return URL.createObjectURL(file);
    }
  },

  // Delete image
  async deleteImage(imagePath: string): Promise<void> {
    try {
      if (!supabase || !imagePath) return;
      
      const path = imagePath.split('/').pop();
      
      if (path) {
        const { error } = await supabase.storage
          .from('news-images')
          .remove([path]);

        if (error) {
          console.error('Error deleting image:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  },
  
  // Initialize realtime sync
  initializeRealtimeSync() {
    try {
      if (!supabase) {
        console.log('No Supabase client available for realtime sync');
        return { unsubscribe: () => console.log('No Supabase client available') };
      }
      
      try {
        console.log('Initializing realtime sync...');
        const subscription = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public',
            table: 'news'
          }, (payload) => {
            console.log('Realtime update received from Supabase:', payload);
            
            // Refresh data
            this.getAllNews().then(() => {
              // Broadcast to all tabs
              this.broadcastNewsUpdate();
            });
          })
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
          });
        
        console.log('Realtime sync initialized');
        
        return {
          unsubscribe: () => {
            subscription.unsubscribe();
            console.log('Realtime sync unsubscribed');
          }
        };
      } catch (channelError) {
        console.error('Error creating realtime channel:', channelError);
        return {
          unsubscribe: () => console.log('No active subscription to unsubscribe')
        }
      }
    } catch (error) {
      console.error('Error initializing realtime sync:', error);
      return {
        unsubscribe: () => console.log('No active subscription to unsubscribe')
      };
    }
  }
};