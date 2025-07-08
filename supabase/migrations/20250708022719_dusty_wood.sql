/*
  # Fix news table schema and ensure all required columns exist
  
  1. Tables
    - Ensure `news` table exists with all required columns
    - Handle existing columns with different casing
    
  2. Security
    - Enable RLS on `news` table
    - Recreate all policies for proper permissions
    
  3. Storage
    - Ensure `news-images` bucket exists
    - Set up storage policies
    
  4. Triggers
    - Create update trigger for updated_at column
*/

-- Make sure the news table exists with basic required columns
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Add missing columns with proper existence checks
DO $$ 
BEGIN
  -- Check and add imageCaption column (case-insensitive check)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'news' 
    AND LOWER(column_name) = 'imagecaption'
  ) THEN
    ALTER TABLE news ADD COLUMN imageCaption TEXT;
  END IF;

  -- Check and add category column (case-insensitive check)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'news' 
    AND LOWER(column_name) = 'category'
  ) THEN
    ALTER TABLE news ADD COLUMN category TEXT;
  END IF;

  -- Check and add youtubeUrl column (case-insensitive check)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'news' 
    AND LOWER(column_name) = 'youtubeurl'
  ) THEN
    ALTER TABLE news ADD COLUMN youtubeUrl TEXT;
  END IF;

  -- Check and add content_html column (case-insensitive check)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'news' 
    AND LOWER(column_name) = 'content_html'
  ) THEN
    ALTER TABLE news ADD COLUMN content_html TEXT;
  END IF;
END $$;

-- Handle existing policies safely
DO $$
BEGIN
  -- Drop existing policies if they exist (ignore errors if they don't exist)
  BEGIN
    DROP POLICY IF EXISTS "Allow public read access" ON news;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to insert" ON news;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to update" ON news;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to delete" ON news;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
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

-- Handle storage bucket creation safely
DO $$
BEGIN
  -- Create storage bucket for news images if it doesn't exist
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('news-images', 'news-images', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  -- If storage.buckets doesn't exist or other error, continue
  NULL;
END $$;

-- Handle storage policies safely
DO $$
BEGIN
  -- Drop existing storage policies if they exist
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors
  END;

  -- Create storage policies if storage.objects table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'objects' AND table_schema = 'storage') THEN
    CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

    CREATE POLICY "Allow public access to images" ON storage.objects
      FOR SELECT USING (bucket_id = 'news-images');

    CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
      FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- If storage schema doesn't exist, continue
  NULL;
END $$;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Handle trigger creation safely
DO $$
BEGIN
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS update_news_updated_at ON news;
  
  -- Create trigger to automatically update updated_at
  CREATE TRIGGER update_news_updated_at 
      BEFORE UPDATE ON news 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN OTHERS THEN
  -- If there's an error creating the trigger, continue
  NULL;
END $$;