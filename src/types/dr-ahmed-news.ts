import { supabase } from '@/lib/supabaseClient';

export interface DrAhmedNewsItem {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  summary?: string;
  date: string;
  author: string;
  image?: string;
  imagecaption?: string;
  category?: string;
  youtubeurl?: string;
  media?: MediaItem[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  featured: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  caption?: string;
  thumbnail?: string;
  size?: number;
  order: number;
}

// Default categories for Dr. Ahmed News
export const DEFAULT_CATEGORIES = [
  { id: 'political', name: 'سياسي', color: 'bg-red-100 text-red-800' },
  { id: 'economic', name: 'اقتصادي', color: 'bg-blue-100 text-blue-800' },
  { id: 'social', name: 'اجتماعي', color: 'bg-green-100 text-green-800' },
  { id: 'cultural', name: 'ثقافي', color: 'bg-purple-100 text-purple-800' },
  { id: 'educational', name: 'تعليمي', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'general', name: 'عام', color: 'bg-gray-100 text-gray-800' }
];

// Sample news data for fallback
export const SAMPLE_DR_AHMED_NEWS: DrAhmedNewsItem[] = [
  {
    id: '1',
    title: 'الدكتور أحمد العلواني يستقبل وفد المظلة العراقية الجامعة',
    content: 'استقبل الشيخ الدكتور أحمد العلواني، وفد المظلة العراقية الجامعة، في مقر إقامته بمدينة الرمادي. وناقش الجانبان عدد من الملفات التي تخص الشأن العراقي، في ظل ما تشهده المنطقة من متغيرات، كما تم التأكيد على حفظ أمن واستقرار العراق، وتعزيز التماسك الاجتماعي بين أبناء الشعب الواحد.',
    summary: 'لقاء مهم مع وفد المظلة العراقية الجامعة لمناقشة الشأن العراقي وتعزيز التماسك الاجتماعي',
    date: '2025-06-12',
    author: 'المكتب الإعلامي',
    image: 'https://images.pexels.com/photos/5325845/pexels-photo-5325845.jpeg',
    imagecaption: 'الدكتور أحمد العلواني خلال لقائه بوفد المظلة العراقية الجامعة',
    category: 'political',
    status: 'published',
    views: 245,
    featured: true,
    tags: ['لقاءات', 'المظلة العراقية', 'الرمادي'],
    created_at: '2025-06-12T10:30:00Z',
    updated_at: '2025-06-12T10:30:00Z'
  },
  {
    id: '2',
    title: 'الدكتور أحمد العلواني يشارك في مؤتمر التنمية الاقتصادية',
    content: 'شارك الدكتور أحمد العلواني في مؤتمر التنمية الاقتصادية الذي أقيم في بغداد، حيث قدم ورقة بحثية حول آفاق التنمية الاقتصادية في العراق. وأكد العلواني خلال المؤتمر على ضرورة تنويع مصادر الدخل وعدم الاعتماد الكلي على النفط، مشيراً إلى أهمية دعم القطاع الخاص وتشجيع الاستثمار.',
    date: '2025-06-05',
    author: 'المكتب الإعلامي',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    category: 'economic',
    status: 'published',
    views: 187,
    featured: false,
    tags: ['اقتصاد', 'تنمية', 'مؤتمرات'],
    created_at: '2025-06-05T14:20:00Z',
    updated_at: '2025-06-05T14:20:00Z'
  },
  {
    id: '3',
    title: 'الدكتور أحمد العلواني يفتتح مدرسة جديدة في الأنبار',
    content: 'افتتح الدكتور أحمد العلواني مدرسة جديدة في محافظة الأنبار، ضمن مبادرته لدعم التعليم في المناطق المتضررة. وأكد العلواني خلال حفل الافتتاح على أهمية التعليم في بناء جيل واعٍ قادر على النهوض بالبلاد، مشدداً على ضرورة توفير بيئة تعليمية مناسبة للطلاب.',
    date: '2025-05-28',
    author: 'المكتب الإعلامي',
    image: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg',
    imagecaption: 'الدكتور أحمد العلواني خلال افتتاح المدرسة الجديدة',
    category: 'educational',
    status: 'published',
    views: 156,
    featured: false,
    tags: ['تعليم', 'الأنبار', 'مدارس'],
    created_at: '2025-05-28T09:15:00Z',
    updated_at: '2025-05-28T09:15:00Z'
  }
];

// Dr. Ahmed News Service
export const drAhmedNewsService = {
  // Get all news
  async getAllNews(): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('dr_ahmed_news')
            .select('*')
            .order('date', { ascending: false });

          if (error) {
            console.warn('Supabase query error:', error.message);
            throw error;
          }
          
          if (data && data.length > 0) {
            // Save to localStorage as backup
            localStorage.setItem('dr-ahmed-news', JSON.stringify(data));
            return data;
          }
          
          // If no data in Supabase, initialize with sample data
          await this.initializeSampleData();
          
          // Try fetching again
          const { data: refreshedData, error: refreshedError } = await supabase
            .from('dr_ahmed_news')
            .select('*')
            .order('date', { ascending: false });
            
          if (refreshedError) {
            console.warn('Supabase refresh query error:', refreshedError.message);
            throw refreshedError;
          }
          
          if (refreshedData && refreshedData.length > 0) {
            localStorage.setItem('dr-ahmed-news', JSON.stringify(refreshedData));
            return refreshedData;
          }
        } catch (supabaseError) {
          console.warn('Supabase connection failed, falling back to localStorage:', supabaseError);
          // Don't throw here, fall through to localStorage fallback
        }
      }
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        console.log('Using localStorage fallback data');
        return JSON.parse(savedNews);
      }
      
      // Initialize with sample data if no data exists
      console.log('No data found, initializing with sample data');
      localStorage.setItem('dr-ahmed-news', JSON.stringify(SAMPLE_DR_AHMED_NEWS));
      return SAMPLE_DR_AHMED_NEWS;
    } catch (error) {
      console.error('Error fetching Dr. Ahmed news:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        console.log('Error occurred, using localStorage fallback data');
        return JSON.parse(savedNews);
      }
      
      // Initialize with sample data if no data exists
      console.log('Error occurred and no localStorage data, initializing with sample data');
      localStorage.setItem('dr-ahmed-news', JSON.stringify(SAMPLE_DR_AHMED_NEWS));
      return SAMPLE_DR_AHMED_NEWS;
    }
  },

  // Get news by ID
  async getNewsById(id: string): Promise<DrAhmedNewsItem | null> {
    try {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('dr_ahmed_news')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.warn('Supabase query error for news by ID:', error.message);
            throw error;
          }
          return data;
        } catch (supabaseError) {
          console.warn('Supabase connection failed for getNewsById, falling back to localStorage:', supabaseError);
          // Don't throw here, fall through to localStorage fallback
        }
      }
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: DrAhmedNewsItem) => item.id === id) || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching Dr. Ahmed news by ID:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: DrAhmedNewsItem) => item.id === id) || null;
      }
      
      return null;
    }
  },

  // Get latest news
  async getLatestNews(limit: number = 3): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('dr_ahmed_news')
            .select('*')
            .eq('status', 'published')
            .order('date', { ascending: false })
            .limit(limit);

          if (error) {
            console.warn('Supabase query error for latest news:', error.message);
            throw error;
          }
          return data || [];
        } catch (supabaseError) {
          console.warn('Supabase connection failed for getLatestNews, falling back to getAllNews:', supabaseError);
          // Don't throw here, fall through to getAllNews fallback
        }
      }
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews
        .filter(item => item.status === 'published')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching latest Dr. Ahmed news:', error);
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews
        .filter(item => item.status === 'published')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  },

  // Get featured news
  async getFeaturedNews(limit: number = 1): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('dr_ahmed_news')
            .select('*')
            .eq('status', 'published')
            .eq('featured', true)
            .order('date', { ascending: false })
            .limit(limit);

          if (error) {
            console.warn('Supabase query error for featured news:', error.message);
            throw error;
          }
          return data || [];
        } catch (supabaseError) {
          console.warn('Supabase connection failed for getFeaturedNews, falling back to getAllNews:', supabaseError);
          // Don't throw here, fall through to getAllNews fallback
        }
      }
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews
        .filter(item => item.status === 'published' && item.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured Dr. Ahmed news:', error);
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      return allNews
        .filter(item => item.status === 'published' && item.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  },

  // Get related news
  async getRelatedNews(excludeId: string, categoryId?: string, limit: number = 3): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        try {
          let query = supabase
            .from('dr_ahmed_news')
            .select('*')
            .eq('status', 'published')
            .neq('id', excludeId)
            .order('date', { ascending: false })
            .limit(limit);
            
          if (categoryId) {
            query = query.eq('category', categoryId);
          }
          
          const { data, error } = await query;

          if (error) {
            console.warn('Supabase query error for related news:', error.message);
            throw error;
          }
          return data || [];
        } catch (supabaseError) {
          console.warn('Supabase connection failed for getRelatedNews, falling back to getAllNews:', supabaseError);
          // Don't throw here, fall through to getAllNews fallback
        }
      }
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      let filtered = allNews
        .filter(item => item.status === 'published' && item.id !== excludeId);
      
      if (categoryId) {
        filtered = filtered.filter(item => item.category === categoryId);
      }
      
      return filtered
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching related Dr. Ahmed news:', error);
      
      // Fallback to getAllNews
      const allNews = await this.getAllNews();
      let filtered = allNews
        .filter(item => item.status === 'published' && item.id !== excludeId);
      
      if (categoryId) {
        filtered = filtered.filter(item => item.category === categoryId);
      }
      
      return filtered
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  },

  // Create or update news
  async upsertNews(newsItem: DrAhmedNewsItem): Promise<DrAhmedNewsItem> {
    try {
      const now = new Date().toISOString();
      const updatedItem = {
        ...newsItem,
        updated_at: now
      };
      
      if (!updatedItem.created_at) {
        updatedItem.created_at = now;
      }
      
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('dr_ahmed_news')
            .upsert(updatedItem)
            .select()
            .single();

          if (error) {
            console.warn('Supabase upsert error:', error.message);
            throw error;
          }
          
          // Update localStorage as backup
          const savedNews = localStorage.getItem('dr-ahmed-news');
          if (savedNews) {
            const allNews = JSON.parse(savedNews);
            const existingIndex = allNews.findIndex((item: DrAhmedNewsItem) => item.id === updatedItem.id);
            
            if (existingIndex >= 0) {
              allNews[existingIndex] = data;
            } else {
              allNews.unshift(data);
            }
            
            localStorage.setItem('dr-ahmed-news', JSON.stringify(allNews));
          }
          
          // Broadcast update
          this.broadcastNewsUpdate();
          
          return data;
        } catch (supabaseError) {
          console.warn('Supabase connection failed for upsertNews, falling back to localStorage:', supabaseError);
          // Don't throw here, fall through to localStorage fallback
        }
      }
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];
      
      const existingIndex = allNews.findIndex((item: DrAhmedNewsItem) => item.id === updatedItem.id);
      
      if (existingIndex >= 0) {
        allNews[existingIndex] = updatedItem;
      } else {
        allNews.unshift(updatedItem);
      }
      
      localStorage.setItem('dr-ahmed-news', JSON.stringify(allNews));
      
      // Broadcast update
      this.broadcastNewsUpdate();
      
      return updatedItem;
    } catch (error) {
      console.error('Error upserting Dr. Ahmed news:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];
      
      const now = new Date().toISOString();
      const updatedItem = {
        ...newsItem,
        updated_at: now
      };
      
      if (!updatedItem.created_at) {
        updatedItem.created_at = now;
      }
      
      const existingIndex = allNews.findIndex((item: DrAhmedNewsItem) => item.id === updatedItem.id);
      
      if (existingIndex >= 0) {
        allNews[existingIndex] = updatedItem;
      } else {
        allNews.unshift(updatedItem);
      }
      
      localStorage.setItem('dr-ahmed-news', JSON.stringify(allNews));
      
      // Broadcast update
      this.broadcastNewsUpdate();
      
      return updatedItem;
    }
  },

  // Delete news
  async deleteNews(id: string): Promise<void> {
    try {
      if (supabase) {
        try {
          const { error } = await supabase
            .from('dr_ahmed_news')
            .delete()
            .eq('id', id);

          if (error) {
            console.warn('Supabase delete error:', error.message);
            throw error;
          }
        } catch (supabaseError) {
          console.warn('Supabase connection failed for deleteNews, proceeding with localStorage only:', supabaseError);
          // Don't throw here, still delete from localStorage
        }
      }
      
      // Also delete from localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: DrAhmedNewsItem) => item.id !== id);
        localStorage.setItem('dr-ahmed-news', JSON.stringify(filteredNews));
      }
      
      // Broadcast update
      this.broadcastNewsUpdate();
    } catch (error) {
      console.error('Error deleting Dr. Ahmed news:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: DrAhmedNewsItem) => item.id !== id);
        localStorage.setItem('dr-ahmed-news', JSON.stringify(filteredNews));
      }
      
      // Broadcast update
      this.broadcastNewsUpdate();
    }
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    try {
      if (supabase) {
        try {
          await supabase.rpc('increment_dr_ahmed_news_views', { news_id: id });
        } catch (supabaseError) {
          console.warn('Supabase connection failed for incrementViews, updating localStorage only:', supabaseError);
          // Don't throw here, still update localStorage
        }
      }
      
      // Also update localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const updatedNews = allNews.map((item: DrAhmedNewsItem) => {
          if (item.id === id) {
            return {
              ...item,
              views: (item.views || 0) + 1
            };
          }
          return item;
        });
        
        localStorage.setItem('dr-ahmed-news', JSON.stringify(updatedNews));
      }
    } catch (error) {
      console.error('Error incrementing Dr. Ahmed news views:', error);
      
      // Fallback to localStorage
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const updatedNews = allNews.map((item: DrAhmedNewsItem) => {
          if (item.id === id) {
            return {
              ...item,
              views: (item.views || 0) + 1
            };
          }
          return item;
        });
        
        localStorage.setItem('dr-ahmed-news', JSON.stringify(updatedNews));
      }
    }
  },

  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    try {
      if (supabase) {
        try {
          for (const newsItem of SAMPLE_DR_AHMED_NEWS) {
            const { error } = await supabase
              .from('dr_ahmed_news')
              .upsert(newsItem);
              
            if (error) {
              console.error('Error inserting sample data:', error);
            }
          }
        } catch (supabaseError) {
          console.warn('Supabase connection failed for initializeSampleData, using localStorage only:', supabaseError);
          // Don't throw here, still save to localStorage
        }
      }
      
      // Also save to localStorage
      localStorage.setItem('dr-ahmed-news', JSON.stringify(SAMPLE_DR_AHMED_NEWS));
      
      // Broadcast update
      this.broadcastNewsUpdate();
    } catch (error) {
      console.error('Error initializing sample data:', error);
      
      // Fallback to localStorage
      localStorage.setItem('dr-ahmed-news', JSON.stringify(SAMPLE_DR_AHMED_NEWS));
      
      // Broadcast update
      this.broadcastNewsUpdate();
    }
  },

  // Broadcast news update
  broadcastNewsUpdate(): void {
    // Broadcast to other tabs using BroadcastChannel
    const channel = new BroadcastChannel('dr-ahmed-news-updates');
    channel.postMessage({ 
      type: 'DR_AHMED_NEWS_UPDATED', 
      timestamp: Date.now()
    });
    
    // Trigger storage event for cross-tab communication
    localStorage.setItem('dr-ahmed-news-update-trigger', Date.now().toString());
    
    // Also trigger a custom event for immediate UI updates
    window.dispatchEvent(new CustomEvent('drAhmedNewsUpdated', {
      detail: { timestamp: Date.now() }
    }));
  },

  // Initialize realtime sync
  initializeRealtimeSync() {
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
          table: 'dr_ahmed_news'
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
  }
};