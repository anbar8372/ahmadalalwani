-- Drop dr_ahmed_news table if it exists
DROP TABLE IF EXISTS public.dr_ahmed_news;

-- Drop news table if it exists
DROP TABLE IF EXISTS public.news;

-- Drop related functions
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_dr_ahmed_news_updated_at();
DROP FUNCTION IF EXISTS public.increment_dr_ahmed_news_views(news_id uuid);

-- Remove storage buckets related to news
DELETE FROM storage.buckets WHERE id = 'news-images';