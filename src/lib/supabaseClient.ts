import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqemddqbmuiuyexeuuta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZW1kZHFibXVpdXlleGV1dXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTgyODMsImV4cCI6MjA2NzU3NDI4M30.JGbkfi6z8OuwDiXP6_e5h1D7_NfNeHlpg2U5QJtyxUI';

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
  console.log('Using hardcoded credentials for development');
} else {
  console.warn('Supabase client initialization failed. Check your environment variables.');
}