/*
  # Remove previous tables and functions

  1. Changes
    - Remove dr_ahmed_news table
    - Remove news table
    - Remove related functions
    - Remove storage buckets
*/

-- Drop functions first (dependencies)
DROP FUNCTION IF EXISTS public.increment_dr_ahmed_news_views(uuid);
DROP FUNCTION IF EXISTS public.update_dr_ahmed_news_updated_at();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Drop tables
DROP TABLE IF EXISTS public.dr_ahmed_news;
DROP TABLE IF EXISTS public.news;

-- Remove storage buckets related to news
DELETE FROM storage.buckets WHERE id = 'news-images';