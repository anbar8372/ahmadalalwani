// This file now returns null for the supabase client
// The application will fall back to localStorage for all data storage

export const supabase = null;

console.log('Supabase client disabled - using localStorage only');