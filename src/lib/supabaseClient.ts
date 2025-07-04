import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Sample news data for initial setup
export const sampleNewsData: Omit<NewsItem, 'created_at' | 'updated_at'>[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
  }
];

// News service functions
export const newsService = {
  // Initialize sample data (call this once to populate the database)
  async initializeSampleData(): Promise<void> {
    try {
      for (const newsItem of sampleNewsData) {
        await this.upsertNews(newsItem);
      }
      console.log('Sample news data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  },

  // Get all news items
  async getAllNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
    
    return data || [];
  },

  // Get news by ID
  async getNewsById(id: string): Promise<NewsItem | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching news by ID:', error);
      return null;
    }
    
    return data;
  },

  // Get latest news (limited)
  async getLatestNews(limit: number = 3): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching latest news:', error);
      throw error;
    }
    
    return data || [];
  },

  // Get related news (excluding current news)
  async getRelatedNews(excludeId: string, limit: number = 3): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .neq('id', excludeId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching related news:', error);
      throw error;
    }
    
    return data || [];
  },

  // Create or update news
  async upsertNews(newsItem: Omit<NewsItem, 'created_at' | 'updated_at'>): Promise<NewsItem> {
    const { data, error } = await supabase
      .from('news')
      .upsert(newsItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting news:', error);
      throw error;
    }
    
    return data;
  },

  // Delete news
  async deleteNews(id: string): Promise<void> {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('news-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  // Delete image from Supabase Storage
  async deleteImage(imagePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('news-images')
      .remove([imagePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};