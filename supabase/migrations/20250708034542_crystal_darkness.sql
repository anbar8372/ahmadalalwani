/*
  # Create dr_ahmed_news table with optimized approach

  1. New Tables
    - `dr_ahmed_news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `content_html` (text, optional)
      - `summary` (text, optional)
      - `date` (date, required)
      - `author` (text, required)
      - `image` (text, optional)
      - `imagecaption` (text, optional)
      - `category` (text, optional)
      - `youtubeurl` (text, optional)
      - `media` (jsonb, default empty array)
      - `status` (text, default 'draft')
      - `views` (integer, default 0)
      - `featured` (boolean, default false)
      - `tags` (text[], default empty array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `dr_ahmed_news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage content

  3. Functions
    - Create function to update updated_at timestamp
    - Create function to increment views
*/

-- Create dr_ahmed_news table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'dr_ahmed_news') THEN
    CREATE TABLE public.dr_ahmed_news (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      content_html TEXT,
      summary TEXT,
      date DATE NOT NULL,
      author TEXT NOT NULL,
      image TEXT,
      imagecaption TEXT,
      category TEXT,
      youtubeurl TEXT,
      media JSONB DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT false,
      tags TEXT[] DEFAULT '{}'::text[],
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

-- Create date index
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'dr_ahmed_news_date_idx') THEN
    CREATE INDEX dr_ahmed_news_date_idx ON public.dr_ahmed_news USING btree (date);
  END IF;
END $$;

-- Create status index
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'dr_ahmed_news_status_idx') THEN
    CREATE INDEX dr_ahmed_news_status_idx ON public.dr_ahmed_news USING btree (status);
  END IF;
END $$;

-- Create featured index
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'dr_ahmed_news_featured_idx') THEN
    CREATE INDEX dr_ahmed_news_featured_idx ON public.dr_ahmed_news USING btree (featured);
  END IF;
END $$;

-- Create category index
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'dr_ahmed_news_category_idx') THEN
    CREATE INDEX dr_ahmed_news_category_idx ON public.dr_ahmed_news USING btree (category);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.dr_ahmed_news ENABLE ROW LEVEL SECURITY;

-- Create public read access policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON public.dr_ahmed_news
      FOR SELECT USING (true);
  END IF;
END $$;

-- Create insert policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to insert'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert" ON public.dr_ahmed_news
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create update policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to update'
  ) THEN
    CREATE POLICY "Allow authenticated users to update" ON public.dr_ahmed_news
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create delete policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'dr_ahmed_news' AND policyname = 'Allow authenticated users to delete'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete" ON public.dr_ahmed_news
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dr_ahmed_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_dr_ahmed_news_updated_at'
  ) THEN
    CREATE TRIGGER update_dr_ahmed_news_updated_at
      BEFORE UPDATE ON public.dr_ahmed_news
      FOR EACH ROW
      EXECUTE FUNCTION update_dr_ahmed_news_updated_at();
  END IF;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_dr_ahmed_news_views(news_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.dr_ahmed_news
  SET views = views + 1
  WHERE id = news_id;
END;
$$ language 'plpgsql';