/*
  # Fix dr_ahmed_news table and policies

  1. New Tables
    - Ensures `dr_ahmed_news` table exists with all required columns
    
  2. Security
    - Conditionally creates policies only if they don't already exist
    - Ensures RLS is enabled
    
  3. Performance
    - Adds indexes for better query performance
    - Adds functions for automatic timestamp updates and view counting
*/

-- Create dr_ahmed_news table if it doesn't exist
CREATE TABLE IF NOT EXISTS dr_ahmed_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  content_html text,
  summary text,
  date date NOT NULL,
  author text NOT NULL,
  image text,
  imagecaption text,
  category text,
  youtubeurl text,
  media jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft'::text NOT NULL,
  views integer DEFAULT 0,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE dr_ahmed_news ENABLE ROW LEVEL SECURITY;

-- Create policies for dr_ahmed_news table only if they don't exist
DO $$
BEGIN
  -- Check if "Allow public read access" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON dr_ahmed_news
      FOR SELECT 
      USING (true);
  END IF;
  
  -- Check if "Allow authenticated users to insert" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to insert'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert" ON dr_ahmed_news
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated'::text);
  END IF;
  
  -- Check if "Allow authenticated users to update" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to update'
  ) THEN
    CREATE POLICY "Allow authenticated users to update" ON dr_ahmed_news
      FOR UPDATE 
      USING (auth.role() = 'authenticated'::text);
  END IF;
  
  -- Check if "Allow authenticated users to delete" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to delete'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete" ON dr_ahmed_news
      FOR DELETE 
      USING (auth.role() = 'authenticated'::text);
  END IF;
END
$$;

-- Create indexes for better performance (IF NOT EXISTS is part of the CREATE INDEX syntax)
CREATE INDEX IF NOT EXISTS dr_ahmed_news_date_idx ON dr_ahmed_news USING btree (date);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_status_idx ON dr_ahmed_news USING btree (status);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_featured_idx ON dr_ahmed_news USING btree (featured);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_category_idx ON dr_ahmed_news USING btree (category);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_title_idx ON dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, title));
CREATE INDEX IF NOT EXISTS dr_ahmed_news_content_idx ON dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, content));

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dr_ahmed_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists and create it again
DROP TRIGGER IF EXISTS update_dr_ahmed_news_updated_at ON dr_ahmed_news;
CREATE TRIGGER update_dr_ahmed_news_updated_at 
    BEFORE UPDATE ON dr_ahmed_news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_dr_ahmed_news_updated_at();

-- Create function to increment view counts
CREATE OR REPLACE FUNCTION increment_dr_ahmed_news_views(news_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dr_ahmed_news
  SET views = views + 1
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;