/*
  # Fix news table structure

  1. Changes
    - Ensure all required columns exist
    - Fix column types and constraints
    - Add missing columns if needed

  2. Security
    - Ensure RLS policies are correctly set up
*/

-- Make sure the news table exists
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  imageCaption TEXT,
  category TEXT,
  youtubeUrl TEXT,
  content_html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security if not already enabled
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Ensure all columns exist (add if missing)
DO $$ 
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'category'
  ) THEN
    ALTER TABLE news ADD COLUMN category TEXT;
  END IF;

  -- Add youtubeUrl column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'youtubeUrl'
  ) THEN
    ALTER TABLE news ADD COLUMN youtubeUrl TEXT;
  END IF;

  -- Add content_html column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'content_html'
  ) THEN
    ALTER TABLE news ADD COLUMN content_html TEXT;
  END IF;

  -- Add imageCaption column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'imageCaption'
  ) THEN
    ALTER TABLE news ADD COLUMN imageCaption TEXT;
  END IF;
END $$;

-- Recreate policies to ensure they exist
-- First drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow public read access" ON news;
  DROP POLICY IF EXISTS "Allow authenticated users to insert" ON news;
  DROP POLICY IF EXISTS "Allow authenticated users to update" ON news;
  DROP POLICY IF EXISTS "Allow authenticated users to delete" ON news;
END $$;

-- Create policies for news table
CREATE POLICY "Allow public read access" ON news
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for news images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Recreate storage policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN
    -- Policies might not exist, so we can ignore errors
END $$;

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_news_updated_at'
  ) THEN
    CREATE TRIGGER update_news_updated_at 
      BEFORE UPDATE ON news 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Trigger might already exist
END $$;