/*
  # Fix news table columns and policies

  1. Changes
    - Add case-insensitive column checks to prevent "column already exists" errors
    - Ensure all required columns exist regardless of case
    - Recreate policies with proper error handling
    - Set up storage bucket and policies with error handling
    - Create update trigger for timestamp management

  2. Security
    - Maintain all existing RLS policies
    - Ensure proper authentication checks
*/

-- Make sure the news table exists with all required columns
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  imagecaption TEXT,
  category TEXT,
  youtubeurl TEXT,
  content_html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Ensure all columns exist (add if missing) with case-insensitive checks
DO $$ 
BEGIN
  -- Add category column if it doesn't exist (case-insensitive)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'news' 
    AND LOWER(column_name) = 'category'
  ) THEN
    ALTER TABLE news ADD COLUMN category TEXT;
  END IF;

  -- Add youtubeurl column if it doesn't exist (case-insensitive)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'news' 
    AND (LOWER(column_name) = 'youtubeurl' OR LOWER(column_name) = 'youtubeurl')
  ) THEN
    ALTER TABLE news ADD COLUMN youtubeurl TEXT;
  END IF;

  -- Add content_html column if it doesn't exist (case-insensitive)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'news' 
    AND LOWER(column_name) = 'content_html'
  ) THEN
    ALTER TABLE news ADD COLUMN content_html TEXT;
  END IF;

  -- Add imagecaption column if it doesn't exist (case-insensitive)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'news' 
    AND (LOWER(column_name) = 'imagecaption' OR LOWER(column_name) = 'imagecaption')
  ) THEN
    ALTER TABLE news ADD COLUMN imagecaption TEXT;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error adding columns: %', SQLERRM;
END $$;

-- Safely recreate policies with error handling
DO $$
BEGIN
  -- Drop existing policies if they exist
  BEGIN
    DROP POLICY IF EXISTS "Allow public read access" ON news;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping read policy: %', SQLERRM;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to insert" ON news;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping insert policy: %', SQLERRM;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to update" ON news;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping update policy: %', SQLERRM;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to delete" ON news;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping delete policy: %', SQLERRM;
  END;

  -- Create policies for news table
  BEGIN
    CREATE POLICY "Allow public read access" ON news
      FOR SELECT USING (true);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating read policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Allow authenticated users to insert" ON news
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating insert policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Allow authenticated users to update" ON news
      FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating update policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Allow authenticated users to delete" ON news
      FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating delete policy: %', SQLERRM;
  END;
END $$;

-- Create storage bucket for news images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('news-images', 'news-images', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage bucket: %', SQLERRM;
END $$;

-- Safely recreate storage policies
DO $$
BEGIN
  -- Drop existing storage policies if they exist
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping upload policy: %', SQLERRM;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping access policy: %', SQLERRM;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping delete policy: %', SQLERRM;
  END;

  -- Create storage policies
  BEGIN
    CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating upload policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Allow public access to images" ON storage.objects
      FOR SELECT USING (bucket_id = 'news-images');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating access policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
      FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating delete policy: %', SQLERRM;
  END;
END $$;

-- Create or replace function to update updated_at timestamp
DO $$
BEGIN
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ language 'plpgsql';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating update_updated_at_column function: %', SQLERRM;
END $$;

-- Drop the trigger if it exists and recreate it
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_news_updated_at ON news;
  
  CREATE TRIGGER update_news_updated_at 
      BEFORE UPDATE ON news 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating trigger: %', SQLERRM;
END $$;