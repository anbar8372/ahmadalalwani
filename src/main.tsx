import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. استيراد مكتبة Supabase
import { createClient } from '@supabase/supabase-js';

// 2. إعداد بيانات مشروعك (ضع بياناتك هنا)
const supabaseUrl = 'https://zqemddqbmuiuyexeuuta.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZW1kZHFibXVpdXlleGV1dXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTgyODMsImV4cCI6MjA2NzU3NDI4M30.JGbkfi6z8OuwDiXP6_e5h1D7_NfNeHlpg2U5QJtyxUI';

// 3. إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// 4. مثال على الاشتراك في التحديثات الفورية (يمكنك نقله لأي مكان في التطبيق)
supabase
  .channel('realtime-table')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'اسم_الجدول' }, // غيّر اسم_الجدول لاسم جدولك
    (payload) => {
      console.log('تغيير جديد في الجدول:', payload);
      // هنا يمكنك إعادة جلب البيانات أو تحديث الحالة في التطبيق
    }
  )
  .subscribe();

// 5. تهيئة تطبيق React
createRoot(document.getElementById("root")!).render(<App />);