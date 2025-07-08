/*
  # Create Dr. Ahmed News Table

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
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Indexes
    - Date index for chronological sorting
    - Status index for filtering by publication status
    - Featured index for quick access to featured news
    - Category index for category filtering
    - Full-text search indexes for title and content (Arabic language support)

  3. Security
    - Enable RLS on `dr_ahmed_news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage news

  4. Functions
    - Function to update the updated_at timestamp
    - Function to increment view count
*/

-- Create dr_ahmed_news table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.dr_ahmed_news (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS dr_ahmed_news_date_idx ON public.dr_ahmed_news USING btree (date);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_status_idx ON public.dr_ahmed_news USING btree (status);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_featured_idx ON public.dr_ahmed_news USING btree (featured);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_category_idx ON public.dr_ahmed_news USING btree (category);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_title_idx ON public.dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, title));
CREATE INDEX IF NOT EXISTS dr_ahmed_news_content_idx ON public.dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, content));

-- Enable Row Level Security
ALTER TABLE public.dr_ahmed_news ENABLE ROW LEVEL SECURITY;

-- Create policies for dr_ahmed_news table
CREATE POLICY "Allow public read access" ON public.dr_ahmed_news
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.dr_ahmed_news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.dr_ahmed_news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.dr_ahmed_news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_dr_ahmed_news_updated_at') THEN
    CREATE FUNCTION update_dr_ahmed_news_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

-- Create trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_dr_ahmed_news_updated_at'
  ) THEN
    CREATE TRIGGER update_dr_ahmed_news_updated_at
      BEFORE UPDATE ON public.dr_ahmed_news
      FOR EACH ROW
      EXECUTE FUNCTION update_dr_ahmed_news_updated_at();
  END IF;
END $$;

-- Create function to increment views
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_dr_ahmed_news_views') THEN
    CREATE FUNCTION increment_dr_ahmed_news_views(news_id uuid)
    RETURNS void AS $$
    BEGIN
      UPDATE public.dr_ahmed_news
      SET views = views + 1
      WHERE id = news_id;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;