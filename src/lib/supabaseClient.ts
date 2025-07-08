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
  supabase.from('dr_ahmed_news').select('id', { count: 'exact', head: true })
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