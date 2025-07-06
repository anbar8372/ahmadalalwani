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
  created_at?: string;
  updated_at?: string;
}

// Enhanced sample news data with 6 news items
export const sampleNewsData: Omit<NewsItem, 'created_at' | 'updated_at'>[] = [
  {
    id: '1',
    title: 'لقاء الدكتور أحمد العلواني مع الشيخ رعد عبد الجبار العلي سليمان',
    content: `الشيخ الدكتور أحمد العلواني، يستقبل الشيخ رعد عبد الجبار العلي سليمان، في مقر إقامته بمدينة الرمادي؛ لمناقشة عدد من المواضيع التي تهم محافظة الأنبار ..

المكتب الإعلامي 
للشيخ الدكتور أحمد العلواني 
15 حزيران 2025`,
    date: '2025-06-15',
    author: 'المكتب الإعلامي',
    image: 'https://d.top4top.io/p_3473n86931.jpg',
    imageCaption: 'لقاء الدكتور أحمد العلواني مع الشيخ رعد عبد الجبار العلي سليمان في مقر إقامته بالرمادي'
  },
  {
    id: '2',
    title: 'الدكتور أحمد العلواني يدعو لإصلاحات اقتصادية شاملة',
    content: `أكد الدكتور أحمد العلواني، النائب السابق في البرلمان العراقي ورئيس اللجنة الاقتصادية السابق، على ضرورة تطبيق إصلاحات اقتصادية شاملة في العراق لمواجهة التحديات الاقتصادية الراهنة.

وقال العلواني في تصريح صحفي: "إن العراق بحاجة ماسة إلى خطة اقتصادية متكاملة تهدف إلى تنويع مصادر الدخل وتقليل الاعتماد على النفط، وتطوير القطاعات الإنتاجية الأخرى".

وأضاف: "خلال فترة رئاستي للجنة الاقتصادية في البرلمان العراقي، عملنا على وضع استراتيجيات طويلة المدى لتحسين الوضع الاقتصادي، ولا يزال هناك الكثير من العمل المطلوب لتحقيق الازدهار الاقتصادي المنشود".

ودعا العلواني إلى ضرورة محاربة الفساد وتطوير البنية التحتية وجذب الاستثمارات الأجنبية كخطوات أساسية نحو التنمية الاقتصادية المستدامة.`,
    date: '2024-12-15',
    author: 'الدكتور أحمد العلواني',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    imageCaption: 'الدكتور أحمد العلواني خلال مؤتمر صحفي حول الإصلاحات الاقتصادية'
  },
  {
    id: '3',
    title: 'العلواني يؤكد على أهمية التعليم العالي في بناء العراق الجديد',
    content: `شدد الدكتور أحمد العلواني، الحاصل على الدكتوراه في علوم الأرض من جامعة بغداد، على الدور المحوري للتعليم العالي والبحث العلمي في بناء عراق قوي ومزدهر.

وأوضح العلواني أن "التعليم هو الأساس الذي يقوم عليه تقدم الأمم، وأن الاستثمار في التعليم العالي والبحث العلمي يجب أن يكون من أولويات الحكومة العراقية".

وتابع: "من خلال تجربتي الأكاديمية في جامعة بغداد، أدركت أهمية ربط التعليم النظري بالتطبيق العملي، وضرورة تطوير المناهج لتواكب التطورات العلمية والتكنولوجية الحديثة".

ودعا العلواني إلى زيادة الميزانيات المخصصة للجامعات العراقية وتطوير المختبرات العلمية وتشجيع البحوث التطبيقية التي تخدم التنمية الوطنية.

كما أكد على ضرورة إعادة النظر في سياسات التعليم العالي لضمان إعداد كوادر مؤهلة قادرة على قيادة عملية التنمية في مختلف القطاعات.`,
    date: '2024-12-10',
    author: 'الدكتور أحمد العلواني',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    imageCaption: 'جامعة بغداد حيث حصل الدكتور العلواني على درجة الدكتوراه في علوم الأرض'
  },
  {
    id: '4',
    title: 'ذكرى خدمة الشعب: العلواني يستذكر إنجازاته البرلمانية',
    content: `في ذكرى انتهاء فترته البرلمانية، استذكر الدكتور أحمد العلواني أبرز الإنجازات التي حققها خلال فترة خدمته كنائب في البرلمان العراقي من 2005 إلى 2014.

وقال العلواني: "كانت فترة عملي في البرلمان العراقي فترة مليئة بالتحديات والإنجازات، حيث عملت بكل جهدي لخدمة الشعب العراقي والدفاع عن حقوقه المشروعة".

وأضاف: "خلال رئاستي للجنة الاقتصادية، تمكنا من وضع عدة قوانين مهمة تهدف إلى تطوير الاقتصاد العراقي وتحسين الأوضاع المعيشية للمواطنين، كما عملنا على مراقبة الأداء الحكومي ومحاسبة المقصرين".

وتابع: "لقد كان شرفاً لي أن أمثل محافظة الأنبار الحبيبة في البرلمان، وأن أكون صوتاً للمواطنين في المحافل الرسمية، وسأبقى دائماً في خدمة شعبي ووطني".

وأكد العلواني أن تجربته البرلمانية علمته أهمية العمل الجماعي والحوار البناء في حل المشاكل وتحقيق التقدم للوطن.`,
    date: '2024-12-05',
    author: 'الدكتور أحمد العلواني',
    image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg',
    imageCaption: 'مبنى البرلمان العراقي حيث خدم الدكتور العلواني لدورتين متتاليتين'
  },
  {
    id: '5',
    title: 'العلواني يدعو لتعزيز الوحدة الوطنية في العراق',
    content: `دعا الدكتور أحمد العلواني إلى ضرورة تعزيز الوحدة الوطنية بين جميع مكونات الشعب العراقي، مؤكداً أن التنوع الثقافي والديني في العراق يجب أن يكون مصدر قوة وليس انقسام.

وقال العلواني في كلمة له: "العراق بلد متنوع ثقافياً ودينياً، وهذا التنوع هو ثروة حقيقية يجب أن نحافظ عليها ونستثمرها لبناء وطن قوي وموحد".

وأضاف: "من خلال تجربتي في العمل السياسي، تعلمت أن الحوار والتفاهم هما السبيل الوحيد لحل الخلافات وبناء مستقبل أفضل لجميع العراقيين".

ودعا العلواني جميع القوى السياسية إلى تغليب المصلحة الوطنية على المصالح الضيقة، والعمل معاً من أجل بناء عراق ديمقراطي يسع الجميع.

وشدد على أهمية دور الشباب في بناء المستقبل، مؤكداً ضرورة إشراكهم في عملية صنع القرار وتوفير الفرص المناسبة لهم للمساهمة في التنمية.`,
    date: '2024-11-28',
    author: 'الدكتور أحمد العلواني',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    imageCaption: 'الدكتور أحمد العلواني يدعو لتعزيز الوحدة الوطنية'
  },
  {
    id: '6',
    title: 'العلواني يطالب بتطوير الخدمات في محافظة الأنبار',
    content: `طالب الدكتور أحمد العلواني بضرورة تطوير الخدمات الأساسية في محافظة الأنبار، مؤكداً أن المحافظة تستحق اهتماماً أكبر من الحكومة الاتحادية.

وقال العلواني: "محافظة الأنبار تعاني من نقص في الخدمات الأساسية مثل الكهرباء والماء والصحة والتعليم، وهذا أمر غير مقبول في محافظة بهذا الحجم والأهمية".

وأضاف: "خلال فترة عملي في البرلمان، عملت جاهداً لتخصيص ميزانيات أكبر لتطوير البنية التحتية في الأنبار، ولا يزال هناك الكثير من العمل المطلوب".

ودعا العلواني الحكومة الاتحادية إلى وضع خطة شاملة لتطوير المحافظة، تشمل إعادة إعمار المناطق المتضررة وتطوير القطاعات الاقتصادية المختلفة.

وأكد على أهمية الاستثمار في التعليم والصحة في المحافظة، مشيراً إلى أن تطوير هذين القطاعين سيساهم في بناء جيل قادر على قيادة التنمية في المستقبل.

كما دعا إلى تشجيع الاستثمار الخاص في المحافظة وتوفير البيئة المناسبة للمشاريع التنموية.`,
    date: '2024-11-20',
    author: 'الدكتور أحمد العلواني',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    imageCaption: 'مشاهد من محافظة الأنبار التي يدعو العلواني لتطوير خدماتها'
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