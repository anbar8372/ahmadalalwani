/*
  # Add category and youtubeUrl fields to news table

  1. Changes
    - Add `category` column to `news` table
    - Add `youtubeUrl` column to `news` table
    - Add `content_html` column to `news` table

  2. Security
    - Maintain existing RLS policies
*/

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'category'
  ) THEN
    ALTER TABLE news ADD COLUMN category TEXT;
  END IF;
END $$;

-- Add youtubeUrl column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'youtubeUrl'
  ) THEN
    ALTER TABLE news ADD COLUMN youtubeUrl TEXT;
  END IF;
END $$;

-- Add content_html column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'content_html'
  ) THEN
    ALTER TABLE news ADD COLUMN content_html TEXT;
  END IF;
END $$;