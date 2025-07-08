# Database Migration Instructions

The application is failing because the `dr_ahmed_news` table doesn't exist in your Supabase database. You need to manually apply the migration.

## Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `zqemddqbmuiuyexeuuta`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Execute the Migration**
   - Copy the entire contents of `supabase/migrations/20250708040435_restless_base.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

## What the Migration Creates:

- `dr_ahmed_news` table with all required columns
- Row Level Security (RLS) policies
- Automatic timestamp update triggers
- View counter function

## After Running the Migration:

The news management system should work properly, and you'll be able to:
- Load existing news
- Add new news items
- Upload images
- Initialize sample data

## Migration SQL to Execute:

```sql
/*
  # Create dr_ahmed_news table and related functions

  1. New Tables
    - `dr_ahmed_news` - Table for storing news articles specific to Dr. Ahmed
      - Basic fields: id, title, content, date, author
      - Extended fields: content_html, summary, image, category, etc.
      - Status tracking: status, views, featured flag
      - Metadata: tags array, created_at, updated_at

  2. Indexes
    - Date index for chronological sorting
    - Status index for filtering by publication status
    - Featured index for highlighting important news
    - Category index for categorization

  3. Security
    - Enable RLS on the table
    - Public read access policy
    - Authenticated users can insert/update/delete

  4. Functions
    - Auto-update timestamp function
    - View counter function
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
CREATE POLICY IF NOT EXISTS "Allow public read access" 
  ON public.dr_ahmed_news FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert" 
  ON public.dr_ahmed_news FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update" 
  ON public.dr_ahmed_news FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete" 
  ON public.dr_ahmed_news FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dr_ahmed_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_dr_ahmed_news_updated_at ON public.dr_ahmed_news;
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
```

Once you've executed this SQL in your Supabase dashboard, refresh your application and the news management system should work correctly.