# Database Setup Instructions

## Issue: Table Not Found Error

If you're seeing table not found errors, it means the application is trying to access the wrong table name or the table doesn't exist in your Supabase project.

## Current Database Schema

Based on your current database schema, you have a table called `news` with the following structure:

- **Table**: `news`
- **Columns**: id, title, content, date, author, image, imagecaption, category, youtubeurl, content_html, created_at, updated_at
- **Security**: RLS enabled with policies for public read and authenticated write access

## Solution: Code Updated

The application code has been updated to use the correct table name (`news`) that matches your existing database schema.

## Check Your Environment Variables

Ensure your `.env` file exists and contains the correct Supabase credentials:

```
VITE_SUPABASE_URL=https://fzhprpwkyaatbnwosdab.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Add Missing Columns (Optional)

If you want to add the additional columns that the application expects, you can run this SQL in your Supabase SQL Editor:

```sql
-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'status'
  ) THEN
    ALTER TABLE news ADD COLUMN status text DEFAULT 'published';
  END IF;
  
  -- Add views column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'views'
  ) THEN
    ALTER TABLE news ADD COLUMN views integer DEFAULT 0;
  END IF;
  
  -- Add featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'featured'
  ) THEN
    ALTER TABLE news ADD COLUMN featured boolean DEFAULT false;
  END IF;
  
  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'tags'
  ) THEN
    ALTER TABLE news ADD COLUMN tags text[];
  END IF;
  
  -- Add summary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'summary'
  ) THEN
    ALTER TABLE news ADD COLUMN summary text;
  END IF;
END $$;
```

## Previous Environment Variables Reference

If you need to reference the old environment variables:
   - Ensure your `.env` file exists and contains:
     ```
     VITE_SUPABASE_URL=https://zqemddqbmuiuyexeuuta.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZW1kZHFibXVpdXlleGV1dXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTgyODMsImV4cCI6MjA2NzU3NDI4M30.JGbkfi6z8OuwDiXP6_e5h1D7_NfNeHlpg2U5QJtyxUI
     ```

## Fallback Behavior

The application is designed to work even without Supabase:
- If the database is unavailable, it falls back to localStorage
- Sample data is automatically loaded for demonstration
- All CRUD operations work locally until Supabase is properly configured