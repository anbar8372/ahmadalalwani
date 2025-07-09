/*
  # Disable database connections
  
  1. Purpose
    - This migration safely disables database connections by removing tables and functions
    - Prevents errors from missing tables in the application
  
  2. Changes
    - Drops dr_ahmed_news table if it exists
    - Drops news table if it exists
    - Drops related functions for updating timestamps and incrementing views
    - Removes storage buckets related to news
*/

-- Drop functions first to avoid dependency issues
DROP FUNCTION IF EXISTS public.increment_dr_ahmed_news_views;
DROP FUNCTION IF EXISTS public.update_dr_ahmed_news_updated_at;
DROP FUNCTION IF EXISTS public.update_updated_at_column;

-- Drop tables
DROP TABLE IF EXISTS public.dr_ahmed_news;
DROP TABLE IF EXISTS public.news;

-- Remove storage buckets related to news
DELETE FROM storage.buckets WHERE id = 'news-images';