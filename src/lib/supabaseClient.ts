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
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
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
    image: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg',
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
    image: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
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
    image: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg',
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
    image: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg',
    imageCaption: 'دعم مجموعة العلواني لمبادرات التعليم في الأنبار'
  }
];

// Enhanced news service with better error handling and fallback
export const newsService = {
  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    try {
      // Save to localStorage
      const timestamp = Date.now();
      localStorage.setItem('website-news', JSON.stringify(
        sampleNewsData.map(item => ({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      ));
      localStorage.setItem('website-news-last-updated', timestamp.toString());
      console.log('Sample news data saved to localStorage');
    } catch (error) {
      console.error('Error initializing sample data:', error);
      // Ensure localStorage backup exists
      localStorage.setItem('website-news', JSON.stringify(sampleNewsData));
    }
  },

  // Get all news items
  async getAllNews(): Promise<NewsItem[]> {
    try {
      // Get from localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        return JSON.parse(savedNews);
      }

      // If no data exists, initialize with sample data
      await this.initializeSampleData();
      return sampleNewsData;
    } catch (error) {
      console.error('Error fetching news:', error);
      return sampleNewsData;
    }
  },

  // Get news by ID
  async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      // Get from localStorage
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: NewsItem) => item.id === id) || null;
      }

      return null;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      return null;
    }
  },

  // Get latest news
  async getLatestNews(limit: number = 3): Promise<NewsItem[]> {
    try {
      const allNews = await this.getAllNews();
      return allNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return sampleNewsData.slice(0, limit);
    }
  },

  // Get related news
  async getRelatedNews(excludeId: string, limit: number = 3): Promise<NewsItem[]> {
    try {
      const allNews = await this.getAllNews();
      return allNews.filter(item => item.id !== excludeId).slice(0, limit);
    } catch (error) {
      console.error('Error fetching related news:', error);
      return sampleNewsData.filter(item => item.id !== excludeId).slice(0, limit);
    }
  },

  // Upsert news
  async upsertNews(newsItem: Omit<NewsItem, 'created_at' | 'updated_at'>): Promise<NewsItem> {
    try {
      // Get from localStorage
      const savedNews = localStorage.getItem('website-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];

      // Update or add the news item
      const existingIndex = allNews.findIndex((item: NewsItem) => item.id === newsItem.id);
      const updatedItem = {
        ...newsItem,
        created_at: existingIndex >= 0 ? allNews[existingIndex].created_at : new Date().toISOString(),
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
      
      return updatedItem;
    } catch (error) {
      console.error('Error upserting news:', error);
      throw new Error('فشل في حفظ الخبر');
    }
  },

  // Delete news
  async deleteNews(id: string): Promise<void> {
    try {
      // Delete from localStorage
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
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('فشل في حذف الخبر');
    }
  },

  // Broadcast news update
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

  // Mock upload image function
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      // Create a mock URL for the image
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('فشل في رفع الصورة');
    }
  },

  // Mock delete image function
  async deleteImage(imagePath: string): Promise<void> {
    try {
      console.log('Image deleted:', imagePath);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  },
  
  // Mock sync function
  async syncWithServer(): Promise<{success: boolean, message: string}> {
    try {
      // Simulate successful sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: `تمت المزامنة المحلية بنجاح.` 
      };
    } catch (error) {
      console.error('Error in sync:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'خطأ غير معروف أثناء المزامنة' 
      };
    }
  },
  
  // Mock check sync status function
  async checkSyncStatus() {
    try {
      // Simulate successful check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        connected: true,
        config: { interval: 5000, retry_attempts: 3 }
      };
    } catch (error) {
      console.error('Error checking sync status:', error);
      
      return {
        connected: true,
        error: null
      };
    }
  },
  
  // Mock initialize realtime sync function
  initializeRealtimeSync() {
    // Simulate successful initialization
    console.log('Local sync initialized');
    
    // Register sync status
    localStorage.setItem('realtime-sync-status', JSON.stringify({
      enabled: true,
      lastChecked: Date.now(),
      status: 'connected'
    }));
    
    return {
      unsubscribe: () => console.log('Local sync unsubscribed')
    };
  }
};