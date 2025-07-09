/*
  # Create Dr Ahmed News table and related functions

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
      - `tags` (text array, default empty array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `dr_ahmed_news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage news

  3. Functions
    - Create function to update updated_at timestamp
    - Create function to increment views count
*/

-- Create dr_ahmed_news table
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

-- Create basic indexes
CREATE INDEX IF NOT EXISTS dr_ahmed_news_date_idx ON public.dr_ahmed_news USING btree (date);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_status_idx ON public.dr_ahmed_news USING btree (status);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_featured_idx ON public.dr_ahmed_news USING btree (featured);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_category_idx ON public.dr_ahmed_news USING btree (category);

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
CREATE OR REPLACE FUNCTION update_dr_ahmed_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dr_ahmed_news_updated_at
  BEFORE UPDATE ON public.dr_ahmed_news
  FOR EACH ROW
  EXECUTE FUNCTION update_dr_ahmed_news_updated_at();

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_dr_ahmed_news_views(news_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.dr_ahmed_news
  SET views = views + 1
  WHERE id = news_id;
END;
$$ language 'plpgsql';

-- Create text search indexes
CREATE INDEX IF NOT EXISTS dr_ahmed_news_title_idx ON public.dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, title));
CREATE INDEX IF NOT EXISTS dr_ahmed_news_content_idx ON public.dr_ahmed_news USING gin (to_tsvector('arabic'::regconfig, content));