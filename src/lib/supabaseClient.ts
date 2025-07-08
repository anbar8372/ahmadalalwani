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
      }
    })
  : null;

// Log connection status for debugging
if (supabase) {
  console.log('Supabase client initialized with URL:', supabaseUrl?.substring(0, 20) + '...');
} else {
  console.warn('Supabase client initialization failed. Check your environment variables.');
}