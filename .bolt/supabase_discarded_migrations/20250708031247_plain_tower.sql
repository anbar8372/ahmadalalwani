/*
  # Remove database components

  1. Cleanup
    - Drop dr_ahmed_news table
    - Drop news table
    - Remove related policies, triggers, and functions

  This migration safely removes all database tables and components related to news functionality.
*/

-- Use a transaction to ensure all operations succeed or fail together
BEGIN;

-- Drop dr_ahmed_news table if it exists
DROP TABLE IF EXISTS public.dr_ahmed_news CASCADE;

-- Drop news table if it exists
DROP TABLE IF EXISTS public.news CASCADE;

-- Drop related functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_dr_ahmed_news_updated_at() CASCADE;
DROP FUNCTION IF EXISTS increment_dr_ahmed_news_views(news_id uuid) CASCADE;

-- Remove storage buckets related to news
DELETE FROM storage.buckets WHERE id = 'news-images';

-- Commit the transaction
COMMIT;