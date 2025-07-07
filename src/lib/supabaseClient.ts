import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    try {
      // First try to save to localStorage as backup
      localStorage.setItem('website-news', JSON.stringify(sampleNewsData));
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
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Save to localStorage as backup
          localStorage.setItem('website-news', JSON.stringify(data));
          return data;
        }
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
      // Always save to localStorage first
      const savedNews = localStorage.getItem('website-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];

      // Update or add the news item
      const existingIndex = allNews.findIndex((item: NewsItem) => item.id === newsItem.id);
      const updatedItem = {
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
      localStorage.setItem('website-news', JSON.stringify(allNews));
      console.log('News saved to localStorage successfully');

      // Try to save to Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .upsert(newsItem)
          .select()
          .single();

        if (error) {
          console.warn('Supabase save failed, but localStorage backup successful:', error);
        } else {
          console.log('News saved to Supabase successfully');
          return data;
        }
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
      // Delete from localStorage first
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: NewsItem) => item.id !== id);
        localStorage.setItem('website-news', JSON.stringify(filteredNews));
        console.log('News deleted from localStorage successfully');
      }

      // Try to delete from Supabase if available
      if (supabase) {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Supabase delete failed, but localStorage delete successful:', error);
        } else {
          console.log('News deleted from Supabase successfully');
        }
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('فشل في حذف الخبر');
    }
  },

  // Upload image with fallback
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      if (supabase) {
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
      } else {
        throw new Error('Supabase not available');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('فشل في رفع الصورة');
    }
  },

  // Delete image
  async deleteImage(imagePath: string): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase.storage
          .from('news-images')
          .remove([imagePath]);

        if (error) {
          console.error('Error deleting image:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};