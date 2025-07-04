# Database Migration Instructions

The application is failing because the `news` table doesn't exist in your Supabase database. You need to manually apply the migration.

## Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Execute the Migration**
   - Copy the entire contents of `supabase/migrations/20250703132421_white_truth.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

## What the Migration Creates:

- `news` table with all required columns
- Row Level Security (RLS) policies
- `news-images` storage bucket for image uploads
- Automatic timestamp update triggers

## After Running the Migration:

The news management system should work properly, and you'll be able to:
- Load existing news
- Add new news items
- Upload images
- Initialize sample data

## Migration SQL to Execute:

```sql
/*
  # Create news table and storage

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `date` (date, required)
      - `author` (text, required)
      - `image` (text, optional)
      - `imageCaption` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage news

  3. Storage
    - Create `news-images` bucket for image storage
    - Set up policies for image upload and access
*/

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  imageCaption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for news table
CREATE POLICY "Allow public read access" ON news
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

Once you've executed this SQL in your Supabase dashboard, refresh your application and the news management system should work correctly.