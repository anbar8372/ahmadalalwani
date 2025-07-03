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

// News service functions
export const newsService = {
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