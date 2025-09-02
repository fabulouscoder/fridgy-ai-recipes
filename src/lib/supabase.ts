import { createClient } from '@supabase/supabase-js';

// Try to get from Lovable's native integration first, then fallback to manual env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// More helpful error message with instructions
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('Supabase configuration needed!');
  console.error('Please replace YOUR_SUPABASE_URL_HERE and YOUR_SUPABASE_ANON_KEY_HERE in src/lib/supabase.ts');
  console.error('Or ensure your Supabase environment variables are set up correctly.');
}

// Create client - use dummy values if not configured to prevent crashes
const finalUrl = (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') 
  ? 'https://placeholder.supabase.co' 
  : supabaseUrl;
  
const finalKey = (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') 
  ? 'placeholder-key' 
  : supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey);