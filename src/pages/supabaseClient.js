// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fgbyfkicksksedoekfej.supabase.co'; // <--- แทนที่ด้วย URL จริงของคุณ
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYnlma2lja3Nrc2Vkb2VrZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTI5NzAsImV4cCI6MjA2NTM4ODk3MH0.o8jkarh-yv6SUs7cNRyjRqM-kFO38ZqtflzBSUgU-jo'; // <--- แทนที่ด้วย Anon Key จริงของคุณ

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL หรือ Anon Key ไม่ได้กำหนดค่าโดยตรงใน supabaseClient.js!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);