/*
  # Create dr_ahmed_news table and related functionality

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
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `dr_ahmed_news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage news

  3. Performance
    - Create indexes for common query patterns
    - Add function for incrementing view counts
*/

-- Create dr_ahmed_news table
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

-- Create policies for dr_ahmed_news table
CREATE POLICY "Allow public read access" ON dr_ahmed_news
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to insert" ON dr_ahmed_news
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated users to update" ON dr_ahmed_news
  FOR UPDATE 
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated users to delete" ON dr_ahmed_news
  FOR DELETE 
  USING (auth.role() = 'authenticated'::text);

-- Create indexes for better performance
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

-- Create trigger to automatically update updated_at
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