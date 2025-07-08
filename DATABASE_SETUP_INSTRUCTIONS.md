# Database Setup Instructions

## Issue: "Failed to fetch" Error

If you're seeing a "Failed to fetch" error, it's likely because the database migration hasn't been applied to your Supabase project yet.

## Solution: Apply Database Migration

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Navigate to "SQL Editor" in the left sidebar
   - Click "New query"

3. **Apply the Migration**
   - Copy the entire contents of `supabase/migrations/20250708040435_restless_base.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify Setup**
   - The migration will create:
     - `dr_ahmed_news` table with all required columns
     - Proper indexes for performance
     - Row Level Security (RLS) policies
     - Helper functions for view counting

5. **Check Your Environment Variables**
   - Ensure your `.env` file exists and contains:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - You can find these values in your Supabase project settings

## What the Migration Creates

- **Table**: `dr_ahmed_news` with columns for title, content, date, author, etc.
- **Security**: RLS policies allowing public read access and authenticated write access
- **Functions**: Auto-update timestamps and view counting
- **Indexes**: For efficient querying by date, status, category, and featured flag

## Fallback Behavior

The application is designed to work even without Supabase:
- If the database is unavailable, it falls back to localStorage
- Sample data is automatically loaded for demonstration
- All CRUD operations work locally until Supabase is properly configured

## Need Help?

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase project is active and accessible
3. Ensure the migration was applied successfully
4. Check that your environment variables are correct