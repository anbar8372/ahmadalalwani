// This file is intentionally empty to prevent any database connections
// All database functionality has been removed from the application

export const supabase = null;

// Empty placeholder for the news service to prevent errors
export const newsService = {
  getAllNews: () => Promise.resolve([]),
  getNewsById: () => Promise.resolve(null),
  getLatestNews: () => Promise.resolve([]),
  getRelatedNews: () => Promise.resolve([]),
  upsertNews: () => Promise.resolve({}),
  deleteNews: () => Promise.resolve(),
  broadcastNewsUpdate: () => {},
  uploadImage: () => Promise.resolve(''),
  deleteImage: () => Promise.resolve(),
  initializeSampleData: () => Promise.resolve(),
  initializeRealtimeSync: () => ({ unsubscribe: () => {} })
};

// Empty sample data
export const sampleNewsData = [];

// Empty NewsItem interface
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  imagecaption?: string;
}