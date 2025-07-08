# Database Setup Instructions

## Connecting to Supabase

The application is now configured to connect to your Supabase project with the following details:

- **Project URL**: https://zqemddqbmuiuyexeuuta.supabase.co
- **API Key**: Your API key has been configured in the `.env` file

## Automatic Table Creation

The application will automatically check for the existence of the required `dr_ahmed_news` table in your Supabase project. If the table doesn't exist, it will attempt to create it with the necessary structure.

## Data Synchronization

The application implements a hybrid approach:
- Primary data storage is in Supabase
- Local storage (localStorage) is used as a fallback when offline
- Data is automatically synchronized between devices when online

## Fallback Behavior

If the connection to Supabase fails for any reason:
1. The application will fall back to using localStorage
2. Sample data will be loaded automatically
3. All CRUD operations will work locally
4. Data will be synchronized when the connection is restored

## Real-time Updates

The application uses Supabase's real-time capabilities to ensure that:
- Changes made on one device are immediately reflected on others
- Multiple users can collaborate without conflicts
- Data remains consistent across all devices

## Troubleshooting

If you encounter connection issues:
1. Check that your Supabase project is active
2. Verify that the API key and URL in the `.env` file are correct
3. Check your internet connection
4. Look for detailed error messages in the browser console